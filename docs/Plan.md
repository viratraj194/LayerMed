# LayerMed - Project Master Plan

## 1. Project Overview
**LayerMed** is a highly interactive, visual medical encyclopedia. Instead of relying on traditional text-based search bars, users navigate medical information visually through a 3D anatomical interface. The platform allows users to explore the human body layer by layer, identify specific organs, discover associated diseases, and instantly access causes, symptoms, cures, and peer-reviewed research papers without leaving the page.

**Lead Architect & Supervisor:** [Raj/Supervisor(Fullstack developer)]
**Lead Developer:** Google AI CLI

---

## 2. Design & Aesthetic
The visual identity of LayerMed is a fusion of classical artistry, modern 3D web rendering, and technical data visualization.

*   **Global Background:** Edge-to-edge, seamless cream parchment paper texture. No frames, no borders, no bounding boxes.
*   **Art Style:** The 3D anatomical models are rendered dynamically to look exactly like hand-drawn graphite pencil sketches (inspired by Leonardo da Vinci’s anatomical studies) complete with cross-hatching.
*   **Modern Accents:** 
    *   Clean, classic serif typography (e.g., Playfair Display) in black/graphite for main text.
    *   Subtle retro-technical data overlays (e.g., "038%", alignment markers).
    *   A structured left-hand navigation menu with subtle vivid purple/neon accents to indicate active states.
    *   Abstract data visualizers (expanding vertical bars) representing biological rhythms.

---

## 3. Core Features & UX
*   **Scrollytelling Integration:** The landing page features a full-length, frameless human body. As the user scrolls, the layers (skin $\rightarrow$ muscle $\rightarrow$ skeleton $\rightarrow$ organs) smoothly peel away and pull apart into an "exploded view."
*   **Interactive Anatomy:** Users can click on specific organs or layers (e.g., Lungs, Heart) to isolate them.
*   **Disease Data Cards:** Clicking an organ reveals a list of associated diseases. Selecting a disease opens a seamless data view containing:
    *   Disease Name
    *   Symptoms
    *   Causes
    *   Cure / Treatments
    *   Direct links to authoritative, peer-reviewed research papers.
*   **Multilingual Support:** The platform will support multiple languages to ensure global accessibility for medical information.

---

## 4. Tech Stack Architecture
A decoupled (headless) architecture to ensure fluid 3D performance and robust data management.

### Frontend (Client-Side)
*   **Core:** HTML5, CSS3, JavaScript (ES6+)
*   **3D Engine:** Three.js (WebGL) / React Three Fiber
*   **Animation:** GSAP (ScrollTrigger) for the scrollytelling and exploded view mechanics.
*   **Shaders:** Custom WebGL post-processing shaders (edge-detection/cross-hatching) to create the real-time graphite pencil effect.

### Backend (Server-Side)
*   **Framework:** Django (Python)
*   **API Layer:** Django REST Framework (DRF) or Django Ninja to serve data to the frontend.
*   **Admin Panel:** Django Admin for managing medical data, categorizing organs, and adding research links.

### Database
*   **Database Engine:** PostgreSQL
*   **Data Structure:** Highly relational mapping (Body Part $\rightarrow$ Layer $\rightarrow$ Disease $\rightarrow$ Research Link) utilizing JSONB for flexible, multilingual text storage.

### External APIs (Data Sourcing)
*   **PubMed API (E-utilities):** To automatically fetch or link medical research papers.
*   **UMLS / Orphanet (Optional):** For standardized disease definitions and symptoms.
*   **Google Cloud Translation API:** For multilingual localization.

---

## 5. Development Roadmap

### Phase 1: The Visual Prototype (Frontend Only)
*   [ ] Set up global CSS styling (seamless parchment background, typography).
*   [ ] Initialize transparent Three.js canvas over the background.
*   [ ] Load a placeholder 3D human model (GLTF/GLB).
*   [ ] Develop and apply the custom WebGL "pencil sketch" shader.
*   [ ] Implement GSAP ScrollTrigger to achieve the layered "peeling" animation.
*   [ ] Build the UI overlays (left-hand menu, technical markers, purple active states).

### Phase 2: Backend & Database Setup
*   [ ] Initialize Django project and PostgreSQL database.
*   [ ] Define Django Models: `AnatomyLayer`, `Organ`, `Disease`, `ResearchPaper`.
*   [ ] Set up Django Admin for easy data entry.
*   [ ] Build RESTful API endpoints to serve organ and disease data as JSON.

### Phase 3: The MVP (Minimum Viable Product) Link-Up
*   [ ] Connect the frontend 3D interface to the Django API.
*   [ ] Fully flesh out **one specific organ** (e.g., the Heart) with accurate layers, 10-20 diseases, and verified research paper links.
*   [ ] Test the click-to-reveal UX for disease information.

### Phase 4: Scaling & Polish
*   [ ] Expand database to include the rest of the human anatomy.
*   [ ] Integrate the translation API for multilingual support.
*   [ ] Final performance optimization for WebGL rendering (mobile responsiveness, framerate stability).