import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 2
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Lights
const lights = {}

lights.items = {}

lights.items.color = '#ffd500'

lights.items.instance = new THREE.PointLight(lights.items.color)
lights.items.instance.position.set(10, 10, - 10)
lights.items.instance.castShadow = true
scene.add(lights.items.instance)

/**
 * Faces
 */
const faces = {}

faces.geometry = new THREE.PlaneGeometry(40, 40)
faces.geometry.rotateX(- Math.PI * 0.5)

faces.material = new THREE.MeshStandardMaterial({
    color: '#999999',
    depthWrite: false,
    roughness: 1
})

faces.mesh = new THREE.Mesh(faces.geometry, faces.material)
faces.mesh.position.y = - 0.20
faces.mesh.receiveShadow = true
scene.add(faces.mesh)

faces.model = new GLTFLoader()
faces.model.load('scene.gltf', (gltf) => {
    const faceModel = gltf.scene
    faceModel.rotateZ(Math.PI * 0.5)
    faceModel.scale.set(2, 2, 2)
    scene.add(faceModel)

    faceModel.traverse((_child) => 
    {
        if(_child instanceof THREE.Mesh)
        {
            _child.castShadow = true
        }
    })
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})

renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()