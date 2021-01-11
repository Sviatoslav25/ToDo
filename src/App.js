import { useState, useEffect } from 'react';
import Listsvg from './components/Listsvg';
import axios from 'axios';

import { List, AddList, Tasks } from './components';
import { Route, Router, useHistory, useLocation } from 'react-router-dom';

function App() {


  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setLists(data);
    });
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data);
    });
  }, []);

  const onAddList = (obj) => {
    const newList = [
      ...lists,
      obj
    ];
    setLists(newList);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newList);
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt("Введіть текст задачі", taskObj.text);
    if (!newTaskText) {
      return;
    }
    const newList = lists.map(item => {
      if (item.id === listId) {
        item.tasks.map(task => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return item;
    });
    setLists(newList);
    axios.patch('http://localhost:3001/tasks/' + taskObj.id, {
      text: newTaskText
    })
      .catch(() => {
        window.alert("Не вдалося змінити задачу");
      });
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("Ви справді хочите видалити задачу?")) {
      const newList = lists.map(item => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter(task => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);
      axios.delete('http://localhost:3001/tasks/' + taskId)
        .catch(() => {
          window.alert("Не вдалося видалити задачу");
        });
    }
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map(item => {
      if (item.id === listId) {
        item.tasks.map(task => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return item;
    });
    setLists(newList);
    axios.patch('http://localhost:3001/tasks/' + taskId, {
      completed
    })
      .catch(() => {
        window.alert("Не вдалося змінити задачу");
      });
  }

  const onEditListTitle = (id, title) => {
    const newList = lists.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };

  useEffect(() => {
    const listId = location.pathname.split('lists/')[1];
    console.log(listId);
    if (lists) {
      const list = lists.find(list => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, location.pathname]);

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          onClickItem={list => {
            history.push('/')
          }}
          items={[
            {
              active: location.pathname === "/",
              icon: (
                <Listsvg />
              ),
              name: 'Всі задачі',
            }
          ]}
        />
        {lists ? (
          < List
            items={lists}
            onRemove={id => {
              const newList = lists.filter(item => item.id !== id);
              setLists(newList);
            }}
            onClickItem={list => {
              history.push(`/lists/${list.id}`)
            }}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
            'Загрузка...'
          )}
        <AddList onAdd={onAddList} colors={colors} />
      </div>
      <div className="todo__tasks">
        <Route exact path="/">
          {
            lists && lists.map(list => (
              <Tasks
                key={list.id}
                list={list}
                onAddTask={onAddTask}
                onEditTitle={onEditListTitle}
                onAddTask={onAddTask}
                onRemoveTask={onRemoveTask}
                onEditTask={onEditTask}
                onCompleteTask={onCompleteTask}
                withoutEmpty
              />
            ))}
        </Route>
        <Route path="/lists/:id">
          {lists && activeItem &&
            <Tasks
              list={activeItem}
              onEditTitle={onEditListTitle}
              onAddTask={onAddTask}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onCompleteTask={onCompleteTask}
            />}
        </Route>
      </div>
    </div>
  );
}

export default App;
