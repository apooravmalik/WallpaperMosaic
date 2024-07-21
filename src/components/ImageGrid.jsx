import { useState, useEffect } from 'react';

const ImageGridFour = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/images/FightClub.jpg",
    "/images/JordanShoe.jpg",
    "/images/TheWeeknd.jpg",
    "/images/TylerTheCreator.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex w-full max-w-5xl mx-auto bg-gray-100 rounded-xl overflow-hidden">
      <div className="w-1/2 relative h-[600px]">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Sample content ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
          />
        ))}
      </div>
      <div className="w-1/2 grid grid-cols-2 gap-6 p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        {images.map((src, index) => (
          <div
            key={index}
            className={`relative transition-all duration-500 ease-in-out transform 
              ${hoveredIndex === index
                ? 'scale-125 z-20 rotate-0'
                : hoveredIndex !== null
                ? `scale-90 ${getRotation(index)} opacity-75`
                : 'hover:scale-105'
              }`}
            style={{
              transitionDelay: hoveredIndex !== null ? `${index * 50}ms` : '0ms',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={src}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className={`absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 
              ${hoveredIndex === index ? 'bg-opacity-10' : 'group-hover:bg-opacity-5'}`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getRotation = (index) => {
  const rotations = ['rotate-1', '-rotate-1', '-rotate-1', 'rotate-1'];
  return rotations[index];
};

export default ImageGridFour;