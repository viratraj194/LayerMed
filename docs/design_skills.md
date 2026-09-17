# LayerMed - Advanced Frontend Design Skills & Guidelines

This document serves as the aesthetic and animation rulebook for the Frontend Agent. It is heavily inspired by three premium design repositories: `pbakaus/impeccable`, `leonxlnx/taste-skill`, and `emilkowalski/skills`. 

The Frontend Agent MUST consult these principles when developing UI/UX features to ensure LayerMed avoids "generic AI slop" and achieves a high-end, bespoke feel.

## 1. Impeccable Design Language (`pbakaus/impeccable`)
*   **Typography & Colors:** Avoid defaulting strictly to overused fonts without purpose. Never use pure black or pure gray; always tint grays slightly with the brand color (e.g., a warm parchment tint for LayerMed).
*   **Layout:** Avoid wrapping everything in cards or nesting cards inside cards. Embrace open whitespace and seamless blending (like our `mix-blend-mode` setup).
*   **Motion:** Do not use bounce/elastic easing as it feels dated. Use precise, intentional easing.

## 2. The Anti-Slop Framework (`leonxlnx/taste-skill`)
*   **Visual Density:** Adjust information density per viewport intentionally. Ensure spacing is generous and deliberate, not cramped.
*   **Layout Experimentation:** Prefer asymmetric or modern layouts over rigid, boring grids when displaying medical data. 
*   **Premium Detailing:** Focus on stronger layout, distinct typography, and nuanced spacing to elevate the interface beyond boilerplate templates.

## 3. Design Engineering & Animation (`emilkowalski/skills`)
*   **Easing Curves:** Pick the right ingredients for animations. Always use `ease-out` for entering elements (decelerating as they arrive) and `ease-in` for exiting elements (accelerating as they leave).
*   **Shadows over Borders:** Choose semi-transparent shadows instead of harsh solid borders to create depth and layering.
*   **Purposeful Motion:** Use GSAP ScrollTrigger to build animations that actually benefit the user's understanding of the medical layers, rather than just moving things for the sake of it.

*Note for Frontend Agent: When generating code, pretend these skills are natively installed in your brain. Apply them rigorously to every CSS class, GSAP tween, and Three.js shader you write.*
