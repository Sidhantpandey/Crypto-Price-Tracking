import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import {useContext} from 'react'
import {toast} from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin ,isAccountVerified} =useContext(AppContent);
  // console.log(userData) 

  const logout=async()=>{
    try {
      axios.defaults.withCredentials=true;// sending cookies too
      // calling logout end point 
      const {data}=await axios.post(backendUrl+'/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
    } catch (error) {
        toast.error(error.message)
    }
  }


  const sendVerificationOtp=async()=>{
      try {
        axios.defaults.withCredentials=true;
        const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp')
        // if otp has been sent we have to redirect user to the email verify page 
        if(data.success){
            navigate('/email-verify')
            toast.success(data.message)
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
          toast.error(error.message)
      }
  }

  // now join this logout function in the li tag 
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData ? 
        <div className='w-12 h-12 flex justify-center items-center rounded-full bg-black text-white relative group text-3xl'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>
              }
              <li onClick={logout}  className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-16'>Logout</li>
            </ul>

          </div>
        </div>
       : 
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      }
    </div>
  );
};

export default Navbar;
