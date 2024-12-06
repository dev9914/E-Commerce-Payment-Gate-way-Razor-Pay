import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Rating } from '@mui/material'

const ProductView = () => {
    const productId = useParams()
    console.log(productId)
    const [product,setProduct] = useState({})
    const token = localStorage.getItem("token");
    // console.log(productId.id)
    const url = import.meta.env.VITE_URL;

    const addProductview = async() =>{
        try {
          const response = await axios.post(`${url}/users/products/${productId.id}/view`,{},{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })
    

          console.log(response)
          // setProduct(response.data.data.getProduct)
        } catch (error) {
        console.log(error)
        }
        
      }
    const getProduct = async() =>{
        try {
          const response = await axios.post(`${url}/users/getproductbyid`,{
            productId: productId.id
          },{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })
    

        //   console.log(response.data.data.getProduct)
          setProduct(response.data.data.getProduct)
        } catch (error) {
        console.log(error)
        }
        
      }

      const AddToCart = async() => {
        try {
            const response = await axios.post(
              `${url}/users/cart/add`, // Pass pagination params
              { productId: productId.id ,quantity: 1},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
    
            console.log(response.data.data)
          } catch (error) {
          console.log(error);
        }
      };

      useEffect(()=>{
        getProduct()
        addProductview()
      },[])

  return (
    <div style={{ background: 'black', height:'100vh', }} className='text-white'>
      <div style={{height:"100vh"}} className='flex ml-4 items-center'>
      <Sidebar />
      <div className='ml-4'>
      <div style={{height:'96vh', width:"81vw",background: 'linear-gradient(to bottom, #171518 0%, #1d181d 80%, #251b25 100%)',border: '0.5px solid rgba(255, 255, 255, 0.123)'}} className=' rounded-md flex flex-col items-center justify-center'>
      <div 
                style={{
                  width: "30vw",
                  height: "70vh",
                  backgroundImage:
                    `url(${product.productImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="bg-yellow-200 mb-5 cursor-pointer rounded-3xl"
              >
                <div style={{width:'32vw'}} className="absolute p-5 bottom-36">
                <Rating className="ml-3" name="simple-controlled" value={3} />
                <div className="ml-3 pb-2 font-sans font-semibold mr-5">{product.name}</div>
                <div className="ml-3 pb-5 font-sans font-semibold mr-5">{product.description}</div>
                <div className="flex justify-around gap-9">
                  <p className="text-2xl font-sans font-semibold">₹{product.price}</p>
                  <div
                    style={{ height: "5vh", width: "6vw" }}
                    className=" rounded-3xl bg-neutral-400 flex items-center justify-center"
                  >
                    <p className="">Shop now</p>
                  </div>
                </div>
                </div>
              </div>
              <div onClick={()=> AddToCart()} style={{width:'30vw', height:'10vh'}} className='bg-white rounded-full flex items-center justify-center'>
                <button className='text-black font-sans font-semibold text-3xl'>Add to Cart</button>
              </div>
      </div>
      </div>
      </div>
    </div>
  )
}

export default ProductView
