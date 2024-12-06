import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Profile = () => {

    const url = import.meta.env.VITE_URL;
    const token = localStorage.getItem("token");
    const [fullName, setfullname] = useState('')
    const [role, setRole] = useState('')
    const [username, setUsername] = useState('')
    const [user, setUser] = useState({})

    const getUserDetails = async () => {
        try {
            const response = await axios.get(
              `${url}/users/getuserdetails`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            setUser(response.data.data.userDetails)
        } catch (error) {
          console.log(error);
        }
      };


    const updateUserDetails = async () => {
        try {
            const response = await axios.patch(
              `${url}/users/profile/update`,{username: username, role: role, fullname: fullName},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            // console.log(response.data.data.userDetails)
            setUser(response.data.data.userDetails)
            setRole('');
            setUsername('')
            setfullname('')
            return response.data
        } catch (error) {
          console.log(error);
        }
      };

      useEffect(()=> {
        getUserDetails()
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

            <h1 className='text-3xl ml-20 mt-5 font-sans font-semibold'>Your Profile</h1>
            <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                updateUserDetails()
            }} className='p-10 px-20'>
        <div className="mb-4">
          <label htmlFor="fullName" className="block font-bold mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e)=> setfullname(e.target.value)}
            placeholder={user.fullname}
            required
            className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block font-bold mb-2">
            Username
          </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            name="username"
            value={username}
            
            placeholder={user.username}
            required
            className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block font-bold mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e)=> setRole(e.target.value)}
            required
            className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Your Role</option>
            <option value="buyer">Customer</option>
            <option value="seller">Shopkeeper</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={user.email}
            disabled
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 text-white bg-red-600 font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
            </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Profile
