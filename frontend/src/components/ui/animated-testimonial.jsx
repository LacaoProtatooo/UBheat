import React, { useState, useEffect } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export const AnimatedTestimonials = ({ testimonials, autoplay = false }) => {
  const [active, setActive] = useState(0);

  if (!testimonials.length) {
    return <p>Images Available.</p>;
  }

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const isActive = (index) => index === active;

  return (
    <div className="w-full h-full mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20">
      {/* Image Section */}
      <div className="relative w-full h-80">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.src}
              initial={{
                opacity: 0,
                scale: 0.9,
                z: -100,
                rotate: randomRotateY(),
              }}
              animate={{
                opacity: isActive(index) ? 1 : 0.7,
                scale: isActive(index) ? 1 : 0.95,
                z: isActive(index) ? 0 : -100,
                rotate: isActive(index) ? 0 : randomRotateY(),
                zIndex: isActive(index) ? 999 : testimonials.length - index,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                z: 100,
                rotate: randomRotateY(),
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 origin-bottom"
            >
              <img
                src={testimonial.src}
                alt={testimonial.name}
                className="h-full w-full rounded-3xl object-cover"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
  
      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={handlePrev}
          className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center group/button"
        >
          <IconArrowLeft className="h-5 w-5 text-black group-hover/button:rotate-12 transition-transform duration-300" />
        </button>
        <button
          onClick={handleNext}
          className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center group/button"
        >
          <IconArrowRight className="h-5 w-5 text-black group-hover/button:-rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
  
};

export default AnimatedTestimonials;
