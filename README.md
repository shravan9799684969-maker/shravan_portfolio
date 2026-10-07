# Shravan Kumar – Personal Portfolio Website
### B.Tech Mechanical Engineering Student | First Year

A modern, responsive, engineering-inspired personal portfolio website built with clean HTML5, CSS3, modern JavaScript, and an interactive 3D mechanical gear simulation powered by Three.js.

---

## 🌟 Key Highlights & Features

- **Genuine First-Year Engineering Presentation**: Accurately showcases academic achievements, foundational skills, and sports honors without exaggerations.
- **Major Highlights Showcased**:
  - **9.5 CGPA** in First Year B.Tech Mechanical Engineering
  - **90% in Class 12 CBSE** (Army Public School, Amritsar)
  - **92% in Class 10 CBSE** (Army Public School, Amritsar)
  - **All India Rank 156** in Merchant Navy Entrance Examination
  - **NDA SSB Selection Board** Candidate
  - **State Level Football Player** & **District Level Basketball Player**
- **Interactive 3D Kinematics Element**: Custom Three.js mechanical gear and gyroscope assembly that responds to cursor movements, with smooth 60fps performance and power-saving viewport pausing.
- **Engineering Blueprint Design System**: Technical crosshair coordinates, blueprint grid pattern, HUD corners, and clean typography (`Plus Jakarta Sans`, `Space Grotesk`, `JetBrains Mono`).
- **Dark & Light Mode Switcher**: Seamlessly toggles theme and persists preference in `localStorage`.
- **Responsive Layout**: Tailored for mobile smartphones, tablets, laptops, and desktop displays with an accessible hamburger menu on mobile.
- **Interactive Resume Modal**: Built-in CV preview with print/save as PDF support.
- **Live Profile Photo Preview Tool**: Test your picture right in the browser with 1 click, or place `avatar.jpg` in `assets/`.
- **Direct Communication & 1-Click Copy**: Instant email copy button (`shravan284687@gmail.com`) and contact form linked to mail client dispatch.

---

## 📂 Project Structure

```text
├── index.html                   # Main semantic HTML5 portfolio
├── css/
│   └── style.css                # Engineering theme, design tokens, responsive queries
├── js/
│   ├── main.js                  # Navigation, theme toggle, counters, modal, contact form
│   └── three-scene.js           # 3D interactive mechanical gear mechanism (Three.js)
├── assets/
│   ├── favicon.svg              # Engineering compass/gear SVG favicon
│   └── avatar-placeholder.svg   # Custom HUD engineering student avatar
└── README.md                    # Documentation & customization guide
```

---

## 🚀 How to View Locally

Simply double-click [`index.html`](file:///Users/shravankumar/Desktop/9799684969/index.html) or right-click and open with your preferred browser:
- Google Chrome
- Safari
- Mozilla Firefox
- Microsoft Edge

No node, npm, or server installations are required!

---

## 🛠️ How to Customize as You Progress Through College

### 1. Adding Your Real Photo
- **Quick Live Preview**: Click the **"📷 Test Photo"** or **"Upload / Preview Your Photo"** button directly on the website to choose a photo from your computer. It updates immediately in your browser.
- **Permanent Code Update**: Place your image (e.g. `shravan-photo.jpg`) inside the `assets/` folder, then open `index.html` and replace `src="assets/avatar-placeholder.svg"` with `src="assets/shravan-photo.jpg"`.

### 2. Adding Your Custom Resume PDF
- Place your PDF file named `resume.pdf` in the root folder.
- In `index.html`, update the resume button link to point directly to `resume.pdf`:
  ```html
  <a href="resume.pdf" download="Shravan_Kumar_Resume.pdf" class="btn btn-primary btn-sm">
    Download PDF
  </a>
  ```

### 3. Adding Your GitHub Link
- Open `index.html` and search for `https://github.com`.
- Replace it with your actual profile link, e.g. `https://github.com/shravankumar`.

### 4. Updating College Projects in Subsequent Semesters
- In `index.html`, locate `<section id="projects">`.
- Duplicate any `.project-card` block to add your 2nd, 3rd, and 4th-year club projects (e.g., SAE Baja, Formula Student, Robotics Lab, CAD designs).

---

## 🌐 Free 1-Click Hosting Options

1. **GitHub Pages**:
   - Create a repository on GitHub (e.g. `shravan-portfolio`).
   - Push these files to GitHub.
   - Go to **Settings > Pages** and select `main` branch. Your site will be live at `https://<username>.github.io/shravan-portfolio/`.
2. **Netlify or Vercel**:
   - Drag and drop this folder directly into [Netlify Drop](https://app.netlify.com/drop) for instant global hosting.

---
&copy; 2026 Shravan Kumar. All Rights Reserved.
