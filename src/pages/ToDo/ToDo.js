import axios from '../../apis/axios';
import styles from './ToDo.module.css';
import ToDoList from '../../components/ToDoList.js';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const toDosUrl = '/todos';

function ToDo() {
    const [toDoList, setToDoList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    
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
            if (error.response.data.message[0] === 'todo should not be empty') {
                setErrorMessage('빈 칸을 채워주시기 바랍니다.');
            } else {
                setErrorMessage(error.response.data.message);
            }
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
            inputRef.current.focus();
        } catch (error) {
            if (error.response.data.message[0] === 'todo should not be empty') {
                setErrorMessage('빈 칸을 채워주시기 바랍니다.');
                inputRef.current.focus();
            } else {
                // message가 여러개 올 수도 있을 것 같은데 어떤 경우인지 모르겠다.
                let totalErrorMessage = '';
                
                error.response.data.message.forEach((element) => {
                    totalErrorMessage += `${element}\n`;
                })
                
                setErrorMessage(totalErrorMessage);
            }
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
            if (error.response.data.message[0] === 'todo should not be empty') {
                setErrorMessage('빈 칸을 채워주시기 바랍니다.');
                inputRef.current.focus();
            } else {
                // message가 여러개 올 수도 있을 것 같은데 어떤 경우인지 모르겠다.
                let totalErrorMessage = '';
                
                error.response.data.message.forEach((element) => {
                    totalErrorMessage += `${element}\n`;
                })
                
                setErrorMessage(totalErrorMessage);
            }
        }
    }
    
    function logout() {
        localStorage.removeItem('userAccessToken');
        navigate('/');
    }
    
    return (
        <section className={styles.wrap}>
            {errorMessage === '' ? 
                null :
                <div className={styles.errorWrap}>
                    <p className={styles.errorMessageText}>❗️ {errorMessage}</p>
                    <FontAwesomeIcon className={styles.errorMessageDeleteButton} icon={faXmark} onClick={() => setErrorMessage('')}></FontAwesomeIcon>
                </div>
            }
            <div className={styles.header}>
                <h1 className={styles.toDoTitle}>To Do</h1>
                <button className={styles.logoutButton} onClick={() => logout()}>Log Out</button>
            </div>
            <div className={styles.addToDoWrap}>
                <input className={styles.addToDoInput} placeholder='해야 할 일을 입력해주세요.' ref={inputRef} onKeyPress={(event) => {
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