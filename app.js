const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const vertex = `
  attribute vec2 position;
  varying vec3 color;
  void main() {
    gl_PointSize = 1.0;
    color = vec3(0.5 + position * 0.5, 0.0);
    gl_Position = vec4(position * 0.5, 1.0, 1.0);
  }
`;

const fragment = `
  precision mediump float;
  varying vec3 color;
  void main()
  {
    gl_FragColor = vec4(color, 1.0);
  }    
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(fragmentShader);


const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

//正多边形顶点组合
function createPolygonVertex(x,y,r,n){
  const unitAngle=Math.PI*2/n;
  var positionArray=[];
  for(let i=0;i<n;i++){
    let angle= unitAngle*i;
    console.log(angle);
    let nx=x+r*Math.cos(angle);
    let ny=y+r*Math.sin(angle);
    positionArray.push(nx,ny);
  }
  return new Float32Array(positionArray);
}
//正多角星顶点组合
function createStarVertex(x,y,r,R,n){
  const unitAngle=Math.PI/n;
  var positionArray=[];
  for(let i=0;i<n*2;i++){
    let angle= unitAngle*i;
    if(i%2!==0){
     let Rx=x+R*Math.cos(angle);
    let Ry=y+R*Math.sin(angle);
    positionArray.push(Rx,Ry);
    }else{
       let rx=x+r*Math.cos(angle);
    let ry=y+r*Math.sin(angle);
    positionArray.push(rx,ry);
    }
  }
  return new Float32Array(positionArray);
}

// const points = new Float32Array([
//   -1, 1,
//   1, 1,
//   1, -1,
//   -1, 1,
//   -1, -1,
//   1, -1
// ]);

// const points = createPolygonVertex(0,0,1,6);
const points = createStarVertex(0,0,1,2,6);
console.log(points);
const bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

const vPosition = gl.getAttribLocation(program, 'position');
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);