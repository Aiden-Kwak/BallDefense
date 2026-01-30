# Ball Defense - Serverless Tower Defense

A commercial-quality, serverless Tower Defense game built with Next.js 14 and HTML5 Canvas.

## Features

- **Serverless**: Runs entirely in the browser (persistent state via LocalStorage).
- **Responsive**: Mobile-first design with touch controls and desktop mouse support.
- **Performance**: Optimized Canvas rendering loop targeting 60fps.
- **Content**:
  - 3 Map Presets (Beginner, Split, Spiral)
  - 6 Unique Enemy Types (Runner, Brute, Swarm, Shielded, Warded)
  - 6 Tower Types with Branching Upgrades (Physical, Magic, DoT, AoE, CC)
  - 12 Balanced Waves

## Controls

- **Pan**: Drag on the board (Touch or Mouse).
- **Select**: Tap/Click a tile to inspect.
- **Build**: Select an empty tile to open the Build Menu.
- **Upgrade/Sell**: Select an existing tower to manage it.
- **HUD**: Track Gold, Lives, and Wave progress.

## Development

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
```

### Deploy to Vercel
1. Push to GitHub/GitLab.
2. Import project in Vercel.
3. Deploy (Zero config required).

## Directory Structure
- `src/game/engine`: Core loop, Renderer, Input.
- `src/game/data`: Static game data (Enemies, Towers, Maps).
- `src/game/systems`: Logic systems (Wave, Enemy, Tower, Projectile).
- `src/game/state`: GameState interface and store.
- `src/game/ui`: React UI components.

## License
MIT
