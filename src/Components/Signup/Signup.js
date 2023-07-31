import React from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import email from '../assets/email.png'
import password from '../assets/password.png'
import mobile from '../assets/mobile.png'
import user from '../assets/user.png'



const Signup=()=>{


    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        Name: '',
        email: '',
        mobile: '',
        password: '',
      });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleSubmitSignup=async (e)=>{
        e.preventDefault()
        if (!formData.Name || !formData.email || !formData.mobile || !formData.password) {
            alert("Please fill in all required fields.");
            return false;
          }
        try{
            await axios.post("http://localhost:4000/signup",formData)
            .then((res)=>{
                    const token  = res.data.jwtToken;
                    // Store the JWT token in local storage
                    localStorage.setItem('jwtToken', token);
                    navigate('/')
                    console.log(res.data)
            })
        }
        catch(error){
            console.log(error)
            alert("User already exists, please Log in")
        }
    }






    return(
        <div className='signup-main'>
            <div className='signup-headers'>
                <h1 className='signup-heading'>Feedback</h1>
                <p className='signup-para'>Add your products and give us your valuable feedback</p>
            </div>
            <form onSubmit={handleSubmitSignup} className='signup-form'>
                <div className='name-box'>
                    <img src={user} alt='email' className='name-logo'/>
                    <input type='text' placeholder='Name' name='Name' value={formData.Name} className='name-input' onChange={handleChange}/>
                </div>
                <div className='email-box'>
                    <img src={email} alt='email' className='email-logo'/>
                    <input type='email' placeholder='Email' name='email' value={formData.email} className='name-input'  onChange={handleChange}/>
                </div>
                <div className='mobile-box'>
                    <img src={mobile} alt='email' className='mobile-logo'/>
                    <input type='number' placeholder='Mobile' name='mobile' value={formData.mobile} className='mobile-input'  onChange={handleChange}/>
                </div>
                <div className='password-box'>
                    <img src={password} alt='password' className='password-logo'/>
                    <input type='password' placeholder='Password' name='password' value={formData.password}  className='password-input'  onChange={handleChange}/>
                </div>
                <p className='redirectLogin'>Already have an account? <Link to="/Login" className='login'>Log in</Link></p>
                <button type="submit" className='signup-btn'>Sign up</button>
            </form>
        </div>

    )
}

export default Signup