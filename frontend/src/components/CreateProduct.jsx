import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateProduct = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setconfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [image, setImage] = useState({});
    const [error, setError] = useState('')

    const navigate = useNavigate()


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
    
        // Handle inputs
        if (name === "email") {
          setEmail(value);
        } if (name === "password") {
          setPassword(value);
        } if (name === "username") {
          setUsername(value);
        } if (name === "confirmPassword") {
          setconfirmPassword(value);
        } if (name === "image" && files) {
          // Handle image upload
          setImage(files[0]);
           // Get the first file (image)
        }
      };

      const url = import.meta.env.VITE_URL;
      const token = localStorage.getItem("token");
      const [data, setData] = useState([]);
    
      const AddProduct = async () => {
        try {
        const formData = new FormData();
        formData.append("name", username);
        formData.append("price", email);
        formData.append("description", password);
        formData.append("category", confirmpassword);
        
        // Append the image if it exists
        if (image) {
          formData.append("productImage", image);
          console.log(image) // 'productImage' should match what the backend expects
        }

        const response = await axios.post(
            `${url}/seller/addproduct`, // API endpoint URL
            formData, // Request body (data)
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }
          )
          setEmail('')
      setPassword('')
      setconfirmPassword('')
      setError('')
      setUsername('')
      setImage('')
    
      alert('Product Added Succesfully !')
      navigate('/dashboard')
          const result = await response.json();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorHTML = error.response.data; // Get the HTML response
        
                // Use DOMParser to extract the error message
                const parser = new DOMParser();
                const doc = parser.parseFromString(errorHTML, "text/html");
                const errorMessage = doc.querySelector("pre")?.textContent || 'An error occurred';
                const cleanedErrorMessage = errorMessage.replace('Error: ', '').split('at ')[0];
        
                setError(cleanedErrorMessage); // Set the extracted message as the error
              }
        }
      };
    
      const handleAdd = ()=> {
        AddProduct()
      }

  return (
    <div style={{height:'96vh', width:"81vw",background: 'linear-gradient(to bottom, #171518 0%, #1d181d 80%, #251b25 100%)',border: '0.5px solid rgba(255, 255, 255, 0.123)'}} className=' rounded-md flex items-center justify-center'>
        <div className='m-12'>
            <h1 className='text-4xl font-sans font-semibold'>Create a new Product</h1>
            <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Product Name</label>
             <input type="text" value={username} onChange={handleInputChange} name="username" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter product name' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Price</label>
             <input type="text" value={email} onChange={handleInputChange} name="email" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter Price' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Description</label>
             <input type="text" value={password} onChange={handleInputChange} name="password" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter product desc' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Product Category</label>
             <input type="text" value={confirmpassword} onChange={handleInputChange} name="confirmPassword" id="" className='bg-black text-sm placeholder-opacity-5 text-gray-200 h-10 pl-3 rounded-lg' placeholder='Enter product category' />
         </div>
         <div className='flex flex-col mt-4'>
             <label htmlFor="" className='text-gray-500 ml-1 text-md mb-2 font-sans font-semibold'>Product Image</label>
             <input
        type="file"
        name="image"
        onChange={handleInputChange}
        accept="image/*" // Only allow image files
      />
         </div>
         {error && <p className='text-red-600 ml-4'>{error}</p>}
         <div onClick={handleAdd} className='bg-white mt-5 rounded-lg cursor-pointer h-10 flex justify-center'>
         <button className='text-black font-sans font-semibold'>Create Product</button>
         </div>
        </div>
    </div>
  )
}

export default CreateProduct
