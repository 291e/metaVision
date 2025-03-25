import * as THREE from 'three'; //'/static/threejs/three.module.js' //'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadGltfModel } from '/static/threejs/importers.min.js'
import TWEEN from 'three/addons/libs/tween.module.js';

// const url = '127.0.0.1:5100';
const url = 'ec2-43-200-145-70.ap-northeast-2.compute.amazonaws.com:5100'
let socket = null;
let timeoutId = null;
const client_id = "0d7d0263c7f94a4a90cf2dbbff3a45bf" //user-id
let connection_info = null;
const submitButton = document.getElementById('submit-button');
const viewerContainer = document.getElementById('viewer-container');
const responseElement = document.getElementById('response');


/* ************************************ */

var group;
let scene, renderer;
let camera, cameraPer;
let pointLights = [];

var dirLight;
let controls, groundMesh;
let modelBoundingBox, modelBoundingSphere, modelCenter, sphereSize, boxSize;
let clock, mixer;
const fov = 45;
const rotateDegree = 6;//12;
let sphereDistance, boxDistance, cameraDistance;
let texturesLoaded = 0;
let loadloop;
let renderLoopActive = true; // Flag to control renderloop
let gifWidth, gifHeight, gifSize;
// let sceneBackground = new THREE.Color(0xffffff);

init();

// const testurl = 'https://metascan-s3.s3.ap-northeast-2.amazonaws.com/25_02_23_12_26_36+(1).glb'
// loadGLBModel(testurl);


function init() { 
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.domElement.style.background = 'radial-gradient(circle, #ffffff, #000000)';

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    viewerContainer.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    //default background: white
    scene.background = null;// new THREE.Color('white'); //null;

    // camera
    // cameraPer = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    cameraPer = new THREE.PerspectiveCamera(45, viewerContainer.clientWidth / viewerContainer.clientHeight, 0.00001, 5000);
    camera = cameraPer;
    scene.add(camera);
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
    controls.addEventListener('change', render);

    //clock for animation loop
    clock = new THREE.Clock();


    // dirLight = new THREE.DirectionalLight(0xffffff, 1);
    // dirLight.castShadow = true;
    // scene.add(dirLight);

    initializePointLights();

    // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

    group = new THREE.Group();


    window.addEventListener('resize', onWindowResize);

    onWindowResize();
}


function initializePointLights() {
    const lightPositions = [
        new THREE.Vector3(0, 0, 0),   // right
        new THREE.Vector3(0, 0, 0),   // left
        new THREE.Vector3(0, 0, 0),   // up
        new THREE.Vector3(0, 0, 0),   // down
        new THREE.Vector3(0, 0, 0),   // front
        new THREE.Vector3(0, 0, 0)    // back
    ];

    for (let i = 0; i < lightPositions.length; i++) {
        const pointLight = new THREE.PointLight(0xffffff, 0, 100);
        pointLight.position.copy(lightPositions[i]); 
        scene.add(pointLight);
        pointLights.push(pointLight);
    }
}


function loadGLBModel(glbUrl) { 
    loadGltfModel(glbUrl) 
        .then((gltfModel) => {
            // scene.remove(group);
            group = new THREE.Group(); 
            addModel2Scene(gltfModel.scene, gltfModel.animations); 
        })
        .catch((error) => {
            // console.error('Error loading GLTF model:', error);
            responseElement.innerHTML = `Error loading GLTF model: ${error}`;
        });

}


function onWindowResize() {
    // Get the actual width and height of #viewer-container
    const containerWidth = viewerContainer.clientWidth;
    const containerHeight = viewerContainer.clientHeight;

    // Set the size of the renderer to the container size
    renderer.setSize(containerWidth, containerHeight);

    // Update the camera's aspect ratio
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();

    render();
}


function renderloop() {
    // Render loop
    requestAnimationFrame(renderloop);

    if (renderLoopActive) render();

    TWEEN.update();
}


function playAnimations(animations) {
    mixer = new THREE.AnimationMixer(group);
    let actions = [];
    for (let i = 0; i < animations.length; i++) {
        const action = mixer.clipAction(animations[i]);
        actions.push(action);
    }

    //play default 
    actions[0].play();
}


function animateLoop() {
    // Render loop
    requestAnimationFrame(animateLoop);

    mixer.update(clock.getDelta());
    if(renderLoopActive) render();
}


function render() {
    // dirLight.position.set(camera.position.x, camera.position.y + 5, camera.position.z + 5);
    renderer.render(scene, camera);
    // console.log("RENDERING ... ");
}


function calculateModelBounding() {
    modelBoundingBox = new THREE.Box3().setFromObject(group);
    modelBoundingSphere = modelBoundingBox.getBoundingSphere(new THREE.Sphere());
    modelCenter = modelBoundingSphere.center;
    sphereSize = modelBoundingSphere.radius * 2;
    // console.log("model sphere size: " + sphereSize);

    boxSize = modelBoundingBox.getSize(new THREE.Vector3());
    boxSize = Math.max(boxSize.x, boxSize.y, boxSize.z)
    // console.log("model box size: " + boxSize);

    // console.log("model center: " + modelCenter.x + " "
    // + modelCenter.y + " "
    // + modelCenter.z + "\n");
}


function traverseModel(node) {
    node.traverse(function (child) { 
        // console.log(child.type);
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
            // child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
            child.scale.setScalar(1);
        }
        child.castShadow = false;//true;
        child.receiveShadow =  false;//true;
        group.add(node);
    });
}


function setPointLight() {
    const center = modelBoundingSphere.center;
    const radius = modelBoundingSphere.radius; 
    const distance = radius * 1.75;

    // const pointLights = [];
    const lightPositions = [
        new THREE.Vector3(center.x + distance, center.y, center.z),   // right
        new THREE.Vector3(center.x - distance, center.y, center.z),   // left
        
        new THREE.Vector3(center.x, center.y + distance, center.z),   // up
        new THREE.Vector3(center.x, center.y - distance, center.z),   // down
        
        new THREE.Vector3(center.x, center.y, center.z + distance),   // front
        new THREE.Vector3(center.x, center.y, center.z - distance)    // back
    ];
    
    for (let i = 0; i < lightPositions.length; i++) {
        pointLights[i].position.copy(lightPositions[i]);  // 更新位置
        pointLights[i].intensity = 10;

        // Visualize the light source position
        // const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);  // Create a small ball to represent the light source
        // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });  /// Set the color of the ball
        // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);  // Create a small ball
        // sphere.position.copy(lightPositions[i]);  // Set the position of the ball to be the same as the light source position
        
        // scene.add(sphere);
    }
}

function setDirLight() {
    const center = modelBoundingSphere.center;
    const radius = modelBoundingSphere.radius;debugger
    const minX = center.x - radius;
    const maxX = center.x + radius;
    const minY = center.y - radius;
    const maxY = center.y + radius;
    // const minZ = center.z - radius;
    const maxZ = center.z + radius;

    // const cameraPosition = modelCenter.clone().add(new THREE.Vector3(sphereSize / 3, sphereSize, sphereSize / 2));
    const cameraPosition = modelCenter.clone().add(new THREE.Vector3(sphereSize / 30, sphereSize * 2, sphereSize / 20));
    cameraPosition.x += maxX * 2; // Replace offsetX with the desired offset along the x-axis
    // cameraPosition.y += offsetY; // Replace offsetY with the desired offset along the y-axis
    cameraPosition.z += maxZ * 2;

    dirLight.shadow.camera.left = minX;
    dirLight.shadow.camera.right = maxX;
    dirLight.shadow.camera.top = maxY;
    dirLight.shadow.camera.bottom = minY;
    dirLight.shadow.camera.near = sphereDistance / 100;
    dirLight.shadow.camera.far = maxY * 10;
    // dirLight.shadow.mapSize.set(256, 256);
    dirLight.shadow.camera.updateProjectionMatrix();


    dirLight.position.copy(cameraPosition);
}


function checkLoadedTextureInfo() { 
    // console.log("texturesLoaded: " + texturesLoaded);
    if (texturesLoaded != renderer.info.memory.textures) {
        texturesLoaded = renderer.info.memory.textures;
    }
    else {
        group.scale.set(1, 1, 1);
        clearInterval(loadloop);
    }
}


function addGroundMesh() {

    const shadowMaterial = new THREE.ShadowMaterial();
    shadowMaterial.opacity = 0.1;
    shadowMaterial.shadowSide = THREE.DoubleSide;
    shadowMaterial.color = new THREE.Color( 0xFF0000 );

    groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(sphereSize * 10, sphereSize * 10), shadowMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = modelBoundingBox.min.y;
    scene.add(groundMesh);
}


function addModel2Scene(model, animations) {
    traverseModel(model);
    group.updateMatrixWorld();

    // group = model;

    calculateModelBounding();

    group.position.y = 0;
    group.position.sub(modelCenter);
    // group.rotation.y = Math.PI / 6;
    group.rotation.set(0, 0, 0);
    scene.add(group);

    //update bounding box and model center
    calculateModelBounding();

    // const boxHelper = new THREE.Box3Helper(modelBoundingBox, 0x0000ff);
    // scene.add(boxHelper);

    // // sphere helper
    // const sphereGeometry = new THREE.SphereGeometry(modelBoundingSphere.radius, 32, 32);
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    // const sphereHelper = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphereHelper.position.copy(modelBoundingSphere.center);
    // scene.add(sphereHelper); 


    group.scale.set(0.000001, 0.000001, 0.000001);

    // //ground
    addGroundMesh();

    sphereDistance = sphereSize / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2));
    boxDistance = boxSize / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2));
    cameraDistance = (sphereDistance + boxDistance) / 2;

    //PerspectiveCamera
    {
        cameraPer.position.copy(modelCenter);
        cameraPer.position.z += cameraDistance;
        cameraPer.near = sphereDistance / 100;
        cameraPer.far = 100 * sphereDistance;
        cameraPer.lookAt(modelCenter);
    }

    // setDirLight();
    setPointLight();

    if (animations.length != 0) {
        playAnimations(animations);
        animateLoop();
    }
    else {
        renderloop();
    }

    loadloop = setInterval(checkLoadedTextureInfo, 100);

    // CreateMaterialChannel();

    // loadCameraState();//test first, need user id check later
}


/* *************************** */

document.getElementById('workflow-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    responseElement.innerHTML = 'submitted';
    submitButton.disabled = true; 
    // viewerContainer.style.display = 'none';  
    scene.remove(group);

    const formData = new FormData();
    formData.append('client_id', client_id);
    formData.append('image_file', document.getElementById('image_file').files[0]);


    socket = new WebSocket(`ws://${url}/ws`);
    // socket = new WebSocket(`wss://${url}/ws`);
    socket.onopen = () => {
        console.log(`WebSocket connected`);
        socket.send(JSON.stringify({ type: 'connect'}));
    };

    socket.onmessage = async (event) => {
    try {
        const message = JSON.parse(event.data);

        if (message.type === 'connect' && message.status === 'ok') {
            connection_info = message.connection_info;
            formData.append('connection_info', connection_info);

            await checkWorkflowStatus(formData, responseElement);
            }   
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }
    };

    socket.onerror = (error) => {
        responseElement.innerHTML = 'WebSocket Error: ' + error.message;
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected');
    };
});


async function checkWorkflowStatus(formData, responseElement) {
    try {
        // const queueResponse = await fetch(`https://${url}/queue_status?connection_info=${connection_info}`, { method: 'GET' });
        const queueResponse = await fetch(`http://${url}/queue_status?connection_info=${connection_info}`, { method: 'GET' });
        const queueResult = await queueResponse.json();

        if (timeoutId !== null){
            clearTimeout(timeoutId);
        }

        if (queueResult.status === 'waiting') {
            const interval = 1000 + queueResult.position * 200;//Math.min(1000, queueResult.position * 200); // Dynamically adjust polling interval
            responseElement.innerHTML = `Waiting: ${queueResult.position} requests ahead ...`;
            timeoutId = setTimeout(() => checkWorkflowStatus(formData, responseElement), interval);
        } 

        else if (queueResult.status === 'ready') {
            try {
                responseElement.innerHTML = 'Processing your request...';

                // for (const [key, value] of formData.entries()) {
                //     console.log(`test0000000000000： ${key}:`, value);
                // }

                // const workflowResponse = await fetch(`https://${url}/generate`, {
                const workflowResponse = await fetch(`http://${url}/generate`, {
                    method: 'POST',
                    body: formData
                });

                const responseResult = await workflowResponse.json();

                if (responseResult.ok && responseResult.glb_url) {
                    responseElement.innerHTML = 'Generated!';
                    viewerContainer.style.display = 'block';
                    loadGLBModel(responseResult.glb_url);
                } else {
                    responseElement.innerHTML = 'Error: ' + (responseResult.error || 'No GLB URL provided');
                }
            }
            catch(error){
                responseElement.innerHTML = 'Error: ' + error.message;
            }
            finally{
                submitButton.disabled = false; // Re-enable the button after the process is finished               

                if (socket.readyState === WebSocket.OPEN) {
                    // console.log('Closing WebSocket...');
                    socket.close(1000, 'Client closed connection'); // 1000 表示正常关闭
                } else {
                    // console.log('WebSocket is not open.');
                }
            }
            
        } 
        else {
            responseElement.innerHTML = 'Unexpected queue status.';
            submitButton.disabled = false;
        }
    } catch (error) {
        responseElement.innerHTML = 'Error: ' + error.message;
    } finally {
        submitButton.disabled = false;
    }
}

// image preview
document.getElementById('image_file').addEventListener('change', function() {
    const file = this.files[0];
    const preview = document.getElementById('image_preview');
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});
