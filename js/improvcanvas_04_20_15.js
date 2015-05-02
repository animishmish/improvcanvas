//Text Elements on screen
//title = call button, info = calling text, prompt = problems warnings


var title, info, prompt;

// global VIDEO variables for my video
var myVideo, myVideoCanvas, myVideoCanvasWidth, myVideoCanvasHeight, myVideoCanvasContext,myVideoTexture, myGeometry;

// global VIDEO variables for their video
var theirVideo, theirVideoCanvas, theirVideoCanvasContext,theirVideoTexture;

// GLOBAL THREE.JS VARIABLES
var container, scene, camera, renderer, controls, canvas3d; 
var movieGeometry;

//GLOBAL VARS FOR CONTROL AND GUI
var keyboard = new THREEx.KeyboardState();
var sliders;
var gui;
var printed = 1;
//Blending mode
var mix ; 
//mouse position
var mouseX = 0;
var mouseY = 0;
//Window middle
var windowHalfX = SCREEN_WIDTH/2;
var windowHalfY = SCREEN_HEIGHT/2;
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

//deafault values for gui sliders
var sliders;

function params() {


            this.showVideo = true;
            this.showFloor = false;
            this.shiftVideoX = 0;
            this.shiftVideoY = 0;
            this.scaleVideo = 1;
            this.rotateMyScreenZ = 0;
            this.rotateMyScreenY = 0;
            this.rotateTheirScreenZ	= 0;
            this.rotateTheirScreenY	= 0;
            this.blendit = 'Multiply';

	}


//---- WEBCAM VIDEO STREAM -----

//01.
//My Webcam attributes and style
myVideo = document.getElementById( 'my-video' );
myVideo.width = 640;
myVideo.height = 480;

//myVideo.msHorizontalMirror = true;
myVideo.muted = true;
//myVideo.rotate(180);
myVideo.style.visibility = "visible";



var myVideoXRot = 0;
var myVideoYRot = 0;
var myVideoZRot = 0;

var theirVideoXRot = 0;
var theirVideoYRot = 0;
var theirVideoZRot = 0;

var p_deg = 0;

//init HTML elements
	container = document.querySelector('#container');
	prompt = document.querySelector('#prompt');
	info = document.querySelector('#info');
	title = document.querySelector('#title');
	info.style.display = 'none';
	//title.style.display = 'none';

//------ VIDEO CANVAS --------------

//myVideo assigned to a canvas
myVideoCanvas = document.getElementById( 'myVideoCanvas' );
//myVideo canvas variables
myVideoCanvas.width = myVideo.width;
myVideoCanvas.height = myVideo.height;

myVideoCanvasWidth = myVideoCanvas.width;
myVideoCanvasHeight = myVideoCanvas.height;

myVideoCanvas.style.display = 'none';


// content of the myVideo canvas
myVideoCanvasContext = myVideoCanvas.getContext( '2d' );

//02.
//Their Webcam attributes and style
theirVideo = document.getElementById( 'their-video' );
theirVideo.width = 640;
theirVideo.height = 480;
theirVideo.muted = true;
theirVideo.style.visibility = "visible";
//theirVideo.style.webkitFilter = "brightness(" + 100 + ") saturate(" + 100 + ")"

//create variable to offset camera on myVideo texture
var theirVideoXpos = 0;
var theirVideoYpos = 0;
var theirVideoZoom = 1;

//------ VIDEO CANVAS --------------

//theirVideo assigned to a canvas
theirVideoCanvas = document.getElementById( 'theirVideoCanvas' );


//theirVideo canvas variables
theirVideoCanvas.width = theirVideo.width;
theirVideoCanvas.height = theirVideo.height;
// content of the myVideo canvas
theirVideoCanvasContext = theirVideoCanvas.getContext( '2d' );



//--------------------

// (set up)
init();

// (draw)				
animate();

function init()
{

	// var serverAddress = 'ws://10.0.27.38:8080'; // this is the itpSandbox IP (check your preferences)
	// //var serverAddress = 'ws://localhost:8080';
	// var socket = new WebSocket (serverAddress) ;

	// console.log('attempting connection to '+serverAddress);

	// socket.onopen = function(){
	// console.log('opened!');

	// };

	// socket.onmessage = function(message){
	// 	var data = JSON.parse(message.data);
	// 	console.log(data.type); // look at the type to see where it should go
	// 	console.log(data.value); // and send this number there to update the GUI slider

	// 	if(data.type==='scaleVideo') {
	// 		myVideoZoom = data.value;
	// 	}

	// 	else if (data.type==='rotateScreenZ') {
	// 		movieScreen.rotation.z = data.value;
	// 		slider.rotateScreenZ=data.value;
	// 		//updateSlider();
	// 	};
	// };

	// socket.onclose = function(){
	// console.log('closed!');

	// };

// SCENE
scene = new THREE.Scene();

//putting all 3d elements into a 3d world
canvas3d = new THREE.Object3D();
scene.add ( canvas3d);

// CAMERA

var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);
// camera.position.set(0,10,450);
//camera.lookAt(scene.position);

// RENDERER
if ( Detector.webgl )
renderer = new THREE.WebGLRenderer( {antialias:true} );
else
renderer = new THREE.CanvasRenderer();
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);


container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );
//container.style.webkitFilter = "brightness(200%)";


// CONTROLS
controls = new THREE.OrbitControls( camera, renderer.domElement );

// EVENT listeners
document.addEventListener('mousemove', onMouseMove, false);
THREEx.WindowResize(renderer, camera);
THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
//CLICK event listeners
container.addEventListener('click', hideInfo, false);
document.querySelector('.closeBtn').addEventListener('click', hideInfo, false);
title.addEventListener('click', showInfo, false);

// LIGHT
var ambient = new THREE.AmbientLight( 0x101030 );
canvas3d.add( ambient );

var directionalLight = new THREE.DirectionalLight( 0xffeedd,10);
directionalLight.position.set( 100, 10, 1 );
canvas3d.add( directionalLight );

// ADD FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -50;
	floor.rotation.x = Math.PI / 2;
	floor.visible = false ; 
	canvas3d.add(floor);

// CREATE VIDEO 3D TEXTURE for me
myVideoTexture = new THREE.Texture( myVideo );


myVideoTexture.minFilter = THREE.LinearFilter;
myVideoTexture.magFilter = THREE.LinearFilter;

// CREATE VIDEO 3D TEXTURE for partner
theirVideoTexture = new THREE.Texture( theirVideo );
theirVideoTexture.minFilter = THREE.LinearFilter;
theirVideoTexture.magFilter = THREE.LinearFilter;



	
  //Test plane for partners video (right)
  var partnerMaterial = new THREE.MeshBasicMaterial( { 
  	map: theirVideoTexture, 
  	overdraw: true, 
  	side:THREE.DoubleSide, 
 	transparent: true,
            
  } );
  	//var partnerTexture = new THREE.ImageUtils.loadTexture( 'images/test.jpg' );
    //var partnerTexture = new THREE.Texture( theirVideoTexture );
    mix = THREE.MultiplyBlending;
    var bigPartnerMaterial = new THREE.MeshBasicMaterial( { 
  	map: theirVideoTexture, 
  	overdraw: true, 
  	side:THREE.DoubleSide, 
 	transparent: true,
 	blending: mix
            
  } );

  // the geometry on which the movie will be displayed;
  //    movie image will be scaled to fit these dimensions.
  var partnerGeometry = new THREE.PlaneGeometry( (theirVideoCanvas.width/15), (theirVideoCanvas.height/15), 1, 1 );
  var partnerScreen = new THREE.Mesh( partnerGeometry, partnerMaterial );
  partnerScreen.position.set(150,120,30);

  partnerScreen.rotation.y = Math.PI;

  
  canvas3d.add(partnerScreen);

    //Test plane for my video (left)
  var myMaterial = new THREE.MeshBasicMaterial( { map: myVideoTexture, overdraw: true, side:THREE.DoubleSide } );
  // the geometry on which the movie will be displayed;
  //    movie image will be scaled to fit these dimensions.
  myGeometry = new THREE.PlaneGeometry( (myVideoCanvas.width/15), (myVideoCanvas.height/15), 1, 1 );

  var myScreen = new THREE.Mesh( myGeometry, myMaterial );
  myScreen.position.set((-150),120,30);
  myScreen.rotation.y = Math.PI;
  

  canvas3d.add(myScreen);

  	movieGeometry = new THREE.PlaneGeometry( 400, 300, 1, 1 );
	movieGeometry.dynamic = true;


	var myBigScreen = new THREE.Mesh( movieGeometry, myMaterial );
	myBigScreen.position.set(0,0,0);
	myBigScreen.rotation.y = Math.PI;
	//myBigScreen.dynamic = true;	
	canvas3d.add(myBigScreen);


	var partnerBigScreen = new THREE.Mesh( movieGeometry, bigPartnerMaterial );

	partnerBigScreen.position.set(0,0,10);
	partnerBigScreen.rotation.y = Math.PI;	
	canvas3d.add(partnerBigScreen);
	
	camera.position.set(0,10,450);
	camera.lookAt(partnerBigScreen.position);



// GUI
	sliders = new params();
	gui = new dat.GUI();
	

	

	//VIDEO CONTROLLER FOLDER
	var f1 = gui.addFolder('Show/Hide Enviroment');
	//SHOW OR HIDE VIDEO SCREEN
	var videoShow = f1.add(sliders, 'showVideo');
	videoShow.onChange(function(value){
	myBigScreen.visible = value;
	});
	//SHOW OR HIDE FLOOR
		var floorShow = f1.add(sliders, 'showFloor');
		floorShow.onChange(function(value){
		floor.visible = value;	
		});

	//Video Rotate Z 
	var zRotV1 = f1.add(sliders, 'rotateMyScreenZ',0,360).step(1);
	zRotV1.onChange(function(value){
	console.log(value);
	value = map_range(value, 0, 360, 0, Math.PI*2);
	myBigScreen.rotation.z = value;
	myScreen.rotation.z = value;
	});	

	var yRotV1 = f1.add(sliders, 'rotateMyScreenY',0,360).step(1);
	yRotV1.onChange(function(value){
	console.log(value);
	value = map_range(value, 0, 360, 0, Math.PI*2);
	myBigScreen.rotation.y = value;
	myScreen.rotation.y = value;
	});

	var zRotV2 = f1.add(sliders, 'rotateTheirScreenZ',0,360).step(1);
	zRotV2.onChange(function(value){
	console.log(value);
	value = map_range(value, 0, 360, 0, Math.PI*2);
	partnerBigScreen.rotation.z = value;
	partnerScreen.rotation.z = value;
	});

	var yRotV2 = f1.add(sliders, 'rotateTheirScreenY',0,360).step(1);
	yRotV2.onChange(function(value){
	console.log(value);
	value = map_range(value, 0, 360, 0, Math.PI*2);
	partnerBigScreen.rotation.y = value;
	partnerScreen.rotation.y = value;
	});


	// var message = {
	// 	'type' : 'rotateScreenZ',
	// 	'value' : value
	// };

	// message.type == 'scaleVideo'

	//socket
	//socket.send (JSON.stringify(message));

	



var blend = gui.add( sliders, 'blendit', [ "Multiply", "Add", "Subtract" ] ).name('Blending Type').listen();
	blend.onChange(function(value) {  

	console.log(value);


	

	if (value == "Multiply")
		value = THREE.MultiplyBlending ;
	else if (value == "Add")
		value = THREE.AdditiveBlending;
	else if (value == "Subtract")
		value = THREE.SubtractiveBlending ;
	
	mix = value; 

	bigPartnerMaterial.blending = mix;

	});




}

function onMouseMove(event) {
	mouseX = (event.clientX - windowHalfX) / (windowHalfX);
	mouseY = (event.clientY - windowHalfY) / (windowHalfY);
}


// ---------- ANIMATE -------------------
function animate() 
{
    requestAnimationFrame( animate );
	render();
	update();		
}



// ---------- UPDATE-------------------
function update()
{		
	if ( keyboard.pressed("p") ) // pause
		myVideo.pause();	
	//console.log('p');

	if ( keyboard.pressed("r") ) // resume
		myVideo.play();
	//console.log('r');
	if ( keyboard.pressed("s") ) // resume
		myBigScreen.visible = true;
	
	if ( keyboard.pressed("s") ) // resume
		myBigScreen.visible = false;

	
	controls.update();


	//THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

}


// ---------- RENDER -------------------

function render() 
{	
	// if ( myVideo.readyState === myVideo.HAVE_ENOUGH_DATA ) 
	// 	myVideoCanvasContext.drawImage(myVideo, myVideoXpos, myVideoYpos , myVideo.width, myVideo.height, 0, 0, myVideoCanvas.width, myVideoCanvas.height);
	// //myVideoCanvasContext.drawImage(myVideo, 0,0, );

	// if(printed >0){
	// console.log("myVideo width",myVideo.width );
	// console.log("myVideo height",myVideo.height );
	// console.log("myVideoCanvas width",myVideoCanvas.width );
	// console.log("myVideoCanvas height",myVideoCanvas.height );
	// }
	// printed--;

	if ( myVideoTexture ) 
			myVideoTexture.needsUpdate = true;
				//getZDepths();


 
// if ( theirVideo.readyState === theirVideo.HAVE_ENOUGH_DATA )
// theirVideoCanvasContext.drawImage(theirVideo, theirVideoXpos, theirVideoYpos , theirVideoCanvas.width, theirVideoCanvas.height, 0, 0, theirVideo.width*theirVideoZoom, theirVideo.height*theirVideoZoom); 

  if ( theirVideoTexture ) 
      theirVideoTexture.needsUpdate = true;

	

	//canvas3d.rotation.x += (mouseX/2000) ;
	//console.log ( "MOUSEx", mouseX);
	//canvas3d.rotation.y += ((mouseX ) - canvas3d.rotation.y) ;
	renderer.render( scene, camera );
}

// ----------	RADIAN TO DEGREES FUNCTION -------------
function map_range(value, low1, high1, low2, high2){
	return low2+(high2-low2)*(value-low1)/(high1-low1);
}
/*
function getColor(x, y) {
	var base = (Math.floor(y) * (myVideoCanvasWidth + 1) + Math.floor(x)) * 4;
	var c = {
		r: pixels[base + 0],
		g: pixels[base + 1],
		b: pixels[base + 2],
		a: pixels[base + 3]
	};
	return (c.r << 16) + (c.g << 8) + c.b;
}

//return pixel brightness between 0 and 1 based on human perceptual bias

function getBrightness(c) {
	return (0.34 * c.r + 0.5 * c.g + 0.16 * c.b);
}


function getZDepths() {

	//noisePosn += params.noiseSpeed;

	//draw webcam video pixels to canvas for pixel analysis
	//double up on last pixel get because there is one more vert than pixels
	myVideoCanvasContext.drawImage(myVideo, 0, 0, myVideoCanvasWidth + 1, myVideoCanvasHeight + 1);
	pixels = myVideoCanvasContext.getImageData(0, 0, myVideoCanvasWidth + 1, myVideoCanvasHeight + 1).data;

	for (var i = 0; i < myVideoCanvasWidth + 1; i++) {
		for (var j = 0; j < myVideoCanvasHeight + 1; j++) {
			var color = new THREE.Color(getColor(i, j));
			//console.log ("Color", color);
			var brightness = getBrightness(color);
			var gotoZ = 0.5 * brightness - 0.5 / 2;
			console.log ("Zlocation", gotoZ);

			//add noise wobble
			//gotoZ += perlin.noise(i * params.noiseScale, j * params.noiseScale, noisePosn) * params.noiseStrength;
			//invert?
			//if (params.invertZ) gotoZ = -gotoZ;
			//tween to stablize
			movieGeometry.vertices[j * (myVideoCanvasWidth + 1) + i].z += (gotoZ - movieGeometry.vertices[j * (myVideoCanvasWidth + 1) + i].z) / 5;
		}
	}
	movieGeometry.verticesNeedUpdate = true;
}
*/

function hideInfo() {
	info.style.display = 'none';
	title.style.display = 'inline';
}

function showInfo() {
	info.style.display = 'inline';
	title.style.display = 'none';
}

