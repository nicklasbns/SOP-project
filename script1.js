try {
    const THREE = require("three");
}catch(e){}
const thre = THREE;
const canvas = document.getElementById("can");

//setup
document.body.style.backgroundColor = "#333";
const can = new thre.Scene();
const cam = new thre.PerspectiveCamera(75);
const renderer = new thre.WebGLRenderer({canvas});
renderer.shadowMap.enabled = true
can.background = new thre.Color(0xa0a0a0)
cam.position.z = 6;
cam.position.y = 5;
cam.lookAt(0, 0, 0);

//grid
var grid = new thre.GridHelper(10, 10, "gray", "gray");
grid.receiveShadow = true;
grid.position.y = -2;
can.add(grid);


//materials
var bumps = new THREE.TextureLoader().load("https://threejs.org/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg");
const textured = new thre.MeshPhongMaterial({color: "lightgray", flatShading: true, vertexColors: false, shininess: 1, bumpMap: bumps, bumpScale: 0.3});
const flat = new thre.MeshPhongMaterial({color: "lightgray", flatShading: true, vertexColors: false, shininess: 1});
const crimson = new thre.MeshPhongMaterial({color: "crimson", flatShading: true, vertexColors: false, shininess: 1});

const wire = new thre.MeshBasicMaterial({color: "black", wireframe: true});

//vars
var time = 0;
var rotation = 0;
objects = [];


var cyl1 = createCylinder(10, 2, 1, 0, 0);
cyl1.position.x = 2
var bar = createCylinder(0, 6, 0.2, 0, 0);
bar.rotateZ(Math.PI/2);


// var ambient = new thre.AmbientLight(0xffffff, 0.2);
// can.add(ambient)
var light = new thre.PointLight(0xffffff, 0.5, 20/*, Math.PI/2, 0, 1*/);
light.castShadow = false;
light.position.set(5, 3, 0);
can.add(light)
var light1 = new thre.PointLight(0xffffff, 0.5, 20/*, Math.PI/2, 0, 1*/);
light1.castShadow = false;
light1.position.set(0, 0, 6);
can.add(light1)
var light2 = new thre.DirectionalLight(0xffffff, 0.5, 20/*, Math.PI/2, 0, 1*/);
light2.castShadow = true;
light2.position.set(0, 5, 0);
can.add(light2)
var shadowGeo = new thre.PlaneGeometry(10, 10);
var shadow = new thre.Mesh(shadowGeo, flat);
shadow.rotateX(-Math.PI/2);
shadow.position.y = -2.1
shadow.receiveShadow = true
can.add(shadow);


var point = createCylinder(0, 0.5, 0.1, 0, 0);
point.position.y = 0.5;
point.castShadow = true;
point.receiveShadow = true;
var x = Math.PI/2, y = 0
can.add(point);

// var uplight = new thre.DirectionalLight(0xffffff, 1);
// var downlight = new thre.DirectionalLight(0xfffffff, 1);
// uplight.position.set(0, 1, 0);
// downlight.position.set(1, 0, 0);
// can.add(uplight);
// can.add(downlight);

function loop() {
    rotation = time/100;
    y = Math.abs(rotation%Math.PI-0.5*Math.PI)

    point.position = point3d(x, Math.PI/2);

    cyl1.draw(rotation);
    // cyl1.rotateY(Math.PI/180*0.5);
    // cam.position.x = Math.sin(rotation/3)*5;
    // cam.position.z = Math.cos(rotation/3)*5;
    // cam.lookAt(0, 0, 0)
    cyl1.setRotationFromAxisAngle(new thre.Vector3(0, 1, 0), rotation)
    bar.rotation.y = rotation+Math.PI/2;
    // bar.rotateX(0.1)
}






function point3d(x, y) {
    var point = new thre.Vector3();
    point.x = Math.sin(y)*Math.cos(x);
    point.z = Math.sin(y)*Math.sin(x);
    point.y = 2+Math.cos(y);
    return point
}

function createCylinder(weight, height, width, dist, x) {
    var geo = new thre.CylinderGeometry(width, width, height, 64);
    var mesh = new thre.Mesh(geo, textured);
    mesh.receiveShadow = true
    mesh.castShadow = true
    can.add(mesh);
    var wireframe = new thre.Mesh(geo, wire);
    // mesh.add(wireframe);
    var pos = mesh.position;

    mesh.draw = function(rotation) {
        pos.x = Math.sin(rotation)*1.4;
        pos.z = Math.cos(rotation)*1.4;
    }
    objects.push(mesh)
    return mesh
}
function createPoint(x, y, r) {
    var geo = new thre.CylinderGeometry(0.1, 0.1, 0.6, 16);
    var mesh = new thre.Mesh(geo, crimson);
    mesh.receiveShadow = true
    mesh.castShadow = true
    can.add(mesh);
    var pos = mesh.position;

    mesh.draw = function(rotation) {
        pos.x = Math.sin(rotation)*1.4;
        pos.z = Math.cos(rotation)*1.4;
    }
    objects.push(mesh)
    return mesh
}
(renderLoop = () => {
    // cyl1.position.x = Math.sin(time/100)
    loop();
    renderer.render(can, cam);
    time++;
    requestAnimationFrame(renderLoop)
})();
