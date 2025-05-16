"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface Position {
  x: number
  y: number
}

interface UseDraggableProps {
  id: string
  onDragStart?: () => void
}

export function useDraggable({ id, onDragStart }: UseDraggableProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)
  const initialMousePosition = useRef<Position>({ x: 0, y: 0 })
  const initialElementPosition = useRef<Position>({ x: 0, y: 0 })

  // Load saved position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem(`draggable-${id}`)
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition)
        setPosition(parsedPosition)
      } catch (error) {
        console.error("Failed to parse saved position", error)
      }
    }
  }, [id])

  // Save position to localStorage when it changes
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem(`draggable-${id}`, JSON.stringify(position))
    }
  }, [position, id])

  // Clear localStorage on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem(`draggable-${id}`)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [id])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging on primary mouse button (left click)
    if (e.button !== 0) return

    setIsDragging(true)

    // Call onDragStart callback if provided
    if (onDragStart) {
      onDragStart()
    }

    // Store initial positions
    initialMousePosition.current = { x: e.clientX, y: e.clientY }
    initialElementPosition.current = { ...position }

    // Prevent text selection during drag
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const dx = e.clientX - initialMousePosition.current.x
      const dy = e.clientY - initialMousePosition.current.y

      setPosition({
        x: initialElementPosition.current.x + dx,
        y: initialElementPosition.current.y + dy,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const draggableProps = {
    ref: elementRef,
    onMouseDown: handleMouseDown,
    style: {
      position: "relative",
      cursor: isDragging ? "grabbing" : "grab",
      zIndex: isDragging ? 1000 : 1,
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: isDragging ? "none" : "box-shadow 0.3s ease",
      boxShadow: isDragging ? "0 10px 20px rgba(0, 0, 0, 0.2)" : "none",
    } as React.CSSProperties,
  }

  return { draggableProps, isDragging }
}
