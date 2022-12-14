import axios from '../../apis/axios';
import styles from './Login.module.css';
import { useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const loginUrl = '/auth/signin';

function Login() {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const emailRef = useRef();
    const passwordRef = useRef();
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
            submitRef.current.style.opacity = 1.0;
        } else {
            submitRef.current.disabled = true;
            submitRef.current.style.opacity = 0.5;
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
                passwordRef.current.focus();
                setErrorMessage('??????????????? ?????????????????????.');
            } else {
                emailRef.current.focus();
                setErrorMessage(error.response.data.message);   
            }
        }
    }
    
    return (
        <section className={styles.wrap}>
            <p className={styles.notice}>* ???????????? @??? ????????????, ??????????????? 8??? ???????????? ?????????????????? ????????????.</p>
            {errorMessage === '' ? 
            null :
            <div className={styles.errorWrap}>
                <p className={styles.errorMessageText}>?????? {errorMessage}</p>
                <FontAwesomeIcon className={styles.errorMessageDeleteButton} icon={faXmark} onClick={() => setErrorMessage('')}></FontAwesomeIcon>
            </div>
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
                    placeholder='???????????? ??????????????????.'
                    required
                ></input>
                <label htmlFor='passwordInputId'>Password</label>
                <input 
                    type='password' 
                    className={styles.passwordInput} 
                    id='passwordInputId'
                    ref={passwordRef}
                    onChange={(event) => {setPasswordValue(event.target.value)}}
                    placeholder='??????????????? ??????????????????.'
                    required
                ></input>
                <div className={styles.buttonsWrap}>
                    <input 
                        type='submit'
                        className={styles.loginButton}
                        ref={submitRef} 
                        value='Login'
                    ></input>
                    <button type='button' className={styles.signupButton} onClick={() => {navigate('/register')}}>Sign Up</button>
                </div>
            </form>
        </section>
    )
}

export default Login;