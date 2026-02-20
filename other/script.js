import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js';
import { GLTFLoader } from "https://unpkg.com/three@0.178.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://unpkg.com/three@0.178.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.178.0/examples/jsm/loaders/DRACOLoader.js';

const loader = new GLTFLoader();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .001, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: false});
const controls = new OrbitControls(camera, renderer.domElement);

init()

function init() {
  loadGlbFile();
  setCamera();
  setRenderer();
  setLighting();

  document.querySelector('#threejs-container').append(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false);  

  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance = 2;

}

function loadGlbFile() {

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  dracoLoader.preload();
  
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    './resources/LastStopBrewing.glb', // Replace with the path to your .glb file
    function ( glb ) {
      scene.add(glb.scene);
    },
    function ( xhr ) {
      // Called while loading is in progress
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      // Called when loading has errors
      console.log( 'An error happened', error );
    }
  );
}

function setCamera() {
  camera.position.z = 5;
}

function setRenderer() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
}

function setLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff); 
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(1, 1, 1);
  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
}

let clock = new THREE.Clock();
let lastTime = 0;
const targetFPS = 60;
const interval = 1000 / targetFPS;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  let currentTime = clock.getElapsedTime() * 1000; // Convert to milliseconds
  let delta = currentTime - lastTime;

  if (delta > interval) {
    // Update and render only when enough time has passed
    controls.update()
    renderer.render(scene, camera);
    lastTime = currentTime - (delta % interval); // Adjust lastTime to account for excess time
  }  
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}
