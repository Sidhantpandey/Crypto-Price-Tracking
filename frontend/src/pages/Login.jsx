import React from "react";
import { useState,useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import {AppContent} from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'


// note that full name property should be displayed in the sign up form and not in login form, we used conditional state variables for this 
// to store state of the input form fields we made three more states 

const login = () => {
  const navigate=useNavigate();
  const {backendUrl,setIsLoggedin,getUserData}=useContext(AppContent)


  const [state, setState] = useState("Sign Up")
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler=async(e)=>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials=true // wqe are sending cookies too

      if(state==='Sign Up'){
        const {data}=await axios.post(backendUrl+'/api/auth/register',{name,email,password})// this is api end point we have to send name , email and password
          if(data.success){
            setIsLoggedin(true)
            getUserData()
            window.location.href = 'http://localhost:5174'; 

          }
          else{
            // alert(data.messaage) instead of this we will show via toast notification 
            toast.error(data.message)
          }
      }// if state is not signup then we will send api request to the login form 
      else{
        const {data}=await axios.post(backendUrl+'/api/auth/login',{email,password})// this is api end point we have to send name , email and password
        if(data.success){
          setIsLoggedin(true)
          getUserData()
          window.location.href = 'http://localhost:5174'; 
        }
        else{
          // alert(data.messaage) instead of this we will show via toast notification 
          toast.error(data.message)
        }
      }

      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
    

  }
  
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0">
      <img
        onClick={()=>navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer "
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Your Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up" ? "Create Account" : "Login to your Account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={e=>setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e=>setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="E Mail-Id"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
             onChange={e=>setPassword(e.target.value)}
             value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <p onClick={()=>navigate('/reset-password')}className="mb-4 text-indigo-500 cursor-pointer">
            Forgot Password ?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:from-indigo-400 hover:to-indigo-800">
  {state}
</button>

        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already Have An Account ?{" "}
            <span onClick={()=>setState('Login')} className="text-blue-400 cursor-pointer underline">
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't Have An Account ?{" "}
            <span onClick={()=>setState('Sign Up')}className="text-blue-400 cursor-pointer underline">
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default login;
