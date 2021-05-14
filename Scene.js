import { makeCamera } from "./Camera.js";
export class Scene {
    constructor(gl) {
        this.getCamera = () => this.camera;
        this.gl = gl;
        this.objects = [];
        this.camera = makeCamera(gl);
        this.render = this.render.bind(this);
        requestAnimationFrame(this.render);
    }
    add(object) {
        var _a, _b;
        this.objects.push(object);
        (_a = object.bindProjection) === null || _a === void 0 ? void 0 : _a.call(object, this.camera.getProjectionMatrix());
        (_b = object.bindView) === null || _b === void 0 ? void 0 : _b.call(object, this.camera.getViewMatrix());
        return () => {
            this.objects.splice(this.objects.indexOf(object), 1);
        };
    }
    render(time) {
        let gl = this.gl;
        let canvas = gl.canvas;
        if (resizeCanvasToDisplaySize(canvas)) {
            this.camera.recalculateProjectionMatrix(canvas.width, canvas.height);
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.4, 0.4, 0.4, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.objects.forEach(r => r.update(time));
        this.camera.update(time);
        this.objects.forEach(r => r.render(time));
        requestAnimationFrame(this.render);
    }
}
const resizeCanvasToDisplaySize = (canvas) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
};
//# sourceMappingURL=Scene.js.map