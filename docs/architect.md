# LayerMed Architecture & Project Map

## Project Overview
LayerMed is an interactive, 3D visual medical encyclopedia allowing users to explore human anatomy and access associated medical data seamlessly.

## Project Map & Directory Structure
```text
D:\projects\LayerMed Project\LayerMed
├── Plan.md                 # Original master plan and requirements
├── architect.md            # Live architecture and map (this file)
├── .rules.md               # Non-negotiable agent workflow rules
├── .env                    # Environment variables (SECRET_KEY, DEBUG, ALLOWED_HOSTS)
├── .gitignore              # Git exclusions (venv, node_modules, .env, db.sqlite3, etc.)
├── design_skills.md        # Advanced frontend design guidelines
├── manage.py               # Django management script
├── db.sqlite3              # SQLite database (dev only)
├── requirements.txt        # Python dependency lock file
├── package.json            # npm dependencies & scripts (build, dev)
├── vite.config.js          # Vite build config → outputs to static/dist/
│
├── layer_med/              # Main Django project directory
│   ├── settings.py         # Django settings (dotenv, DRF, CORS, django-filter)
│   ├── urls.py             # Root URL config → includes core.urls
│   ├── wsgi.py             # WSGI entrypoint
│   └── asgi.py             # ASGI entrypoint
│
├── core/                   # Django core app
│   ├── models.py           # BodySystem, AnatomyLayer, Organ, Disease, ResearchPaper
│   ├── admin.py            # Admin panel with list_display, search, filters
│   ├── serializers.py      # DRF nested ModelSerializers
│   ├── api_views.py        # DRF ModelViewSets (filter, search, ordering)
│   ├── views.py            # home() view → renders core/home.html
│   ├── urls.py             # '' → home view, 'api/v1/' → DRF router
│   ├── apps.py             # App config
│   └── management/commands/seed_brain_data.py # Brain DB seed script
│
├── src/                    # Frontend source (Vite entry points)
│   ├── main.js             # Three.js scene, GSAP ScrollTrigger, WebGL particles, shaders
│   └── style.css           # Tailwind v4 with @theme Dala tokens, scrollbar, animations
│
├── static/                 # Django static files
│   ├── dist/               # Vite build output (main.js, style.css)
│   ├── css/                # Legacy CSS (deprecated, replaced by src/style.css)
│   ├── js/                 # Legacy JS (deprecated, replaced by src/main.js)
│   ├── img/                # Images (favicon, etc.)
│   └── data/               # 3D data (anatomy.glb goes here)
│
├── templates/              # Django templates
│   ├── base.html           # Master layout: Inter font, Vite dist assets (no CDNs)
│   └── core/home.html      # Landing page: Dala dark-void UI + scrollytelling sections
│
└── venv/                   # Python virtual environment
```

## Tech Stack

### Frontend
- **Build Tool**: Vite 8.2.2 (bundles src/ → static/dist/)
- **3D Engine**: Three.js 0.185.1 (npm, ES module import)
- **Animation**: GSAP 3.15.0 (npm, ScrollTrigger plugin)
- **CSS Framework**: Tailwind CSS v4.3.3 (via @tailwindcss/vite plugin, @theme tokens)
- **Shaders**: Custom GLSL (vertex: morph + mouse repel + drift, fragment: rotated triangle texture)
- **PostCSS**: PostCSS 8.5.26 + Autoprefixer 10.5.4

### Backend
- **Framework**: Django 5.0.6 (Python)
- **API Layer**: Django REST Framework (DRF) with ModelViewSets
- **CORS**: django-cors-headers
- **Filtering**: django-filter (DjangoFilterBackend)
- **Config**: python-dotenv (.env for SECRET_KEY, DEBUG, ALLOWED_HOSTS)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Environment**: Virtual environment at `venv/`

## Database Schema
```
BodySystem (1) ──→ (N) AnatomyLayer
BodySystem (1) ──→ (N) Organ
AnatomyLayer (1) ──→ (N) Organ
Organ (M) ←──→ (N) Disease
Disease (M) ←──→ (N) ResearchPaper
```

### Models
- **BodySystem**: name, description, icon, order
- **AnatomyLayer**: name, description, order, body_system (FK)
- **Organ**: name, description, layer (FK), body_system (FK), model_name_3d, position_x/y/z
- **Disease**: name, description, organ (M2M), symptoms, causes, treatments, severity, prevalence
- **ResearchPaper**: title, authors, abstract, doi_url, pubmed_id, disease (M2M), publication_date

## API Endpoints
All under `/api/v1/` via DRF DefaultRouter:
| Endpoint | ViewSet | Filter | Search |
|---|---|---|---|
| `/api/v1/systems/` | BodySystemViewSet | — | name |
| `/api/v1/layers/` | AnatomyLayerViewSet | body_system | name |
| `/api/v1/organs/` | OrganViewSet | layer, body_system | name, model_name_3d |
| `/api/v1/diseases/` | DiseaseViewSet | severity, organ | name, symptoms |
| `/api/v1/papers/` | ResearchPaperViewSet | disease | title, authors |

## Design System (Dala Theme)
- **Background**: Pure black void `#000000` — never dark gray
- **Colors**: Bone White `#ffffff`, Ash Gray `#9a9a9a`, Silver Mist `#bdbdbd`, Electric Iris `#8052ff`, Saffron Spark `#ffb829`, Deep Verdant `#15846e`
- **Typography**: Inter (200-600 weights). Headlines: 78-113px, tracking -4.52px. Body: 18px, weight 200.
- **Layout**: No cards, no borders, no panels, no shadows. Elements float on the black canvas.
- **Particles**: 45k outlined triangular glyphs in violet, amber, teal, blue. Normal blending.

## WebGL Architecture
- **Renderer**: WebGLRenderer with `alpha: true`, transparent background, context loss/restore handlers
- **Shader**: Custom ShaderMaterial with morph (brain → heart), mouse repel (NaN-guarded), ambient drift
- **Morphing**: `uScrollProgress` uniform (0.0 → 1.0) scrubbed by GSAP ScrollTrigger
- **Interactivity**: Mouse repulsion via `uMouse3D` uniform (raycaster + plane intersection + lerp)
- **GLB Loading**: Expects `static/data/anatomy.glb` with named meshes
- **Fallback**: 45k procedural particles (brain-shaped clusters: frontal lobe, parietal, cerebellum, brainstem)
- **Safety**: WebGL context loss handling, GLSL NaN guards, elapsed time capping

## Security
- SECRET_KEY loaded from `.env` via python-dotenv
- DEBUG controlled via `.env` (defaults to False)
- ALLOWED_HOSTS configurable via `.env` (defaults to localhost, 127.0.0.1)
- `.gitignore` excludes venv/, node_modules/, .env, db.sqlite3, __pycache__/
- CDN dependencies eliminated (all bundled via Vite)
- WebGL context loss/restore handlers implemented
- GLSL NaN guards on normalize() calls
- CORS enabled (CORS_ALLOW_ALL_ORIGINS for dev — restrict for prod)

## Build & Run

### Development
```bash
# Terminal 1: Build frontend assets
npm run build          # Or: npm run dev (for HMR during development)

# Terminal 2: Run Django server
venv\Scripts\python.exe manage.py runserver
```

### Production
```bash
npm run build
venv\Scripts\python.exe manage.py collectstatic
# Deploy via gunicorn/uwsgi with PostgreSQL
```

## Current State
- **Phase 1**: ✅ COMPLETE — Frontend WebGL particle system with Dala theme
- **Phase 2**: ✅ COMPLETE — Backend models, admin, REST API, security hardening
- **Phase 3**: ✅ COMPLETE — Connect frontend to API, flesh out Brain organ data, implement click-to-reveal UX
- **Phase 4**: 🔲 NOT STARTED — Scale to full anatomy, multilingual support

## Agent Workflow
- **Head Agent (Coordinator)**: Manages tasks, updates `architect.md`, coordinates sub-agents.
- **Frontend Agent**: Handles UI, 3D rendering (Three.js), animations (GSAP), Vite build.
- **Backend Agent**: Handles Django setup, API endpoints, database models.
- **Security Agent**: Reviews code for vulnerabilities, bugs, and best practices.

*Note: This file must be updated with every structural change to the project to provide context for sub-agents.*
