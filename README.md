# INKORA — Premium Editorial Publishing Platform
> **Brand Tagline:** *"Ideas Leave a Mark."*

INKORA is a full-stack editorial publishing platform engineered for visionaries, technologists, architects, and essayists. It combines cinematic real-time 3D environments, editorial typography, full content lifecycle management, and community discourse.

---

## 🖋️ Brand Identity & Design System

- **Brand Personality**: Sophisticated, editorial, contemporary, minimal, and visually memorable.
- **Color Palette**:
  - **Midnight Navy** (`#0B1020`): Deep primary background evocative of fine Japanese Sumi ink.
  - **Deep Charcoal** (`#111827`): Surface card background.
  - **Electric Teal** (`#56E0C5`): Primary accent signaling intellectual energy and clarity.
  - **Warm Amber** (`#FFB86B`): Secondary accent representing craft and warmth.
  - **Warm Ivory** (`#F7F5EF`): Light theme background with parchment texture.
  - **Soft White / Charcoal**: High-contrast typography optimized for prolonged reading comfort.
- **Typography**:
  - *Headlines & Article Titles*: Expressive high-contrast editorial serifs (**Playfair Display** & **Newsreader**).
  - *UI Controls & Navigation*: Clean architectural sans-serif (**Plus Jakarta Sans**).
  - *Code Blocks & Data*: Monospaced (**JetBrains Mono**).
- **Brand Logo & Favicon**:
  - Original geometric emblem uniting a stylized ink nib, chiseled letter "I", and folded page facet.
  - Scalable vector SVG with glowing hover effects and micro-interactions.

---

## 🌌 Cinematic 3D Animated Background

The hero section features a real-time WebGL 3D environment built with **Three.js** and **React Three Fiber**:
- Floating translucent glass spheres with optical refraction.
- Chiseled icosahedrons and glowing geometric ribbons.
- Drifting ink dust motes with electric teal and warm amber luminescence.
- Smooth mouse-directed parallax physics.
- `pointer-events-none` container ensuring foreground text and links are 100% accessible.
- Low-motion fallback respecting `prefers-reduced-motion` and WebGL gracefully.

---

## ⚡ Core Features

1. **Authentication & Security**:
   - JWT authentication stored securely in localStorage with Bearer header interceptors.
   - Password encryption using `bcryptjs` with salt rounds.
   - Helmet security headers, rate limiting (`express-rate-limit`), and sanitized inputs.
2. **Editorial Content Creation & Management**:
   - Create, edit, and delete articles with ownership validation.
   - Live Markdown and rich formatting editor with instant preview tab.
   - Real-time word count and estimated reading time calculation.
   - Draft vs. Published status toggles.
   - Curated high-resolution Unsplash photograph presets or custom image URLs.
3. **Article Reading Experience**:
   - Slim floating reading progress indicator.
   - High-contrast editorial typography with pull-quotes, lists, and syntax blocks.
   - Native Web Share API with clipboard fallback toast.
   - Real-time Like/Applaud button and bookmarking.
   - Related articles query based on editorial pillar categories.
4. **Community Discourse (Comments)**:
   - Full CRUD: Add, edit, and delete comments with permission checks (author or admin).
   - Optimistic UI updates with instant feedback.
   - Unauthenticated visitor prompts.
5. **Author Dashboard & Profiles**:
   - Real calculated metrics: Total Published, Drafts Count, Total Views, Reader Comments.
   - Tabbed management workspace for Published Articles vs. Drafts.
   - Public author portfolio pages with biography and published essays.
   - In-app profile editing modal.
6. **Search & Discovery**:
   - Debounced keyword search across titles, summaries, and tags.
   - Category filtering across 7 editorial pillars: *Technology, Design, Programming, Science, Creativity, Lifestyle, Business*.
   - Sorting options: Newest, Oldest, Most Read, Most Appreciated.
   - Pagination controls.
7. **Sunday Editorial Dispatch**:
   - Persistent newsletter subscription endpoint with deduplication.

---

## 🛡️ Conventional Architecture — Strict "No AI" Policy

INKORA is engineered as a conventional web platform:
- Zero AI chatbots or fake assistants.
- Zero AI-generated prose or synthetic summaries.
- All search queries, sorting, comments, and metrics are powered by standard MongoDB aggregation pipelines and REST APIs.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** + PostCSS
- **React Router v6**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **Lucide React** (icons)
- **Axios** (HTTP client with JWT interceptors)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose ODM**
- **JSON Web Tokens (JWT)** + **bcryptjs**
- **Helmet** + **express-rate-limit** + **cors** + **morgan**
- Automatic **MongoMemoryServer** fallback for zero-friction local testing.

---

## 🔑 Demo Credentials

To immediately test all publishing, editing, and administrative workflows:

| Role | Email | Password |
|---|---|---|
| **Author (Julian Cross)** | `demo@inkora.com` | `Password123!` |
| **Admin (Editorial Lead)** | `admin@inkora.com` | `AdminPassword123!` |

*(One-click quick-fill buttons are also provided on the Sign In page for convenience).*

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
Run the following from the `Blog-Platform` root directory:

```bash
# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### 3. Database Seeding
Pre-populate the database with 8 editorial essays, 5 authors, comments, and metrics:

```bash
npm --prefix server run seed
```

### 4. Running Locally
Run the server and client concurrently:

```bash
# Start backend API (runs on http://localhost:5051)
npm --prefix server run dev

# In a separate terminal, start frontend (runs on http://localhost:5173)
npm --prefix client run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Automated Testing

An automated test suite is included to verify all API endpoints and security invariants:

```bash
npm --prefix server test
```

**Results:**
- ✅ GET /api/health
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ GET /api/auth/me
- ✅ GET /api/posts
- ✅ GET /api/posts/editorial/stats
- ✅ POST /api/posts
- ✅ POST /api/posts/:id/comments
- ✅ POST /api/posts/:id/like
- ✅ PUT /api/comments/:id
- ✅ DELETE /api/posts/:id
- ✅ POST /api/newsletter/subscribe
- **12 passed, 0 failed.**

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Set root directory to `Blog-Platform/client`.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Environment Variable: `VITE_API_URL=https://your-backend-render-url.onrender.com/api`.

### Backend (Render)
1. Set root directory to `Blog-Platform/server`.
2. Build command: `npm install`.
3. Start command: `node src/server.js`.
4. Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5051`
   - `MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/inkora_blog`
   - `JWT_SECRET=your_production_secret_key`
   - `CLIENT_URL=https://your-frontend-vercel-url.vercel.app`

---

## 📄 License
MIT © INKORA Editorial Collective. Ideas Leave a Mark.
