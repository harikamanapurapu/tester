import React from "react";
import './Navbar.css'
import { useNavigate} from 'react-router-dom';
import user from "../assets/user.png"

const Navbar=({handleLogout,isLoggedIn})=>{
    
    const navigate=useNavigate()

    const handleLogin=()=>{
        navigate('/Login')
    }

    const handleSignup=()=>{
        navigate('/Signup')
    }
    return(
        <div className="navbar-main">
            <p className="navbar-title">Feedback</p>
            <div className="navbar-btns">
                {isLoggedIn?<> 
                <button className="navbar-loginbtn" onClick={handleLogout}>Log out</button>
                <button className="navbar-hello" onClick={handleLogin}>Hello!</button>
                <img src={user} alt="user" className="navimg"/>
                </>
                :
                <>
                <button className="navbar-loginbtn" onClick={handleLogin}>Log in</button>
                <button className="navbar-signupbtn" onClick={handleSignup}>Sign up</button> 
                </>
                }
            </div>
        </div>
    )
}

export default Navbar