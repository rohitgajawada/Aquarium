var gl, MatrixID;
var model = new Float32Array(16), view = new Float32Array(16), projectionP = new Float32Array(16), projectionO = new Float32Array(16);
var VP = new Float32Array(16), MVP = new Float32Array(16);
var eye = new Float32Array(3), target = new Float32Array(3), up = new Float32Array(3);
var cameraUp = new Float32Array(3), cameraFront = new Float32Array(3), cameraDirection = new Float32Array(3), cameraRight = new Float32Array(3);
var canvas = document.getElementById('game-surface');
var program;
var CamOffsetX=0, CamOffsetY=0, CamOffsetZ=0;
var tx=0, ty=0, tz=0;
var upx=0, upy=0, upz=0;
var initialTranslateOBJ = new Float32Array(16), finalTranslateOBJ = new Float32Array(16), translateOBJ = new Float32Array(16), rotateOBJ = new Float32Array(16), scaleOBJ = new Float32Array(16), OBJTransform = new Float32Array(16);
var vao;
var vertexShader, fragmentShader;
var modelObj0, img0;
var tuna, salmon, reef, egg, pebble, table, skybox, food, bubble, room;
var seaweed;
var weeds = [];

var foodelem, bubbleelem;
var myfish = [];
var eggs = [];
var pebs = [];
var selectfish = 0;
var selectmove = 0, fishx = 0, fishy =0 , fishz = 0;
var fl = 1;

var bgmusic= new Audio("bg.mp3");
var eatFood= new Audio("eatFood.mp3");
var birthSound= new Audio("birth.mp3");
var bubblePop= new Audio("bubblePop.mp3");
var deathSound= new Audio("death.mp3");

var aqlen = 1;
var aqwid = 6;

var positionAttribLocation, texCoordAttribLocation, normalAttribLocation;
var ambientUniformLocation, sunlightDirUniformLocation, sunlightIntUniformLocation;

function VAO () {
	this.Vertices = "undefined";
	this.Indices = "undefined";
	this.TexCoords = "undefined";
	this.Normals = "undefined";
	this.PosVertexBufferObject = "undefined";
	this.TexCoordVertexBufferObject = "undefined";
	this.IndexBufferObject = "undefined";
	this.NormalBufferObject = "undefined";
	this.Texture = "undefined";
}

function initMain () {
	loadTextResource('shaders/shader.vs.glsl', function (vsErr, vsText)
	{
			loadTextResource('shaders/shader.fs.glsl', function (fsErr, fsText) {
					img = [];
					modelObj = [];
					loadJSONResource('models/salmon.json', function (modelErr, modelObj0) {
						modelObj.push(modelObj0);
					loadImage('models/salmon.jpg', function (imgErr, img0) {
						img.push(img0);
					loadJSONResource('models/tuna.json', function (modelErr, modelObj1) {
						modelObj.push(modelObj1);
					loadImage('models/tuna.jpeg', function (imgErr, img1) {
						img.push(img1);
					loadJSONResource('models/reef.json', function (modelErr, modelObj2) {
						modelObj.push(modelObj2);
					loadImage('models/reef.jpg', function (imgErr, img2) {
						img.push(img2);
					loadJSONResource('models/fishegg.json', function (modelErr, modelObj3) {
						modelObj.push(modelObj3);
					loadImage('models/fishegg.jpeg', function (imgErr, img3) {
						img.push(img3);
					loadJSONResource('models/pebble.json', function (modelErr, modelObj3) {
						modelObj.push(modelObj3);
					loadImage('models/pebble.jpeg', function (imgErr, img3) {
						img.push(img3);
					loadJSONResource('models/table.json', function (modelErr, modelObj3) {
						modelObj.push(modelObj3);
					loadImage('models/table.jpeg', function (imgErr, img3) {
						img.push(img3);
					loadJSONResource('models/skybox.json', function (modelErr, modelObj5) {
						modelObj.push(modelObj5);
					loadImage('models/ocean.jpeg', function (imgErr, img5) {
						img.push(img5);
					loadJSONResource('models/food.json', function (modelErr, modelObj6) {
						modelObj.push(modelObj6);
					loadImage('models/food.jpg', function (imgErr, img6) {
						img.push(img6);
						loadJSONResource('models/bubble.json', function (modelErr, modelObj6) {
							modelObj.push(modelObj6);
						loadImage('models/bubble.jpeg', function (imgErr, img6) {
							img.push(img6);
							loadJSONResource('models/outerskybox.json', function (modelErr, modelObj6) {
								modelObj.push(modelObj6);
							loadImage('models/room.jpg', function (imgErr, img6) {
								img.push(img6);
								loadJSONResource('models/seaweed2.json', function (modelErr, modelObj6) {
									modelObj.push(modelObj6);
								loadImage('models/leaftexture.jpeg', function (imgErr, img6) {
									img.push(img6);
					main(vsText, fsText, img, modelObj);
	});
});
});
});
});
});
});
});
	});
});
	});
});
	});
});
																	});
																});
															});
													});
											});
									});
							});
					});
			});
	});
}

// Create shaders
function LoadShaders(vertexShaderText, fragmentShaderText) {
	vertexShader = gl.createShader(gl.VERTEX_SHADER);
	fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

}

// create3DObject function
function create3DObject(index, img, modelObj) {
	vao = new VAO();

	vao.Vertices = modelObj[index].meshes[0].vertices;
	vao.Indices = [].concat.apply([], modelObj[index].meshes[0].faces);
	vao.TexCoords = modelObj[index].meshes[0].texturecoords[0];
	vao.Normals = modelObj[index].meshes[0].normals;

	vao.PosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vao.PosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vao.Vertices), gl.STATIC_DRAW);

	vao.TexCoordVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vao.TexCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vao.TexCoords), gl.STATIC_DRAW);

	vao.IndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vao.IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vao.Indices), gl.STATIC_DRAW);

	vao.NormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vao.NormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vao.Normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.PosVertexBufferObject);
	positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.TexCoordVertexBufferObject);
	texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	// I wrote some code (y)
	gl.enableVertexAttribArray(texCoordAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.NormalBufferObject);
	normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
	gl.vertexAttribPointer(
		normalAttribLocation,
		3, gl.FLOAT,
		gl.TRUE,
		3 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.enableVertexAttribArray(normalAttribLocation);

	// Create texture
	vao.Texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, vao.Texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		img[index]
	);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return vao;
}

var cameraSpeed = 0.25;

var filemodel;
// Object declarations
function createModel(index, img, modelObj) {
		filemodel = create3DObject(index, img, modelObj);
		return filemodel;
}

// draw3DObject function
function draw3DObject(vao)
{
	gl.bindBuffer(gl.ARRAY_BUFFER, vao.PosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vao.Vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.TexCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vao.TexCoords), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vao.IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vao.Indices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.NormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vao.Normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.PosVertexBufferObject);
	positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.TexCoordVertexBufferObject);
	texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, vao.NormalBufferObject);
	normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
	gl.vertexAttribPointer(
		normalAttribLocation,
		3, gl.FLOAT,
		gl.TRUE,
		3 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.enableVertexAttribArray(normalAttribLocation);

	gl.bindTexture(gl.TEXTURE_2D, vao.Texture);
	gl.activeTexture(gl.TEXTURE0);
	gl.drawElements(gl.TRIANGLES, vao.Indices.length, gl.UNSIGNED_SHORT, 0);
}


var modelUniformLocation, viewUniformLocation, projUniformLocation;

// move3D function
function move3D(initialTranslate, translateVec, rotationDegree, rotateAboutVec, scaleVec, alpha, vao)
{
	mat4.identity(model);
	mat4.fromTranslation(initialTranslateOBJ, initialTranslate);
	mat4.fromTranslation(finalTranslateOBJ, vec3.fromValues(-initialTranslate[0], -initialTranslate[1], -initialTranslate[2]));
	mat4.fromTranslation(translateOBJ, translateVec);
	mat4.fromRotation(rotateOBJ, glMatrix.toRadian(rotationDegree), rotateAboutVec);
	mat4.fromScaling(scaleOBJ, scaleVec);
	mat4.mul(OBJTransform, initialTranslateOBJ, scaleOBJ);
	mat4.mul(OBJTransform, rotateOBJ, OBJTransform);
	mat4.mul(OBJTransform, finalTranslateOBJ, OBJTransform);
	mat4.mul(OBJTransform, translateOBJ, OBJTransform);
	mat4.mul(model, OBJTransform, model);
	gl.uniformMatrix4fv(modelUniformLocation, gl.FALSE, model);

	var modelAlpha = gl.getUniformLocation(program, 'uAlpha');
	gl.uniform1f(modelAlpha, alpha);
	draw3DObject(vao);
}



var radius = 10;
var camAngle = 0;
var camAngle2 = 0;
var camTime = 5;
var framerate = 60;
var tempvec = new Float32Array(3);
// Draw function


function setfoodrc()
{
	foodelem.vis = 1;
	newx = Math.random();
	newx = (newx - 0.5) * 6;
	newz = Math.random();
	newz = (newz - 0.5) * 6;
	foodelem.x = newx;
	foodelem.z = newz;
	foodelem.y = 4;
}

function draw()
{
	gl.useProgram(program);
	modelUniformLocation = gl.getUniformLocation(program, 'mWorld');
	viewUniformLocation = gl.getUniformLocation(program, 'mView');
	projUniformLocation = gl.getUniformLocation(program, 'mProj');

	// CamOffsetX = Math.sin(glMatrix.toRadian(camAngle)) * radius;
	// CamOffsetZ = Math.cos(glMatrix.toRadian(camAngle)) * radius;
	camAngle+=360/(framerate*camTime);
	eye = [0+CamOffsetX, 1 + CamOffsetY, 20+CamOffsetZ];
	target = [0+tx, 0+ty, 0+tz];
	up = [0+upx, 1+upy, 0+upz];
	// cameraFront = [0,0,-1];

	vec3.sub(cameraDirection, eye, target);
	vec3.normalize(cameraDirection, cameraDirection);
	vec3.cross(cameraRight, up, cameraDirection);
	vec3.normalize(cameraRight, cameraRight);
	vec3.cross(cameraUp, cameraDirection, cameraRight);

	mat4.identity(model);
	vec3.add(tempvec, eye, cameraFront);

	mat4.lookAt(view, eye, tempvec, cameraUp);
	// mat4.lookAt(view, eye, target, up);
	mat4.perspective(projectionP, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
	gl.uniformMatrix4fv(modelUniformLocation, gl.FALSE, model);
	gl.uniformMatrix4fv(viewUniformLocation, gl.FALSE, view);
	gl.uniformMatrix4fv(projUniformLocation, gl.FALSE, projectionP);

	ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
	sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
	sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');

	gl.uniform3f(ambientUniformLocation, 0.2, 0.2, 0.2);
	gl.uniform3f(sunlightDirUniformLocation, 0, 0, 8);
	gl.uniform3f(sunlightIntUniformLocation, 1.0, 1.0, 1.0);

	gl.clearColor(107/255.0, 202/255.0, 226/255.0, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	camAngle2+=(360/300);
	// move3D statements
	for(i = 0; i < myfish.length; i++)
	{
		if(myfish[i].vis == 1 && myfish[i].kill == 0 && foodelem.vis  == 0 && i != selectmove)
		{

			var dist = 0.05;
			fishang = myfish[i].ang;
			if(myfish[i].scale < 1)
			{
				myfish[i].scale += 0.001;
				myfish[i].y += (3 / 750.0);
			}
			myfish[i].x += dist * Math.sin( (Math.PI * fishang) / 180.0);
			if(myfish[i].y >= 4)
				fl = -1;
			if(myfish[i].y <= -1)
				fl = 1;
			myfish[i].y += (dist/50.0) * fl;

			myfish[i].z += dist * Math.cos( (Math.PI * fishang) / 180.0);

			if( (myfish[i].x < aqlen * -1 || myfish[i].x > aqlen || myfish[i].z < aqwid * -1 || myfish[i].z > aqwid) && (myfish[i].flag == 0))
			{

				// myfish[i].ang = (myfish[i].ang + 5) % 360;
				// if(myfish[i].ang == )
				myfish[i].flag = 1;
			  myfish[i].tempAngle = myfish[i].ang + 90;
			}
			if(myfish[i].flag == 1)
			{
				if(myfish[i].tempAngle == myfish[i].ang)
				{
					myfish[i].flag = 0;
				}
				else
				{
					myfish[i].ang += 1;
				}
			}
			posx = bubbleelem.x;
			posy = bubbleelem.y;
			posz = bubbleelem.z;
			range = 1;
			if(bubbleelem.vis == 1 && myfish[i].x <= posx + range && myfish[i].x >= posx - range && myfish[i].z <= posz + range && myfish[i].z >= posz - range && myfish[i].y <= posy + range && myfish[i].y >= posy - 0.3)
			{
				myfish[i].ang = (myfish[i].ang + 180) % 360;
			}
		}
		if(myfish[i].vis == 1 && myfish[i].kill == 1 && foodelem.vis  == 0 && i != selectmove)
		{
			if(myfish[i].y <= -3)
				myfish[i].vis = 0;
			myfish[i].y -= 0.01;
		}
		if(foodelem.vis == 1 && i != selectmove)
		{
			posx = foodelem.x;
			posz = foodelem.z;
			posy = foodelem.y;

			if(myfish[i].y <= posy + 0.3 && myfish[i].y >= posy - 0.3)
			{
				foodelem.scale -= 0.005;
				if(foodelem.scale <= 0)
				{
					foodelem.vis = 0;
				}
			}
			myfish[i].ang = 45;
			myfish[i].y += 0.05;
			// myfish[i].z += 0.05;
		}
	}
	move3D(vec3.fromValues(0,0,0), vec3.fromValues(0,-10,0), 0, vec3.fromValues(0,1,0), vec3.fromValues(0.12,0.12,0.2), 1, table)
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	move3D(vec3.fromValues(0,0,0), vec3.fromValues(0,3.75,0), 0, vec3.fromValues(0,1,0), vec3.fromValues(13,5,11), 0.2, skybox)
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

	for(i = 0; i < myfish.length; i++)
	{
		if(myfish[i].vis == 1)
		{
			if(foodelem.vis == 0)
			{
				myfish[i].animAng += 0.5 * myfish[i].animFlag;
				move3D(vec3.fromValues(0,0,0), vec3.fromValues(myfish[i].x, myfish[i].y, myfish[i].z), myfish[i].ang + myfish[i].animAng, vec3.fromValues(0,1,0), vec3.fromValues(1.2 * myfish[i].scale, 1 * myfish[i].scale, 1 * myfish[i].scale), 1,myfish[i].mymodel)
			}
			else
			{
				move3D(vec3.fromValues(0,0,0), vec3.fromValues(myfish[i].x, myfish[i].y, myfish[i].z),-15, vec3.fromValues(1,0,0), vec3.fromValues(1.2 * myfish[i].scale, 1 * myfish[i].scale, 1 * myfish[i].scale), 1,myfish[i].mymodel)
			}
			myfish[i].collflag = 0;
			if(myfish[i].animAng == 3 || myfish[i].animAng == -3)
				myfish[i].animFlag *= -1;
		}
	}

	for(i = 0; i < eggs.length; i++)
	{
		if(eggs[i].flag == 0)
		{
			eggs[i].y -= 0.01;
		}
		else
		{
			eggs[i].age += 1;
		}
		if(eggs[i].y <= -1)
		{
			eggs[i].flag = 1;
		}
		if(eggs[i].age >= 500 && eggs[i].age <= 501)
		{
			// console.log("Yello");
			eggs[i].vis = 0;
			birthSound.play();
			genModel(myfish, eggs[i].x, eggs[i].y, eggs[i].z, 230, 0.25, eggs[i].ftype);
		}
		// console.log(eggs[i].y)
		if(eggs[i].vis == 1)
		{
			move3D(vec3.fromValues(0,0,0), vec3.fromValues(eggs[i].x,eggs[i].y,eggs[i].z),eggs[i].ang, vec3.fromValues(0,1,0), vec3.fromValues(1 *eggs[i].scale, 1 *eggs[i].scale, 1 *eggs[i].scale), 1,eggs[i].mymodel)
		}
	}

	for(i = 0; i < pebs.length; i++)
	{
		move3D(vec3.fromValues(0,0,0), vec3.fromValues(pebs[i].x,pebs[i].y,pebs[i].z), 0, vec3.fromValues(0,1,0), vec3.fromValues(1 *pebs[i].scale, 1 *pebs[i].scale, 1 *pebs[i].scale), 1,pebble)
	}

	if(foodelem.vis == 1)
	{
		move3D(vec3.fromValues(0,0,0), vec3.fromValues(foodelem.x, foodelem.y, foodelem.z), 0, vec3.fromValues(0,1,0), vec3.fromValues(1 * foodelem.scale, 1 * foodelem.scale, 1 * foodelem.scale), 1,food)
	}

	if(bubbleelem.vis == 1)
	{
		bubbleelem.y += 0.05;
		if(bubbleelem.y >= 6)
		{
			bubblePop.play();
			bubbleelem.vis = 0;
		}
		move3D(vec3.fromValues(0,0,0), vec3.fromValues(bubbleelem.x, bubbleelem.y, bubbleelem.z), 0, vec3.fromValues(0,1,0), vec3.fromValues(1 * bubbleelem.scale, 1 * bubbleelem.scale, 1 * bubbleelem.scale), 1,bubble)
	}

	//Draw table
	// move3D(vec3.fromValues(0,0,0), vec3.fromValues(0,-1,0), 0, vec3.fromValues(0,1,0), vec3.fromValues(0.02, 0.02, 0.02), table);
	// move3D(vec3.fromValues(0,0,0), vec3.fromValues(0,3,0), 0, vec3.fromValues(0,1,0), vec3.fromValues(3, 3, 3), skybox);
}

function genModel(array, xcoord, ycoord, zcoord, dirangle, scaleval, mod, type)
{
	array.push({x: xcoord, y: ycoord, z: zcoord, ang: dirangle, flag: 0, collflag: 0, mymodel: mod, animFlag: 1, animAng: 0, scale: scaleval ,tempAngle: 0, age: 0, vis: 1, ftype: type, kill: 0});
}

function genModel2(array, xcoord, ycoord, zcoord, scaleval)
{
	array.push({x: xcoord, y: ycoord, z: zcoord, scale: scaleval});
}

function createPebbles()
{
	genModel2(pebs, 5, -1, 3, 1);
	genModel2(pebs, -2, -1, -7, 2);
	genModel2(pebs, -6, -1, 2, 2.5);
	genModel2(pebs, 6, -1, -5, 2);
}

function createBubble()
{
	bubbleelem.vis = 1;
	newx = Math.random();
	newx = (newx - 0.5) * 7;
	newz = Math.random();
	newz = (newz - 0.5) * 7;
	bubbleelem.x = newx;
	bubbleelem.z = newz - 5;
	bubbleelem.y = -3;
	bubbleelem.scale = 0.2;
}

// Initialize WebGL
function initGL(vertexShaderText, fragmentShaderText, img, modelObj) {
	gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	bgmusic.play();
	gl.clearColor(0.3, 0.3, 0.3, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
	LoadShaders(vertexShaderText, fragmentShaderText);
	salmon = createModel(0, img, modelObj);
	tuna = createModel(1, img, modelObj);
	reef = createModel(2, img, modelObj);
	egg = createModel(3, img, modelObj);
	pebble = createModel(4,img, modelObj);
	table = createModel(5,img,modelObj);
	skybox = createModel(6,img, modelObj);
	food = createModel(7,img,modelObj);
	bubble = createModel(8,img,modelObj);
	room = createModel(9, img, modelObj);
	seaweed = createModel(10, img, modelObj)
	createPebbles();
	genModel(myfish, 3, 1.5, 3, 150, 1, tuna, tuna);
	genModel(myfish, -3, 3, 3, 110, 1, tuna, tuna);
	genModel(myfish, 3, 2, -3, 230, 2, tuna, tuna);
	genModel(myfish, 2, 3, -7, 150, 1, salmon, salmon);
	genModel(myfish, -2, 1, -7, 110, 1, salmon, salmon);
	genModel(myfish, 2, 3, -7, 230, 1, salmon, salmon);
	foodelem = {x: 0, y: 5, z: 0, scale: 0.3, vis: 0};
	bubbleelem = {x: 0, y: -4, z: 0, scale: 1, vis: 0};
	// console.log(img.length);
	genModel2(weeds, 0, 3, 0, 0, 10, seaweed);
}

var loop;
var counter = 0;
var triv = new Float32Array(3);
var iter_index = 0;

var rect;
var x, y;
var mouseX, mouseY, mouseZ;
var lastX = 640, lastY = 360;
var xoffset, yoffset;
var sensitivity = 1, yaw = 0, pitch = 0;

function getMousePos(canvas, evt) {
  rect = canvas.getBoundingClientRect();
  x = evt.clientX - rect.left;
  y = evt.clientY - rect.top;

  mouseX = (x-640)/640;
  mouseY = -(y-360)/360;
  mouseZ = -0.03;
}

function main(vertexShaderText, fragmentShaderText, img, modelObj)
{
	var current_time, last_update_time=-10, freeView = 0;
	initGL(vertexShaderText, fragmentShaderText, img, modelObj);

	cameraFront = [0,0,-1];

	document.addEventListener('keydown', function(event)
	{
		// console.log("Hello");
		vec3.cross(triv, cameraFront, cameraUp);
		vec3.normalize(triv, triv);
		if(event.keyCode == 65) //a
		{
			CamOffsetX -= cameraSpeed * triv[0];
			CamOffsetY -= cameraSpeed * triv[1];
			CamOffsetZ -= cameraSpeed * triv[2];
		}
		if(event.keyCode == 68) //d
		{
			CamOffsetX += cameraSpeed * triv[0];
			CamOffsetY += cameraSpeed * triv[1];
			CamOffsetZ += cameraSpeed * triv[2];
		}
		if(event.keyCode == 87) //w
		{
			CamOffsetX += cameraSpeed * cameraFront[0];
			CamOffsetY += cameraSpeed * cameraFront[1];
			CamOffsetZ += cameraSpeed * cameraFront[2];
		}
		if(event.keyCode == 83) //s
		{
			CamOffsetX -= cameraSpeed * cameraFront[0];
			CamOffsetY -= cameraSpeed * cameraFront[1];
			CamOffsetZ -= cameraSpeed * cameraFront[2];
		}
		if(event.keyCode == 69 && myfish[i].vis == 1) //e
		{
			genModel(eggs, myfish[selectfish].x, myfish[selectfish].y, myfish[selectfish].z, 90, 0.5, egg, myfish[selectfish].mymodel);
		}
		if(event.keyCode == 82) //r
		{
			selectfish = (selectfish + 1) % myfish.length;
		}
		if(event.keyCode == 75) //k
		{
			myfish[selectfish].kill = 1;
			deathSound.play();
		}
		if(event.keyCode == 70)//f
		{
			setfoodrc();
		}
		if(event.keyCode == 66)//b
		{
			createBubble();
		}
		if(event.keyCode == 80)//p
		{
			selectmove = (selectmove + 1) % myfish.length;
		}
		if(event.keyCode == 37)//left
		{
			if(myfish[selectmove].x >= -4)
			{
				myfish[selectmove].x -= 0.05;
				myfish[selectmove].ang =270;
			}
		}
		if(event.keyCode == 39)//right
		{
			if(myfish[selectmove].x <= 4)
			{
					myfish[selectmove].x += 0.05;
					myfish[selectmove].ang = 90;
			}
		}
		if(event.keyCode == 38)//away
		{
			if(myfish[selectmove].z >= -4)
			{
				myfish[selectmove].z -= 0.05;
				myfish[selectmove].ang = 180;
			}
		}
		if(event.keyCode == 40)//towards
		{
			if(myfish[selectmove].z <= 10)
			{
				myfish[selectmove].z += 0.05;
				myfish[selectmove].ang = 0;
			}
		}
		if(event.keyCode == 71)//deselect fish = g
		{
			selectmove = -1;
		}

		if (event.keyCode == 84) //t
		{
			if (freeView == 0)
			{
				CamOffsetX = 0;
				CamOffsetY = 20;
				CamOffsetZ = 0;
				cameraFront = [0,-1,0];
				// cameraUp = [0,0,-1]
			}
		}

		if (event.keycode == 78) //n
		{
				CamOffsetX = 0;
				CamOffsetY = 0;
				CamOffsetZ = 0;
				cameraFront = [0,0,-1];
				upx=0;
				upy=0;
				upz=0;
		}

		if (event.keyCode == 72) //h
		{
			freeView = 1 - freeView;
		}

		// if(event.keyCode == 40)//down
		// {
		// 	if(myfish[selectmove].z >= -4)
		// 		myfish[selectmove].z -= 0.05;
		// }
		// if(event.keyCode == 40)//down
		// {
		// 	if(myfish[selectmove].z >= -4)
		// 		myfish[selectmove].z -= 0.05;
		// }

	});

	canvas.addEventListener('mousemove', function(evt) {
		getMousePos(canvas, evt);
		yaw = 180*mouseX - 180;
		pitch = 90*mouseY;

		if (freeView == 1)
		{
			vec3.set(cameraFront, Math.cos(glMatrix.toRadian(yaw))*Math.cos(glMatrix.toRadian(pitch)), Math.sin(glMatrix.toRadian(pitch)), Math.sin(glMatrix.toRadian(yaw))*Math.cos(glMatrix.toRadian(pitch)));
			// vec3.normalize(cameraFront, cameraFront);
		}
	}, false);


	// Main render loop
	loop = function () {
		current_time = performance.now() * 1000;
		if ((current_time - last_update_time) >= 1/framerate) {
			draw();
			last_update_time = current_time;
		}
		requestAnimationFrame(loop);
	};

	requestAnimationFrame(loop);
};
