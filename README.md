# FleetFix Tycoon

A simple 3D fleet repair tycoon built with Next.js. The game now focuses on the main fun loop: dispatch repair calls, watch trucks move through the 3D yard, earn coins and parts, hire crew, upgrade the garage, and grow into a city service hub.

## What changed

- Rebuilt the main game screen into a cleaner 3D tycoon yard.
- Removed the older side systems that made the game feel crowded.
- Added working dispatch timers, crew assignment, garage upgrades, parts shop, goals, and local save progress.
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

## Game notes

- Calls use parts. Buy parts before dispatching too many trucks.
- More service bays let you run more jobs at the same time.
- Response truck upgrades shorten job timers.
- Training and city upgrades increase crew capacity.
- Away progress is capped at 8 hours so the economy stays balanced.
