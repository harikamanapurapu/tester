import React from 'react';
import './Modals.css'
import emaillogo from '../assets/email.png'
import passwordlogo from '../assets/password.png'
import mobile from '../assets/mobile.png'
import user from '../assets/user.png'
import { useState } from 'react';
import axios from 'axios';

import { useEffect } from 'react';


const LoginModal = ({setshowAddProductModal,setshowLoginModal }) => {
    const [email,setemail]=useState("")
    const [password,setPassword]=useState("")

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
                setshowLoginModal(false)
                setshowAddProductModal(true)
                console.log(res.data)}
            })
            .catch((err)=>{
                alert('login failed')
                console.log('Login Failed',err.response.data)
            })
    }

  return (
        <div className='login-main-modal'>
            <form className='login-form-modal' onSubmit={handleSubmitLogin}>
                <h1 className='login-modal'>Log in to continue</h1>
                <div className='email-box-modal'>
                    <img src={emaillogo} alt='email' className='email-logo-modal'/>
                    <input type='email' placeholder='Email' name='email' value={email} onChange={handleEmail} className='email-input-modal'/>
                </div>
                <div className='password-box-modal'>
                    <img src={passwordlogo} alt='password' className='password-logo-modal'/>
                    <input type='password' placeholder='Password' name='password' value={password} onChange={handlePassword}  className='password-input-modal'/>
                </div>
                <button className='login-btn-modal' >Log in</button>
            </form>
            <div className='loginmodal-sidebar'>
                <h1 className='loginmodal-heading'>Feedback</h1>
                <p className='loginmodal-para'>Add your product and rate other items.............</p>
            </div>
        </div>
  );
};

const SignUpModal = ({handleLoginModalClick , setshowAddProductModal ,setshowSignupModal}) => {
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
                    setshowSignupModal(false)
                    setshowAddProductModal(true)
                    console.log(res.data)
            })
        }
        catch(error){
            console.log(error)
            alert("User already exists, please Log in")
        }
    }

  return (
        <div className='signup-main-modal'>
            <form className='signup-form-modal' onSubmit={handleSubmitSignup}>
                <h1 className='signup-modal'>Signup to continue</h1>
                <div className='name-box-modal'>
                    <img src={user} alt='email' className='name-logo-modal'/>
                    <input type='text' placeholder='Name' name='Name' value={formData.Name} className='name-input-modal' onChange={handleChange}/>
                </div>
                <div className='email-box-signup-modal'>
                    <img src={emaillogo} alt='email' className='email-logo-modal'/>
                    <input type='email' placeholder='Email' name='email' value={formData.email} className='email-input-modal' onChange={handleChange}/>
                </div>
                <div className='mobile-box-modal'>
                    <img src={mobile} alt='email' className='mobile-logo-modal'/>
                    <input type='number' placeholder='Mobile' name='mobile' value={formData.mobile} className='mobile-input-modal'onChange={handleChange}/>
                </div>
                <div className='password-box-signup-modal'>
                    <img src={passwordlogo} alt='password' className='password-logo-modal'/>
                    <input type='password' placeholder='Password' name='password' value={formData.password}  className='password-input-modal' onChange={handleChange}/>
                </div>
                <p className='redirectLogin-modal'>Already have an account? <span className='modallogin' onClick={handleLoginModalClick}>Log in</span></p>
                <button className='signup-btn-modal' >Sign up</button>
            </form>
            <div className='signupmodal-sidebar'>
                <h1 className='signupmodal-heading'>Feedback</h1>
                <p className='signupmodal-para'>Add your product and rate other items.............</p>
            </div>
        </div>
  );
};


const AddproductModal = ({setshowAddProductModal,editProduct}) => {



    const [ProductformData, setProductFormData] = useState({
        companyName: '',
        category: '',
        logoUrl: '',
        linkofProduct: '',
        description:''
      });

    useEffect(() => {
        console.log(editProduct)
        if (editProduct) {
            setProductFormData({
            companyName: editProduct.companyName || "",
            category: editProduct.category || "",
            logoUrl: editProduct.logoUrl || "",
            linkofProduct: editProduct.linkofProduct || "",
            description: editProduct.description || "",
            });
        }
    }, [editProduct]);


    
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setProductFormData({
          ...ProductformData,
          [name]: value,
        });
    };

    const handleSubmitAddproduct = async (e) => {
        e.preventDefault();
        try {
          if (!ProductformData.companyName || !ProductformData.category || !ProductformData.logoUrl || !ProductformData.linkofProduct || !ProductformData.description) {
            alert("Please fill in all required fields.");
            return;
          }
      
          if (editProduct) {
            // If editProduct is not null, it means we are updating an existing product
            // Perform a PATCH request with the updated product data
            const response = await axios.patch(`http://localhost:4000/Editproduct/${editProduct._id}`, ProductformData);
            console.log(response.data);
            // Optionally, show a success message or perform any other actions after successful update
          } else {
            // If editProduct is null, it means we are adding a new product
            await axios.post("http://localhost:4000/Addproduct", ProductformData);
          }
      
          // Close the modal after successful submission
          setshowAddProductModal(false);
        } catch (error) {
          console.log(error);
        }
      };
      



    return (
          <div className='addproduct-main-modal'>
              <form className='addproduct-form-modal' onSubmit={handleSubmitAddproduct}>
                  <h1 className='addproduct-modal'>Add your product</h1>
                  <div className='Company-modal'>
                      <input type='text' placeholder='Name of the company' name='companyName' value={ProductformData.companyName} onChange={handleChangeInput} className='company-input-modal'/>
                  </div>
                  <div className='Category-modal'>
                      <input type='text' placeholder='Category' name='category' value={ProductformData.category} onChange={handleChangeInput} className='category-input-modal'/>
                  </div>
                  <div className='logo-modal'>
                      <input type='text' placeholder='Add logo url' name='logoUrl' value={ProductformData.logoUrl} onChange={handleChangeInput} className='logo-input-modal'/>
                  </div>
                  <div className='productLink-modal'>
                      <input type='text' placeholder='Link of the product' name='linkofProduct' value={ProductformData.linkofProduct} onChange={handleChangeInput} className='productLink-input-modal'/>
                  </div>
                  <div className='description-modal'>
                      <input type='text' placeholder='Add description' name='description' value={ProductformData.description} onChange={handleChangeInput} className='description-input-modal'/>
                  </div>
                  <button className='addproduct-btn-modal' type='submit'>+Add</button>
              </form>
              <div className='addproductmodal-sidebar'>
                  <h1 className='addproductmodal-heading'>Feedback</h1>
                  <p className='addproductmodal-para'>Add your product and rate other items.............</p>
              </div>
          </div>
    );
  };

export default {AddproductModal,SignUpModal,LoginModal};



export { LoginModal, SignUpModal ,AddproductModal};
