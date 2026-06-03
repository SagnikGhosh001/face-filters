# 🎥 Real-Time Face Filter Web App (Instagram/Snapchat Style) — Build Prompt

## 🎯 Goal
Build a **fully working web-based real-time face filter application** similar to Instagram/Snapchat AR filters.

The app must:
- Access webcam in browser
- Detect face in real time
- Apply AR filters (glasses, hats, stickers)
- Render everything smoothly in real time

👉 Focus first on a **working real-time face filter system**.  
👉 Recording + download comes **at the end after core system works**.

---

# 🧠 Tech Stack Requirements

## Language
- JavaScript (ES6+)

## Frontend
- You may use:
  - React OR Next.js (preferred for structure)
  
## Face Tracking
- Use:
  - MediaPipe Face Mesh (mandatory)

## Rendering (choose best approach)
You can use:
- p5.js → for simple 2D overlays (easy filters)
- Three.js → for advanced 3D AR filters (preferred for glasses/hats)

Choose what gives the best real-time performance and accuracy.

---

# 🧩 Phase 1 — Core Working System (MOST IMPORTANT)

## 1. Webcam Setup
- Use `getUserMedia()` API
- Show live webcam feed in browser

## 2. Face Detection
Use MediaPipe Face Mesh to:
- detect face landmarks (eyes, nose, mouth, forehead)
- track head movement in real time
- update coordinates continuously

## 3. Render Face Overlay System
Create a system that:
- maps face landmarks → screen coordinates
- allows overlays to stick to face

Must support:
- scaling with face distance
- rotation with head tilt
- smooth movement (no jitter)

---

## 4. Basic Filters (MVP)
Implement at least 3 working filters:

### 👓 Glasses Filter
- aligns with both eyes
- scales with face width
- rotates with head tilt

### 🎩 Hat Filter
- positioned on forehead/head top
- follows face movement

### 😄 Face Sticker
- placed on nose or cheek
- moves with facial landmarks

---

## 🎛️ Filter System Design
Create modular filter architecture:

- Each filter = function/class
- Input = face landmarks
- Output = position + scale + rotation

Example structure:
- filterEngine.js
- filters/glasses.js
- filters/hat.js
- filters/sticker.js

---

## 🎨 Rendering Requirements
- Must run smoothly in real time (target 30 FPS)
- No lag or freezing
- Filters must feel “attached” to face naturally

---

# 🧱 UI Requirements
Simple and clean UI:
- Webcam preview area (center)
- Filter selection buttons (bottom or side panel)
- Active filter highlight
- Reset filter button

Keep UI minimal and functional.

---

# ⚙️ Performance Requirements
- Optimize MediaPipe processing
- Avoid heavy computations every frame
- Use requestAnimationFrame properly
- Ensure smooth tracking even on mid-range laptops/mobile browsers

---

# 🧪 Phase 2 — Enhancement (after core works)

Only after Phase 1 is stable:

## Optional Improvements
- Better filter smoothing (reduce jitter)
- Multiple filters simultaneously
- Face effects (blur, glow, color shift)
- Mobile responsiveness

---

# 🎬 Phase 3 — Recording System (ADD LAST)

After everything above works properly, implement:

## 📹 Video Recording
- Use MediaRecorder API
- Record:
  - webcam video + filters combined

## 📥 Download Feature
- Allow:
  - start recording
  - stop recording
  - preview video
  - download as MP4/WebM

---

# 🏗️ Architecture Suggestion

Recommended structure:


/src
/camera
webcam.js
/mediapipe
faceMesh.js
/filters
glasses.js
hat.js
sticker.js
/engine
filterEngine.js
/ui
controls.js
app.js


---

# 🚀 Final Output Requirements

The final app must:
✔ Run in browser  
✔ Use webcam  
✔ Track face in real time  
✔ Apply AR filters correctly  
✔ Be smooth and responsive  
✔ Have modular filter system  
✔ Include recording + download only at the end  

---

# 💡 Important Instruction to AI
Do NOT start with recording or SaaS features.

👉 First deliver a **fully working real-time face filter system**  
👉 Then incrementally add improvements  
👉 Recording comes last only after stability is achieved