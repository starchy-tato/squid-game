// Reference link to code from three.js documentation:
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene

// Setting up the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Select bg color
renderer.setClearColor(0xb7c3f3,1);

// Set ambient light
const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

// Global variables
const start_position = 3;
const end_position = -start_position;

function createCube(size, positionX, rotY = 0, color = 0xfbc851){
    // Render a cube 
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = positionX;
    cube.rotation.y = rotY;
    scene.add( cube );
    return cube;
}

// Number sets the camera distance to the object 
camera.position.z = 5;

// Instantiate a loader
const loader = new THREE.GLTFLoader();

// This work is based on "Squid Game - Giant Doll" (https://sketchfab.com/3d-models/squid-game-giant-doll-7afd49dd07714651a6afa1fc4aac8576) by Rzyas (https://sketchfab.com/rzyas) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
class Doll{
    constructor(){
        loader.load("../models/scene.gltf", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.4, 0.4, 0.4)
            gltf.scene.position.set(0,-1,0);
            this.doll = gltf.scene;
        })
    }

    lookBackward(){
        // this.doll.rotation.y = -3.15;

        // Using gsap to make the turn animation smooth 
        gsap.to(this.doll.rotation, {y: -3.15, duration: .45})
    }

    lookForward(){
        // this.doll.rotation.y = 0;

        gsap.to(this.doll.rotation, {y: 0, duration: .45})
    }

}

// Track that player will be running along
function createTrack(){
    createCube({w: start_position * 2 + 0.2, h: 1.5, d: 1}, 0, 0, 0xe5a716).position.z = -1;
    createCube({w: .2, h: 1.5, d: 1}, start_position, -0.35);
    createCube({w: .2, h: 1.5, d: 1}, end_position, 0.35);
}
createTrack()

// Using a sphere for player
class Player{
    constructor(){
        const geometry = new THREE.SphereGeometry( 0.3, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = 1;
        sphere.position.x = start_position;
        scene.add( sphere );
        this.player = sphere;
        this.playerInfo = {
            positionX: start_position,
            velocity: 0
        }
    }

    run(){
        this.playerInfo.velocity = .03
    }
    
    stop(){
        // Give player a slight delay when stopping
        gsap.to(this.playerInfo, {velocity: 0, duration: 0.1})
    }

    update(){
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
    }

}

const player = new Player()
let doll = new Doll()

setTimeout(() => {
    doll.lookBackward()
}, 1000);

// Animate loop so renderer will draw the scene every time screen is refreshed
function animate() {
    renderer.render( scene, camera );
	requestAnimationFrame( animate );
    player.update()
}
animate();

// Add responsiveness in browser
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight)
}

// Keypress handling; event listeners for when key is pressed or not
window.addEventListener('keydown', (e) => {
    if(e.key == "ArrowLeft"){
        player.run();
    }
})

window.addEventListener('keyup', (e) => {
    if(e.key == "ArrowLeft"){
        player.stop();
    }
})