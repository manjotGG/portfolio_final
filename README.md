# Manjot's Portfolio

A creative portfolio website showcasing design work, illustrations, and artistic projects.

## 🚀 Live Demo

Visit the live site: [Your Vercel URL]

## 📁 Project Structure

```
portfolio_final/
├── index.html              # Entry point (redirects to mainwebsite.html)
├── mainwebsite.html        # Main portfolio page
├── scribbling.html         # Sketchbook collection
├── graphic_design.html     # Graphic design portfolio
├── Illustrator.html        # Illustrator work
├── about-me.html          # About page
├── vercel.json            # Vercel deployment configuration
├── package.json           # Project metadata
├── scroll-animations.css  # Scroll animation styles
├── scroll-animations.js   # Scroll animation system
└── assets/                # Images and media files
    ├── *.jpeg, *.png      # Portfolio images
    ├── *.mp4, *.gif       # Video files
    └── *.css, *.js        # Additional assets
```

## 🛠️ Local Development

### Prerequisites
- Python 3.x (for local server)
- Modern web browser

### Running Locally

1. **Clone or download the repository**
   ```bash
   cd portfolio_final
   ```

2. **Start local server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Or connect via GitHub**
   - Push code to GitHub repository
   - Connect repository to Vercel
   - Deploy automatically

### Deployment Configuration

The `vercel.json` file includes:
- **Static file serving** for HTML, CSS, JS, and images
- **Route configuration** for clean URLs
- **Security headers** for better protection
- **Automatic redirects** from root to main website

## 🎨 Features

- **Responsive Design** - Works on all devices
- **Smooth Animations** - 60fps scroll animations with hardware acceleration
- **Interactive Gallery** - Modal image viewing with smooth transitions
- **Parallax Effects** - Subtle background video parallax
- **Modern UI** - Clean, professional design
- **Fast Loading** - Optimized images and animations

## 📱 Pages

- **Home** (`/`) - Main portfolio landing page
- **Scribbling** (`/scribbling`) - Sketchbook collection
- **Graphic Design** (`/graphic-design`) - Design portfolio
- **Illustrator** (`/illustrator`) - Illustrator work
- **About** (`/about`) - About page

## 🔧 Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks required
- **Hardware Acceleration** - GPU-optimized animations
- **Intersection Observer** - Efficient scroll-triggered animations
- **RequestAnimationFrame** - Smooth 60fps performance
- **Mobile Optimized** - Touch-friendly interactions

## 📄 License

MIT License - Feel free to use this code for your own projects.

## 👨‍🎨 Author

**Manjot** - Creative Designer & Artist

---

*Built with ❤️ and modern web technologies*