// Per vertex lambert shading model
export const vs = `
    attribute vec4 vPosition;
    attribute vec3 vNormal;

    uniform mat4 mNormal;
    uniform mat4 mModel;
    uniform mat4 mView;
    uniform mat4 mProjection;

    varying highp vec3 vLighting;

    const highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    const highp vec3 directionalLightColor = vec3(1, 1, 1);
    const highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    void main() {
      gl_Position = mProjection * mView * mModel * vPosition;

      highp vec4 transformedNormal = mNormal * vec4(vNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
`;
export const fs = `
    varying highp vec3 vLighting;

    void main() {
      gl_FragColor = vec4(vLighting, 1);
    }
`;
//# sourceMappingURL=lambert.glsl.js.map