import * as THREE from "three"
import { MTLLoader } from "three/addons/loaders/MTLLoader.js"
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"
import { cameraSettings, lightParams } from "./constants"

// all puzzle pieces
const camera = new THREE.PerspectiveCamera(
  cameraSettings.fov,
  cameraSettings.aspect,
  cameraSettings.near,
  cameraSettings.far
)
const scene = new THREE.Scene()
const light = new THREE.DirectionalLight(
  lightParams.color,
  lightParams.intensity
)

light.position.set(-1, 2, 4)

camera.position.set(
  cameraSettings.start.X,
  cameraSettings.start.Y,
  cameraSettings.start.Z
)

camera.lookAt(0, -1, 0)
camera.rotateZ(1.5)

const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t
}

scene.add(light)
scene.background = new THREE.Color(0xffffff)

const resizeRendererToDisplaySize = (renderer: THREE.WebGLRenderer) => {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

export const moveCameraToScrollPercentage = () => {
  // calculate percentage of scroll
  const bodyHeight = document.body.scrollHeight
  const windowHeight = window.innerHeight
  const scrolled = window.scrollY
  const percentage: number = scrolled / (bodyHeight - windowHeight)
  const newX = lerp(cameraSettings.start.X, cameraSettings.end.X, percentage)
  const newY = lerp(cameraSettings.start.Y, cameraSettings.end.Y, percentage)
  const newZ = lerp(cameraSettings.start.Z, cameraSettings.end.Z, percentage)
  camera.position.set(newX, newY, newZ)
}

export function initializeRenderer(ref: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: ref,
  })

  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  mtlLoader.load("/resources/models/plane/japanesePlane.mtl", (mtl) => {
    mtl.preload()
    objLoader.setMaterials(mtl)
  })
  objLoader.load("/resources/models/plane/japanesePlane.obj", (root) => {
    scene.add(root)
  })

  const render = () => {
    // update camera and resolution according to client
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    // render
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  return render
}
