import fs from 'fs';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill for Blob and Canvas if necessary (we are in node, GLTFExporter might need them? No, it works in Node if we don't use textures usually)
// Actually, using GLTFExporter in Node requires extra setups because of browser globals.
// It's much easier to just write a simple cube, sphere, cylinder.
