import React, { useState } from 'react'
import './SignIn.css'
import icon from '../assets/meeting.png'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const SignUp = () => {

    const navigate = useNavigate()
  const url = import.meta.env.VITE_URL

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setconfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullname, setfullName] = useState('')
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
    if (e.target.name === "username") {
      setUsername(e.target.value);
    }
    if (e.target.name === "confirmPassword") {
      setconfirmPassword(e.target.value);
    }
    if (e.target.name === "fullname") {
      setfullName(e.target.value);
    }
  };

  const SignUp = async() =>{
    try {
      const response = await axios.post(`${url}/users/register`,{
        email: email,
        username:username,
        password:password,
        fullname:fullname
      })
      localStorage.setItem('token', response.data.data.accessToken)
      setEmail('')
      setPassword('')
      setconfirmPassword('')
      setfullName('')
      setUsername('')
      setError('')
      navigate('/dashboard')
      console.log(response.data)
    } catch (error) {

      if (error.response && error.response.data) {
        const errorHTML = error.response.data; // Get the HTML response

        // Use DOMParser to extract the error message
        const parser = new DOMParser();
        const doc = parser.parseFromString(errorHTML, "text/html");
        const errorMessage = doc.querySelector("pre")?.textContent || 'An error occurred';
        const cleanedErrorMessage = errorMessage.replace('Error: ', '').split('at ')[0];

        setError(cleanedErrorMessage); // Set the extracted message as the error
      }else{
        setError('Internal Server Error')
      }
      
    }
    
  }

  const handleSignUp = ()=> {
    if(!email) {
      throw new Error(setError("Email and password is required"))
    }
    if(!password) {
      throw new Error(setError("Password is required"))
    }
    if(!(password === confirmpassword)) {
        throw new Error(setError("Password and Confirm Password should be same"))
    }
    SignUp()
  }

  return (<>
  <NavBar />
    <div style={{height:'104vh'}} className='text-white flex justify-center'>
    <div className='maincardsignup mt-10 rounded-md'>
     <div className='m-7'>
         <div className='flex'>
         <img src={icon} className='mr-2' style={{width:'25px', height:"25px"}} alt="" />
         <h1 className='text-md mb-4 text-blue-500 font-sans font-semibold'>E-Commerce</h1>
         </div>
         <h1 className='text-3xl font-sans font-semibold'>Sign Up</h1>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Username</label>
             <input type="text" autoComplete="off" value={username} onChange={handleInputChange} name="username" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter your username' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>FullName</label>
             <input type="text" autoComplete="off" value={fullname} onChange={handleInputChange} name="fullname" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter your username' />
         </div>
         <div className='flex flex-col mt-6'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Email</label>
             <input autoComplete="off" type="text" value={email} onChange={handleInputChange} name="email" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='your@gmail.com' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Password</label>
             <input autoComplete="off" type="password" value={password} onChange={handleInputChange} name="password" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='• • • • • •' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Confirm Password</label>
             <input autoComplete="off" type="password" value={confirmpassword} onChange={handleInputChange} name="confirmPassword" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='• • • • • •' />
         </div>
         {error && <p className='text-red-600 ml-4'>{error}</p>}
         <div className='mt-3'>
         </div>
         <div onClick={handleSignUp} className='bg-white mt-5 rounded-lg cursor-pointer h-10 flex justify-center'>
         <button className='text-black font-sans font-semibold'>Sign Up</button>
         </div>
         <div className='flex justify-center mt-3 text-white'>
             <p className='mr-1'>Already have an account?</p>
             <Link to='/'>
             <p className='font-semibold font-sans underline cursor-pointer'>Sign In</p>
             </Link>
         </div>
     </div>
    </div>
 </div>
 </>
  )
}

export default SignUp
