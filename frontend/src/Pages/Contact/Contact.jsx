import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const Contact = () => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted:', {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    });
    
    // Show a success message (you can replace this with Swal)
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="bg-base-100 min-h-screen text-base-content px-15">
      
      {/* --- Hero Section --- */}
      <div 
        className="relative h-[40vh] md:h-[50vh] bg-secondary flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url('https://placehold.co/1600x600?text=We%27d+Love+to+Hear+From+You')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="p-6">
          <h1 className="text-5xl  md:text-7xl font-bold font-aladin mb-8">Contact With Us</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Have a question, feedback, or just want to say hello? Get in touch!
          </p>
        </div>
      </div>

      {/* --- Contact Info & Form Section --- */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* --- Left Column: Contact Info --- */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-aladin text-primary mb-4">Get In Touch</h2>
              <p className="text-lg text-base-content/80 mb-6">
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaMapMarkerAlt className="text-3xl text-primary mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Our Location</h3>
                <p className="text-base-content/70">123 Mealport Street, Food City, 12345</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaPhoneAlt className="text-3xl text-primary mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Call Us</h3>
                <p className="text-base-content/70">+1 (234) 567-890</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaEnvelope className="text-3xl text-primary mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Email Us</h3>
                <p className="text-base-content/70">support@mealport.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaClock className="text-3xl text-primary mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Opening Hours</h3>
                <p className="text-base-content/70">Mon - Sat: 09:00 AM - 11:00 PM</p>
                <p className="text-base-content/70">Sun: 10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* --- Right Column: Contact Form --- */}
          <div className="card bg-base-200 shadow-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold font-aladin text-primary mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Name</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="John Doe" 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Email</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="john@example.com" 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>

              {/* Subject */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Question about an order" 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>

              {/* Message */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea 
                  name="message"
                  className="textarea textarea-bordered h-32" 
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary btn-lg">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* --- Map Section --- */}
      <div className="h-[50vh] bg-base-300">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.218561026078!2d-73.9878536845936!3d40.75800097932691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c64801b9%3A0x6d57065c363da003!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1678886522345!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Our Location"
        ></iframe>
      </div>

    </div>
  );
};

export default Contact;
