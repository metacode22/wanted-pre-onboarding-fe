import axios from '../apis/axios';
import styles from './ToDoList.module.css';

const toDosUrl = '/todos';

function ToDoList(props) {
    console.log(props.toDoList);
    
    return (
        <>
            {props.toDoList?.map((element) => {
                return (
                    <div style={{display: 'flex'}} key={element.id}>
                        {/* isCompleted에 따라 */}
                        <div>check 표시</div>
                        
                        {/* 수정 시 input으로 바뀌어야 함. element.todo라는 데이터는 input 안에 띄우면서 */}
                        <div>{element.todo}</div>
                        
                        {/* 수정 시 ok 버튼으로 바뀌어야 함. */}
                        <div>edit</div>
                        
                        {/* 수정 시 cancel 버튼으로 바뀌어야 함. */}
                        <div>delete</div>
                    </div>
                )
            })}
        </>
    )
}

export default ToDoList;