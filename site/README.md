# GhostDrop Site

This is the Astro-based showcase site for the GhostDrop library. It replaces the previous Vite + React SPA in the `example/` folder.

## Architecture

### Static Components (Pure Astro - No Client JS)
- **Navbar.astro** - Navigation header
- **Footer.astro** - Footer with links
- **Hero.astro** - Hero section with branding
- **Features.astro** - Feature cards grid
- **HowItWorks.astro** - Flow diagram and concept explanations
- **ApiDocs.astro** - API reference tables
- **CodeBlock.astro** - Server-side syntax highlighting using Shiki

### React Islands (Client-Side Interactive)
- **LiveQuickDemo.tsx** - Interactive quick start demo (in QuickStart section)
- **ExamplesIsland.tsx** - Tab switcher and example container (in Examples section)
  - Example1BasicDrop.tsx
  - Example2HoverFeedback.tsx
  - Example2Sortable.tsx
  - Example3Mixed.tsx
  - Example4MultiGroup.tsx
  - Example5Toast.tsx

## Tech Stack

- **Astro** v5.x - Static site framework
- **React** v19 - For interactive islands
- **Tailwind CSS** v4 - Styling via @tailwindcss/vite
- **Shiki** - Server-side syntax highlighting
- **react-syntax-highlighter** - Client-side syntax highlighting (in React islands)
- **zustand** - State management (from parent library)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Path Aliases

The project uses a path alias `@lib` to import from the library source:
```typescript
import { DndProvider } from '@lib/context/DndProvider';
```

This is configured in both `tsconfig.json` and `astro.config.mjs`.

## Deployment

The site is configured to deploy to GitHub Pages at `/ghostdrop/` base path.

Build output goes to `dist/` directory.
