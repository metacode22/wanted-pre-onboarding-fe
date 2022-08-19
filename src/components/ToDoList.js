import axios from '../apis/axios';
import styles from './ToDoList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircle, faCircleCheck, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';

const toDosUrl = '/todos';

function ToDoList(props) {
    return (
        <>
            {props.toDoList?.map((element) => {
                return (
                    <ToDoElement toDoList={props.toDoList} setToDoList={props.setToDoList} element={element} key={element.id}></ToDoElement>
                )
            })}
        </>
    )
}

function ToDoElement(props) {
    const [editFlag, setEditFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const updateInput = useRef();
    
    useEffect(() => {
        if (editFlag) {
            updateInput.current.focus();
        }
    }, [editFlag])
    
    async function deleteToDo(element) {
        try {
            const response = await axios.delete(toDosUrl + `/${element.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`
                }
            })
            
            const newToDoList = [...props.toDoList];
            const indexToDelete = newToDoList.findIndex(x => x.id === element.id);
            newToDoList.splice(indexToDelete, 1);
            props.setToDoList(newToDoList);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    }
    
    async function updateToDo(element) {
        try {
            const response = await axios.put(toDosUrl + `/${element.id}`, {
                todo: updateInput.current.value,
                isCompleted: element.isCompleted
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            
            const responseGetToDoList = await axios.get(toDosUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`
                }
            })
            
            props.setToDoList(responseGetToDoList.data.reverse());
            setEditFlag(false);
        } catch (error) {
            if (error.response.data.message[0] === 'todo should not be empty') {
                setErrorMessage('빈 칸을 채워주시기 바랍니다.');
                updateInput.current.focus();
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
    
    async function toggleIsCompleted(element) {
        try {
            const response = await axios.put(toDosUrl + `/${element.id}`, {
                todo: element.todo,
                isCompleted: !element.isCompleted
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
            
            const responseGetToDoList = await axios.get(toDosUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userAccessToken')}`
                }
            })
            
            props.setToDoList(responseGetToDoList.data.reverse());
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    }
    
    return (
        <>
            <div className={styles.toDoElementWrap}>
                {props.element.isCompleted === true ?
                    <FontAwesomeIcon className={styles.circleCheck} icon={faCircleCheck} onClick={() => toggleIsCompleted(props.element)}></FontAwesomeIcon>
                    : <FontAwesomeIcon className={styles.circle} icon={faCircle} onClick={() => toggleIsCompleted(props.element)}></FontAwesomeIcon>
                }
                
                {editFlag === false ? 
                    <>
                        <div className={styles.toDoText}>{props.element.todo}</div>
                        <div className={styles.buttonsWrap}>
                            <FontAwesomeIcon className={styles.editButton} icon={faPenToSquare} onClick={() => {setEditFlag(true)}}></FontAwesomeIcon>
                            <FontAwesomeIcon className={styles.deleteButton} icon={faTrash} onClick={() => {deleteToDo(props.element)}}></FontAwesomeIcon>
                        </div>
                    </>
                    :
                    <>
                        <input className={styles.toDoTextInput} ref={updateInput} defaultValue={props.element.todo} onKeyUp={() => {
                            if (window.event.keyCode === 13) {
                                updateToDo(props.element);
                            }
                        }}></input>
                        <div className={styles.buttonsWrap}>
                            <FontAwesomeIcon className={styles.okButton} icon={faCheck} onClick={() => updateToDo(props.element)}></FontAwesomeIcon>
                            <FontAwesomeIcon className={styles.cancelButton} icon={faXmark} onClick={() => {
                                setErrorMessage('');
                                setEditFlag(false)
                            }}></FontAwesomeIcon>
                        </div>
                    </>
                }
            </div>
            <div>
                {errorMessage === '' ? 
                null :
                <div className={styles.errorWrap}>
                    <p className={styles.errorMessageText}>❗️ {errorMessage}</p>
                    <FontAwesomeIcon className={styles.errorMessageDeleteButton} icon={faXmark} onClick={() => setErrorMessage('')}></FontAwesomeIcon>
                </div>
                }
            </div>
        </>
    )
}

export default ToDoList;