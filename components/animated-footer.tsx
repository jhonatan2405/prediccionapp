"use client"

import { useEffect, useRef } from "react"

export function AnimatedFooter() {
  const bubblesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bubblesRef.current) return

    // Generate 128 bubbles with random properties
    const bubbles = []
    for (let i = 0; i < 128; i++) {
      const size = 2 + Math.random() * 4
      const distance = 6 + Math.random() * 4
      const position = -5 + Math.random() * 110
      const time = 2 + Math.random() * 2
      const delay = -1 * (2 + Math.random() * 2)

      bubbles.push({
        size,
        distance,
        position,
        time,
        delay,
      })
    }

    // Create bubble elements
    bubbles.forEach((bubble) => {
      const div = document.createElement("div")
      div.className = "bubble"
      div.style.setProperty("--size", `${bubble.size}rem`)
      div.style.setProperty("--distance", `${bubble.distance}rem`)
      div.style.setProperty("--position", `${bubble.position}%`)
      div.style.setProperty("--time", `${bubble.time}s`)
      div.style.setProperty("--delay", `${bubble.delay}s`)
      bubblesRef.current?.appendChild(div)
    })
  }, [])

  return (
    <footer className="footer-animated">
      <div className="bubbles" ref={bubblesRef} />
      <div className="footer-content">
        <div className="text-center space-y-2">
          <p className="footer-title">DML-Predict AI © 2025</p>
          <p className="footer-text">
            Sistema de apoyo al diagnóstico. No reemplaza el criterio médico profesional.
          </p>
          <p className="footer-title">
            Hecho con <span className="footer-title">♥</span> por{" "}
            <span className="footer-title">Jbarcode</span>
          </p>
        </div>
      </div>
      <svg style={{ position: "fixed", top: "100vh" }}>
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="blob"
            />
          </filter>
        </defs>
      </svg>
    </footer>
  )
}


