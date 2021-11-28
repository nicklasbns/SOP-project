try {
    const THREE = require("three");
}catch(e){}
const thre = THREE;
const canvas = document.getElementById("can");
canvas.onclick = click;

//setup
document.body.style.backgroundColor = "#333";
const {width, height} = canvas
const can = new thre.Scene();
const cam = new thre.PerspectiveCamera(75);
const renderer = new thre.WebGLRenderer({canvas});
const raycaster = new thre.Raycaster();
renderer.shadowMap.enabled = true
can.background = new thre.Color(0xa0a0a0)
cam.position.z = 10;
cam.position.y = 5;
cam.position.x = 0;
cam.lookAt(0, 0, 0);

//grid
var grid = new thre.GridHelper(10, 10, "gray", "gray");
grid.receiveShadow = true;
grid.position.y = -2;
can.add(grid);


//materials
var bumps = new THREE.TextureLoader().load("https://threejs.org/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg");
var plaster = new THREE.TextureLoader().load("https://thumbs.dreamstime.com/z/k-rough-plaster-roughness-texture-height-map-specular-imperfection-d-materials-black-white-hi-res-200368950.jpg");
const textured = new thre.MeshPhongMaterial({color: "lightgray", flatShading: true, vertexColors: false, shininess: 1, bumpMap: plaster, bumpScale: 1});
const flat = new thre.MeshPhongMaterial({color: "lightgray", flatShading: true, vertexColors: false, shininess: 1});
const crimson = new thre.MeshPhongMaterial({color: "crimson", flatShading: true, vertexColors: false, shininess: 1});

const wire = new thre.MeshBasicMaterial({color: "black", wireframe: true});

//vars
var time = Date.now();
var Dtime = 0;
var rotation = 0;
var inert = 0;
var momentumn = 1;
var objects = [];
var debug = 0;


var geo = new thre.CylinderGeometry(0.2, 0.2, 6, 16);
geo.rotateZ(Math.PI/2)
var bar = new thre.Mesh(geo, textured);
bar.receiveShadow = bar.castShadow = true;
can.add(bar);
// createCylinder({height: 2, width:1, x:2, z:0});
// createCylinder({height: 2, width:1, x:-2, z:0});


var light2 = new thre.DirectionalLight(0xffffff, 0.5);
light2.castShadow = true;
light2.position.set(0, 5, 0);
can.add(light2)
var shadowGeo = new thre.PlaneGeometry(10, 10);
var shadow = new thre.Mesh(shadowGeo, flat);
shadow.rotateX(-Math.PI/2);
shadow.position.y = -2.01
shadow.receiveShadow = true
can.add(shadow);


for (var i = 0, max = 5; i < max*2; i++) {
    let light = new thre.PointLight(0xffffff, 1/max, 40)
    let phi = Math.PI/2-(Math.PI/10*2)*(i>=max?-1:1);
    light.position.setFromSphericalCoords(7, phi, Math.PI*2/max*i)
    can.add(light);
    let marker = createPoint(0, 0, 0);
    light.add(marker);
}


var point = createPoint(0, 0);
point.position.set(0, 0.5, 0);
point.castShadow = true;
point.receiveShadow = true;
can.add(point);


function click(event) {
    // raycaster.setFromCamera({x:0.5, y:0.5}, cam);
    raycaster.setFromCamera({x:event.layerX/width*2-1, y:-event.layerY/height*2+1}, cam);
    var intersects = raycaster.intersectObjects(can.children)
    console.log(intersects);
    console.log(intersects[0].point);
    let geo = new thre.SphereGeometry(0.5);
    let mesh = new thre.Mesh(geo, crimson);
    mesh.position.setX(intersects[0].point.x)
    mesh.position.setY(intersects[0].point.y)
    mesh.position.setZ(intersects[0].point.z)
    bar.add(mesh);
}

function loop() {
    Dtime = Date.now()-time;
    if (Dtime == 0) return
    momentumn -= rotation*0.022
    rotation += momentumn/Dtime/10
    inert = 1/12*5*6**2;
    if (debug ? momentumn > 0 : momentumn < 0) {
        debug = !debug;
        console.log(Math.abs(rotation).toFixed(3));
    }

    bar.rotation.y = rotation+Math.PI/2;
    time = Date.now();
}






function point3d(x, y) {
    var point = new thre.Vector3();
    point.x = Math.sin(y)*Math.cos(x);
    point.z = Math.sin(y)*Math.sin(x);
    point.y = 2+Math.cos(y);
    return point
}

function createCylinder(options = {weight: 10, height: 2, width: 1, x:2, z:0}) {
    var geo = new thre.CylinderGeometry(options.width, options.width, options.height, 64);
    var mesh = new thre.Mesh(geo, textured);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.set(options.x, 0, options.z);
    bar.add(mesh);
    // var wireframe = new thre.Mesh(geo, wire);
    // mesh.add(wireframe);
    var pos = mesh.position;

    mesh.draw = function(rotation) {
        pos.x = Math.sin(rotation)*1.4;
        pos.z = Math.cos(rotation)*1.4;
        mesh.setRotationFromAxisAngle(new thre.Vector3(0, 1, 0).add(new thre.Vector3(0, 0, 0)).setLength(1), rotation)
        // mesh.setRotationFromAxisAngle(new thre.Vector3(1, 0, 0), rotation/2)
    }
    objects.push(mesh)
    return mesh
}
function createPoint(x, y, r=1) {
    var geo = new thre.CylinderGeometry(0.1, 0.1, 0.6, 16);
    var mesh = new thre.Mesh(geo, crimson);
    mesh.receiveShadow = true
    mesh.castShadow = true
    can.add(mesh);
    mesh.position.setFromSphericalCoords(r, x, y)
    return mesh
}
(renderLoop = () => {
    loop();
    renderer.render(can, cam);
    time++;
    requestAnimationFrame(renderLoop)
})();