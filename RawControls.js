export const makeRawControls = (canvas) => {
    const state = {
        mouse: {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            lmb: false,
            rmb: false,
            wheel: 0
        }
    };
    canvas.addEventListener("contextmenu", (event) => { event.preventDefault(); return false; });
    canvas.addEventListener("mousedown", (event) => {
        state.mouse.lmb = state.mouse.lmb || event.button == 0;
        state.mouse.rmb = state.mouse.rmb || event.button == 2;
    });
    canvas.addEventListener("mouseup", (event) => {
        state.mouse.lmb = state.mouse.lmb && !(event.button == 0);
        state.mouse.rmb = state.mouse.rmb && !(event.button == 2);
    });
    canvas.addEventListener("mouseout", (event) => {
    });
    canvas.addEventListener("mousemove", (event) => {
        var rect = (event === null || event === void 0 ? void 0 : event.target).getBoundingClientRect();
        state.mouse.x = event.clientX - rect.left; //x position within the element.
        state.mouse.y = event.clientY - rect.top; //y position within the element.
        state.mouse.dx += event.movementX;
        state.mouse.dy += event.movementY;
    });
    canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        state.mouse.wheel = event.deltaY > 0 ? -1 : 1; // + means mouse moved fwd
    });
    return {
        state,
        update: (time) => { },
        render: (time) => {
            state.mouse.x = state.mouse.y = state.mouse.dx = state.mouse.dy = state.mouse.wheel = 0;
        }
    };
};
//# sourceMappingURL=RawControls.js.map