import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scene Setup
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const initWidth = container.clientWidth || window.innerWidth;
    const initHeight = container.clientHeight || window.innerHeight;
    renderer.setSize(initWidth, initHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initWidth / initHeight, 0.1, 100);
    camera.position.set(0, 0, 18.5); 

    // Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target3D = new THREE.Vector3();

    window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / (rect.width || initWidth)) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / (rect.height || initHeight)) * 2 + 1;
    });

    const tCanvas = document.createElement('canvas');
    tCanvas.width = 128; 
    tCanvas.height = 128;
    const ctx = tCanvas.getContext('2d');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8; 
    ctx.lineJoin = 'round'; 
    ctx.lineCap = 'round';
    const side = 80;
    const h = side * (Math.sqrt(3) / 2);
    const cx = 64;
    const cy = 64 + (h / 6); 
    const topX = cx, topY = cy - h/2;
    const brX = cx + side/2, brY = cy + h/2;
    const blX = cx - side/2, blY = cy + h/2;

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(brX, brY);
    ctx.lineTo(blX, blY);
    ctx.closePath();
    ctx.stroke();
    
    const triangleTex = new THREE.CanvasTexture(tCanvas);
    triangleTex.minFilter = THREE.LinearMipMapLinearFilter;
    triangleTex.magFilter = THREE.LinearFilter;
    triangleTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    triangleTex.needsUpdate = true; 

    // Unified Shader Material with 3-step morphing and explosion
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse3D: { value: new THREE.Vector3(999, 999, 999) },
            uTexture: { value: triangleTex },
            uProgress: { value: 0.0 }
        },
        vertexShader: `
            uniform float uTime;
            uniform vec3 uMouse3D;
            uniform float uProgress;
            
            attribute vec3 aTargetPosition; // ECG
            attribute vec3 aTargetPosition2; // Heart
            attribute vec3 aColor2;
            attribute vec3 aColor3;
            attribute float aRandom;
            attribute float aSizeMultiplier;
            
            varying vec3 vColor;
            varying float vRotation;

            // Simple noise function for scatter
            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            }

            void main() {
                vRotation = aRandom * 6.28318;
                
                // Mix positions based on uProgress (0: Brain, 1: ECG, 2: Heart)
                vec3 mixedPos;
                vec3 finalColor;
                
                // Explode scatter logic
                float scatterPhase1 = smoothstep(0.0, 0.5, abs(uProgress - 0.5)); 
                float scatterPhase2 = smoothstep(0.0, 0.5, abs(uProgress - 1.5));
                float scatterDist = (1.0 - min(scatterPhase1, scatterPhase2)) * 45.0; // Explosion distance
                
                vec3 scatterVec = normalize(vec3(aRandom - 0.5, noise(position) - 0.5, noise(position + 1.0) - 0.5)) * scatterDist;
                
                if (uProgress < 1.0) {
                    mixedPos = mix(position, aTargetPosition, smoothstep(0.0, 1.0, uProgress));
                    finalColor = mix(color, aColor2, smoothstep(0.0, 1.0, uProgress));
                } else {
                    mixedPos = mix(aTargetPosition, aTargetPosition2, smoothstep(1.0, 2.0, uProgress));
                    finalColor = mix(aColor2, aColor3, smoothstep(1.0, 2.0, uProgress));
                }

                mixedPos += scatterVec; // Add the explosion scatter
                
                vColor = finalColor;

                vec4 worldPos = modelMatrix * vec4(mixedPos, 1.0);
                float dist = distance(worldPos.xyz, uMouse3D);
                
                float baseSize = aSizeMultiplier > 0.0 ? (50.0 * aSizeMultiplier) : 50.0;
                float hoverRadius = 3.0;
                if(dist < hoverRadius) {
                    vec3 dir = normalize(worldPos.xyz - uMouse3D);
                    worldPos.xyz += dir * (hoverRadius - dist) * (0.8 + aRandom * 0.5);
                    baseSize += (hoverRadius - dist) * 60.0;
                }

                worldPos.y += sin(uTime * 2.0 + worldPos.x) * 0.05;

                vec4 mvPosition = viewMatrix * worldPos;
                gl_PointSize = (baseSize / -mvPosition.z); 
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D uTexture;
            varying vec3 vColor;
            varying float vRotation;
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                
                // Apply rotation
                float s = sin(vRotation);
                float c = cos(vRotation);
                mat2 rot = mat2(c, -s, s, c);
                coord = rot * coord;
                coord += vec2(0.5);
                
                if(coord.x < 0.0 || coord.x > 1.0 || coord.y < 0.0 || coord.y > 1.0) discard;
                
                vec4 texColor = texture2D(uTexture, coord);
                if(texColor.a < 0.1 && texColor.r < 0.1) discard; // Keep only glowing lines
                
                gl_FragColor = vec4(vColor * texColor.rgb, 1.0); // Premultiplied-like blending
            }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    let morphGroup;
    const loader = new GLTFLoader();

    function loadOrganModels() {
        Promise.all([
            new Promise((res, rej) => loader.load('/static/data/Brain.glb', res, undefined, rej)),
            new Promise((res, rej) => loader.load('/static/data/Heart_v2.glb', res, undefined, rej))
        ]).then(([brainGltf, heartGltf]) => {
            const extractVertices = (gltf) => {
                let totalVertices = 0;
                const meshes = [];
                gltf.scene.traverse((child) => {
                    if (child.isMesh && child.geometry) {
                        let geom = child.geometry.clone();
                        if (geom.index) {
                            geom = geom.toNonIndexed(); // Keep this fix!
                        }
                        meshes.push({ mesh: child, geom: geom });
                        totalVertices += geom.attributes.position.count;
                    }
                });

                const MAX_PARTICLES = 30000;
                const step = Math.max(1, Math.floor(totalVertices / MAX_PARTICLES));
                const actualVertexCount = Math.floor(totalVertices / step);
                
                const positions = new Float32Array(actualVertexCount * 3);
                let offset = 0;
                
                meshes.forEach((item) => {
                    const child = item.mesh;
                    const geom = item.geom;
                    const posAttr = geom.attributes.position;
                    child.updateWorldMatrix(true, false);
                    const matrix = child.matrixWorld;
                    const vec = new THREE.Vector3();
                    const isSkinned = child.isSkinnedMesh;
                    
                    for(let i = 0; i < posAttr.count; i += step) {
                        if (offset >= actualVertexCount) break;
                        if (isSkinned) { child.applyBoneTransform(i, vec); } 
                        else { vec.fromBufferAttribute(posAttr, i); }
                        vec.applyMatrix4(matrix);
                        positions[offset * 3] = vec.x;
                        positions[offset * 3 + 1] = vec.y;
                        positions[offset * 3 + 2] = vec.z;
                        offset++;
                    }
                });
                return { positions: positions.slice(0, offset * 3), count: offset };
            };

            function centerAndNormalize(positions, count, targetRadius) {
                let minX = Infinity, minY = Infinity, minZ = Infinity;
                let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
                for(let i=0; i<count; i++) {
                    const x = positions[i*3], y = positions[i*3+1], z = positions[i*3+2];
                    if(x < minX) minX = x; if(y < minY) minY = y; if(z < minZ) minZ = z;
                    if(x > maxX) maxX = x; if(y > maxY) maxY = y; if(z > maxZ) maxZ = z;
                }
                const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
                let maxR = 0;
                for(let i=0; i<count; i++) {
                    positions[i*3] -= cx; positions[i*3+1] -= cy; positions[i*3+2] -= cz;
                    const d = Math.sqrt(Math.pow(positions[i*3],2) + Math.pow(positions[i*3+1],2) + Math.pow(positions[i*3+2],2));
                    if(d > maxR) maxR = d;
                }
                const scale = targetRadius / (maxR || 1);
                for(let i=0; i<count; i++) {
                    positions[i*3] *= scale; positions[i*3+1] *= scale; positions[i*3+2] *= scale;
                }
            }

            const brainData = extractVertices(brainGltf);
            const heartData = extractVertices(heartGltf);
            
            centerAndNormalize(brainData.positions, brainData.count, 7.0);
            centerAndNormalize(heartData.positions, heartData.count, 7.0);

            // Align counts to max available for simplicity
            const count = Math.min(brainData.count, heartData.count, 30000);
            
            const positions = new Float32Array(count * 3);
            const targetPos = new Float32Array(count * 3);  // ECG
            const targetPos2 = new Float32Array(count * 3); // Heart
            
            const colors = new Float32Array(count * 3);     // Brain
            const colors2 = new Float32Array(count * 3);    // ECG
            const colors3 = new Float32Array(count * 3);    // Heart
            
            const randoms = new Float32Array(count);
            const sizeMultipliers = new Float32Array(count);

            const brainPal = [new THREE.Color('#00ffff'), new THREE.Color('#e0ffff'), new THREE.Color('#00bfff')];
            const ecgPal = [new THREE.Color('#ff00ff'), new THREE.Color('#ffb6c1'), new THREE.Color('#ffffff')];
            const heartPal = [new THREE.Color('#ff0044'), new THREE.Color('#ff4d88'), new THREE.Color('#ff99cc')];

            for(let i = 0; i < count; i++) {
                // Brain (Step 1)
                positions[i*3] = brainData.positions[i*3];
                positions[i*3+1] = brainData.positions[i*3+1];
                positions[i*3+2] = brainData.positions[i*3+2];
                
                // ECG (Step 2) - Procedural Zig-Zag (Vertical)
                const t = (i / count);
                const y = -(t - 0.5) * 15; // Spans from +7.5 (top) to -7.5 (bottom)
                const freq = 10.0;
                let x = Math.sin(t * Math.PI * 2 * freq) * 2.0;
                if(Math.sin(t * Math.PI * 2 * freq * 0.5) > 0.8) x += 3.0; // spikes pointing right
                if(Math.sin(t * Math.PI * 2 * freq * 0.3) < -0.8) x -= 2.0; // spikes pointing left
                x *= (1.0 - Math.pow(2.0 * t - 1.0, 4.0)); // Fade out ends (taper at top and bottom)
                
                targetPos[i*3] = x;
                targetPos[i*3+1] = y;
                targetPos[i*3+2] = (Math.random() - 0.5) * 0.5;

                // Heart (Step 3)
                targetPos2[i*3] = heartData.positions[i*3];
                targetPos2[i*3+1] = heartData.positions[i*3+1]; 
                targetPos2[i*3+2] = heartData.positions[i*3+2];

                randoms[i] = Math.random();
                sizeMultipliers[i] = 0.5 + Math.random() * 1.5;

                let c1 = brainPal[Math.floor(Math.random() * brainPal.length)];
                colors[i*3] = c1.r; colors[i*3+1] = c1.g; colors[i*3+2] = c1.b;

                let c2 = ecgPal[Math.floor(Math.random() * ecgPal.length)];
                colors2[i*3] = c2.r; colors2[i*3+1] = c2.g; colors2[i*3+2] = c2.b;

                let c3 = heartPal[Math.floor(Math.random() * heartPal.length)];
                colors3[i*3] = c3.r; colors3[i*3+1] = c3.g; colors3[i*3+2] = c3.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPos, 3));
            geometry.setAttribute('aTargetPosition2', new THREE.BufferAttribute(targetPos2, 3));
            
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('aColor2', new THREE.BufferAttribute(colors2, 3));
            geometry.setAttribute('aColor3', new THREE.BufferAttribute(colors3, 3));
            
            geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
            geometry.setAttribute('aSizeMultiplier', new THREE.BufferAttribute(sizeMultipliers, 1));

            morphGroup = new THREE.Group();
            morphGroup.scale.set(1, 1, 1);
            morphGroup.position.x = 4.0; // Right side of screen

            const particles = new THREE.Points(geometry, material);
            morphGroup.add(particles);
            scene.add(morphGroup);

            // GSAP ScrollTrigger to drive uProgress
            gsap.to(material.uniforms.uProgress, {
                value: 2.0, // 0 to 1 (ECG), 1 to 2 (Heart)
                ease: "none",
                scrollTrigger: {
                    trigger: "#main-container",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.0
                }
            });
            ScrollTrigger.refresh();

        }).catch((err) => console.error(err));
    }

    loadOrganModels();

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsed % (Math.PI * 1000.0);
        
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(interactionPlane, target3D);
        material.uniforms.uMouse3D.value.lerp(target3D, 0.1); 
        
        if (morphGroup) {
            morphGroup.rotation.y = elapsed * 0.5;
        }
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
