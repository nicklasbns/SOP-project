try {
    const THREE = require("three");
}catch(e){}
const thre = THREE;
const canvas = document.getElementById("can");

//setup
document.body.style.backgroundColor = "#fff";
const can = new thre.Scene();
const cam = new thre.PerspectiveCamera(75);
const renderer = new thre.WebGLRenderer({canvas});
can.background = new thre.Color(0xa0a0a0)
cam.position.z = 6;
cam.position.y = 5;
cam.lookAt(0, 0, 0);


//materials
const crimson = new thre.MeshPhongMaterial({color: "lightgray", flatShading: true, vertexColors: false, shininess: 1});
const wire = new thre.MeshBasicMaterial({color: "black", wireframe: true});

//vars
var time = 0;
var rotation = 0;


var cyl1 = createCylinder(10, 2, 1, 0, 0);
cyl1.position.x = 2
var bar = createCylinder(0, 6, 0.2, 0, 0);
bar.rotateZ(Math.PI/2);

// var ambient = new thre.AmbientLight(0xffffff, 0.2);
// can.add(ambient)
var light = new thre.SpotLight(0xffffff, 1, 20);
light.position.set(3, 2, 0);
can.add(light)
var light1 = new thre.SpotLight(0xffffff, 1, 20);
light1.position.set(0, 0, 4);
can.add(light1)
var light2 = new thre.SpotLight(0xffffff, 1, 20);
light2.position.set(-4, 2, 0);
can.add(light2)
var point = createCylinder(0, 0.5, 0.1, 0, 0);
point.position.y = 0.5;
var x = 45, y = 0
can.add(point);

// var uplight = new thre.DirectionalLight(0xffffff, 1);
// var downlight = new thre.DirectionalLight(0xfffffff, 1);
// uplight.position.set(0, 1, 0);
// downlight.position.set(1, 0, 0);
// can.add(uplight);
// can.add(downlight);

function loop() {
    rotation = time/100;

    x = Math.abs(rotation%Math.PI-0.5*Math.PI)
    point.position.x = Math.sin(x)*Math.cos(y);
    point.position.z = Math.sin(x)*Math.sin(y);
    point.position.y = 2+Math.cos(x);

    cyl1.position.x = Math.sin(rotation)*1.4;
    cyl1.position.z = Math.cos(rotation)*1.4;
    // cyl1.rotateY(Math.PI/180*0.5);
    // cam.position.x = Math.sin(rotation/3)*5;
    // cam.position.z = Math.cos(rotation/3)*5;
    // cam.lookAt(0, 0, 0)
    cyl1.setRotationFromAxisAngle(new thre.Vector3(0, 1, 0), rotation)
    bar.rotation.y = rotation+Math.PI/2;
    // bar.rotateX(0.1)
}








function createCylinder(weight, height, width, dist, rad) {
    var geo = new thre.CylinderGeometry(width, width, height, 64);
    var mesh = new thre.Mesh(geo, crimson);
    can.add(mesh);
    var wireframe = new thre.Mesh(geo, wire);
    // mesh.add(wireframe);
    return mesh
}
(renderLoop = () => {
    // cyl1.position.x = Math.sin(time/100)
    loop();
    renderer.render(can, cam);
    time++;
    requestAnimationFrame(renderLoop)
})();
