import axios from '../../apis/axios';
import styles from './ToDo.module.css';
import ToDoList from '../../components/ToDoList.js';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const toDosUrl = '/todos';

function ToDo() {
    const [toDoList, setToDoList] = useState([]);
    
    const inputValue = useRef();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem('userAccessToken') === null) {
            navigate('/');
        }
        
        getToDoList();
    }, [])
    
    async function handleSubmitByEnterKey(event) {
        event.preventDefault();
        try {
            const response = await axios.post(toDosUrl, {
                todo: event.target.value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            
            setToDoList([response.data, ...toDoList]);
            event.target.value = null;
        } catch (error) {
            console.log(error);   
        }
    }
    
    async function handleSubmitByAddButtonClick() {
        try {
            const response = await axios.get(toDosUrl, {
                todo: inputValue.current.value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    async function getToDoList() {
        try {
            const response = await axios.get(toDosUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`
                }
            })
            
            setToDoList(response.data.reverse());
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <section className={styles.wrap}>
            <p>To Do</p>
            <div className={styles.addToDoWrap}>
                <input className={styles.addToDoInput} ref={inputValue} onKeyUp={(event) => {
                    if (window.event.keyCode === 13) {
                        handleSubmitByEnterKey(event);
                    }
                }}></input>
                <FontAwesomeIcon className={styles.addToDoButton} icon={faCirclePlus} onClick={() => {
                    handleSubmitByAddButtonClick();
                }}></FontAwesomeIcon>
            </div>
            <div className={styles.toDoListWrap}>
                <ToDoList toDoList={toDoList} setToDoList={setToDoList}></ToDoList>
            </div>
        </section>
    )
}

export default ToDo;