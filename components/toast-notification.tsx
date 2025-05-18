"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  light?: boolean
}

export function Toast({ message, isVisible, onClose, light = false }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md z-50 max-w-sm animate-fade-in border flex justify-between items-start shadow-lg ${
      light
        ? 'bg-purple-100 border-purple-300 text-purple-800 shadow-md'
        : 'bg-[#232529] border-purple-500 text-white shadow-lg'
    }`}>
      <p className="pr-4 font-extralight">{message}</p>
      <button onClick={onClose} className={light ? 'text-purple-400 hover:text-purple-800' : 'text-gray-400 hover:text-white'}>
        <X size={18} />
      </button>
    </div>
  )
}
