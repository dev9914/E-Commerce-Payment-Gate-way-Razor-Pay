import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import axios from 'axios';

const Order = () => {

  const url = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);

  const getOrderItems = async() => {
      try {
        const response = await axios.get(`${url}/users/order/getorder`,{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        })
        // console.log(response.data.data.items)
        setData(response.data.data.items)
        return response.data
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=> {
      getOrderItems()
    },[])

  return (
    <div
    style={{ background: "black", height: "100vh" }}
    className="text-white"
  >
    <div style={{ height: "100vh" }} className="flex ml-4">
      <div className="mt-4">
        <Sidebar />
      </div>
      <div className="ml-4 mt-4">
        <div
          style={{
            height: "96vh",
            width: "81vw",
            background:
              "linear-gradient(to bottom, #171518 0%, #1d181d 80%, #251b25 100%)",
            border: "0.5px solid rgba(255, 255, 255, 0.123)",
          }}
          className="rounded-md overflow-y-auto"
        >

            <h1 className='text-3xl p-5 font-sans font-semibold'>Your Orders</h1>

            {data.map((product)=> (
              <div className='border-t border-b p-5 border-opacity-40 border-gray-300' key={product._id}>
                <div className='flex gap-2 ml-5'>
                <p>Address:</p><p>{product.shippingAddress}</p>
                </div>
                <div className='flex gap-2 ml-5'>
                <p>Order Total:</p><p>{product.totalPrice}₹</p>
                </div>
                <div className='flex gap-2 ml-5'>
                <p>Payment Mode:</p><p>{product.paymentMethod}</p>
                </div>
                <div className='flex gap-2 ml-5'>
                <p>Order Status:</p><p>{product.status}</p>
                </div>
                <div style={{width: "75vw",scrollbarWidth: "none", /* For Firefox */
    msOverflowStyle: "none"}} className='flex overflow-x-auto p-5 gap-7'>
                  {product.items.map((item)=> (
                    <Link to={`/dashboard/productview/${item.productId._id}`} key={item.productId._id} >
                    <div
                      style={{
                        width: "20vw",
                        height: "50vh",
                        backgroundImage: `url(${item.productId.productImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className="bg-yellow-200 cursor-pointer mb-5 rounded-3xl"
                    >
                      <div style={{ paddingTop: "33vh" }}>
                        <div className="ml-3 pb-1 font-sans font-semibold mr-5">
                          <p>
                        {item.productId.name.length > 40
              ? item.productId.name.substring(0, 40) + "..."
              : item.productId.name}</p>
                          <p>
                        {item.productId.description.length > 35
              ? item.productId.description.substring(0, 35) + "..."
              : item.productId.description}
                          </p>
  
                          <div className='flex'>
                              <p>Quantity:&nbsp;</p>
                              <p>{item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex justify-around gap-9">
                          <p className="text-2xl font-sans font-semibold">
                            ₹{item.productId.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              </div>
            ))}

{/* <div className="m-14 grid grid-cols-3 gap-6">
              {data.map((item, index) => (
                <Link to={`/dashboard/productview/${item.product._id}`} onMouseEnter={()=> setProductId(item.product._id)} key={index} >
                  <div
                    style={{
                      width: "20vw",
                      height: "50vh",
                      backgroundImage: `url(${item.product.productImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="bg-yellow-200 cursor-pointer mb-5 rounded-3xl"
                  >
                    <div style={{ paddingTop: "25vh" }}>
                      <div className="ml-3 pb-1 font-sans font-semibold mr-5">
                        <p>
                      {item.product.name.length > 40
            ? item.product.name.substring(0, 40) + "..."
            : item.product.name}</p>
                        <p>
                      {item.product.description.length > 35
            ? item.product.description.substring(0, 35) + "..."
            : item.product.description}
                        </p>

                        <div className='flex'>
                            <p>Quantity:&nbsp;</p>
                            <p>{item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex justify-around gap-9">
                        <p className="text-2xl font-sans font-semibold">
                          ₹{item.product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div> */}
            {/* {data.length > 0 ? (
            <div className='flex justify-between'>
                <p className='text-xl font-sans font-semibold p-4'>
                SubTotal : {totalPrice}₹
                </p>
                <button onClick={()=> CreateOrder()} className='bg-red-600 px-3 rounded-md h-12 font-semibold font-sans'>Place Order</button>
                <p className='text-xl font-sans font-semibold p-4'>
                Total Item : {data.length}
                </p>
            </div>
            ):(
                <div>
                    <h1 className='text-3xl font-sans font-semibold ml-16'>Fetching ...</h1>
                </div>
            )} */}

        </div>
      </div>
    </div>
  </div>
  )
}

export default Order
