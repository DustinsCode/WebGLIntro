function main() {
	let canvas = document.getElementById("my-canvas");

	//setupWebGL is defined in webgl-utils.js
	let gl = WebGLUtils.setupWebGL(canvas);

	//Load the shader pair. 2nd arg is vertex shader, 3rd is frag shader
	ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
		.then( (prog) =>{

			gl.useProgram(prog);
			//Use black RGB=(0,0,0) for the clear color
			gl.clearColor(0.0, 0.0, 0.0, 1.0);

			//setup the viewport
			gl.viewport(0,0, canvas.width, canvas.height);

			// Clear the color buffer
			gl.clear(gl.COLOR_BUFFER_BIT);

			// x1, y1, x2, y2, x3, y3
			let vertices = [-0.8, -0.6, 0.7, -0.6, -0.5, 0.7];

			createGasket(vertices, 2000);
			//Create WebGL Buffer and Populate
			let vertexBuff = gl.createBuffer();
			gl.bindBuffer (gl.ARRAY_BUFFER, vertexBuff);

			gl.bufferData (gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

			//Obtain Reference to Vertex Shader Attribute
			// vertexPos is an attribute name in vertex Shader
			let posAttr = gl.getAttribLocation (prog, "vertexPos");
			gl.enableVertexAttribArray(posAttr);

			//Specify Layout of Shader Attribute
			gl.vertexAttribPointer(posAttr,
				2,			/*each attr has TWO components (x,y) */
				gl.FLOAT,	/*each component is a 32bit float*/
				false, 		/*data does not require normalization into "unit" range*/
				0, 			/*stride=0: the attr's are tightly packet*/
				0); 		/*offset=0: the first byte of the buffer is the actual data*/

			gl.drawArrays(gl.TRIANGLES,
				0,  /* starting index in the array */
				vertices.length/2); /* number of vertices to draw */

		});
}

function createGasket (inputArr, count) {

	//pick initial random point P inside the triangle
	var px = .2*(inputArr[0]) + .3*(inputArr[2]) + .5*(inputArr[4]);
	var py = .2*(inputArr[1]) + .3*(inputArr[3]) + .5*(inputArr[5]);

	c = 0;
	while(c < count){

		//pick number between 0 and 2, inclusively
		var v = Math.floor(Math.random()*10%3);

		//get coordinates from first vertex, second, or third (0,1,2)
        var vx = inputArr[v*2];
        var vy = inputArr[v*2+1];

        //midpoint of the p and v is q
		var qx=(px + vx)/2;
		var qy=(py + vy)/2;

		//Push new point into array
		inputArr.push(qx);
		inputArr.push(qy);

		//replace p and q;
		px = qx;
		py = qy;

		//add to c;
        c++;
	}
