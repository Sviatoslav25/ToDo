import { useState, useEffect } from 'react';
import List from '../List/index';
import Badge from '../Badge';
import closeSvg from '../../assets/img/close.svg';

import './AddListButton.scss'
import axios from 'axios';


const AddList = ({ colors, onAdd }) => {

    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Array.isArray(colors)) {
            selectColor(colors[0].id);
        }
    }, [colors]);

    const onClose = () => {
        setVisiblePopup(false);
        setInputValue("");
        selectColor(colors[0].id);
    }

    const addList = () => {
        if (!inputValue) {
            alert("Введіть назву списку");
            return;
        }
        setIsLoading(true);
        axios
            .post('http://localhost:3001/lists', {
                name: inputValue,
                colorId: selectedColor
            })
            .then(({ data }) => {
                const color = colors.filter(c => c.id === selectedColor)[0];
                console.log(color);
                const listObj = { ...data, color, tasks: [] };
                onAdd(listObj);
                onClose();
            }).catch(() => {
                window.alert("Помилка при добавленні списку");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }


    return (
        <div>
            <List
                onClick={() => setVisiblePopup(true)}
                items={[
                    {
                        className: "list__add-button",
                        icon: (
                            <svg width="12"
                                height="12"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="list__icon-plus"
                            >
                                <path
                                    d="M8 1V15"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M1 8H15"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>),
                        name: "Добавити список"
                    }
                ]
                }
            />
            {visiblePopup && (
                <div className='add-list__popup'>
                    <img onClick={onClose} src={closeSvg} alt=" close button" className="add-list__popup-close-btn" />
                    <input
                        value={inputValue}
                        onChange={e => {
                            setInputValue(e.target.value);
                        }}
                        className="field"
                        type="text"
                        placeholder="Назва списку"

                    />

                    <div className="add-list__popup-colors">
                        {
                            colors.map(color => (
                                <Badge onClick={(() => selectColor(color.id))}
                                    key={color.id}
                                    color={color.name}
                                    className={selectedColor === color.id && 'active'}
                                />
                            ))}
                    </div>
                    <button className='button' onClick={addList}>
                        {isLoading ? 'Іде добавлення' : 'Добавити'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AddList;