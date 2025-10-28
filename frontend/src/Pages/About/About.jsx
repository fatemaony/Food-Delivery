import React from 'react';
import { FaUtensils, FaShippingFast, FaSmile, FaUsers, FaLeaf } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-base-100 min-h-screen text-base-content lg:px-15">
      
      {/* --- Hero Section --- */}
      <div 
        className="relative h-[40vh] md:h-[50vh] bg-secondary flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url('https://placehold.co/1600x600?text=Delicious+Food+Delivered')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="p-6">
          <h1 className="text-5xl md:text-7xl font-bold font-aladin mb-4">About Mealport</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Your daily port for fresh, delicious, and fast meals, delivered right to your door.
          </p>
        </div>
      </div>

      {/* --- Our Mission Section --- */}
      <div className="py-16  max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-aladin text-primary mb-3">Our Mission</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-base-content/80">
            At Mealport, our mission is simple: to connect you with the best local flavors without the hassle. We believe that good food creates good moments, and we're dedicated to making those moments happen faster and more reliably than ever before.
          </p>
        </div>

        {/* --- Core Values Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Value 1: Quality */}
          <div className="card bg-base-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaLeaf className="text-5xl text-success mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Quality & Freshness</h3>
            <p className="text-base-content/70">
              We partner with the best local restaurants that share our passion for quality ingredients and exceptional taste.
            </p>
          </div>
          
          {/* Value 2: Speed */}
          <div className="card bg-base-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaShippingFast className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Speedy Delivery</h3>
            <p className="text-base-content/70">
              Our dedicated network of riders ensures your food arrives hot, fresh, and on time. No more waiting, just eating.
            </p>
          </div>
          
          {/* Value 3: Service */}
          <div className="card bg-base-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaSmile className="text-5xl text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Customer Happiness</h3>
            <p className="text-base-content/70">
              Your satisfaction is our top priority. From browsing to your last bite, we're here to make your experience seamless.
            </p>
          </div>
        </div>
      </div>

      {/* --- Our Story Section --- */}
      <div className="bg-base-200 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img 
              src="https://placehold.co/600x400/D97706/FFFFFF?text=Our+Journey" 
              alt="Our Story"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold font-aladin text-primary mb-4">Our Story</h2>
            <p className="text-lg text-base-content/80 mb-4">
              Founded in [Year] by a group of food lovers, Mealport was born from a simple problem: "Why is it so hard to get great food delivered quickly?"
            </p>
            <p className="text-base-content/70 mb-4">
              We started with just a few partner restaurants and a handful of dedicated riders, driven by a passion to serve our community. Today, we've grown into a bustling "port" for hundreds of restaurants and thousands of happy customers, but our core mission of delicious food, fast, remains the same.
            </p>
          </div>
        </div>
      </div>

      {/* --- Join Us (CTA) Section --- */}
      <div className="py-20 px-6 text-center bg-base-100">
        <FaUsers className="text-6xl text-primary mx-auto mb-4" />
        <h2 className="text-4xl font-bold font-aladin mb-4">Join the Mealport Family</h2>
        <p className="text-lg text-base-content/80 max-w-2xl mx-auto mb-8">
          Whether you're a customer craving your next favorite meal, a restaurant looking to expand your reach, or a rider ready to hit the road, there's a place for you here.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => window.location.href='/menus'}
          >
            Order Now
          </button>
          <button 
            className="btn btn-outline btn-secondary btn-lg"
            onClick={() => window.location.href='/apply-rider'} // Update this link if needed
          >
            Become a Rider
          </button>
        </div>
      </div>

    </div>
  );
};

export default About;
