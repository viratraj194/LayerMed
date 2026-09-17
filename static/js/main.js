// Register GSAP ScrollTrigger
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener("DOMContentLoaded", () => {
    
    // Scrollytelling Animation Timeline
    if (document.querySelector('#scrolly-container') && typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scrolly-container",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });

        // Phase 1: Scroll past section 1 (Skin -> Muscle)
        tl.to("#img-skin", { opacity: 0, duration: 1 }, "phase1")
          .to("#img-muscle", { opacity: 1, duration: 1 }, "phase1");
        
        // Phase 2: Scroll past section 2 (Muscle -> Exploded)
        tl.to("#img-muscle", { opacity: 0, duration: 1 }, "phase2")
          .to("#container-exploded", { opacity: 1, scale: 1.0, duration: 1 }, "phase2");
    }

    // ThreeJS Initialization (only if canvas exists)
    const canvas = document.querySelector('#webgl-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const sizes = { width: window.innerWidth, height: window.innerHeight };
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.z = 5;
        scene.add(camera);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
        
        const tick = () => {
            renderer.render(scene, camera);
            window.requestAnimationFrame(tick);
        };
        tick();
    }
});
