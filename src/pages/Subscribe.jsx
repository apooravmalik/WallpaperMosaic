import { useState } from "react";
import { subscribeEmail } from "../utils/api";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FaInstagram, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
    setError('');
    try {
      await validationSchema.validate({ email }, { abortEarly: false });
      console.log('Attempting to subscribe:', email);
      await subscribeEmail(email);
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      console.error('Submission error:', err);
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      } else {
        toast.error('Subscription failed. Please try again.');
      }
    }
  };

  const getRotation = (index) => {
    const rotations = ["rotate-1", "-rotate-1", "-rotate-1", "rotate-1"];
    return rotations[index];
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 order-2 md:order-1 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 md:p-6 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
          {images.map((src, index) => (
            <div
              key={index}
              className={`relative transition-all duration-500 ease-in-out transform 
                ${
                  hoveredIndex === index
                    ? "scale-110 z-20 rotate-0"
                    : hoveredIndex !== null
                    ? `scale-95 ${getRotation(index)} opacity-75`
                    : "scale-100 hover:scale-105"
                }`}
              style={{
                transitionDelay:
                  hoveredIndex !== null ? `${index * 50}ms` : "0ms",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-full h-48 md:h-full object-cover rounded-lg shadow-lg"
              />
              <div
                className={`absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 
                ${
                  hoveredIndex === index
                    ? "bg-opacity-10"
                    : "group-hover:bg-opacity-5"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/2 order-1 md:order-2 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 md:p-8 flex flex-col justify-center items-center relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center text-white">
          Subscribe to Our <span className="animated-gradient">Wallpaper</span>{" "}
          Newsletter
        </h2>
        <p className="text-gray-300 mb-6 md:mb-8 text-center text-sm md:text-base">
          Join our community of wallpaper enthusiasts! Subscribe to receive
          bi-monthly emails featuring stunning wallpapers designed by talented
          creators. Discover new artwork and elevate your device look with every
          issue.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
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
              <span className="relative">Subscribe Now</span>
            </button>
          </div>
        </form>
        <div className="mt-4 text-gray-400 text-sm">
          <Link to="/unsubscribe" className="hover:text-white">
            Unsubscribe
          </Link>
        </div>
        <div className="mt-4 md:absolute md:bottom-4 flex flex-col md:flex-row items-center text-gray-400 text-xs md:text-sm">
          <div className="flex items-center mb-2 md:mb-0 md:mr-3">
            <FaUserCircle className="w-4 h-4 mr-1" />
            <a
              href="https://apoorav-malik.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Made by Apoorav
            </a>
          </div>
          <div className="flex items-center">
            <FaInstagram className="w-4 h-4 mr-1" />
            <a
              href="https://www.instagram.com/harman.malik823/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Designed by Harman
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
