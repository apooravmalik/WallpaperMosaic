import { useState, useEffect } from "react";
import { unsubscribeEmail } from "../utils/api"; // Assuming you have an API call for unsubscribing
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Unsubscribe = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/images/FightClub.jpg",
    "/images/JordanShoe.jpg",
    "/images/TheWeeknd.jpg",
    "/images/TylerTheCreator.jpg",
  ];

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await validationSchema.validate({ email }, { abortEarly: false });
      await unsubscribeEmail(email);
      toast.success("Unsubscribed successfully!");
      setEmail("");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      } else {
        toast.error("Unsubscription failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-1/2 relative">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="Sample content"
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
          />
        ))}
      </div>
      <div className="w-1/2 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 flex flex-col justify-center items-center relative">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Unsubscribe from Our Wallpaper Newsletter
        </h2>
        <p className="text-gray-300 mb-8 text-center">
          We are sorry to see you go. Please enter your email address to unsubscribe from our bi-monthly wallpaper newsletter.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-md shadow-2xl group"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 group-hover:opacity-100"></span>
              <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
              <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
              <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
              <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
              <span className="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
              <span className="relative">Unsubscribe</span>
            </button>
          </div>
        </form>
        <div className="mt-4 text-gray-400 text-sm">
          <Link to="/" className="hover:text-white">
            Back to Subscribe
          </Link>
        </div>
        <div className="absolute bottom-4 flex items-center text-gray-400">
          <FaUserCircle className="w-6 h-6 mr-1" />
          <a href="https://apoorav-malik.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Made by Apoorav
          </a>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
