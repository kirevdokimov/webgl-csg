export const createShader = (gl, vs, fs) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader)
        throw new Error("Fragment shader could not be created");
    gl.shaderSource(vertexShader, vs);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error("vs " + gl.getShaderInfoLog(vertexShader) || "Vertex shader compilation failed for some unknown reason");
    }
    ;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader)
        throw new Error("Fragment shader could not be created");
    gl.shaderSource(fragmentShader, fs);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error("fs " + gl.getShaderInfoLog(fragmentShader) || "Fragment shader compilation failed for some unknown reason");
    }
    ;
    const prg = gl.createProgram();
    if (!prg)
        throw new Error("Shader program could not be created");
    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw new Error("link " + gl.getProgramInfoLog(prg) || "Shader linking failed for some unknown reason");
    }
    ;
    return prg;
};
//# sourceMappingURL=createShader.js.map