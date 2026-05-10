# FleetFix Tycoon

A cozy isometric 3D fleet repair tycoon built with Next.js. The game focuses on starting from one repair yard and growing into a full service town that supports repair teams and their families.

## What changed

- Rebuilt the main game screen into a brighter town-builder inspired 3D yard.
- Removed the older mini game, weather, feedback, loan-style clutter, and road/decoration ribbon moments.
- Added coins and money as separate economies.
- Added working dispatch timers, crew assignment, garage upgrades, parts shop, goals, and local save progress.
- Added town construction timers. Buildings wait for ribbon cutting; roads and decorations finish automatically.
- Added slower hiring rules: owner works alone until Level 5, one technician until Level 21, then global-style growth.
- Added storage limits, parts store upgrades, salary due, pickup upgrades, town value, and endless level scaling.
- Fixed the weird always-moving truck. Trucks stay parked when no call is active.
- Added catch-up progress for sleep or closed-browser time. The browser cannot truly keep running while a computer is asleep, so the game calculates completed jobs and idle income when you open it again.
- Fixed the PWA icon paths and added a GitHub-safe `.gitignore`.

## Run locally

Open PowerShell inside the project folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Then open:

```text
http://localhost:3000
```

## Test production build

```powershell
npm.cmd run build
```

## Upload to GitHub

Upload these source files and folders:

```text
app
public
.gitignore
next.config.mjs
package.json
package-lock.json
README.md
```

Do not upload these folders if they appear:

```text
node_modules
.next
.vercel
```

## Deploy on Vercel

1. Go to Vercel and choose **Add New Project**.
2. Import your GitHub repo.
3. Framework should be **Next.js**.
4. Build command should be:

```text
npm run build
```

5. Output folder can stay blank.
6. Click **Deploy**.

No database or environment variables are required for this version. Progress is saved in the player browser with local storage.

Recommended Vercel settings:

```text
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: leave blank
Root Directory: leave blank if these files are at the top of GitHub
```

## Game notes

- Calls use repair parts. Buy parts before dispatching too many trucks.
- Coins run daily operations. Money grows the business.
- More service bays let you run more jobs at the same time.
- Pickup and response truck upgrades shorten travel and return time.
- Build homes, schools, hospitals, parks, warehouses, training and service buildings to support the town.
- Buildings use construction timers and ribbon cutting. Roads and decorations do not use ribbon cutting.
- Away progress is capped at 8 hours so the economy stays balanced.
