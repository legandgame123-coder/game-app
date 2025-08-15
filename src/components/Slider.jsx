import React, { useState, useEffect } from "react";

const Slider = () => {
  // Array of images for the slider
  const slides = [
    "https://img.tapimg.net/market/images/5718d54dd6ea30695fc85b3a61c52787.png",
    "https://img.tapimg.net/market/images/5718d54dd6ea30695fc85b3a61c52787.png",
    "https://res.cloudinary.com/rivalry/image/fetch/q_50/https%3A%2F%2Fimages.prismic.io%2Frivalryglhf%2FZrTQfkaF0TcGIybh_AviatorGame.png%3Fauto%3Dformat%2Ccompress"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [currentIndex]);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  // Function to go to a specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full min-h-72 max-w-3xl mx-auto">
      {/* Slider container */}
      <div className="flex transition-transform duration-700 ease-in-out justify-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full max-w-52 flex-shrink-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-full z-0"
            }`}
          >
            <img src={slide} alt={`Slide ${index + 1}`} className="rounded h-52 w-full object-cover" />
          </div>
        ))}
      </div>

      {/* Slide indicators (buttons to go to a specific slide) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 cursor-pointer rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;