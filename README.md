# Dimver Paul T. Rodulfo — Portfolio

Plain HTML, CSS and JavaScript. No build step.

## Run locally
Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit http://localhost:8000.

## Add your content
1. **Images** — put these in `assets/images/`: `profile.jpg` (a starter crop from your design reference is included, replace it with a sharper photo), `taskflow.png`, `boardnear.png`, `medtrack.png`. Until the project images exist, the cards show branded placeholder tiles.
2. **Links, email and CV** — edit the `CONFIG` block at the top of `script.js` (`cv` is the path to your CV file). Any empty value shows as a disabled link.
3. **Contact form** — create a form on a service such as Formspree or Web3Forms, then paste its URL into `CONFIG.formEndpoint`. Until then the form tells visitors it is not connected.

## Deploy
Push the folder to GitHub, then enable GitHub Pages (Settings → Pages → deploy from `main`, root). Netlify and Vercel also work by dragging the folder in.

## Notes
- Icons load from the Lucide CDN and fonts from Google Fonts, so an internet connection is needed.
- Theme choice is saved in LocalStorage; light mode is the default.