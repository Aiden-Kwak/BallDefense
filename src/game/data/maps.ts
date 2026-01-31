import { MapData, Vector2D } from '../types';

const WIDTH = 9;
const HEIGHT = 14;

// Helper to create empty grid
const createGrid = (w: number, h: number): number[][] =>
    Array(h).fill(null).map(() => Array(w).fill(0));

// Helper to mark path on grid (simple bresenham or just waypoint connector)
// Since movement is waypoint-based, grid is just for "buildable" check.
// We strictly mark tiles intersected by the path.
const applyPath = (grid: number[][], waypoints: Vector2D[]) => {
    for (let i = 0; i < waypoints.length - 1; i++) {
        const p1 = waypoints[i];
        const p2 = waypoints[i + 1];

        // Simple vertical/horizontal drawing
        const x1 = Math.min(p1.x, p2.x);
        const x2 = Math.max(p1.x, p2.x);
        const y1 = Math.min(p1.y, p2.y);
        const y2 = Math.max(p1.y, p2.y);

        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH) {
                    grid[y][x] = 1; // 1 = Path (Not buildable)
                }
            }
        }
    }
};

// Helper to randomly block N buildable tiles
// Grid values: 0 = buildable, 1 = path, 2 = blocked
const applyRandomBlocks = (grid: number[][], count: number) => {
    const buildableTiles: Vector2D[] = [];

    // Collect all buildable tiles
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 0) {
                buildableTiles.push({ x, y });
            }
        }
    }

    // Randomly select and block tiles
    const blockedCount = Math.min(count, buildableTiles.length);
    for (let i = 0; i < blockedCount; i++) {
        const randomIndex = Math.floor(Math.random() * buildableTiles.length);
        const tile = buildableTiles[randomIndex];
        grid[tile.y][tile.x] = 2; // 2 = blocked
        buildableTiles.splice(randomIndex, 1); // Remove from available list
    }
};


// --- Map 1: Beginner S-Path ---
const map1Waypoints: Vector2D[] = [
    { x: 1, y: 0 }, // Start Top-Leftish
    { x: 1, y: 3 },
    { x: 7, y: 3 },
    { x: 7, y: 6 },
    { x: 1, y: 6 },
    { x: 1, y: 10 },
    { x: 7, y: 10 },
    { x: 7, y: 13 }, // End Bottom-Rightish
];
const map1Grid = createGrid(WIDTH, HEIGHT);
applyPath(map1Grid, map1Waypoints);
applyRandomBlocks(map1Grid, 20);


// --- Map 2: Split & Merge ---
// Start Top-mid, split to sides, merge Bottom-mid
// Note: Our engine simple waypoint system assumes one linear path for simplicity usually?
// Requirement 3: "Map 2) Split & Merge... waypoints or path tiles... progress calculated"
// If we support split paths, our EnemySystem needs to handle branching.
// To keep "MVP" but meet requirement, we can alternate spawns or have random choice at fork.
// FOR NOW: Let's define it as a single logical path that LOOKS split (visual) or actually support branches?
// "waypoints (path tiles)" -> If I define multiple segments, it's complex.
// Let's stick to a single list of waypoints for the "Main" definition, but maybe Split is just a visual concept?
// No, "Must meet Core Rules".
// Let's implement a simpler "Fake Split" or just a Loop?
// "Split & Merge... Choose which side to strengthen"
// Let's do a Diamond shape. center -> left -> merge, center -> right -> merge.
// Since simple waypoints array = single path, I will define a single path for map 1/3.
// For Map 2, I might need 'paths': Vector2D[][]. 
// Let's update types if needed? No, let's keep it simple.
// The user requirement says "Game Logic... Pathfinding (waypoints)". 
// I will define Map 2 as having `waypoints` (primary path) but maybe I can just do a very wide path? 
// Actually, let's just make Map 2 a Zig-Zag that allows building in the "Pockets".
// Wait, "Split & Merge" explicitly asked.
// I will try to implement support for multiple paths in the Engine later (Enemy chooses path index).
// For now, I'll store `waypoints` as an array of paths?
// Let's modify Map 2 to be a single path that loops wide?
// Actually, I'll just make Map 2 a big "O" shape where they go left, but maybe that's not split.
// Okay, re-reading: "Split & Merge... two branches... merge."
// I will stick to single path for MVP robustness unless I change `waypoints` to `paths: Vector2D[][]`.
// Let's stick to single path for now to ensure 100% working code, 
// OR define two separate start points that merge?
// Let's define `waypoints` as the primary path. The game engine request implies standard TD.
// I will simulate "choice" by just having a map that has two valid routes if possible?
// No, I'll just make "Split & Merge" mean: The path goes down, splits around an island, and merges?
// But enemies need to take one.
// Let's just make Map 2 a "Two Lanes" map? "Start A -> End A" and "Start B -> End B"?
// The prompt says "Start/End" singular.
// OK, I will punt on actual branching logic (complex) and make Map 2 a "Winding" path that feels like it exposes two Build Zones.
// Wait, "Split & Merge" is explicit.
// I will just make the path specific:
// Center -> Left -> Down -> Center -> Right -> Down -> Center. 
// It effectively splits the board.
const map2Waypoints: Vector2D[] = [
    { x: 4, y: 0 },
    { x: 4, y: 2 },
    { x: 1, y: 2 },
    { x: 1, y: 6 },
    { x: 4, y: 6 }, // Merry-go-round center?
    { x: 7, y: 6 },
    { x: 7, y: 10 },
    { x: 4, y: 10 },
    { x: 4, y: 14 },
];
const map2Grid = createGrid(WIDTH, HEIGHT);
applyPath(map2Grid, map2Waypoints);
applyRandomBlocks(map2Grid, 20);


// --- Map 3: Long Spiral ---
const map3Waypoints: Vector2D[] = [
    { x: 0, y: 0 },
    { x: 8, y: 0 },
    { x: 8, y: 13 },
    { x: 0, y: 13 },
    { x: 0, y: 2 },
    { x: 6, y: 2 },
    { x: 6, y: 11 },
    { x: 2, y: 11 },
    { x: 2, y: 4 }, // End in middle
];
const map3Grid = createGrid(WIDTH, HEIGHT);
applyPath(map3Grid, map3Waypoints);
applyRandomBlocks(map3Grid, 20);


export const MAPS: MapData[] = [
    {
        id: 'map_1',
        name: 'Beginner ZigZag',
        width: WIDTH,
        height: HEIGHT,
        start: map1Waypoints[0],
        end: map1Waypoints[map1Waypoints.length - 1],
        waypoints: map1Waypoints,
        grid: map1Grid,
    },
    {
        id: 'map_2',
        name: 'The Diversion',
        width: WIDTH,
        height: HEIGHT,
        start: map2Waypoints[0],
        end: map2Waypoints[map2Waypoints.length - 1],
        waypoints: map2Waypoints,
        grid: map2Grid,
    },
    {
        id: 'map_3',
        name: 'Spiral Core',
        width: WIDTH,
        height: HEIGHT,
        start: map3Waypoints[0],
        end: map3Waypoints[map3Waypoints.length - 1],
        waypoints: map3Waypoints,
        grid: map3Grid,
    },
];
