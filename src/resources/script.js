import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js';
import { GLTFLoader } from "https://unpkg.com/three@0.178.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://unpkg.com/three@0.178.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.178.0/examples/jsm/loaders/DRACOLoader.js';

const loader = new GLTFLoader();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls(camera, renderer.domElement);

init()

function init() {
  loadGlbFile();
  setCamera();
  setRenderer();
  setLighting();
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);  

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
  camera.position.z = 2;
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

// Animation loop
function animate() {
  controls.update()
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
