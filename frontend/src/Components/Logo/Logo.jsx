import React from 'react'
import { Link } from 'react-router'
import logoImage from '../../assets/logo.png'

const Logo = () => {
  return (
    <Link to={'/'}>
    <div className='flex items-center text-primary h-3 justify-center'>
      <img className='w-20 h-20' src={logoImage} alt="logo" />
      <h1 className='text-3xl -ml-3 font-bold 
      '>Flavory</h1>
    </div>
    </Link>
  )
}

export default Logo
