# Claude Flow BLE - Marketing Site

A professional marketing website for Claude Flow BLE, a comprehensive BLE and NFC communication testing application.

## Project Overview

This is a slide-based marketing site showcasing the features, use cases, and value proposition of the Claude Flow BLE app. The site uses a modern, accessible design with smooth transitions between content sections.

## Technology Stack

- **HTML5**: Semantic markup with comprehensive accessibility support
- **CSS3**: Modern styling using CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No framework dependencies for optimal performance
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

## Directory Structure

```
src/
├── index.html              # Main entry point with complete slide structure
├── styles/
│   ├── main.css           # CSS variables, typography, base styles
│   ├── components.css     # Reusable components (buttons, cards, utilities)
│   └── responsive.css     # Mobile-first responsive design system
├── scripts/
│   ├── main.js           # Application initialization and utilities
│   ├── slides.js         # Slide navigation and transition logic
│   └── animations.js     # Animation utilities and scroll effects
├── assets/
│   ├── images/           # Screenshots, illustrations, app images
│   ├── icons/            # SVG icons and favicons
│   └── fonts/            # Web fonts (if needed)
└── components/           # Reusable HTML components (future use)
```

## Slide Structure

The site contains 6 slides:

1. **Hero/Welcome** - Main value proposition and CTAs
2. **Current Features** - BLE communication and NFC reading capabilities
3. **Future Features** - Roadmap with NFC writing, CSV import, tag duplication
4. **Use Cases** - Target audience scenarios (developers, testers, students)
5. **Monetization** - Fair donation model explanation
6. **Download/Contact** - Final CTAs and contact information

## Key Features Implemented

### CSS System
- **Design Variables**: Complete color palette, typography scale, spacing system
- **Component Library**: Buttons, cards, badges, utilities with hover effects
- **Responsive Design**: Mobile-first with 5 breakpoints (640px, 768px, 1024px, 1280px, 1536px)
- **Accessibility**: WCAG 2.1 AA compliant with proper focus management

### JavaScript Architecture
- **Slide Management**: Smooth transitions with keyboard and touch support
- **Animation System**: Scroll-triggered animations with reduced motion support
- **Performance Monitoring**: Web Vitals tracking and performance optimization
- **Accessibility**: Screen reader announcements and keyboard navigation

### Browser Support
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Progressive enhancement for older browsers
- Mobile-first responsive design for all screen sizes

## Development Guidelines

### For Individual Slide Agents

Each slide has a dedicated `<section>` with the following structure:
```html
<section class="slide slide-[name]" data-slide="[number]" role="tabpanel" aria-labelledby="slide-title-[number]" aria-hidden="true">
  <div class="slide-content">
    <h2 id="slide-title-[number]" class="h1">Slide Title</h2>
    <!-- Your content here -->
  </div>
</section>
```

### Available CSS Classes

#### Typography
- `.display` - Hero headlines (48px/52px, bold)
- `.h1` - Section headlines (36px/40px, bold)  
- `.h2` - Subsection headlines (30px/36px, semibold)
- `.subtitle` - Supporting text for headlines

#### Buttons
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-success` - Success/positive action buttons
- `.btn-warning` - Coming soon/warning buttons

#### Layout
- `.features-grid` - 1-3 column responsive grid for features
- `.use-cases-grid` - 1-3 column grid for use cases
- `.roadmap-timeline` - 1-3 column grid for roadmap items
- `.hero-buttons` - Button container with proper spacing

#### Cards
- `.card` - Basic card with hover effects
- `.feature-card` - Special styling for feature showcases
- `.use-case` - Quote-style cards with left border
- `.roadmap-item` - Timeline-style items with icons

### Content Guidelines

- Use the established color palette (primary blue #2563EB, success green #10B981, warning orange #F59E0B)
- Follow the 8px spacing system using CSS variables
- Include proper alt text for all images
- Use semantic HTML elements for accessibility
- Test with keyboard navigation and screen readers

### Image Assets

Place assets in appropriate directories:
- `/src/assets/images/` - App screenshots, mockups, illustrations
- `/src/assets/icons/` - SVG icons, favicons
- Optimize images for web (WebP with fallbacks recommended)
- Use descriptive filenames and proper alt attributes

### Testing Checklist

- [ ] Visual design matches specifications
- [ ] Responsive design works on all breakpoints
- [ ] Keyboard navigation functions properly
- [ ] Touch/swipe gestures work on mobile
- [ ] Screen reader accessibility is maintained
- [ ] Performance remains optimal (< 500KB total)

## Running Locally

### Option 1: Simple File Server
```bash
# Navigate to project directory
cd /path/to/marketing_site_tester

# Start local server (Python 3)
python3 -m http.server 8000 --directory src

# Or using Python 2
python -m SimpleHTTPServer 8000

# Visit in browser
open http://localhost:8000
```

### Option 2: Node.js Live Server
```bash
# Install live-server globally (if not installed)
npm install -g live-server

# Navigate to src directory
cd src

# Start live server
live-server --port=8000

# Automatically opens in browser
```

### Option 3: PHP Built-in Server
```bash
# Navigate to src directory  
cd src

# Start PHP server
php -S localhost:8000

# Visit in browser
open http://localhost:8000
```

## Getting Started

1. Follow one of the "Running Locally" options above
2. Use arrow keys or navigation buttons to move between slides
3. Test responsive design by resizing browser window
4. Verify accessibility with screen reader tools

## Browser Testing

Test in these browsers/devices:
- Chrome/Edge (desktop and mobile)
- Firefox (desktop and mobile)
- Safari (desktop and iOS)
- Various screen sizes and orientations

The foundation is complete and ready for individual slide implementation!