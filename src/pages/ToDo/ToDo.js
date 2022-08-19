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
    
    const inputRef = useRef();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem('userAccessToken') === null) {
            navigate('/');
        } else {
            inputRef.current.focus();
            getToDoList();
        }
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
            const response = await axios.post(toDosUrl, {
                todo: inputRef.current.value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            
            setToDoList([response.data, ... toDoList]);
            inputRef.current.value = null;
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
            <h1 className={styles.toDoTitle}>To Do</h1>
            <div className={styles.addToDoWrap}>
                <input className={styles.addToDoInput} placeholder='해야 할 일을 입력해주세요.' ref={inputRef} onKeyUp={(event) => {
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