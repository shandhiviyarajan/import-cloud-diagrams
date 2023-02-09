import * as THREE from "./node_modules/three/build/three.module.js";
global.THREE = THREE;

import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from './node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { TTFLoader } from "./node_modules/three/examples/jsm/loaders/TTFLoader.js";
import { OBJLoader } from "./node_modules/three/examples/jsm/loaders/OBJLoader.js";
import { LineSegmentsGeometry } from "./node_modules/three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineSegments2 } from "./node_modules/three/examples/jsm/lines/LineSegments2.js";
import { Line2 } from "./node_modules/three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "./node_modules/three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "./node_modules/three/examples/jsm/lines/LineMaterial.js";
import { WEBGL } from "./node_modules/three/examples/jsm/WebGL.js";
import { EffectComposer } from "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "./node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "./node_modules/three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "./node_modules/three/examples/jsm/shaders/FXAAShader.js";

import { SCENE_CONFIG } from "./config/scene.config.js";
import Stats from "./node_modules/stats.js/src/Stats.js"

global.THREE.CSS3DRenderer = CSS3DRenderer;
global.THREE.CSS3DObject = CSS3DObject;
global.THREE.CSS3DSprite = CSS3DSprite;

global.THREE.OrbitControls = OrbitControls;
global.THREE.TTFLoader = TTFLoader;
global.THREE.OBJLoader = OBJLoader;
global.THREE.LineSegmentsGeometry = LineSegmentsGeometry;
global.THREE.LineSegments2 = LineSegments2;
global.THREE.Line2 = Line2;
global.THREE.LineGeometry = LineGeometry;
global.THREE.LineMaterial = LineMaterial;
global.THREE.WEBGL = WEBGL;
global.THREE.EffectComposer = EffectComposer;
global.THREE.RenderPass = RenderPass;
global.THREE.ShaderPass = ShaderPass;
global.THREE.OutlinePass = OutlinePass;
global.THREE.FXAAShader = FXAAShader;
global.SCENE_CONFIG = SCENE_CONFIG;
global.Stats = Stats;
