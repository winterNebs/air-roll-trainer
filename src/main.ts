import * as THREE from "three";
import { Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const loader = new GLTFLoader();

const scene = new THREE.Scene();

const light = new THREE.PointLight(0xffffff, 1, 0, 0);
light.position.set(0, 500, 0);
light.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(light);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const X = 118.01;
const Y = 84.2;
const Z = 56.27;
const OFFSET_X = 13.88;
const OFFSET_Y = 0.0;
const OFFSET_Z = 20.75;
const SCALE = 50;
const MODEL_SCALE = 0.023;
const ACCEL = 0.00125;
const DECAY = 0.98; 
const MAX_ANGLE = 0.0385;

const ANG_VEL_TS = 2.336;
const ANG_VEL_SSS = 1.975;

const geometry = new THREE.BoxGeometry(X / SCALE, Y / SCALE, Z / SCALE);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);
const group = new THREE.Group();
const axis = new THREE.AxesHelper(5);
group.add(axis);
group.add(cube);
scene.add(group);
group.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
cube.position.set(OFFSET_X / SCALE, OFFSET_Y / SCALE, OFFSET_Z / SCALE);
camera.position.z = 5;
loader.load(
  "octane.glb",
  function (gltf) {
    gltf.scene.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
    gltf.scene.rotation.x = Math.PI / 2;
    gltf.scene.position.z = -0.3;
    group.add(gltf.scene);
    console.log("loaded");
  },
  undefined,
  function (error) {
    console.error(error);
  },
);
var angular_velocity = new Vector3(0, 0, 0);
var keys: { [index: string]: boolean } = {
  w: false,
  a: false,
  s: false,
  d: false,
  q: false,
  e: false,
};
document.addEventListener(
  "keydown",
  (ev) => {
    if (ev.key in keys) {
      keys[ev.key] = true;
    }
  },
  false,
);
document.addEventListener(
  "keyup",
  (ev) => {
    if (ev.key in keys) {
      keys[ev.key] = false;
    }
  },
  false,
);
function animate() {
  requestAnimationFrame(animate);

  if (keys["w"]) {
    angular_velocity.y += ACCEL;
  }
  if (keys["s"]) {
    angular_velocity.y -= ACCEL;
  }
  if (keys["a"]) {
    angular_velocity.z += ACCEL;
  }
  if (keys["d"]) {
    angular_velocity.z -= ACCEL;
  }
  if (keys["e"]) {
    angular_velocity.x += ACCEL;
  }
  if (keys["q"]) {
    angular_velocity.x -= ACCEL;
  }
  // Implement max speed and decay
  if (angular_velocity.length() > MAX_ANGLE) {
    angular_velocity.normalize();
    angular_velocity.multiplyScalar(MAX_ANGLE);
  }

    

  group.rotateX(angular_velocity.x);
  group.rotateY(angular_velocity.y);
  group.rotateZ(angular_velocity.z);

  angular_velocity.multiplyScalar(DECAY);
  

  renderer.render(scene, camera);
}
animate();
