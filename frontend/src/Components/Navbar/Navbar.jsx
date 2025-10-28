import React from 'react'
import { Link } from 'react-router'
import Logo from '../Logo/Logo'
import useAuth from '../../Hooks/useAuth'
import useUserRole from '../../Hooks/useUserRole'
import Swal from 'sweetalert2'
import useAxios from '../../Hooks/useAxios'

const Navbar = () => {
  const navItems = <> 
    <Link to={"/"}><li className='text-secondary font-bold hover:underline  px-5'>Home</li></Link>
    <Link to={"/menus"}><li className='text-secondary font-bold hover:underline  px-5'>Menu</li></Link>
    <Link to={"/about"}><li className='text-secondary font-bold hover:underline  px-5'>About</li></Link>
    <Link to={"/contact"}><li className='text-secondary font-bold hover:underline px-5'>Contact</li></Link>
  </>

  const { user, loading, signOutUser } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axiosInstance = useAxios();
  const [dbUser, setDbUser] = React.useState(null);

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user || !role) return '/dashboard';
    return role.toLowerCase() === 'admin' ? '/dashboard/admin' : '/dashboard/user';
  };

  // Fetch user data from database
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const response = await axiosInstance.get(`/api/users/email/${user.email}`);
          // Fix: Access the data property from the response
          if (response.data.success) {
            setDbUser(response.data.data); // This is the actual user object
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user, axiosInstance]);

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
            icon: "success",
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary'
            }
          });
          signOutUser();
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="navbar bg-base-100 px-10 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {navItems}

            <div className="lg:hidden flex flex-col gap-2 p-2">
              {user && (
                <div>
                  <Link to={getDashboardLink()}>
                    <button className='btn btn-primary w-full'>Dashboard</button>
                  </Link>
                </div>
              )}
              {user ? (
                // Profile dropdown for mobile
                <div className="dropdown dropdown-end w-full">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      <img 
                        alt="User profile" 
                        src={dbUser?.image || user?.photoURL || 'https://via.placeholder.com/150'} 
                      />
                    </div>
                  </div>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li className='pt-2'>
                      <span className="justify-center font-bold">
                        {dbUser?.name || user?.displayName || 'User Name'}
                      </span>
                    </li>
                    <li className='pb-2'>
                      <span className="justify-center text-sm text-gray-500">
                        {user?.email || 'user@email.com'}
                      </span>
                    </li>
                    <li>
                      <a onClick={handleLogout} className="text-error  text-center font-bold cursor-pointer">Sign Out</a>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin" className="btn btn-outline btn-secondary w-full">
                  Sign In
                </Link>
              )}
            </div>
          </ul>
        </div>
        
        <Logo/>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems}
        </ul>
      </div>
      
      {/* Desktop Auth Section */}
      <div className="navbar-end hidden lg:flex gap-2 items-center">
        {user && (
          <div>
            <Link to={getDashboardLink()}>
              <button className='btn btn-primary'>Dashboard</button>
            </Link>
          </div>
        )}
        {user ? (
          // Profile dropdown for desktop
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom" 
              data-tip={dbUser?.name || user?.displayName || 'User'}
            >
              <div className="w-10 rounded-full">
                <img 
                  alt="User profile" 
                  src={dbUser?.image || user?.photoURL || 'https://via.placeholder.com/150'} 
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className='pt-2'>
                <span className="justify-center font-bold">
                  {dbUser?.name || user?.displayName || 'User Name'}
                </span>
              </li>
              <li className='pb-2'>
                <span className="justify-center text-sm text-gray-500">
                  {user?.email || 'user@email.com'}
                </span>
              </li>
              <li>
                <a onClick={handleLogout} className="text-error font-bold cursor-pointer">Sign Out</a>
              </li>
            </ul>
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

export default Navbar;