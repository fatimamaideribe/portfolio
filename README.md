# Fatima Ibrahim Maideribe's Portfolio

My portfolio site: a Y2K-style laptop in the browser. It opens with a 3D laptop you lift the lid of. Windows can be dragged, resized, snapped and minimised. Case studies open in a built-in browser, and there's a file explorer, photos app, terminal, notepad, task manager, settings and an A* Snake that plays itself. On phones it switches to a home-screen layout. Each project opens as a case study page.

[View Live Portfolio](https://fatimamaideribe.github.io/portfolio/)

## Projects

### MSc Design Engineering, Imperial College London
- **FlowState** (`flowstate.html`): a focus app that pauses distracting apps until you've verified the task is done. User interviews, paper, lo-fi and hi-fi prototypes, and think-aloud testing in Figma.
- **Smart Plant Buddy** (`plant-buddy.html`): an ESP32 plant monitor with soil, light, temperature and humidity sensors, Firebase logging, a Chart.js dashboard and an OLED mood face. [Code & data](https://github.com/fatimamaideribe/Smart-Plant-Buddy-Code)

### Earlier work
- **AI Study Buddy** (`ai-study-buddy.html`): an ESP32 robot study companion
- **A\* Pathfinding Snake** (`snake-ai.html`): snake with an A* search AI
- **Wildwise** (`wildwise.html`): conservation brand, Roblox game and campaign
- **Automated Exhaust Fan** (`arduino-fan.html`): sensor-driven Arduino fan control
- **Bakery Website** (`bakery.html`): full-stack PHP/MySQL bakery site

## Structure
- `index.html`: the desktop shell and window content
- `os/fatos.css` / `os/fatos.js`: the desktop "operating system" (window manager, apps, taskbar, Start menu)
- `os/intro.js`: the 3D laptop intro (Three.js from a CDN)
- `notebook.html`: an alternate scrapbook-style prototype (not linked from the site)
- `case-study.css` / `case-study.js`: shared template for every project page
- `assets/`: web-optimised images and videos (`assets/thumbs/` holds the project card thumbnails)

## Run locally
```
python3 -m http.server 8080
```

## Contact
Feel free to reach out for collaborations or opportunities: [LinkedIn](https://www.linkedin.com/in/fatima-ibrahim-maideribe)
