import addSvg from '../../assets/img/add.svg';

import { useState } from 'react';
import axios from 'axios';

const AddTaskForm = ({ list, onAddTask }) => {

    const [visibleForm, setVisibleForm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleFormVisible = () => {
        setVisibleForm(!visibleForm);
        setInputValue('');
    }

    const addTask = () => {
        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false
        }
        setIsLoading(true);
        axios.post('http://localhost:3001/tasks', obj).then(({ data }) => {
            onAddTask(list.id, data);
            toggleFormVisible();
        })
            .catch(() => {
                window.alert("Помилка при добавленні задачі");
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    return (
        <div className="tasks__form">
            {!visibleForm ? (
                <div onClick={toggleFormVisible} className="tasks__form-new">
                    <img src={addSvg} alt="Add icon" />
                    <span>Нова задача</span>
                </div>
            ) : (
                    <div className="tasks__form-block">
                        <input
                            value={inputValue}
                            className="field"
                            type="text"
                            placeholder="Задача"
                            onChange={e => { setInputValue(e.target.value) }}
                        />
                        <button disabled={isLoading} className='button' onClick={addTask} >
                            {isLoading ? 'Іде добавлення' : "Добавити"}
                        </button>
                        <button onClick={toggleFormVisible} className='button button--grey' >Відмінити</button>
                    </div>
                )}
        </div>
    )
}

export default AddTaskForm;