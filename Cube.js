import { mat4 } from "./gl-matrix/index.js";
import { vs, fs } from "./phong.glsl.js";
import { createShader } from "./createShader.js";
var positions = new Float32Array([
    //https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample7/webgl-demo.js
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,
    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,
    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
]);
const normals = new Float32Array([
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
]);
const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23, // left
]);
export const makeCube = (gl) => {
    let shaderProgram = createShader(gl, vs, fs);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(shaderProgram, 'vPosition');
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    const normalLoc = gl.getAttribLocation(shaderProgram, 'vNormal');
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    const projectionLoc = gl.getUniformLocation(shaderProgram, 'mProjection');
    const modelLoc = gl.getUniformLocation(shaderProgram, 'mModel');
    const viewLoc = gl.getUniformLocation(shaderProgram, 'mView');
    const normalMatrixLoc = gl.getUniformLocation(shaderProgram, 'mNormal');
    let projection = mat4.create();
    let model = mat4.create();
    mat4.scale(model, model, [.25, .25, .25]);
    let view = mat4.create();
    // https://paroj.github.io/gltut/Illumination/Tut09%20Normal%20Transformation.html
    let normal = mat4.create();
    const recalcNormalMatrix = () => {
        mat4.mul(normal, view, model);
        mat4.invert(normal, normal);
        mat4.transpose(normal, normal);
    };
    recalcNormalMatrix();
    return {
        bindProjection: (m) => { projection = m; },
        bindView: (m) => { view = m; },
        update: (time) => {
            mat4.rotateY(model, model, 0.02);
            recalcNormalMatrix();
        },
        render: (time) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(positionLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(normalLoc);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.useProgram(shaderProgram);
            gl.uniformMatrix4fv(projectionLoc, false, projection);
            gl.uniformMatrix4fv(modelLoc, false, model);
            gl.uniformMatrix4fv(viewLoc, false, view);
            gl.uniformMatrix4fv(normalMatrixLoc, false, normal);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, // type of indices
            0);
        }
    };
};
//# sourceMappingURL=Cube.js.map