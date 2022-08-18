import axios from '../apis/axios';
import styles from './ToDoList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

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
    
    return (
        <div className={styles.toDoElementWrap}>
            {props.element.isCompleted === true ?
                <FontAwesomeIcon className={styles.circleCheck} icon={faCircleCheck}></FontAwesomeIcon>
                : <FontAwesomeIcon className={styles.circle} icon={faCircle}></FontAwesomeIcon>
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
                    <input className={styles.toDoTextInput}></input>
                    <div className={styles.buttonsWrap}>
                        <div className={styles.okButton}>ok</div>
                        <div className={styles.cancelButton} onClick={() => setEditFlag(false)}>cancel</div>
                    </div>
                </>
            }
        </div>
    )
}

export default ToDoList;