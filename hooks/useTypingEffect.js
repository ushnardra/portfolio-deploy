import { useState, useEffect } from 'react';

export const useTypingEffect = (words, typeSpeed = 150, deleteSpeed = 100, delay = 1000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(typeSpeed);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex % words.length];

      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
        setTypingSpeed(deleteSpeed);
      } else {
        setText(currentWord.substring(0, text.length + 1));
        setTypingSpeed(typeSpeed);
      }

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex(wordIndex + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, delay, typingSpeed]);

  return text;
};
