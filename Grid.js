import { createShader } from "./createShader.js";
import { mat4 } from "./gl-matrix/index.js";
export const makeGrid = (gl, slices = 2, unitSize = 1) => {
    // amount of quads per row and column
    let quads = Math.max(slices, 0) + 1;
    let vertices = [];
    for (let i = 0; i <= quads; i++) {
        // x axis lines
        vertices.push(i, 0);
        vertices.push(i, quads);
        // y axis lines
        vertices.push(0, i);
        vertices.push(quads, i);
    }
    let linesCount = vertices.length / 2;
    const vs = `
    precision highp float;
    attribute vec2 vPosition;
    uniform mat4 mModel;
    uniform mat4 mView;
    uniform mat4 mProjection;
    void main() {
        gl_Position = mProjection * mView * mModel * vec4(vPosition.x, 0.0, vPosition.y, 1.0);
    }
    `;
    const fs = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `;
    const shaderProgram = createShader(gl, vs, fs);
    let positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(shaderProgram, 'vPosition');
    const projectionLoc = gl.getUniformLocation(shaderProgram, 'mProjection');
    const modelLoc = gl.getUniformLocation(shaderProgram, 'mModel');
    const viewLoc = gl.getUniformLocation(shaderProgram, 'mView');
    let projection = mat4.create();
    let view = mat4.create();
    let model = mat4.create();
    let gridHalfSize = unitSize * quads / 2;
    mat4.translate(model, model, [-gridHalfSize, 0, -gridHalfSize]);
    mat4.scale(model, model, [unitSize, unitSize, unitSize]);
    return {
        bindProjection: (m) => { projection = m; },
        bindView: (m) => { view = m; },
        update: (time) => { },
        render: (time) => {
            gl.useProgram(shaderProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
            gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(positionLoc);
            gl.uniformMatrix4fv(projectionLoc, false, projection);
            gl.uniformMatrix4fv(modelLoc, false, model);
            gl.uniformMatrix4fv(viewLoc, false, view);
            gl.drawArrays(gl.LINES, 0, linesCount);
        }
    };
};
//# sourceMappingURL=Grid.js.map