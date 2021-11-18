try {
    const THREE = require("three");
}catch(e){}
const thre = THREE;
const canvas = document.getElementById("can");
canvas.onclick = click;

//setup
document.body.style.backgroundColor = "#333";
const can = new thre.Scene();
const cam = new thre.PerspectiveCamera(75);
const renderer = new thre.WebGLRenderer({canvas});
const raycaster = new thre.Raycaster();
renderer.shadowMap.enabled = true
can.background = new thre.Color(0xa0a0a0)
cam.position.z = 10;
cam.position.y = 5;
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
var time = 0;
var rotation = 0;
objects = [];


var geo = new thre.CylinderGeometry(0.2, 0.2, 6, 16);
geo.rotateZ(Math.PI/2)
var bar = new thre.Mesh(geo, textured);
bar.receiveShadow = bar.castShadow = true;
can.add(bar);
var cyl1 = createCylinder({height: 2, width:1, x:2, z:0});
cyl1.position.x = 2
var cyl2 = createCylinder({height: 2, width:1, x:0, z:2});
// cyl1.rotateOnWorldAxis(new thre.Vector3(1, 0, 0))


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

let max = 5
for (var i = 0; i < max*2; i++) {
    let light = new thre.PointLight(0xffffff, 1/max, 40)
    let phi = Math.PI/2-(Math.PI/10*2)*(i>=max?-1:1);
    light.position.setFromSphericalCoords(7, phi, Math.PI*2/max*i)
    can.add(light);
    let marker = createPoint(0, 0, 0);
    light.add(marker);
}


var point = createCylinder({height: 0.5, width: 0.1});
point.position.y = 0.5;
point.castShadow = true;
point.receiveShadow = true;
var x = Math.PI/2, y = 0
can.add(point);


function click() {
    cam.position.setX = 0;
    raycaster.setFromCamera({x:0, y:-0.1}, cam);
    var intersects = raycaster.intersectObjects(can.children)
    console.log(intersects);
    intersects.forEach(point => {
        console.log(point.point);
        let geo = new thre.SphereGeometry(0.5);
        let mesh = new thre.Mesh(geo, crimson);
        mesh.position.setX(point.point.x)
        mesh.position.setY(point.point.y)
        mesh.position.setZ(point.point.z)
        can.add(mesh);
    })
    cam.position.x = 6;
    cam.lookAt(new thre.Vector3(0, 0, 0))
}

function loop() {
    rotation = time/100;
    y = Math.abs(rotation%Math.PI-0.5*Math.PI)

    point.position = point3d(x, Math.PI/2);

    // cyl1.draw(rotation);
    // cyl1.rotateY(Math.PI/180*0.5);
    // cam.position.x = Math.sin(rotation/3)*5;
    // cam.position.z = Math.cos(rotation/3)*5;
    // cam.lookAt(0, 0, 0)
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

function createCylinder(options = {weight: 10, height: 2, width: 1, x:2, z:0}) {
    unpack(options, this);
    var geo = new thre.CylinderGeometry(width, width, height, 64);
    var mesh = new thre.Mesh(geo, textured);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.set(x, 0, z);
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
    var pos = mesh.position.setFromSphericalCoords(r, x, y)
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
function unpack(obj, dest) {
    for (var key in obj) {
        dest[key] = obj[key];
    }
}