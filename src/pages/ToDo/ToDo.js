import axios from '../../apis/axios';
import styles from './ToDo.module.css';
import ToDoList from '../../components/ToDoList.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const toDosUrl = '/todos';

function ToDo() {
    const [toDoList, setToDoList] = useState([]);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem('userAccessToken') === null) {
            navigate('/');
        }
        
        getToDoList();
    }, [])
    
    function handleSubmit(event) {
        
    }
    
    async function getToDoList() {
        try {
            const response = await axios.get(toDosUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`
                }
            })
            
            setToDoList(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <section className={styles.wrap}>
            <div className={styles.addToDoWrap}>
                <input className={styles.addToDoInput} onSubmit={(event) => handleSubmit(event)}></input>
                <FontAwesomeIcon className={styles.addToDoButton} icon={faCirclePlus}></FontAwesomeIcon>
            </div>
            <div className={styles.toDoListWrap}>
                <ToDoList toDoList={toDoList} setToDoList={setToDoList}></ToDoList>
            </div>
        </section>
    )
}

export default ToDo;