import React, {useContext,useEffect,useState} from 'react'
import { assets } from "../assets/assets";
import {AppContent} from '../context/AppContext'
import axios from 'axios'
import {toast} from  'react-toastify'
import {useNavigate} from 'react-router-dom';


// after getting otp on the email user should se one more input field where he can write password
// three forms are visible we want that after submitting 1st form it should open second and after 2nd it should open 3rd

const ResetPassword = () => {
  const {backendUrl}=useContext(AppContent)
  // send cookies
  axios.defaults.withCredentials=true
  const navigate=useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setnewPassword] = useState('')

  const [isEmailSent, setisEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)


  // link these input refs to the input field
  const inputRefs=React.useRef([])

  //handler for 1st form 
const onSubmitEmail=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
      if(data.success){
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
      data.success && setisEmailSent(true)
    } catch (error) {
      toast.error(error.message)

    }
}
  // handler for second form 
  const onSubmitOtp=async(e)=>{
    e.preventDefault();
    const otpArray=inputRefs.current.map(e=>e.value);
    const otpString = otpArray.join(''); 
    setOtp(otpString);
    setIsOtpSubmitted(true);
}
// handler for 3rd form
const onSubmitNewPassword=async(e)=>{
  e.preventDefault();
  try {
    const {data}=await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword})
    data.success?toast.success(data.message) :toast.error(data.message)
    data.success && navigate('/login')
  } catch (error) {
    toast.error(error.message)
  }

}

  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text')
    const pasteArray=paste.split('')
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
      }
    })
  
  }
  const deleteInput=(e,index)=>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
      inputRefs.current[index-1].focus()
    }
  
  }
  const handleInput=(e,index)=>{
    if(e.target.value.length >0 && index <inputRefs.current.length-1){
      inputRefs.current[index+1].focus()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <img
        onClick={()=>navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer "
      />
{/* to enter emailid */}

{!isEmailSent && <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter Your Registered Email Address</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} required className='bg-transparent outline-none text-white' placeholder='Email Id' type="email" />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3  hover:from-indigo-400 hover:to-indigo-800'>Submit</button>
      </form>}
      


{/* OTP Input Form */}

{!isOtpSubmitted && isEmailSent && <form  onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the OTP sent to your Email-Id</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>(
                <input  ref={e=>inputRefs.current[index]=e} onInput={(e)=>handleInput(e,index)} onKeyDown={(e)=>deleteInput(e,index)}className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' type="text" maxLength='1' key={index} required />
            ))}

          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full  hover:from-indigo-400 hover:to-indigo-800 '>Submit</button>
      </form>}


{/* Enter new password */}

{isOtpSubmitted && isEmailSent && <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the New Password</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input value={newPassword} onChange={(e)=>setnewPassword(e.target.value)} required className='bg-transparent outline-none text-white' placeholder='Password' type="password" />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3  hover:from-indigo-400 hover:to-indigo-800'>Submit</button>
      </form>}
      






    </div>
  )
}

export default ResetPassword