"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, FileCode, Linkedin, MessageSquare, ChevronDown, ChevronUp, Search, Moon } from "lucide-react"
import { Draggable } from "@/components/draggable"
import { InteractiveBackground } from "@/components/interactive-background"
import { Toast } from "@/components/toast-notification"
import dynamic from 'next/dynamic';
import { DropZone } from "@/components/drop-zone";
import { CustomCursor } from "@/components/custom-cursor";
import FadeIn from "@/components/fade-in";
import ThemeToggle from "@/components/ThemeToggle"; // Adjust the path if necessary

// Change the dynamic import to include type
const AnimatedText = dynamic<{
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
  highlightWords?: string[];
  highlightClassName?: string;
}>(() => import("../components/AnimatedText"), { 
  ssr: false,
  loading: () => <div className="text-5xl md:text-7xl font-extrabold">Loading...</div>
});

// Array of witty messages to show when dragging
const wittyMessages: string[] = [
  "Feel free to arrange according to you, consider this your playground!",
  "Drag and drop like you're rearranging your desk... but less effort!",
  "Go ahead, make yourself at home. Move things around!",
  "This portfolio is like IKEA furniture - some assembly required!",
  "Dragging elements: the adult version of playing with building blocks.",
  "Who needs interior designers when you can arrange this portfolio yourself?",
]

// Skill data for rendering
const skillsData = [
  {
    id: "skills-languages",
    title: "Languages",
    items: ["Java Python", "JavaScript C++ SQL"],
  },
  {
    id: "skills-web",
    title: "Web",
    items: ["React.js Next.js", "Node.js Express.js", "MongoDB"],
  },
  {
    id: "skills-mobile",
    title: "Mobile",
    items: ["Flutter", "React Native"],
  },
  {
    id: "skills-devops",
    title: "DevOps",
    items: ["Docker AWS", "Git CI/CD"],
  },
  {
    id: "skills-uiux",
    title: "UI/UX",
    items: ["Figma", "Adobe XD"],
  },
  {
    id: "skills-others",
    title: "Others",
    items: ["Firebase REST APIs", "PyTorch Blender Unity", "Ethical Hacking"],
  },
]

export default function HomeLight() {
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [showFullAbout, setShowFullAbout] = useState(false)
  const [showAllExperience, setShowAllExperience] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [lastToastTime, setLastToastTime] = useState(0)
  const [droppedSkills, setDroppedSkills] = useState<
    Array<{ id: string; title: string; items: string[]; position: { x: number; y: number } }>
  >([])
  const [ratingMessage, setRatingMessage] = useState("")
  const [showRating, setShowRating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [expandDropZone, setExpandDropZone] = useState(false)
  const [skillDropped, setSkillDropped] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showSearchResult, setShowSearchResult] = useState(false)
  const [showSearchResponse, setShowSearchResponse] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [heroImageSrc, setHeroImageSrc] = useState("/images/dp.png");
  const [isSparkle, setIsSparkle] = useState(false);
  const [isMagicTransition, setIsMagicTransition] = useState(false);
  const [showBlushPopup, setShowBlushPopup] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);



  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleSearchResponse = () => {
    setShowSearchResponse((prev) => !prev);
    const audio = new Audio('/music/boom.mp3');
    audio.play();
  };

  const handleDragStart = () => {
    setExpandDropZone(true)
    setIsDragging(true)
    const currentTime = Date.now()
    if (currentTime - lastToastTime > 30000) {
      const randomMessage = wittyMessages[Math.floor(Math.random() * wittyMessages.length)]
      setToastMessage(randomMessage)
      setShowToast(true)
      setLastToastTime(currentTime)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (droppedSkills.length === 0) {
      setExpandDropZone(false)
    }
  }

  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.add("border-purple-500", "bg-purple-900/20")
    }
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.remove("border-purple-500", "bg-purple-900/20")
    }
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.remove("border-purple-500", "bg-purple-900/20")
      const skillId = e.dataTransfer!.getData("text/plain")
      const skill = skillsData.find((s) => s.id === skillId)
      if (skill) {
        const isAlreadyDropped = droppedSkills.some((ds) => ds.id === skill.id)
        if (!isAlreadyDropped) {
          const rect = dropZone.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          setDroppedSkills((prev) => [
            ...prev,
            {
              ...skill,
              position: { x, y },
            },
          ])
        }
      }
    }
    dropZone.addEventListener("dragover", handleDragOver)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("drop", handleDrop)
    return () => {
      dropZone.removeEventListener("dragover", handleDragOver)
      dropZone.removeEventListener("dragleave", handleDragLeave)
      dropZone.removeEventListener("drop", handleDrop)
    }
  }, [droppedSkills])

  const handleRearrangeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const data = e.dataTransfer.getData("text/plain")
    if (data.startsWith("dropped-")) {
      const index = Number.parseInt(data.replace("dropped-", ""))
      const rect = dropZoneRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setDroppedSkills((prev) => {
        const newSkills = [...prev]
        newSkills[index] = {
          ...newSkills[index],
          position: { x, y },
        }
        return newSkills
      })
    }
  }

  const handleSkillDropped = () => {
    setSkillDropped(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const x = e.clientX - centerX;
    const rotateY = (x / (rect.width / 2)) * 45;
    setMousePosition({ x: 0, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleHeroImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    setIsSparkle(true);
    setTimeout(() => setIsSparkle(false), 700);
    if (e.detail === 3) {
      setIsFadingOut(true);
      setTimeout(() => {
        setHeroImageSrc("/images/Wink.png");
        setIsFadingOut(false);
        setShowBlushPopup(true);
        if (!audioRef.current) {
          audioRef.current = new Audio('/music/blush.mp3');
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 font-mono relative">
      {/* Interactive Background */}
      <InteractiveBackground />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Toast Notification */}
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} light />

      {/* Left sidebar icons */}
      <FadeIn className="fixed left-4 top-1/3 hidden lg:flex flex-col gap-4 z-50">
        <Link href="https://github.com/7sohamd" aria-label="Github">
          <Github className="w-5 h-5 text-gray-600 hover:text-gray-900 transition" />
        </Link>
        <Link href="https://github.com/7sohamd/portfolio" aria-label="Projects">
          <FileCode className="w-5 h-5 text-gray-600 hover:text-gray-900 transition" />
        </Link>
      </FadeIn>

      {/* Navigation */}
      <FadeIn>
        <header className="container mx-auto py-6 px-4 relative z-10">
          <nav className="flex justify-between items-center">
            <Link href="https://www.youtube.com/watch?v=xvFZjo5PgG0" className="flex items-center gap-2 text-gray-900">
              <span className="font-bold flex items-center">
                <Image src="/images/logo.png" alt="Logo" width={20} height={20} className="mr-2" />
                Soham
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-purple-600 hover:text-purple-700 transition">
                #home
              </Link>
              <Link href="#projects" className="text-gray-600 hover:text-gray-900 transition">
                #works
              </Link>
              <Link href="#about-me" className="text-gray-600 hover:text-gray-900 transition">
                #about-me
              </Link>
              <Link href="#contacts" className="text-gray-600 hover:text-gray-900 transition">
                #contacts
              </Link>
              
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1 transition"
                >
                  EN
                  {isDropdownOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <div
                  className={`absolute top-full mt-2 bg-white border border-gray-200 rounded shadow-lg transition-all duration-300 ${
                    isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  <ul className="py-2">
                    <li className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer">
                      Seriously?
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </FadeIn>

      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="absolute top-10 left-10 z-50"> {/* Positioned absolutely */}
            <ThemeToggle />
        </div>
        <section className="py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <Draggable id="hero-text" className="space-y-6" onDragStart={handleDragStart}>
            <h1 className="text-5xl md:text-7xl font-extrabold hero-text leading-tight">
              <AnimatedText 
                text="Soham is a Software Engineer and Full Stack Developer"
                className="text-5xl md:text-7xl font-extrabold hero-text leading-tight"
                delay={500}
                wordDelay={150}
                highlightWords={["Software", "Engineer", "Full", "Stack", "Developer"]}
                highlightClassName="text-purple-600"
              />
            </h1>
            <FadeIn delay={2000}>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                and makes flop horror games using unity, btw..
                <br />
                <span className="flex items-center gap-2">
                  Hey google can I get a job?
                  <button
                    onClick={toggleSearchResponse}
                    className="text-purple-600 hover:text-purple-700 transition"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </span>
              </p>
            </FadeIn>
            {showSearchResponse && (
              <FadeIn>
                <p className="text-lg md:text-xl text-gray-600 mt-2">
                  Google said,<span className="text-purple-600"> 'Try Bing, I don't handle lost causes.'</span>
                </p>
              </FadeIn>
            )}
            <FadeIn delay={2500}>
              <a
                href="/Modern_Simple_ATS_Friendly_LateX_resume.pdf"
                download="Soham_Dey_CV.pdf"
                className="bg-transparent hover:bg-purple-100 text-gray-900 border border-purple-500 px-6 py-3 text-lg transition mt-4 inline-block"
              >
                Download CV
              </a>
            </FadeIn>
          </Draggable>
          <FadeIn delay={1000}>
            <div className="relative">
              <div
                ref={imageRef}
                className="relative group [perspective:1000px]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {showBlushPopup && (
                  <span className="popup-blush">damn! you made me blush</span>
                )}
                <div
                  className="relative transition-all duration-300 ease-out [transform-style:preserve-3d]"
                  style={{
                    transform: `rotateY(${mousePosition.y}deg)`,
                  }}
                >
                  <div
                    className={`${
                      isSparkle ? "hero-sparkle-glow" : ""
                    } ${isFadingOut ? "hero-fade-magic" : ""}`}
                  >
                    <Image
                      src={heroImageSrc}
                      alt="Developer portrait"
                      width={300}
                      height={300}
                      className={`mx-auto cursor-pointer`}
                      onClick={handleHeroImageClick}
                    />
                  </div>
                </div>
                {/* Theme indicator image */}
                <div className="absolute -bottom-16 -left-32 w-96 h-96 pr-10">
                  <Image
                    src="/images/light.png"
                    alt="Light mode indicator"
                    width={800}
                    height={800}
                    className="w-full h-full object-contain floating-fast"
                  />
                </div>
              </div>

              {/* Currently working on badge */}
              <Draggable
                id="currently-working"
                className="absolute bottom-[20%] left-[10%] bg-white border-l-2 border-purple-500 py-2 px-4 z-20 shadow-md"
                onDragStart={handleDragStart}
              >
                <p className="text-xs text-purple-600">Currently working on</p>
                <p className="text-sm text-gray-900">Portfolio</p>
              </Draggable>
            </div>
          </FadeIn>
        </section>

        {/* Decorative graphics for hero section */}
        <div aria-hidden="true" className="pointer-events-none select-none">
                  <Image
                    src="/images/graphic1.png"
                    alt="Floating graphic 1"
                    width={120}
                    height={120}
                    className="absolute top-[300px] left-[5px] opacity-40 floating-slow z-[-1]" // Adjusted left from 50px to 20px
                  />
                  <Image
                    src="/images/dots-grid.png"
                    alt="Static dots grid accent"
                    width={120}
                    height={80}
                    className="absolute top-10 right-10 opacity-20"
                  />
                </div>

        {/* Quote Section */}
        <FadeIn>
          <section className="py-16 flex justify-center">
            <Draggable id="quote" className="max-w-2xl relative border border-gray-200 p-8 bg-white shadow-sm" onDragStart={handleDragStart}>
              <span className="quote-mark text-gray-300 absolute top-0 left-4">"</span>
              <p className="text-xl text-center px-10">With great power comes great electricity bill</p>
              <span className="quote-mark text-gray-300 absolute bottom-0 right-4">"</span>
              <div className="bg-white border border-gray-200 px-4 py-2 absolute -bottom-4 right-8 shadow-sm">
                <p className="text-right text-gray-600">- Dr. Who</p>
              </div>
            </Draggable>
          </section>
        </FadeIn>

       {/* Projects Section */}
       <FadeIn>
          <section id="projects" className="py-16 relative">
            <div aria-hidden="true" className="pointer-events-none select-none">
              <Image
                src="/images/graphic2.png"
                alt="Floating graphic 2"
                width={100}
                height={100}
                className="absolute top-0 right-10 opacity-20 floating-slow-reverse"
              />
              <Image
                src="/images/rectangle.png"
                alt="Floating rectangle"
                width={80}
                height={80}
                className="absolute bottom-10 left-10 opacity-15 floating-slow"
              />
              <Image
                src="/images/dots-grid.png"
                alt="Static dots grid accent"
                width={100}
                height={60}
                className="absolute bottom-0 right-0 opacity-10"
              />
            </div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold section-title">
                <span className="text-purple-600">#</span>projects
              </h2>
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition"
              >
                View all{" "}
                <span className="text-sm">
                  {showAllProjects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
            </div>

            {/* Initial 3 projects (always visible) */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Project 1 - LifeSyncHub */}
              <Draggable
                id="project-1"
                className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                onDragStart={handleDragStart}
              >
                <div className="h-48 bg-blue-50 relative">
                  <div className="absolute inset-0 p-4">
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded w-fit">LifeSyncHub</div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-700">ML Disease Prediction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-700">Doctor Video Calls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-700">Blockchain Records</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                    <div className="text-xs text-gray-600">React.js Node.js MongoDB ML</div>
                  </div>
                  <h3 className="text-xl mb-2 text-gray-900">LifeSyncHub</h3>
                  <p className="text-sm text-gray-600 mb-4">Healthcare app with ML disease prediction</p>
                  <div className="flex gap-2">
                    <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1"
                      onClick={() => window.open('https://github.com/7sohamd/VideoCall', '_blank')}
                    >
                      GitHub <span>↗</span>
                    </button>
                  </div>
                </div>
              </Draggable>

              {/* Project 2 - Hackwarness */}
              <Draggable
                id="project-2"
                className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                onDragStart={handleDragStart}
              >
                <div className="h-48 bg-green-50 relative">
                  <div className="absolute inset-0 p-4 flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">HACKWARNESS</div>
                      <div className="bg-green-200 rounded-full p-2 inline-block mt-2">
                        <div className="w-6 h-6 flex items-center justify-center">🔒</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                    <div className="text-xs text-gray-600">Python React.js ML Cybersecurity</div>
                  </div>
                  <h3 className="text-xl mb-2 text-gray-900">Hackwarness</h3>
                  <p className="text-sm text-gray-600 mb-4">Cybersecurity awareness game with adaptive ML tools</p>
                  <div className="flex gap-2">
                    <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1"
                      onClick={() => window.open('https://github.com/7sohamd/Avenir', '_blank')}
                    >
                      GitHub <span>↗</span>
                    </button>
                  </div>
                </div>
              </Draggable>

              {/* Project 3 - Kavach */}
              <Draggable
                id="project-3"
                className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                onDragStart={handleDragStart}
              >
                <div className="h-48 bg-purple-50 relative">
                  <div className="absolute inset-0 p-4 flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-800">Kavach</div>
                      <div className="text-xl font-bold text-purple-800">Safety App</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                    <div className="text-xs text-gray-600">Flutter Blockchain AI</div>
                  </div>
                  <h3 className="text-xl mb-2 text-gray-900">Kavach</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Blockchain-based women's safety app with hidden camera detection
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1"
                      onClick={() => window.open('https://github.com/AayushKP/KAWACH', '_blank')}
                    >
                      GitHub <span>↗</span>
                    </button>
                  </div>
                </div>
              </Draggable>
            </div>

            {/* Additional projects (hidden by default) */}
            {showAllProjects && (
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {/* Project 4 - Samadhan */}
                <Draggable
                  id="project-4"
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onDragStart={handleDragStart}
                >
                  <div className="h-48 bg-blue-100 relative flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">Samadhan</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                      <div className="text-xs text-gray-600">React.js Node.js MongoDB</div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">Samadhan</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Real-time reporting system for water infrastructure issues
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1">
                        GitHub <span>↗</span>
                      </button>
                    </div>
                  </div>
                </Draggable>

                {/* Project 5 - Agneepath */}
                <Draggable
                  id="project-5"
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onDragStart={handleDragStart}
                >
                  <div className="h-48 bg-orange-100 relative flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-900">Agneepath</div>
                      <div className="text-sm text-orange-900 mt-2">Railway Navigation</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                      <div className="text-xs text-gray-600">AR Unity AI</div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">Agneepath</h3>
                    <p className="text-sm text-gray-600 mb-4">AR-based railway navigation with AI grievance support</p>
                    <div className="flex gap-2">
                      <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1"
                        onClick={() => window.open('https://1drv.ms/p/c/995ced1584e46218/ERhi5IQV7VwggJmhAQAAAAABZYhMUkHUIJrU8pthnFsRKg?e=PTr74c', '_blank')}
                      >
                        Demo <span>↗</span>
                      </button>
                    </div>
                  </div>
                </Draggable>

                {/* Project 6 - NoKeyboardGaming */}
                <Draggable
                  id="project-6"
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onDragStart={handleDragStart}
                >
                  <div className="h-48 bg-indigo-100 relative flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-900">NoKeyboardGaming</div>
                      <div className="text-sm text-indigo-900 mt-2">Gesture Control</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                      <div className="text-xs text-gray-600">Python OpenCV ML</div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">NoKeyboardGaming</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Facial movement + hand gesture based gaming control system
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1"
                        onClick={() => window.open('https://github.com/7sohamd/NoKeyBoardGaming', '_blank')}
                      >
                        GitHub <span>↗</span>
                      </button>
                    </div>
                  </div>
                </Draggable>

                {/* Project 7 - Emotion Recognise */}
                <Draggable
                  id="project-7"
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onDragStart={handleDragStart}
                >
                  <div className="h-48 bg-yellow-100 relative flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-900">Emotion Recognise</div>
                      <div className="text-sm text-yellow-900 mt-2">Facial Analysis</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                      <div className="text-xs text-gray-600">Python TensorFlow OpenCV</div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">Emotion Recognise</h3>
                    <p className="text-sm text-gray-600 mb-4">ML-based emotion recognition from facial input</p>
                    <div className="flex gap-2">
                      <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1"
                        onClick={() => window.open('https://github.com/7sohamd/Emotion-Recognise', '_blank')}
                      >
                        GitHub <span>↗</span>
                      </button>
                    </div>
                  </div>
                </Draggable>

                {/* Project 8 - TabTracker */}
                <Draggable
                  id="project-8"
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onDragStart={handleDragStart}
                >
                  <div className="h-48 bg-blue-200 relative flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">TabTracker</div>
                      <div className="text-sm text-blue-900 mt-2">Chrome Extension</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="border border-gray-200 inline-block px-4 py-1 mb-2 bg-gray-50">
                      <div className="text-xs text-gray-600">JavaScript Chrome API NLP</div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">TabTracker</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Chrome extension to track time spent on tabs and summarize content
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 transition flex items-center gap-1"
                        onClick={() => window.open('https://github.com/7sohamd/TabTracker', '_blank')}
                      >
                        GitHub <span>↗</span>
                      </button>
                    </div>
                  </div>
                </Draggable>
              </div>
            )}
          </section>
        </FadeIn>

        {/* Skills Section */}
        <FadeIn>
          <section id="skills" className="py-16 relative">
            <h2 className="text-2xl font-bold section-title mb-8">
              <span className="text-purple-600">#</span>skills
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <DropZone
                  className="bg-white border border-gray-200 p-6 h-full flex items-center justify-center cursor-default"
                  onItemDropped={handleSkillDropped}
                >
                  <div className="text-center">
                    {!skillDropped ? (
                      <>
                        <p className="text-gray-600 mb-2">I left this space empty on purpose</p>
                        <p className="text-purple-600 font-bold">so that you can play around</p>
                        <p className="text-gray-600 mt-2">
                          or maybe just a <span className="line-through">skill</span> space issue
                        </p>
                        <div className="mt-4 opacity-50">
                          <span className="text-2xl">🎮</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-2">
                          <span className="text-purple-600 font-bold text-xl">{ratingMessage}</span>
                        </p>
                        <div className="mt-6 opacity-70">
                          <span className="text-3xl">🏆</span>
                        </div>
                        <button
                          onClick={() => setSkillDropped(false)}
                          className="mt-6 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1 rounded transition"
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                </DropZone>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Draggable
                  id="skills-languages"
                  className="bg-white border border-gray-200"
                  onDragStart={handleDragStart}
                >
                  <div className="border border-gray-200 inline-block px-4 py-1 m-2">
                    <h3 className="font-bold text-gray-900">Languages</h3>
                  </div>
                  <div className="p-4 pt-0">
                    <ul className="text-gray-600 space-y-1">
                      <li>Java Python</li>
                      <li>JavaScript C++ SQL</li>
                    </ul>
                  </div>
                </Draggable>
                <Draggable id="skills-web" className="bg-white border border-gray-200" onDragStart={handleDragStart}>
                  <div className="border border-gray-200 inline-block px-4 py-1 m-2">
                    <h3 className="font-bold text-gray-900">Web</h3>
                  </div>
                  <div className="p-4 pt-0">
                    <ul className="text-gray-600 space-y-1">
                      <li>React.js Next.js</li>
                      <li>Node.js Express.js</li>
                      <li>MongoDB</li>
                    </ul>
                  </div>
                </Draggable>
                <Draggable
                  id="skills-mobile"
                  className="bg-white border border-gray-200"
                  onDragStart={handleDragStart}
                >
                  <div className="border border-gray-200 inline-block px-4 py-1 m-2">
                    <h3 className="font-bold text-gray-900">Mobile</h3>
                  </div>
                  <div className="p-4 pt-0">
                    <ul className="text-gray-600 space-y-1">
                      <li>Flutter</li>
                      <li>React Native</li>
                    </ul>
                  </div>
                </Draggable>
                <Draggable
                  id="skills-devops"
                  className="bg-white border border-gray-200"
                  onDragStart={handleDragStart}
                >
                  <div className="border border-gray-200 inline-block px-4 py-1 m-2">
                    <h3 className="font-bold text-gray-900">DevOps</h3>
                  </div>
                  <div className="p-4 pt-0">
                    <ul className="text-gray-600 space-y-1">
                      <li>Docker AWS</li>
                      <li>Git CI/CD</li>
                    </ul>
                  </div>
                </Draggable>
                <Draggable id="skills-uiux" className="bg-white border border-gray-200" onDragStart={handleDragStart}>
                  <div className="border border-gray-200 inline-block px-4 py-1 m-2">
                    <h3 className="font-bold text-gray-900">UI/UX</h3>
                  </div>
                  <div className="p-4 pt-0">
                    <ul className="text-gray-600 space-y-1">
                      <li>Figma</li>
                      <li>Adobe XD</li>
                    </ul>
                  </div>
                </Draggable>
                <Draggable
                  id="skills-others"
                  className="bg-white border border-gray-200"
                  onDragStart={handleDragStart}
                >
                  <div className="border border-gray-200 inline-block px-4 py-1 m-2">
                    <h3 className="font-bold text-gray-900">Others</h3>
                  </div>
                  <div className="p-4 pt-0">
                    <ul className="text-gray-600 space-y-1">
                      <li>Firebase REST APIs</li>
                      <li>PyTorch Blender Unity</li>
                      <li>Ethical Hacking</li>
                    </ul>
                  </div>
                </Draggable>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* About Me Section */}
        <FadeIn>
          <section id="about-me" className="py-16 relative">
            <div aria-hidden="true" className="pointer-events-none select-none">
              <Image
                src="/images/dots-grid-small.png"
                alt="Small dots grid accent"
                width={80}
                height={80}
                className="absolute bottom-0 right-0 opacity-20 floating-slow"
              />
              <Image
                src="/images/graphic2.png"
                alt="Floating graphic 2"
                width={80}
                height={80}
                className="absolute top-0 left-10 opacity-30 floating-slow-reverse"
              />
            </div>
            <h2 className="text-2xl font-bold section-title mb-8">
              <span className="text-purple-600">#</span>about-me
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Draggable id="about-me-text" className="space-y-4" onDragStart={handleDragStart}>
                <p className="text-gray-900">Hello, I'm Soham!</p>
                <div className={`text-gray-600 ${showFullAbout ? "" : "line-clamp-3"}`}>
                  <p className="mb-4">
                    I'm a Software Engineer based in Kolkata, India. I have experience in full stack development (MERN,
                    Next.js), cross-platform apps (Flutter, React Native), and DevOps (Docker, AWS).
                  </p>
                  <p>
                    I have proven success in leading teams, developing scalable applications, and participating in
                    national-level hackathons. I'm passionate about solving real-world problems with efficient code and
                    intuitive UI/UX.
                  </p>
                  <p className="mt-4">
                    My educational background includes a B.Tech in Computer Science and Engineering from Netaji Subhash
                    Engineering College (2022-2026) with a GPA of 7.9 (Till 5th Sem). I've achieved recognition in various
                    hackathons, including reaching the Second Round at Smart India Hackathon 2023 and 2024 as a Team
                    Leader.
                  </p>
                  <p className="mt-4">
                    I'm fluent in English and Hindi, and Bengali is my native language. I'm always looking for new
                    challenges and opportunities to grow as a developer.
                  </p>
                </div>
                <button
                  onClick={() => setShowFullAbout(!showFullAbout)}
                  className="bg-transparent hover:bg-gray-100 text-gray-900 text-xs border border-gray-200 px-3 py-1 mt-4 transition flex items-center gap-1"
                >
                  {showFullAbout ? "Read less" : "Read more"}{" "}
                  {showFullAbout ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </Draggable>

              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Experience</h3>
                  <button
                    onClick={() => setShowAllExperience(!showAllExperience)}
                    className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1 transition"
                  >
                    View all {showAllExperience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Always visible experiences */}
                <Draggable
                  id="experience-1"
                  className="bg-white border border-gray-200 overflow-hidden"
                  onDragStart={handleDragStart}
                >
                  <div className="p-4">
                    <div className="border border-gray-200 inline-block px-4 py-1 mb-2">
                      <div className="text-xs text-gray-600">Co-Founder (2023 – Present)</div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">NooBuild, Kolkata, India</h3>
                    <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                      <li>Built a 2K+ member community and led a 50+ member team to host 7+ tech events.</li>
                      <li>
                        Created a freelancing-focused training curriculum and conducted workshops on Game Dev, UI/UX, and
                        Graphic Design.
                      </li>
                    </ul>
                  </div>
                </Draggable>

                <Draggable
                  id="experience-2"
                  className="bg-white border border-gray-200 overflow-hidden"
                  onDragStart={handleDragStart}
                >
                  <div className="p-4">
                    <div className="border border-gray-200 inline-block px-4 py-1 mb-2">
                      <div className="text-xs text-gray-600">Design Lead (2023 – 2024)</div>
                    </div>
                    <h3 className="text-xl mb-2 text-gray-900">GDSC NSEC, Kolkata, India</h3>
                    <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                      <li>Designed interactive branding and content for 20+ tech workshops and community events.</li>
                      <li>Led UI/UX sessions to introduce 100+ students to design tools and workflows.</li>
                    </ul>
                  </div>
                </Draggable>

                {/* Hidden experiences (shown when "View all" is clicked) */}
                {showAllExperience && (
                  <>
                    <Draggable
                      id="experience-3"
                      className="bg-white border border-gray-200 overflow-hidden"
                      onDragStart={handleDragStart}
                    >
                      <div className="p-4">
                        <div className="border border-gray-200 inline-block px-4 py-1 mb-2">
                          <div className="text-xs text-gray-600">Python Developer Intern (Aug 2023 – Nov 2023)</div>
                        </div>
                        <h3 className="text-xl mb-2 text-gray-900">CodeClause</h3>
                        <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                          <li>
                            Developed a Python-Tkinter desktop music player using OOP principles, file handling, and
                            intuitive UI design.
                          </li>
                        </ul>
                      </div>
                    </Draggable>

                    <Draggable
                      id="experience-4"
                      className="bg-white border border-gray-200 overflow-hidden"
                      onDragStart={handleDragStart}
                    >
                      <div className="p-4">
                        <div className="border border-gray-200 inline-block px-4 py-1 mb-2">
                          <div className="text-xs text-gray-600">Video Editor (2019 – 2022)</div>
                        </div>
                        <h3 className="text-xl mb-2 text-gray-900">Curlbury (YouTube)</h3>
                        <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                          <li>
                            Produced and edited travel, gaming, and documentary videos for an audience of 10K+ viewers.
                          </li>
                        </ul>
                      </div>
                    </Draggable>
                  </>
                )}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Contacts Section */}
        <FadeIn>
          <section id="contacts" className="py-16 relative">
            <div aria-hidden="true" className="pointer-events-none select-none">
              <Image
                src="/images/rectangle.png"
                alt="Floating rectangle"
                width={60}
                height={60}
                className="absolute top-0 left-1/2 opacity-10 floating-slow"
              />
              <Image
                src="/images/dots-grid-small.png"
                alt="Small dots grid accent"
                width={60}
                height={60}
                className="absolute bottom-0 left-0 opacity-10"
              />
              <Image
                src="/images/graphic1.png"
                alt="Floating graphic 1"
                width={60}
                height={60}
                className="absolute bottom-10 right-10 opacity-10 floating-slow-reverse"
              />
            </div>
            <h2 className="text-2xl font-bold section-title mb-8">
              <span className="text-purple-600">#</span>contacts
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Draggable id="contact-text" className="space-y-4" onDragStart={handleDragStart}>
                <p className="text-gray-600">
                  I'm interested in freelance opportunities. However, if you have other request or question, don't
                  hesitate to contact me
                </p>
              </Draggable>
              <Draggable
                id="contact-info"
                className="bg-white p-6 border border-gray-200 shadow-sm"
                onDragStart={handleDragStart}
              >
                <h3 className="font-bold mb-4 text-gray-900">Message me here</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <span className="text-gray-900">+91 73639 77016</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">@</span>
                    <span className="text-gray-900">soham4707@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">
                      <Github className="w-5 h-5" />
                    </span>
                    <span className="text-gray-900">7sohamd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">
                      <Linkedin className="w-5 h-5" />
                    </span>
                    <span className="text-gray-900">soham-dey-891332256</span>
                  </div>
                </div>
              </Draggable>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* Footer */}
      <FadeIn>
        <footer className="border-t border-gray-200 py-8 mt-16 relative z-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
                <div className="flex items-center gap-2">
                  <Image src="/images/logo.png" alt="Logo" width={20} height={20} className="mr-2" />
                  <span className="font-bold text-gray-900">Soham</span>
                </div>
                <span className="text-gray-600 text-sm">soham4707@gmail.com</span>
                <p className="text-gray-600 text-sm">Software Engineer — Full Stack Developer — UI/UX Designer</p>
              </div>
              <div className="text-center md:text-right">
                <h3 className="font-bold mb-2 text-gray-900">Media</h3>
                <div className="flex gap-4 justify-center md:justify-end">
                  <Link href="https://github.com/7sohamd" className="text-gray-600 hover:text-gray-900 transition">
                    <Github className="w-5 h-5" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/soham-dey-891332256/"
                    className="text-gray-600 hover:text-gray-900 transition"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-600 text-sm mt-8">© Copyright 2024. Made by Soham</div>
          </div>
        </footer>
      </FadeIn>
    </div>
  )
} 