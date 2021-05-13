import { createShader } from "./createShader.js";
import { mat4, vec3 } from "./gl-matrix/index.js";
import { SceneObject } from "./Scene";
import { vs, fs } from "./phong.glsl.js"

type VertNormSequence = {
    vertices: number[]
    normals: number[]
}

// Служебный конструктор для VertNormSequence
const vns = (vertices: number[], normals: number[]): VertNormSequence => ({ vertices, normals })
const elementsCount = (s: VertNormSequence): number => s.vertices.length / 3 // По одному числу на каждую компоненту вектора

const mergeVertNormSequences = (s: VertNormSequence[]): VertNormSequence => {
    let v: number[] = []
    let n: number[] = []
    s.forEach(vn => {
        v.push(...vn.vertices)
        n.push(...vn.normals)
    })

    return vns(v, n)
}

// Дополнительный этап триангуляции для последовательностей, представляющих полигоны с большим чем 3 количеством вершин
const triangulateConvexVertNormSequence = (s: VertNormSequence): VertNormSequence => {
    //https://www.habrador.com/tutorials/math/10-triangulation/
    let v: number[] = []
    let n: number[] = []

    const numberOfElements = elementsCount(s)

    for (let i = 2; i < numberOfElements; i++) {
        v = v.concat(
            s.vertices[0], s.vertices[1], s.vertices[2], // 0
            s.vertices[(i - 1) * 3], s.vertices[(i - 1) * 3 + 1], s.vertices[(i - 1) * 3 + 2], // i-1
            s.vertices[i * 3], s.vertices[i * 3 + 1], s.vertices[i * 3 + 2])//i

        n = n.concat(s.normals[0], s.normals[1], s.normals[2], // 0
            s.normals[(i - 1) * 3], s.normals[(i - 1) * 3 + 1], s.normals[(i - 1) * 3 + 2], // i-1
            s.normals[i * 3], s.normals[i * 3 + 1], s.normals[i * 3 + 2])//i
    }

    return vns(v, n)
}

const polygonToVertNormSequence = (p: Polygon): VertNormSequence => {
    // Превращаем массив массивов чисел, представляющих вектора, в один плоский массив
    let v: number[] = []
    let n: number[] = []
    p.vertices.forEach(x => {
        v.push(x.pos.x, x.pos.y, x.pos.z)
        n.push(x.normal.x, x.normal.y, x.normal.z)
    })

    let vns1 = vns(v, n)

    /* 
        Для дополнительного триангулирования нужно произвести выборку полигонов,
        количество вершин у которых больше 3, а так как мы рабоате с плоским массивом,
        где вектора уложены просто поледовательностью цисел, то нужно выбрать те полигоны,
        где последовательность чисел не равна девяти (по три числа на каждый из трёх векторов)
    */
    if (v.length !== 9) {
        return triangulateConvexVertNormSequence(vns1)
    }

    return vns1;
}

export type XyzVec = {
    x: number,
    y: number,
    z: number
}

export type Polygon = {
    vertices: {
        pos: XyzVec,
        normal: XyzVec
    }[]
}

export const makeCsgObject = (gl: WebGLRenderingContext, polygons: Polygon[]): CsgObject => {

    let vns = mergeVertNormSequences(polygons.map(polygonToVertNormSequence))
    const numberOfElements = elementsCount(vns)

    let positions = new Float32Array(vns.vertices)
    let normals = new Float32Array(vns.normals)

    let shaderProgram = createShader(gl, vs, fs)

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(shaderProgram, 'vPosition');

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
    const normalLoc = gl.getAttribLocation(shaderProgram, 'vNormal')

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const projectionLoc = gl.getUniformLocation(shaderProgram, 'mProjection');
    const modelLoc = gl.getUniformLocation(shaderProgram, 'mModel');
    const viewLoc = gl.getUniformLocation(shaderProgram, 'mView');
    const normalMatrixLoc = gl.getUniformLocation(shaderProgram, 'mNormal')

    let projection = mat4.create()
    let model = mat4.create()
    let view = mat4.create()

    const vLightPos = gl.getUniformLocation(shaderProgram, 'viewLightPos')
    let lightPos = vec3.fromValues(5, 5, 5)
    let viewLightPos = vec3.create();

    // https://paroj.github.io/gltut/Illumination/Tut09%20Normal%20Transformation.html

    let normal = mat4.create()

    const recalcNormalMatrix = () => {
        mat4.mul(normal, view, model)
        mat4.invert(normal, normal)
        mat4.transpose(normal, normal);
    }

    recalcNormalMatrix()

    return {
        verticesCount: numberOfElements * 3,
        triangesCount: numberOfElements,
        bindProjection: (m: mat4) => { projection = m },
        bindView: (m: mat4) => { view = m },
        update: (time) => {
            mat4.rotateY(model, model, 0.02)
            recalcNormalMatrix()
        },
        render: (time: number) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(positionLoc)

            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
            gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(normalLoc)

            gl.useProgram(shaderProgram)

            gl.uniformMatrix4fv(projectionLoc, false, projection);
            gl.uniformMatrix4fv(modelLoc, false, model);
            gl.uniformMatrix4fv(viewLoc, false, view);
            gl.uniformMatrix4fv(normalMatrixLoc, false, normal);

            vec3.transformMat4(viewLightPos, lightPos, view)
            gl.uniform3fv(vLightPos, viewLightPos);

            gl.drawArrays(
                gl.TRIANGLES,
                0,
                numberOfElements
            );
        }
    }
}

export type CsgObject = SceneObject & {
    verticesCount: number,
    triangesCount: number
}