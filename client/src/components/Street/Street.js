import React, { useState, useEffect } from "react";
import { FreeCamera, Vector3, HemisphericLight, DirectionalLight, Mesh, MeshBuilder, PhotoDome, CubeTexture, StandardMaterial, Color3, Texture, Vector2 } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

//https://forum.babylonjs.com/t/unknown-materials/4895/3
// having issues with gltf
import '@babylonjs/loaders/glTF';

// import { WaterMaterial } from "@babylonjs/materials";
// import Babylon from "../../shared/3D/Babylon"; // uses above component in same directory
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.

import './Street.scss';


let box, ground, dome, scene;
let infoText = "";

const onSceneReady = (sc) => {
    scene = sc;
    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    const canvas = scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);




    // Our built-in 'ground' shape.
    // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    // addSkybox(scene);
    // addGround(scene);
    // addWater();
    addLights();
    addDome("pano.jpg");
    addBox();
    addPlane();
    addTree();

    setupPicking();

};

const setupPicking = () => {
    scene.onPointerDown = function (evt, pickResult) {
        // We try to pick an object
        if (pickResult.hit) {
            if (pickResult.pickedMesh.name === "old_expressway") {
                infoText = "here's some info about the old expressway";
            }
            else if (pickResult.pickedMesh.name === "new_building") {
                infoText = "here's some info about this building";
            }
        }
    };
}

const addLights = () => {

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    // var light = new HemisphericLight("light", new Vector3(0, -1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    // light.intensity = 0.7;

    // var lightD = DirectionalLight("DirectionalLight", new Vector3(0, -1, 0), scene);

    //Light direction is up and left
    var light = new HemisphericLight("hemiLight", new Vector3(-1, 1, 0), scene);
    // light.diffuse = new Color3(1, 0, 0);
    // light.specular = new Color3(0, 1, 0);
    // light.groundColor = new Color3(0, 1, 0);
}

const addTree = () => {
    // SceneLoader.Append("/assets/oak/", "OakTree.gltf", scene, function (scene) {
    //     console.log("added");
    // });

   

    SceneLoader.ImportMesh("", "/assets/oak/", "OakTree.gltf", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        newMeshes[0].position.z = -30;
        newMeshes[0].position.x = -10;
        newMeshes[0].scaling = new Vector3(2, 2, 2);

        const clone = newMeshes[0].clone();
        clone.position.x = 50;
        clone.position.z = -50;

        const clone1 = newMeshes[0].clone();
        clone1.position.x = 30;
        clone1.position.z = -70;
    });
}

const addSound = () => {
    const mat = new StandardMaterial("building", scene);
    mat.diffuseTexture = new Texture("/assets/oldexpressway.jpeg", scene);
    mat.diffuseColor = new Color3(.7, .7, .7);
    mat.specularColor = new Color3(.7, .7, .7);
    mat.emissiveColor = new Color3(.7, .7, .7);

    const plane = MeshBuilder.CreatePlane("plane", { width: 10, height: 10 }, scene);
    plane.material = mat;

    plane.position.y = 0;
    plane.position.x = -55;
    plane.position.z = -15;

    plane.rotation.y = -Math.PI / 2;
}

const addPlane = () => {
    const mat = new StandardMaterial("building", scene);
    mat.diffuseTexture = new Texture("/assets/oldexpressway.jpeg", scene);
    mat.diffuseColor = new Color3(.7, .7, .7);
    mat.specularColor = new Color3(.7, .7, .7);
    mat.emissiveColor = new Color3(.7, .7, .7);
    const plane = MeshBuilder.CreatePlane("old_expressway", { width: 44, height: 30 }, scene);
    plane.material = mat;

    plane.position.y = 0;
    plane.position.x = -55;
    plane.position.z = -15;

    plane.rotation.y = -Math.PI / 2;
    plane.isPickable = true;
}

const addBox = () => {
    // Our built-in 'box' shape.
    const myMaterial = new StandardMaterial("mat_build", scene);
    myMaterial.diffuseColor = new Color3(.5, 0, .3);
    // myMaterial.specularColor = new Color3(0.1, 0.1, 0.3);
    // myMaterial.emissiveColor = new Color3(.41, .1, /1);
    myMaterial.ambientColor = new Color3(0.23, 0.18, 0.53);

    box = MeshBuilder.CreateBox("new_building", { size: 44 }, scene);

    // Move the box upward 1/2 its height
    box.position.y = 10;
    box.position.x = 60;
    box.position.z = 140;
    box.rotation.y = .3;
    box.material = myMaterial;
    box.isPickable = true;
}

const addDome = (url) => {
    dome = new PhotoDome(
        "testdome",
        `/assets/${url}`,
        {
            resolution: 32,
            size: 1000
        },
        scene
    );
    dome.fovMultiplier = .1;
}

const setDome = (url) => {
    let path = `/assets/${url}`;
    // var mat = new StandardMaterial("mat", scene);
    // mat.diffuseTexture = new Texture(path, scene);
    // dome.material = mat;
    dome.photoTexture = new Texture(path, scene, false, false);
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
    if (box !== undefined) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime();

        const rpm = 10;
        box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
};

export default function Street() {
    // const [infoText, setInfoText] = useState("");

    useEffect(
        () => {
          
            return () => {
            }
        },
        // empty array if you want this to run once
        // otherwise, fill with variables that will update
        [infoText]
    );

    return (
        <div className="Street Sketch">
            <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="babylon-canvas" />
            <div className="gui">
                <div className="timeButtons">
                    <button onClick={() => setDome("pano.jpg")}>present</button>
                    <button onClick={() => setDome("future.png")}>future</button>
                </div>
                <div className="addressBlock">
                    {infoText}
                </div>
            </div>
        </div>
    )

}