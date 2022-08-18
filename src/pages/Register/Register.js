import axios from '../../apis/axios';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const registerUrl = '/auth/signup';

function Register() {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
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
        
        if (passwordValue !== confirmPasswordValue) {
            setErrorMessage('비밀번호를 재확인해주시기 바랍니다.');
            confirmPasswordRef.current.focus();
            
            return;
        }
        
        if (passwordValue.length < 8) {
            setErrorMessage('비밀번호는 8자 이상 작성해주시기 바랍니다.');
            passwordRef.current.focus();
            
            return;
        }
        
        try {
            const response = await axios.post(registerUrl, {
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
            setErrorMessage(error.response.data.message);
        }
    }
    
    return (
        <section className={styles.wrap}>
            <p>이메일은 @을 포함해서, 비밀번호는 8자 이상으로 입력해주시기 바랍니다.</p>
            {errorMessage === '' ? 
            null :
            <p>{errorMessage}</p>
            }
            <h1>Register</h1>
            <form className={styles.registerForm} onSubmit={(event) => {handleSubmit(event)}}>
                <label htmlFor='emailInputId'>Email</label>
                <input
                    type='email'
                    className={styles.emailInput}
                    id='emailInput'
                    ref={emailRef}
                    autoComplete='off'
                    onChange={(event) => {setEmailValue(event.target.value)}}
                    placeholder='이메일을 입력해주세요.'
                    required
                ></input>
                <label htmlFor='passwordInputId'>Password</label>
                <input
                    type='password'
                    className={styles.passwordInput}
                    id='passwordInputId'
                    ref={passwordRef}
                    onChange={(event) => {setPasswordValue(event.target.value)}}
                    placeholder='비밀번호를 입력해주세요.'
                    required
                ></input>
                <label htmlFor='confirmPasswordInputId'>Confirm Password</label>
                <input
                    type='password'
                    className={styles.confirmPasswordInput}
                    id='confirmPasswordInputId'
                    ref={confirmPasswordRef}
                    onChange={(event) => {setConfirmPasswordValue(event.target.value)}}
                    placeholder='비밀번호를 재확인해주세요.'
                    required
                ></input>
                <input 
                    type='submit'
                    ref={submitRef}
                    value='Register'
                ></input>
            </form>
            <button type='button' onClick={() => {navigate('/')}}>Back to Login page</button>
        </section>
    )
}

export default Register;