import React, { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();
  // Fix: Initialize useRef with 0 to satisfy the "Expected 1 arguments" error and provide a mutable ref object.
  const animationRef = useRef(0);

  useEffect(() => {
    if (isVisible) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        }
      };
      animationRef.current = requestAnimationFrame(step);
    }
    return () => {
      if(animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export default AnimatedCounter;
