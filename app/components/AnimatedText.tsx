import { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
  highlightWords?: string[];
  highlightClassName?: string;
}

const AnimatedText = ({ text, className = '', delay = 0, wordDelay = 100, highlightWords = [], highlightClassName = '' }: AnimatedTextProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [visibleWords, setVisibleWords] = useState<number>(0);

  useEffect(() => {
    const splitWords = text.split(' ');
    setWords(splitWords);

    const timer = setTimeout(() => {
      let currentWord = 0;
      const interval = setInterval(() => {
        if (currentWord < splitWords.length) {
          setVisibleWords(prev => prev + 1);
          currentWord++;
        } else {
          clearInterval(interval);
        }
      }, wordDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, wordDelay]);

  return (
    <div className={`${className} leading-tight`}>
      {words.map((word, index) => {
        const isHighlighted = highlightWords.includes(word);
        return (
          <span
            key={index}
            className={`inline-block transition-all duration-500 mx-[0.25em] ${
              index < visibleWords ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isHighlighted ? `${highlightClassName} glitch-text` : ''}`}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export default AnimatedText; 