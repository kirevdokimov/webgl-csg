import { mat4, quat, quat2, ReadonlyMat4, vec3 } from "./gl-matrix/index.js"
import { SceneObject } from "./Scene"

export const makeCamera = (gl: WebGLRenderingContext, position: vec3 = [5, 5, 5], target: vec3 = [0, 0, 0]): Camera => {

    let projectionMatrix = mat4.create();

    const recalculateProjectionMatrix = (canvasWidth: number, canvasHeight: number) => {
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = canvasWidth / canvasHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    }

    {
        let htmlCanvas = (gl.canvas as HTMLCanvasElement);
        recalculateProjectionMatrix(htmlCanvas.width, htmlCanvas.height);
    }

    const up = [0, 1, 0];
    let viewMatrix = mat4.lookAt(mat4.create(), position, target, up);
    let dirtyFlag = false;

    return {
        set position(v: vec3) {
            vec3.copy(position, v)
            dirtyFlag = true;
        },
        get position() { return position },
        set target(v: vec3) {
            vec3.copy(target, v)
            dirtyFlag = true;
        },
        get target() { return target },
        getViewMatrix: () => viewMatrix,
        getProjectionMatrix: () => projectionMatrix,
        update: (time) => {
            if (!dirtyFlag) return;
            mat4.lookAt(viewMatrix, position, target, up)
            dirtyFlag = false;
        },
        render: (time) => { },
        bindProjection: (m: mat4) => { projectionMatrix = m },
        bindView: (m: mat4) => { viewMatrix = m },
        get dirtyFlag() { return dirtyFlag },
        recalculateProjectionMatrix: recalculateProjectionMatrix
    }
}

export type Camera = SceneObject & {
    dirtyFlag: boolean
    position: vec3,
    target: vec3,
    getViewMatrix: () => mat4
    getProjectionMatrix: () => mat4,
    recalculateProjectionMatrix: (canvasWidth: number, canvasHeight: number) => void
}