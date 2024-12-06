import React from 'react'
import { GoHomeFill } from "react-icons/go";
import Icon from '../assets/meeting.png'
import { CiSearch } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { FiPlusSquare } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaBoxesPacking, FaCartArrowDown } from "react-icons/fa6";
import { MdOutlineShoppingBag, MdRemoveRedEye } from "react-icons/md";
import axios from 'axios';
import { CgProfile } from "react-icons/cg";

const Sidebar = () => {

  const url = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [data, setData] = useState('');
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/users/getuserdetails`, {headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }});

      setData(response.data.data.userDetails.role);
      return (response.data.data.userDetails.role)
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(`${url}/users/logout`,{},{headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }});

      localStorage.removeItem('token')
      navigate('/')
      const result = await response.json();
      return result
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = ()=>{
    logout()
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{height:'96vh', width:"16vw",background: 'linear-gradient(to bottom, #171518 0%, #171518 90%, #251b25 100%)',border: '0.5px solid rgba(255, 255, 255, 0.123)'}} className=' rounded-md'>
      <div className='flex ml-7 gap-9 flex-col mt-3'>
        <p className='cursor-pointer italic text-xl font-sans'>E-Commerce</p>
        <Link className='flex' to='/dashboard'>
        <p className='cursor-pointer'><GoHomeFill size={30} /></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Home</p>
        </Link>
        <Link className='flex' to='/dashboard/search'>
        <p className='cursor-pointer'><CiSearch size={30}/></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Search</p>
        </Link>
        <Link className='flex' to='/dashboard/cart'>
        <p className='cursor-pointer'><FaCartArrowDown size={27} /></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Cart</p>
        </Link >
        <Link className='flex' to='/dashboard/order'>
        <p className='cursor-pointer'><MdOutlineShoppingBag size={30} /></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Your Orders</p>
        </Link >
        <Link className='flex' to='/dashboard/recentlyviewed'>
        <p className='cursor-pointer'><MdRemoveRedEye size={27} /></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Recent View</p>
        </Link>
        {data ==='seller' && (<>
        <Link className='flex' to='/dashboard/sellerupload'>
        <p className='cursor-pointer'><FaBoxesPacking size={27} /></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Seller's Inventory</p>
        </Link >
          <Link className='flex' to='/dashboard/createproduct'>
        <p className='cursor-pointer'><FiPlusSquare size={27}/></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Upload Product</p>
          </Link>
          </>
        )}
          <Link className='flex' to='/dashboard/profile'>
        <p className='cursor-pointer'><CgProfile size={30} /></p>
        <p className='text-lg ml-2 font-sans font-semibold'>Profile</p>
          </Link>
        <p onClick={handleLogout} className='cursor-pointer absolute bottom-10'><CiLogout size={30}/></p>
      </div>
    </div>
  )
}

export default Sidebar
