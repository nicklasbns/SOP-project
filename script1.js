try {
    const THREE = require("three");
    const log4j = require("log4j");
}catch(e){}
const three = THREE;
const canvas = document.getElementById("can");
canvas.onclick = click;
canvas.oncontextmenu = click;
canvas.onmousemove = hover;
document.getElementById("pause").onclick = pause;
document.getElementById("restart").onclick = restart;
document.getElementById("clear").onclick = () => bar.remove(...bar.children);
const info = document.getElementById("dataInfo");
const startAngle = document.getElementById("startAngle");
const deg = document.getElementById("deg");
const elemWeight = document.getElementById("weight");
[...document.getElementsByClassName("preset")].forEach((elem, i) => elem.onclick = () => {add(i == 0 ? 2.8 : i == 1 ? 2.2 : i == 2 ? 1.9 : i == 3 ? 1.6 : 0, 0); add(i == 0 ? -2.8 : i == 1 ? -2.2 : i == 2 ? -1.9 : i == 3 ? -1.6 : 0, 0)})

//setup
document.body.style.backgroundColor = "#333";
const {width, height} = canvas;
const can = new three.Scene();
const cam = new three.PerspectiveCamera(75, width/height);
const renderer = new three.WebGLRenderer({canvas});
const raycaster = new three.Raycaster();
renderer.shadowMap.enabled = true
can.background = new three.Color(0xa0a0a0);
cam.position.set(0, 4, 10.32);
cam.lookAt(0, 0, 0);

//grid
var grid = new three.GridHelper(10, 10, "gray", "gray");
grid.receiveShadow = true;
grid.position.y = -2;
can.add(grid);


//materials
var plaster = new THREE.TextureLoader().load("https://thumbs.dreamstime.com/z/k-rough-plaster-roughness-texture-height-map-specular-imperfection-d-materials-black-white-hi-res-200368950.jpg");
const textured = new three.MeshPhongMaterial({color: "lightgray", flatShading: true, vertexColors: false, shininess: 1, bumpMap: plaster, bumpScale: 1});
const flat = new three.MeshPhongMaterial({color: "lightgray", flatShading: true, vertexColors: false, shininess: 1});
const transparrent = new three.MeshPhongMaterial({color: "white", flatShading: true, vertexColors: false, shininess: 1, transparent: true, opacity: 0});
const crimson = new three.MeshPhongMaterial({color: "crimson", flatShading: true, vertexColors: false, shininess: 1});
const yellow = new three.MeshPhongMaterial({color: new three.Color(0.862, 0.90, 0.235), flatShading: true, vertexColors: false, shininess: 1});

const wire = new three.MeshBasicMaterial({color: "black", wireframe: true});

//vars
var time = Date.now();
var frames = 0;
var Dtime = 0;
var rotation = Math.PI/4;
var baseInert = 1/12*0.128*0.6*0.6;
var inert = baseInert;
var momentumn = 0;
var vinkelacceleration = 0;
var speed, limit;
// var objects = [];
var highlight = 0;
var running = true;
// logging/data collection
var hitEnd = 0;
var period = Date.now();
var timer = 0;


var geo = new three.CylinderGeometry(0.2, 0.2, 6, 16);
geo.rotateZ(Math.PI/2)
var bar = new three.Mesh(geo, textured);
bar.receiveShadow = bar.castShadow = true;
can.add(bar);
// createCylinder({height: 2, width:1, x:2, z:0});
// createCylinder({height: 2, width:1, x:-2, z:0});


var light2 = new three.DirectionalLight(0xffffff, 0.5);
light2.castShadow = true;
light2.position.set(0, 5, 0);
can.add(light2)
var shadowGeo = new three.PlaneGeometry(10, 10);
var shadow = new three.Mesh(shadowGeo, flat);
shadow.rotateX(-Math.PI/2);
shadow.position.y = -2.01
shadow.receiveShadow = true;
can.add(shadow);
shadow = new three.Mesh(shadowGeo, transparrent);
shadow.rotateX(-Math.PI/2);
can.add(shadow);


for (var i = 0, max = 5; i < max*2; i++) {
    let light = new three.PointLight(0xffffff, 1/max, 40);
    let phi = Math.PI/2-(Math.PI/10*2)*(i>=max?-1:1);
    light.position.setFromSphericalCoords(7, phi, Math.PI*2/max*i);
    can.add(light);
    let marker = createPoint(0, 0, 0);
    light.add(marker);
}


var point = createPoint(0, 0);
point.position.set(0, 0.5, 0);
point.castShadow = true;
point.receiveShadow = true;
can.add(point);

function pause(e) {
    if (running) {
        e.srcElement.innerText = "paused";
        running = false;
        // rotation = 0;
        // momentumn  = 0;
    } else {
        e.srcElement.innerText = "pause";
        running = true;
        time = Dtime
        // rotation = deg.checked ? startAngle.value/180*Math.PI : startAngle.value-0;
        // momentumn  = 0;
    }
}

function restart() {
    rotation = deg.checked ? startAngle.value/180*Math.PI : startAngle.value-0;
    momentumn  = 0;
    timer = 0
}

function click(event) {
    if (running) return;
    var button = event.button == 2;
    raycaster.setFromCamera({x:event.layerX/width*2-1, y:-event.layerY/height*2+1}, cam);
    var intersects = raycaster.intersectObjects(button ? bar.children : [shadow]);
    if (!intersects.length) return event.preventDefault();
    if (button) {
        // // objects = objects.filter(e => e.uuid != intersects[0].object.uuid);
        bar.remove(intersects[0].object);
        event.preventDefault();
    } else {
        add(intersects[0].point.x, intersects[0].point.y);
    }
}

function add(x, z) {
    let geo = new three.SphereGeometry(0.5);
    let mesh = new three.Mesh(geo, crimson);
    mesh.position.setX(x);
    mesh.position.setY(0);
    mesh.position.setZ(z);
    // objects.push(mesh);
    mesh.weight = elemWeight.value/1000
    bar.add(mesh);
}

function hover(event) {
    if (running) return;
    raycaster.setFromCamera({x:event.layerX/width*2-1, y:-event.layerY/height*2+1}, cam);
    var intersects = raycaster.intersectObjects(bar.children);
    if (!intersects.length) return highlight.material = crimson;
    if (highlight != intersects[0].object || !highlight) {
        highlight.material = crimson;
        highlight = intersects[0].object
    }
    highlight.material = yellow;
}

function loop() {
    Dtime = Date.now();
    inert = baseInert
    bar.children.forEach(mesh => {inert += mesh.weight*(mesh.position.distanceTo(bar.position)/10)**2})

    // bar.children.forEach(weight => {
    //     weight.position.distanceTo(Vector3())
    // });

    for (; Dtime > time && running; time++) {
        momentumn -= rotation*0.022/inert/1000; // angle * spring force(force/dist)
        timer++

        rotation += momentumn/1000
        if (timer == limit) {
            console.log(rotation, 1/2*speed*Math.pow(limit/1000, 2), rotation/(1/2*speed*Math.pow(limit/1000, 2)), Date.now()-period);
            // debugger;
        }
        if (hitEnd ? momentumn > 0 : momentumn < 0) {
            hitEnd = !hitEnd;
            console.log(Math.round((timer)*1.98), Math.abs(rotation).toFixed(3));
            timer = 0;
        }
    }
    info.innerText = 
    `Frame: ${frames}
    Momentumn: ${momentumn.toFixed(2)}
    Rotation: ${rotation.toFixed(3)}
    Weights: ${bar.children.length}
    `

    bar.rotation.y = rotation;
}

// setInterval(() => {
//     rotation = 0; console.log(timer, timer = 0, Date.now()-period, period = Date.now());
// }, 1000);




function point3d(x, y) {
    var point = new three.Vector3();
    point.x = Math.sin(y)*Math.cos(x);
    point.z = Math.sin(y)*Math.sin(x);
    point.y = 2+Math.cos(y);
    return point
}

function createCylinder(options = {weight: 10, height: 2, width: 1, x:2, z:0}) {
    var geo = new three.CylinderGeometry(options.width, options.width, options.height, 64);
    var mesh = new three.Mesh(geo, textured);
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
        mesh.setRotationFromAxisAngle(new three.Vector3(0, 1, 0).add(new three.Vector3(0, 0, 0)).setLength(1), rotation)
        // mesh.setRotationFromAxisAngle(new thre.Vector3(1, 0, 0), rotation/2)
    }
    // objects.push(mesh)
    return mesh
}
function createPoint(x, y, r=1) {
    var geo = new three.CylinderGeometry(0.1, 0.1, 0.6, 16);
    var mesh = new three.Mesh(geo, crimson);
    mesh.receiveShadow = true
    mesh.castShadow = true
    can.add(mesh);
    mesh.position.setFromSphericalCoords(r, x, y);
    return mesh
}
(renderLoop = () => {
    loop();
    renderer.render(can, cam);
    frames++;
    requestAnimationFrame(renderLoop)
})();