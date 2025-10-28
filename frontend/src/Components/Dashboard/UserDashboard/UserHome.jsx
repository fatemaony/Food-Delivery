import React from 'react';
import { Link } from 'react-router';

const UserHome = () => {
    

    return (
        <div 
            className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white p-10"
            
        >
            <div className="bg-primary bg-opacity-50 p-10 rounded-lg text-center">
                <div className='flex items-center justify-center gap-5'>

                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZJJ4MHxDrfwtLDQ4xGYalSV9FOVWR5LG9jg&s' alt="Delicious Food Logo" className="w-40 h-40 mb-4" />
                <div>
                <h1 className="text-5xl font-bold mb-4 font-aladin">Welcome to Our Restaurant</h1>
                <p className="text-xl mb-8">Experience the best food in town, delivered right to your door.</p>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-2 text-amber-500">Our Special Offer</h2>
                        
                        <ul className="text-left list-disc list-inside mb-4 space-y-1">
                            <li>Cremini Mushrooms</li>
                            <li>Homemade Marinara</li>
                            
                        </ul>
                        <Link to="/menus">
                           <button className="btn btn-primary bg-amber-600 border-none hover:bg-amber-700">Order Now</button>
                        </Link>
                    </div>
                    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg flex flex-col items-center justify-center">
                         <h2 className="text-2xl font-bold mb-2 text-amber-500">Fast Delivery</h2>
                         <p className="mb-4">Free Home Delivery within 30 minutes. Rated 4.5 by 150+ reviews.</p>
                         <Link to="/menus">
                            <button className="btn btn-outline btn-secondary border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
                                Search Now
                            </button>
                         </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
