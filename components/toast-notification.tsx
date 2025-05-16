"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
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
    <div className="fixed bottom-4 right-4 bg-[#232529] border border-purple-500 text-white p-4 rounded-md shadow-lg z-50 max-w-sm animate-fade-in">
      <div className="flex justify-between items-start">
        <p className="pr-4">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
