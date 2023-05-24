import { useRef, useEffect } from "react"
import { initializeRenderer, moveCameraToScrollPercentage } from "./setup.3d"
import "./styles/Plane.scss"

export function Plane() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) {
      const render = initializeRenderer(ref.current)
      // start animation cycle, cause render is recursive
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
      <div className='content-block'>
        Эта страница является демонстрацией моих навыков работы с библиотекой{" "}
        <a href='https://threejs.org/' className='link' target='_blank'>
          three.js
        </a>
      </div>
      <div className='content-block'>
        Это мой первый опыт работы с ней, поэтому здесь не применены аддоны для
        post-processing. Я хотел сделать что-то простое, но в то же время
        зрелищное
      </div>
      <div className='content-block'>
        Координаты камеры привязаны к скроллу страницы, поэтому создается эффект
        движения самолета по направлению к зрителю
      </div>
      <div className='content-block'>
        Модель самолета взята из открытых источников. Выбор именно этой модели
        не несет в себе скрытого смысла, кроме того что я хотел какой-нибудь
        боевой самолет, летящий в оранжевом небе
      </div>
    </div>
  )
}
