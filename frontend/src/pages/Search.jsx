import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { FaMagnifyingGlassPlus } from 'react-icons/fa6'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';

const Search = () => {

    const url = import.meta.env.VITE_URL;
    const token = localStorage.getItem("token");
    const [searchedText, setSearchedText] = useState('')
    const [item, setItem] = useState('')
    const [data, setData] = useState([]);
    const [notFound, setNotfound] = useState('')

    const getSearchProduct = async() => {
        try {
          const response = await axios.get(`${url}/seller/search?query=${searchedText}`,{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })

        //   console.log(response.data.data)
          setData(response.data.data)
          setItem(searchedText)
          setSearchedText('')
          return response.data
        } catch (error) {
          setSearchedText('')
          setNotfound('Oops! No products match your search.')
          console.log(error)
        }
      }


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
          className="rounded-md"
        >
          <div className="m-12 flex flex-col">
          <div>
      <div style={{background:'#171518', width:'70vw',height:"10vh",}} className='rounded-full'>
        <div style={{height:"8.5vh",border: '0.5px solid rgba(255, 255, 255, 0.123)',width:"69vw",left:'7px',top:"5px"}} className='flex justify-between rounded-full relative'>
          <input style={{background:'#171518',width:'61vw'}} className='ml-2 rounded-full px-3 outline-none' type="text" value={searchedText} onChange={(e)=> setSearchedText(e.target.value)} placeholder='Search for products, brands, and categories...' />
            <div onClick={()=> getSearchProduct()} style={{height:'6vh',width:"6vw"}} className='mr-3 bg-white cursor-pointer mt-2 text-black flex rounded-full'>
            <FaMagnifyingGlassPlus className='mt-3 ml-2' size={18} />
            <p className='font-sans font-semibold ml-2 mt-2' >Shop</p>
            </div>
        </div>
      </div>
    </div>
            <h1 className="text-3xl font-semibold font-sans">
                {data.length > 0 && (
                    <p>
                        List of "{item}"
                    </p>
                )}
            </h1>
            <div className="flex justify-between">
            {data.length > 0 && (
            <div className="flex gap-5 mt-8">
                <button
                  style={{ background: "#343434", width: "9vw", height: "6vh" }}
                  className="rounded-3xl font-sans font-semibold text-gray-100"
                >
                  Recommended
                </button>
                <button
                  style={{ background: "#343434", width: "9vw", height: "6vh" }}
                  className="rounded-3xl font-sans font-semibold text-gray-400"
                >
                  Top Products
                </button>
            </div>
            )}
            {data.length ===0 && !notFound && (
                <div>
                    <h1 className='text-3xl ml-5 mt-5 font-sans font-semibold'>Find your favorite items...</h1>
                </div>
            )}
            {notFound && (
                 <h1 className='text-3xl ml-5 mt-5 font-sans font-semibold'>{notFound}</h1>
            )}
            </div>
          </div>
          <div style={{height:"55vh", scrollbarWidth: "none", /* For Firefox */
    msOverflowStyle: "none"}} className="m-14 overflow-y-auto grid grid-cols-3 gap-6">
              {data.map((item, index) => (
                <Link key={index} to={`/dashboard/productview/${item._id}`}>
                  <div
                    style={{
                      width: "20vw",
                      height: "50vh",
                      backgroundImage: `url(${item.productImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="bg-yellow-200 cursor-pointer mb-5 rounded-3xl"
                  >
                    <div style={{ paddingTop: "32vh" }}>
                      <Rating className="ml-3" name="simple-controlled" value={3} />
                      <div className="ml-3 pb-1 font-sans font-semibold mr-5">
                        <p>
                      {item.name.length > 40
            ? item.name.substring(0, 40) + "..."
            : item.name}</p>
                        <p>
                      {item.description.length > 35
            ? item.description.substring(0, 35) + "..."
            : item.description}
                        </p>
                      </div>
                      <div className="flex justify-around gap-9">
                        <p className="text-2xl font-sans font-semibold">
                          ₹{item.price}
                        </p>
                        <div
                          style={{ height: "5vh", width: "6vw" }}
                          className="rounded-3xl bg-neutral-400 flex items-center justify-center"
                        >
                          <p>Shop now</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Search
