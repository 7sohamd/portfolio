import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure this runs only on the client
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return; // Ensure this runs only on the client

    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));

    if (newMode) {
      document.documentElement.classList.add('dark');
      router.push('/page'); // Redirect to dark mode page
    } else {
      document.documentElement.classList.remove('dark');
      router.push('/page-light'); // Redirect to light mode page
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-40 h-40 flex items-center justify-center focus:outline-none relative"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Glow effect with floating animation */}
      <div className="absolute inset-0 rounded-full bg-white opacity-40 blur-2xl floating"></div>
      {darkMode ? (
        <Image
          src="/images/moon.png"
          alt="Moon"
          width={196}
          height={196}
          className="bg-transparent floating" // Added floating animation
        />
      ) : (
        <Image
          src="/images/sun.png"
          alt="Sun"
          width={196}
          height={196}
          className="bg-transparent floating" // Added floating animation
        />
      )}
    </button>
  );
};

export default ThemeToggle;
