import Lottie from 'lottie-react';
import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar, FaUtensils, FaClock, FaShieldAlt } from 'react-icons/fa';
import animated from '../../assets/Lottie/hero.json';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left mb-8 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="badge badge-warning gap-2 mb-6 p-4 text-lg font-semibold"
              variants={itemVariants}
            >
              <FaStar className="text-yellow-600" />
              Foodie - Fast & Hot Meal Delivery
            </motion.div>

            <motion.h1 
              className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              variants={itemVariants}
            >
              Order{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Healthy & Fresh
              </span>{' '}
              Food Any Time
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
              variants={itemVariants}
            >
              Experience the finest culinary delights delivered to your doorstep. 
              Fresh ingredients, expert chefs, and lightning-fast delivery guaranteed.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-8"
              variants={itemVariants}
            >
              <button className="btn btn-warning btn-lg gap-2 text-white">
                Order Now
                <FaArrowRight />
              </button>
              <button className="btn btn-outline btn-warning btn-lg">
                View Menu
              </button>
            </motion.div>

           
          
          </motion.div>

          {/* Right Content - Lottie Animation */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              <Lottie 
                animationData={animated} 
                loop={true}
                className="w-full h-full"
              />
              

              <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <FaShieldAlt className="text-green-500" />
                <span className="text-sm font-medium">100% Hygienic</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <FaClock className="text-blue-500" />
                <span className="text-sm font-medium">24/7 Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <FaStar className="text-yellow-500" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </motion.div>
            

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;