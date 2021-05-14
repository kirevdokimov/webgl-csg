import CSG from "./csg/csg.js";
const resolution = 16;
let pos = (n) => ({ x: n, y: n, z: n });
let v = (x, y, z) => ({ x, y, z });
let examples = [];
{
    let sOne = CSG.sphere({
        center: { x: 0, y: 0, z: 0 },
        radius: 1,
        slices: resolution,
        stacks: resolution
    });
    let sTwo = CSG.sphere({
        center: { x: .5, y: .5, z: 0 },
        radius: 0.75,
        slices: resolution,
        stacks: resolution
    });
    examples["sphereWithBite"] = sOne.subtract(sTwo).toPolygons();
}
{
    let cube = CSG.cube({ radius: .6 });
    let sphere = CSG.sphere({ radius: .8 });
    examples["cubeFrame"] = cube.subtract(sphere).toPolygons();
}
{
    let a = CSG.cube({
        center: pos(0),
        radius: .5
    });
    let b = CSG.sphere({
        center: pos(.5),
        radius: .75
    });
    let c = CSG.sphere({
        center: pos(.5),
        radius: .3
    });
    examples["onionCut"] = a.subtract(b).union(a.intersect(c)).toPolygons();
}
{
    let tpi = Math.PI * 2;
    let r1 = .4;
    let r2 = 1;
    let v1 = v(Math.cos(tpi / 3), 0, Math.sin(tpi / 3));
    let v2 = v(Math.cos(tpi / 3 * 2), 0, Math.sin(tpi / 3 * 2));
    let v3 = v(Math.cos(tpi), 0, Math.sin(tpi));
    let a = CSG.sphere({
        center: v1,
        radius: r1
    });
    let b = CSG.sphere({
        center: v2,
        radius: r1
    });
    let c = CSG.sphere({
        center: v3,
        radius: r1
    });
    let d = CSG.sphere({
        radius: .8
    });
    let e = CSG.sphere({
        center: v1,
        radius: r2
    });
    let f = CSG.sphere({
        center: v2,
        radius: r2
    });
    let g = CSG.sphere({
        center: v3,
        radius: r2
    });
    examples["foo"] = d.subtract(e).subtract(f).subtract(g).union(a).union(b).union(c).toPolygons();
}
export const example = (name) => {
    return examples[name];
};
//# sourceMappingURL=csgExamples.js.map