import axios from 'axios';
import { Link } from 'react-router-dom'

import './Tasks.scss'

import editSvg from '../../assets/img/edit.svg';
import AddTaskForm from './AddTaskForm';
import Task from './Task';

const Tasks = ({ list, onEditTitle, onAddTask, withoutEmpty, onRemoveTask, onEditTask, onCompleteTask }) => {

    const editTitle = () => {
        const newTitle = window.prompt("Введіть нову назву списку", list.name);
        if (newTitle) {
            onEditTitle(list.id, newTitle);
            axios.patch('http://localhost:3001/lists/' + list.id, {
                name: newTitle
            }).catch(() => {
                window.alert("Не вдалося оновити назву списку");
            });
        }
    };

    return (
        <div className="tasks">
            <Link to={`/lists/${list.id}`}>
                <h2 style={{ color: list.color.hex }} className="tasks__title">
                    {list.name}
                    <img
                        onClick={editTitle}
                        src={editSvg}
                        alt="Edit icon"
                    />
                </h2>
            </Link>

            <div className="tasks__items">
                {!withoutEmpty && list.tasks && !list.tasks.length && <h2>Задачі відсутні</h2>}
                {
                    list.tasks && list.tasks && list.tasks.map(task =>
                        <Task key={task.id} list={list} onEdit={onEditTask} onRemove={onRemoveTask} onCompleted={onCompleteTask} {...task} />
                    )}
                <AddTaskForm key={list.id} list={list} onAddTask={onAddTask} />
            </div>
        </div>
    )
}

export default Tasks;