import React from 'react'
import { useAppContext } from '../context/AppContext'

const Header = () => {
    const {isLoggedin, userData} = useAppContext();
  return (
    <div className='p-4 sm:p-6 sm:px-24 h-screen flex items-center justify-center '>
        {isLoggedin? <h1 className='text-2xl md:text-3xl'>Welcome back, {userData? userData.name : "Chief"} </h1>:<h1>Welcome, please sign up to verify your account</h1>}
    </div>
  )
}

export default Header