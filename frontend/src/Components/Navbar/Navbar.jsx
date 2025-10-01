import React from 'react'
import { Link } from 'react-router'
import Logo from '../Logo/Logo'
import useAuth from '../../Hooks/useAuth'
import Swal from 'sweetalert2'

const Navbar = () => {
  const navItems = <>
  <Link to={"/"}><li className='text-secondary font-bold hover:underline  px-5'>Home</li></Link>
  <Link to={"/"}><li className='text-secondary font-bold hover:underline  px-5'>Menu</li></Link>
  <Link to={"/"}><li className='text-secondary font-bold hover:underline  px-5'>Order</li></Link>
  <Link to={"/"}><li className='text-secondary font-bold hover:underline  px-5'>About</li></Link>
  <Link to={"/"}><li className='text-secondary font-bold hover:underline px-5'>Contact</li></Link>
  
  </>


const { user, loading, signOutUser } = useAuth();

const handleLogout = async () => {
  try {
    
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sign Out"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sign Out!",
          text: "User signed out successfully.",
          icon: "success"
        });
       signOutUser();
      }
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  return (
    <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {navItems}
      </ul>
    </div>
    
    <Logo/>
    
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      {navItems}
    </ul>
  </div>
  <div className="navbar-end">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm">
            Welcome, {user.displayName || user.email?.split('@')[0]}
          </span>
          <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm">
            Sign Out
          </button>
        </div>
      ) : (
        <Link to="/signin" className="btn btn-outline btn-secondary">
          Sign In
        </Link>
      )}
    </div>
</div>
  )
}

export default Navbar
