"use client"

import type React from "react"
import { useDraggable } from "@/hooks/use-draggable"
import { useState } from "react"

interface DraggableProps {
  id: string
  children: React.ReactNode
  className?: string
  onDragStart?: () => void
}

export function Draggable({ id, children, className = "", onDragStart }: DraggableProps) {
  const [dragStarted, setDragStarted] = useState(false)

  const { draggableProps, isDragging } = useDraggable({
    id,
    onDragStart: () => {
      if (onDragStart) {
        onDragStart()
      }
      setDragStarted(true)
    },
  })

  // Separate handler for HTML5 drag events
  const handleNativeDragStart = (e: React.DragEvent) => {
    // Only set drag data if we haven't already started dragging via mouse events
    if (!dragStarted) {
      e.dataTransfer.setData("text/plain", id)
      e.dataTransfer.effectAllowed = "move"

      if (onDragStart) {
        onDragStart()
      }
    }
  }

  return (
    <div
      {...draggableProps}
      className={`${className} ${isDragging ? "dragging" : ""}`}
      data-draggable="true"
      draggable="true"
      onDragStart={handleNativeDragStart}
    >
      {children}
      {/* Small drag handle indicator */}
      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 9h14M5 15h14"></path>
        </svg>
      </div>
    </div>
  )
}
