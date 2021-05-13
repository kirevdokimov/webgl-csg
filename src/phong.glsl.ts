// Сamera space blinn phong


export const vs = `
attribute vec4 vPosition;
attribute vec3 vNormal;

uniform mat4 mNormal;
uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProjection;

varying vec3 n;
varying vec3 viewVertex;
varying vec4 lp;

void main(){
    vec4 v4 = mView * mModel * vPosition;
    viewVertex = vec3(v4) / v4.w;
    n = vec3(mNormal * vec4(vNormal, 0.0));
    gl_Position = mProjection * v4;
}
`

export const fs = `
precision highp float;
varying vec3 n;
varying vec3 viewVertex;

uniform lowp vec3 viewLightPos;
const vec3 ambientColor = vec3(0.1, 0.1, 0.1); // black
const vec3 diffuseColor = vec3(0.8, 0.0, 0.0);
const vec3 specularColor = vec3(1.0, 1.0, 1.0); // white
const float shininess = 30.0;

void main(){

    vec3 N = normalize(n);
    vec3 L = normalize(viewLightPos - viewVertex);

    float lambertian = max(dot(L, N), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0){
        vec3 V = normalize(-viewVertex);
        vec3 H = normalize(L + V);
        float specAngle = max(dot(H, N), 0.0);
        specular = pow(specAngle, shininess);
    }

    gl_FragColor = vec4(
        ambientColor 
        + lambertian * diffuseColor
        + specular * specularColor
        , 1.0);
}
`