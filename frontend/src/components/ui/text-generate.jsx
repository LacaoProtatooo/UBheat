import React, { useEffect, useRef } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';
import { cn } from '../../utils/cn';

// Text formatting function
const formatResponseText = (text) => {
  return text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/:\s*/g, ':\n\n') // Add newline after colon
    .replace(/(\d+\.\s)/g, '\n\n\t$1'); // Add newlines before each numbered item
};

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.1,
}) => {
  const [scope, animate] = useAnimate();
  const ref = useRef(null);

  // Format the text before splitting into words
  const formattedText = formatResponseText(words);
  let wordsArray = formattedText.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(
            "span",
            {
              opacity: 1,
              filter: filter ? "blur(0px)" : "none",
            },
            {
              duration: duration ? duration : 1,
              delay: stagger(0.05),
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-black opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)} ref={ref}>
      <div className="mt-4">
        <div className="text-white text-3xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
