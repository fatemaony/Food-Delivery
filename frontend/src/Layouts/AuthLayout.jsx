import React from 'react';
import { Outlet } from 'react-router';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import Logo from '../Components/Logo/Logo';
import signIn from '../assets/Lottie/Signin.json';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Header with logo */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-4 md:px-10 md:py-5"
      >
        <Logo className="h-12 w-auto" />
      </motion.header>

      {/* Main content */}
      <main className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Lottie animation section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-md lg:max-w-xl"
          >
            <div className="p-8">
              <Lottie 
                animationData={signIn} 
                loop={true} 
                className="w-full h-auto"
              />
            </div>
           
          </motion.div>

          {/* Outlet (sign-in/sign-up forms) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-md w-full mt-10"
          >
            <div className="bg-base-100 px-4 rounded-2xl shadow-xl border border-base-300">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  )
}

export default AuthLayout;