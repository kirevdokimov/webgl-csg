import { quat } from "./gl-matrix/index.js";
import { vec3 } from "./gl-matrix/index.js";
const fromAxisAngle = (axis, angle) => {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    // assumes axis is normalized
    const halfAngle = angle / 2;
    let s = Math.sin(halfAngle);
    let x = axis[0] * s;
    let y = axis[1] * s;
    let z = axis[2] * s;
    let w = Math.cos(halfAngle);
    return quat.fromValues(x, y, z, w);
};
export const makeCameraPanControls = (camera, controls) => {
    let fwd = [0, 0, 1];
    let right = [1, 0, 0];
    let position = camera.position;
    let target = camera.target;
    const up = [0, 1, 0];
    // максимальная и минимальная границы спектра углов между position и up (для ограничения вращения верх-низ)
    const maxAngle = Math.PI / 2 * 0.9;
    const minAngle = Math.PI / 2 * 0.1;
    const minDistance = 1;
    const maxDistance = 20;
    const recalcFwdRight = (target, position) => {
        vec3.subtract(fwd, target, position);
        fwd[1] = 0;
        vec3.normalize(fwd, fwd);
        vec3.cross(right, fwd, up);
    };
    return {
        render: (time) => { },
        update: (time) => {
            if (controls.state.mouse.rmb) {
                recalcFwdRight(target, position);
                let kfwd = controls.state.mouse.dy / 100;
                let kright = -controls.state.mouse.dx / 100;
                vec3.scaleAndAdd(position, position, fwd, kfwd);
                vec3.scaleAndAdd(position, position, right, kright);
                vec3.scaleAndAdd(target, target, fwd, kfwd);
                vec3.scaleAndAdd(target, target, right, kright);
                camera.target = target;
                camera.position = position;
            }
            else if (controls.state.mouse.lmb) {
                let kx = -controls.state.mouse.dx / 100;
                let ky = -controls.state.mouse.dy / 100;
                // TODO тут вместо вращения posiiton можно вращать fwd и пересчитывать position, так будто логичнее выходит
                // считаем quat вращения и весь пересчет будет делаться через умножение fwd, right и position на quat
                vec3.rotateY(position, position, target, kx);
                // тут надо пересчитать right потому что мы повернули position
                recalcFwdRight(target, position);
                { // ограничение по вращению верх-низ
                    let angle = vec3.angle(position, up);
                    if (angle + ky > maxAngle)
                        ky = maxAngle - angle;
                    if (angle + ky < minAngle)
                        ky = minAngle - angle;
                }
                let q = fromAxisAngle(right, ky);
                // console.log()
                vec3.transformQuat(position, position, q);
                camera.position = position;
            }
            if (controls.state.mouse.wheel != 0) {
                // -1 потому что wheel >0 подразумевает moveTo target, а мне нужно обратное направление
                let moveFrom = controls.state.mouse.wheel * -1;
                let fromTarget = vec3.create();
                vec3.sub(fromTarget, position, target);
                let from = vec3.len(fromTarget);
                if (from + moveFrom < minDistance)
                    moveFrom = minDistance - from;
                if (from + moveFrom > maxDistance)
                    moveFrom = maxDistance - from;
                vec3.normalize(fromTarget, fromTarget);
                vec3.scaleAndAdd(position, position, fromTarget, moveFrom);
                camera.position = position;
            }
        }
    };
};
//# sourceMappingURL=CameraPanControls.js.map