import axios from '../apis/axios';
import styles from './ToDoList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';

const toDosUrl = '/todos';

function ToDoList(props) {
    const [errorMessage, setErrorMessage] = useState('');
    
    return (
        <>
            {errorMessage}
            {props.toDoList?.map((element) => {
                return (
                    <ToDoElement setErrorMessage={setErrorMessage} toDoList={props.toDoList} setToDoList={props.setToDoList} element={element} key={element.id}></ToDoElement>
                )
            })}
        </>
    )
}

function ToDoElement(props) {
    const [editFlag, setEditFlag] = useState(false);
    
    const updateInput = useRef();
    
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
            console.log(error);
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
            console.log(error);
            props.setErrorMessage(error.response.data.message[0])
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
            console.log(error);
        }
    }
    
    return (
        <div className={styles.toDoElementWrap}>
            {props.element.isCompleted === true ?
                <FontAwesomeIcon className={styles.circleCheck} icon={faCircleCheck} onClick={() => toggleIsCompleted(props.element)}></FontAwesomeIcon>
                : <FontAwesomeIcon className={styles.circle} icon={faCircle} onClick={() => toggleIsCompleted(props.element)}></FontAwesomeIcon>
            }
            
            {editFlag === false ? 
                <>
                    <div className={styles.toDoText}>{props.element.todo}</div>
                    <div className={styles.buttonsWrap}>
                        <FontAwesomeIcon className={styles.editButton} icon={faPenToSquare} onClick={() => setEditFlag(true)}></FontAwesomeIcon>
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
                        <div className={styles.okButton} onClick={() => updateToDo(props.element)}>ok</div>
                        <div className={styles.cancelButton} onClick={() => setEditFlag(false)}>cancel</div>
                    </div>
                </>
            }
        </div>
    )
}

export default ToDoList;