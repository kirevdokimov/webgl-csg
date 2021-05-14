import { createShader } from "./createShader.js";
import { mat4 } from "./gl-matrix/index.js";
export const makeArrow = (gl, xyz, color = "1.0, 0.0, 0.0, 1.0") => {
    let vertices = [0, 0, 0, 1, xyz[0], xyz[1], xyz[2], 1];
    const vs = `
    precision highp float;
    attribute vec4 vPosition;
    uniform mat4 mModel;
    uniform mat4 mView;
    uniform mat4 mProjection;
    void main() {
        gl_Position = mProjection * mView * mModel * vPosition;        
        gl_PointSize = 10.0;
    }
    `;
    const fs = `

    void main() {
        gl_FragColor = vec4(${color});
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
    return {
        bindProjection: (m) => { projection = m; },
        bindView: (m) => { view = m; },
        bindModel: (m) => { model = m; },
        set xyz(v) {
            vertices = [0, 0, 0, 1, v[0], v[1], v[2], 1];
            gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        },
        get xyz() {
            return vertices.slice(4, 7);
        },
        update: (time) => { },
        render: (time) => {
            gl.useProgram(shaderProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
            gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(positionLoc);
            gl.uniformMatrix4fv(projectionLoc, false, projection);
            gl.uniformMatrix4fv(modelLoc, false, model);
            gl.uniformMatrix4fv(viewLoc, false, view);
            gl.drawArrays(gl.LINES, 0, 2);
            gl.drawArrays(gl.POINTS, 1, 1);
        }
    };
};
//# sourceMappingURL=Arrow.js.map