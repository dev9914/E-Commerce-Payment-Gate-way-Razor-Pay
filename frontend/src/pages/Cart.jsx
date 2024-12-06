import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar';
import { Button, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

const Cart = () => {
    const url = import.meta.env.VITE_URL;
    const token = localStorage.getItem("token");
    const [data, setData] = useState([]);
    const [productId, setProductId] = useState('')
    const [placeOrder, setPlaceorder] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('')
    const [PaymentMode, setPaymentMode] = useState('')

    const getCartItem = async() => {
        try {
          const response = await axios.get(`${url}/users/cart/getItem`,{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })

        //   console.log(response.data.data.items[0].product.name)
          setData(response.data.data.items)
          return response.data
        } catch (error) {
          console.log(error)
        }
      }
    const deleteCartItem = async() => {
        try {
          const response = await axios.delete(`${url}/users/cart/delete/${productId}`,{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })
          getCartItem()
          return response.data
        } catch (error) {
          console.log(error)
        }
      }
    const CreateOrder = async() => {
        try {
          const response = await axios.post(`${url}/users/order/create`,{items:orderItems, totalPrice: totalPrice,shippingAddress: shippingAddress, paymentMethod: PaymentMode },{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })
          console.log(response.data)
          setPlaceorder(false)
          return response.data
        } catch (error) {
          console.log(error)
        }
      }

      const orderItems = data.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      
      // Calculate the total price
      const totalPrice = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );


      useEffect(()=> {
        getCartItem()
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

            <h1 className='text-3xl ml-16 mt-5 font-sans font-semibold'>Cart Items</h1>

<div className="m-14 grid grid-cols-3 gap-6">
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
                    <MdDelete size={27}  onClick={(e) => {
                            e.preventDefault() 
                            deleteCartItem(); 
                          }} color='black' className='ml-[270px] mt-2' />
                    <div style={{ paddingTop: "25vh" }}>
                      <Rating className="ml-3" name="simple-controlled" value={3} />
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
            </div>
            {data.length > 0 ? (
            <div className='flex justify-between'>
                <p className='text-xl font-sans font-semibold p-4'>
                SubTotal : {totalPrice}₹
                </p>
                <button onClick={()=> setPlaceorder(true)} className='bg-red-600 px-3 rounded-md h-12 font-semibold font-sans'>Place Order</button>
                <p className='text-xl font-sans font-semibold p-4'>
                Total Item : {data.length}
                </p>
            </div>
            ):(
                <div>
                    <h1 className='text-3xl font-sans font-semibold ml-16'>Your cart is empty. Start shopping now!</h1>
                </div>
            )}

            <div className='flex items-start justify-center'>
            {placeOrder && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-stone-800 w-2/4 p-6 rounded shadow-lg text-center">
      <div className=" mx-auto p-4 rounded">
  <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
  <form onSubmit={(event) => {
    event.preventDefault(); 
    CreateOrder(); 
  }}>
    <div className="mb-4">
      <label htmlFor="shippingAddress" className="block text-sm font-medium">
        Shipping Address
      </label>
      <input
      value={shippingAddress}
      onChange={(e)=> setShippingAddress(e.target.value)}
        type="text"
        id="shippingAddress"
        name="shippingAddress"
        placeholder="Enter your address"
        className="mt-1 block w-full rounded-md text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
        required
      />
    </div>

    {/* Payment Mode Select */}
    <div className="mb-4">
      <label htmlFor="paymentMode" className="block text-sm font-medium ">
        Payment Mode
      </label>
      <select
        id="paymentMode"
        name="paymentMode"
        className="mt-1 block w-full rounded-md text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
        value={PaymentMode}
        onChange={(e)=> setPaymentMode(e.target.value)}
        required
      >
        <option value="">Select Payment Mode</option>
        <option value="Credit Card">Credit Card</option>
        <option value="Debit Card">Debit Card</option>
        <option value="Cash On Delivery">Cash On Delivery</option>
        <option value="Paytm">Paytm</option>
      </select>
    </div>

    {/* Buttons */}
    <div className="flex justify-between">
      <button
        type="button" onClick={()=> setPlaceorder(false)}
        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="bg-red-600 text-white py-2 px-4 rounded transition"
      >
        Place Order
      </button>
    </div>
  </form>
</div>

      </div>
    </div>
  )}
            </div>

        </div>
      </div>
    </div>
  </div>
  )
}

export default Cart
