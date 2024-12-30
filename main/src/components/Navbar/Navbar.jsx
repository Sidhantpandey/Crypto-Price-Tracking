import React ,{useContext,useState} from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow_icon from '../../assets/arrow_icon.png'
import {CoinContext} from '../../context/CoinContext'
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const {setCurrency,currency}=useContext(CoinContext)
  const navigate = useNavigate();



  const currencyHandler=(event)=>{
    switch(event.target.value){
      case "usd":{
        setCurrency({name:"usd",symbol:"$"})
        break;
      }
      case "eur":{
        setCurrency({name:"eur",symbol:"&"})
        break;
      }
      case "inr":{
        setCurrency({ name: 'inr', symbol: '₹' });
        break;
      }
      default:{
        setCurrency({name:"usd",symbol:"$"})
        break;
      }
    }
  } // we will link this currency handler with the dropdown 
  
  return (
    <div className='navbar'>
        <img onClick={()=>navigate('/')} className='cursor-pointer' src={logo} alt="" />
        <ul>
            <li onClick={()=>navigate('/')}>Home</li>
            <li>Features</li>
            <li>Blog</li>
            <li>Pricing</li>
        </ul>
        <div className="navbar-right">
            <select onChange={currencyHandler}>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="INR">INR</option>
            </select>
            <button>Sign Up <img src={arrow_icon} alt="" /></button>
        </div>
    </div>
  )
}

export default Navbar