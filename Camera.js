import { mat4, vec3 } from "./gl-matrix/index.js";
export const makeCamera = (gl, position = [5, 5, 5], target = [0, 0, 0]) => {
    let projectionMatrix = mat4.create();
    const recalculateProjectionMatrix = (canvasWidth, canvasHeight) => {
        const fieldOfView = 45 * Math.PI / 180; // in radians
        const aspect = canvasWidth / canvasHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    };
    {
        let htmlCanvas = gl.canvas;
        recalculateProjectionMatrix(htmlCanvas.width, htmlCanvas.height);
    }
    const up = [0, 1, 0];
    let viewMatrix = mat4.lookAt(mat4.create(), position, target, up);
    let dirtyFlag = false;
    return {
        set position(v) {
            vec3.copy(position, v);
            dirtyFlag = true;
        },
        get position() { return position; },
        set target(v) {
            vec3.copy(target, v);
            dirtyFlag = true;
        },
        get target() { return target; },
        getViewMatrix: () => viewMatrix,
        getProjectionMatrix: () => projectionMatrix,
        update: (time) => {
            if (!dirtyFlag)
                return;
            mat4.lookAt(viewMatrix, position, target, up);
            dirtyFlag = false;
        },
        render: (time) => { },
        bindProjection: (m) => { projectionMatrix = m; },
        bindView: (m) => { viewMatrix = m; },
        get dirtyFlag() { return dirtyFlag; },
        recalculateProjectionMatrix: recalculateProjectionMatrix
    };
};
//# sourceMappingURL=Camera.js.map