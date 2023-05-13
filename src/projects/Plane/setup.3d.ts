import * as THREE from "three"
import { MTLLoader } from "three/addons/loaders/MTLLoader.js"
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"
import { cameraSettings, lightParams } from "./constants"

// all puzzle pieces
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  cameraSettings.fov,
  cameraSettings.aspect,
  cameraSettings.near,
  cameraSettings.far
)

const mainLight = new THREE.DirectionalLight(
  lightParams.main.color,
  lightParams.main.intensity
)

const secondaryLight = new THREE.DirectionalLight(
  lightParams.secondary.color,
  lightParams.secondary.intensity
)

mainLight.position.set(-1, 2, 4)
secondaryLight.position.set(0, 0, -2)

camera.position.set(
  cameraSettings.start.X,
  cameraSettings.start.Y,
  cameraSettings.start.Z
)

camera.lookAt(0, -10, 0)
camera.rotateX(0.4)
camera.rotateZ(1)

const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t
}

scene.add(mainLight)
scene.add(secondaryLight)

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
  const bodyHeight = document.body.scrollHeight
  const windowHeight = window.innerHeight
  const scrolled = window.scrollY
  const alpha: number = scrolled / (bodyHeight - windowHeight)
  const newPos = new THREE.Vector3(
    lerp(cameraSettings.start.X, cameraSettings.end.X, alpha),
    lerp(cameraSettings.start.Y, cameraSettings.end.Y, alpha),
    lerp(cameraSettings.start.Z, cameraSettings.end.Z, alpha)
  )
  camera.position.set(newPos.x, newPos.y, newPos.z)
}

// load textures, materials and objects from external source
const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
const model: { plane: null | THREE.Group } = { plane: null }
const textureLoader = new THREE.TextureLoader()
const bgTexture = textureLoader.load("resources/images/sky-background.png")
scene.background = bgTexture
mtlLoader.load("/resources/models/plane/japanesePlane.mtl", (mtl) => {
  mtl.preload()
  objLoader.setMaterials(mtl)
})
objLoader.load("/resources/models/plane/japanesePlane.obj", (obj) => {
  model.plane = obj
  scene.add(obj)
})

export function initializeRenderer(ref: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: ref,
  })
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  const render = () => {
    const canvas = renderer.domElement
    const canvasAspect = canvas.clientWidth / canvas.clientHeight
    // offset bg image to not be stretched
    const imageAspect = bgTexture.image
      ? bgTexture.image.width / bgTexture.image.height
      : 1
    const aspect = imageAspect / canvasAspect

    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1

    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect
    // update camera and resolution according to client
    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = canvasAspect
      camera.updateProjectionMatrix()
    }

    // render
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  return render
}
