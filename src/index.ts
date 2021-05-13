import { makeRawControls } from "./RawControls.js"
import { makeCube } from "./Cube.js"
import { makeGrid } from "./Grid.js"
import { Scene } from "./Scene.js"
import { makeCameraPanControls } from "./CameraPanControls.js"
import { makeArrow } from "./Arrow.js"
import { makeCsgObject } from "./CsgObject.js"
import { example } from "./csgExamples.js"

const prepareContext = () => {
    const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement
    const gl = canvas.getContext("webgl")
    if (!gl) throw `No WebGL context available`
    return gl
}

const infoText = document.getElementById("info") as HTMLSpanElement;
const verticesCountText = document.getElementById("verticesCount") as HTMLSpanElement;
const trianglesCountText = document.getElementById("trianglesCount") as HTMLSpanElement;
const exampleSelector = document.getElementById("exampleSelector") as HTMLSelectElement

window.onload = async () => {

    let removeCsg = () => { }

    try {
        let gl = prepareContext()
        let scene = new Scene(gl)

        let csgObject = makeCsgObject(gl, example(exampleSelector.value))
        let grid = makeGrid(gl, 2, 1)
        let rawControls = makeRawControls(gl.canvas as HTMLCanvasElement);

        let camPanControls = makeCameraPanControls(scene.getCamera(), rawControls)

        let xArrow = makeArrow(gl, [1, 0, 0], "1.0, 0.0, 0.0, 1.0");
        let yArrow = makeArrow(gl, [0, 1, 0], "0.0, 1.0, 0.0, 1.0");
        let zArrow = makeArrow(gl, [0, 0, 1], "0.0, 0.0, 1.0, 1.0");

        let tArrow = makeArrow(gl, [1, 0, 0], "1.0, 0.0, 1.0, 1.0");
        tArrow.update = (time) => {
            tArrow.xyz = scene.getCamera().target
        }

        // let lightArrow = makeArrow(gl, [.5, .5, .5], "1.0, 1.0, 1.0, 1.0")

        removeCsg = scene.add(csgObject)
        scene.add(grid)
        scene.add(xArrow)
        scene.add(yArrow)
        scene.add(zArrow)

        scene.add(tArrow)
        // scene.add(lightArrow)

        scene.add(rawControls)
        scene.add(camPanControls)

        infoText.textContent = ""
        verticesCountText.textContent = String(csgObject.verticesCount)
        trianglesCountText.textContent = String(csgObject.triangesCount)

        exampleSelector.addEventListener("change", e => {
            removeCsg()
            let csgObject = makeCsgObject(gl, example(exampleSelector.value))
            removeCsg = scene.add(csgObject)
            verticesCountText.textContent = String(csgObject.verticesCount)
            trianglesCountText.textContent = String(csgObject.triangesCount)
        })

    } catch (e) {
        let msg = `FATAL: ${e}`
        console.log(msg)
        infoText.textContent = msg
    }
}

