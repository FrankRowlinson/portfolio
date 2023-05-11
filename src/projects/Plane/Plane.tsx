import { useRef, useEffect } from "react"
import { initializeRenderer, moveCameraToScrollPercentage } from "./utils.3d"
import "./Plane.scss"

export function Plane() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) {
      const render = initializeRenderer(ref.current)
      // start animation cycle
      requestAnimationFrame(render)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", moveCameraToScrollPercentage)
    return () => {
      window.removeEventListener("scroll", moveCameraToScrollPercentage)
    }
  }, [])

  return (
    <div className='canvas-container'>
      <canvas className='canvas' ref={ref}></canvas>
    </div>
  )
}
