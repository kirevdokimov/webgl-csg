import { Camera, makeCamera } from "./Camera.js";
import { mat4 } from "./gl-matrix/index.js";

export interface SceneObject {
    update: (time: number) => void
    render: (time: number) => void
    bindProjection?: (m: mat4) => void
    bindView?: (m: mat4) => void
}

export class Scene {

    gl: WebGLRenderingContext
    objects: SceneObject[]
    camera: Camera

    constructor(gl: WebGLRenderingContext) {

        this.gl = gl;
        this.objects = []
        this.camera = makeCamera(gl)
        this.render = this.render.bind(this)
        requestAnimationFrame(this.render)
    }

    add(object: SceneObject): () => void {
        this.objects.push(object)
        object.bindProjection?.(this.camera.getProjectionMatrix())
        object.bindView?.(this.camera.getViewMatrix())
        return () => {
            this.objects.splice(this.objects.indexOf(object), 1)
        }
    }

    getCamera = () => this.camera

    render(time: number) {
        let gl = this.gl;
        let canvas = gl.canvas as HTMLCanvasElement;
        if (resizeCanvasToDisplaySize(canvas)) {
            this.camera.recalculateProjectionMatrix(canvas.width, canvas.height)
        }
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(0.4, 0.4, 0.4, 1.0);

        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.objects.forEach(r => r.update(time))

        this.camera.update(time)

        this.objects.forEach(r => r.render(time))

        requestAnimationFrame(this.render)
    }
}

const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}