import React from 'react'
import './NavBar.css'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='text-white navb flex items-center justify-end'>
        <div className='flex gap-2 mr-7'>
            <Link to='/sellerlogin'>
    <button className='button rounded-lg h-10 font-sans font-bold'>
    Shopkeeper
    </button>
            </Link>
    <Link to='/'>
    <button className='button rounded-lg h-10 font-sans font-bold'>
    Customer
    </button>
    </Link>
        </div>
    </div>
  )
}

export default NavBar
