import axios from '../../apis/axios';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect} from 'react';

const loginUrl = '/auth/signin';

function Login() {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const emailRef = useRef();
    const submitRef = useRef();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (localStorage.getItem('userAccessToken') !== null) {
            navigate('/todo');
        }
        
        submitRef.current.disabled = true;
        emailRef.current.focus();
    }, [])
    
    useEffect(() => {
        if (emailValue.includes('@') && passwordValue.length >= 8) {
            submitRef.current.disabled = false;
        } else {
            submitRef.current.disabled = true;
        }
    }, [emailValue, passwordValue])
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        try {
            const response = await axios.post(loginUrl, {
                email: emailValue,
                password: passwordValue
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            const accessToken = response?.data?.access_token;
            localStorage.setItem('userAccessToken', accessToken);
            
            const storedAccessToken = localStorage.getItem('userAccessToken');
            if (accessToken === storedAccessToken) {
                navigate('/todo');
            }
        } catch (error) {
            if (error.response.data.message === 'Unauthorized') {
                setErrorMessage('아이디와 비밀번호를 재확인해주세요.');
            } else {
                setErrorMessage(error.response.data.message);   
            }
        }
    }
    
    return (
        <section className={styles.wrap}>
            <p>이메일은 @을 포함해서, 비밀번호는 8자 이상으로 입력해주시기 바랍니다.</p>
            {errorMessage === '' ? 
            null :
            <p>{errorMessage}</p>
            }
            <h1>Log In</h1>
            <form className={styles.loginForm} onSubmit={(event) => {handleSubmit(event)}}>
                <label htmlFor='emailInputId'>Email</label>
                <input 
                    type='email' 
                    className={styles.emailInput} 
                    id='emailInputId'
                    ref={emailRef}
                    autoComplete='off'
                    onChange={(event) => {setEmailValue(event.target.value)}}
                    // value={emailValue}
                    placeholder='이메일을 입력해주세요.'
                    required
                ></input>
                <label htmlFor='passwordInputId'>Password</label>
                <input 
                    type='password' 
                    className={styles.passwordInput} 
                    id='passwordInputId'
                    onChange={(event) => {setPasswordValue(event.target.value)}}
                    // value={passwordValue}
                    placeholder='비밀번호를 입력해주세요.'
                    required
                ></input>
                <input 
                    type='submit'
                    ref={submitRef} 
                    value='Login'
                ></input>
            </form>
            <button type='button' onClick={() => {navigate('/register')}}>Sign Up</button>
        </section>
    )
}

export default Login;