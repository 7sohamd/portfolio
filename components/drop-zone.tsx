"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface DropZoneProps {
  children: React.ReactNode
  className?: string
  onItemDropped?: () => void
}

export function DropZone({ children, className = "", onItemDropped }: DropZoneProps) {
  const [isOver, setIsOver] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    // Function to handle when a draggable element is over the drop zone
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer!.dropEffect = "move"
      setIsOver(true)
    }

    // Function to handle when a draggable element enters the drop zone
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      setIsOver(true)
    }

    // Function to handle when a draggable element leaves the drop zone
    const handleDragLeave = (e: DragEvent) => {
      // Only set isOver to false if we're leaving the drop zone (not entering a child element)
      if (e.target === dropZone) {
        setIsOver(false)
      }
    }

    // Function to handle when a draggable element is dropped in the drop zone
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsOver(false)

      // Get the dragged item ID
      const draggedItemId = e.dataTransfer!.getData("text/plain")
      console.log("Item dropped:", draggedItemId)

      // Call the callback if provided
      if (onItemDropped) {
        onItemDropped()
      }
    }

    // Add event listeners
    dropZone.addEventListener("dragover", handleDragOver)
    dropZone.addEventListener("dragenter", handleDragEnter)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("drop", handleDrop)

    // Clean up event listeners
    return () => {
      dropZone.removeEventListener("dragover", handleDragOver)
      dropZone.removeEventListener("dragenter", handleDragEnter)
      dropZone.removeEventListener("dragleave", handleDragLeave)
      dropZone.removeEventListener("drop", handleDrop)
    }
  }, [onItemDropped])

  return (
    <div
      ref={dropZoneRef}
      className={`${className} ${isOver ? "border-purple-500 bg-purple-900/20" : ""} transition-colors duration-300`}
    >
      {children}
    </div>
  )
}
