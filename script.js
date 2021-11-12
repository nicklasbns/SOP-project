try {
    const THREE = require("three");
} catch (error) {
    
}
// var a = document.createElement("canvas")
// a.width = 300; a.height = 300; a.id = "can";
// document.body.appendChild(a);
document.body.style.backgroundColor = "#333";

// var canvas = document.getElementById("can");
//var can = canvas.getContext("webgl2");
var thre = THREE;
var step = 0;

var can = new thre.Scene();
var camera = new thre.PerspectiveCamera(75, 1/* window.innerWidth / window.innerHeight */, 0.1, 300);

var renderer = new thre.WebGLRenderer();
renderer.setSize(300, 300);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.right = "500px";
renderer.domElement.style.top = "70px";

var orange = new thre.MeshBasicMaterial({color: "orange"});
var mat = new thre.MeshBasicMaterial();

thre.GreaterDepth

const geometry = new thre.BoxGeometry();
const cube = new thre.Mesh(geometry, orange);
can.add(cube);

camera.position.z = 5;


points = [pos(-3, 0, 0), pos(0, 2, 0), pos(3, 0, 0)];

var line = new thre.BufferGeometry().setFromPoints(points);
var lineArt = new thre.Line(line, orange);
can.add(lineArt);


var cylinder = new thre.CylinderGeometry(1, 1, 1, 32)
var cylinderArt = new thre.Mesh(cylinder, orange);
cylinderArt.position.y = 2
cylinderArt.position.x = 2
can.add(cylinderArt);




function update() {
    // camera.position.x = Math.sin(step)*2;
    // camera.position.y = Math.cos(step)*2;
    cube.rotation.x = step;
    cube.rotation.y = step;
    points[0].x = Math.sin(step)-3;
    points[0].y = Math.cos(step);
    line.setFromPoints(points)
    step += 0.01;
}
// setInterval(update, 200);

function render() {
    update()
    renderer.render(can, camera)
    requestAnimationFrame(render);
}
render()
console.log(can);



function pos(x, y, z) {
    return new thre.Vector3(x, y, z);
}