import React from 'react'
import './Login.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import emaillogo from '../assets/email.png'
import passwordlogo from '../assets/password.png'




const Login=()=>{

   
    const [email,setemail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()

    const handleEmail=(e)=>{
        setemail(e.target.value)
    }

    const handlePassword=(e)=>{
        setPassword(e.target.value)
    }

    async function handleSubmitLogin(e){
        e.preventDefault();
        const credentials={email,password};
        await axios.post("http://localhost:4000/login",credentials)
            .then((res)=>{
                if(email!=="" && password!==""){
                const token  = res.data.jwtToken;
                // Store the JWT token in local storage
                localStorage.setItem('jwtToken', token);
                navigate('/')
                console.log(res.data)}
            })
            .catch((err)=>{
                alert('login failed')
                console.log('Login Failed',err.response.data)
            })
    }



    return(
        <div className='login-main'>
            <div className='login-headers'>
                <h1 className='login-heading'>Feedback</h1>
                <p className='login-para'>Add your products and give us your valuable feedback</p>
            </div>
            <form className='login-form' onSubmit={handleSubmitLogin}>
                <div className='email-box-login'>
                    <img src={emaillogo}  alt='email' className='email-logo'/>
                    <input type='email' placeholder='Email' name='email' value={email} onChange={handleEmail} className='email-input'/>
                </div>
                <div className='password-box-login'>
                    <img src={passwordlogo} alt='password' className='password-logo'/>
                    <input type='password' placeholder='Password' name='Password' value={password} onChange={handlePassword}  className='password-input'/>
                </div>
                <p className='redirectSignup'>Don't have an account? <Link to="/Signup" className='signUp'> Sign up</Link></p>
                <button type='submit' className='login-btn'>Log in</button>
            </form>
        </div>
    )
}

export default Login