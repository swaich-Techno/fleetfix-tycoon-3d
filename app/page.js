"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SAVE_KEY = "fleetfix-tycoon-simple-3d-v1";
const MAX_AWAY_SECONDS = 8 * 60 * 60;

const CREW_NAMES = [
  "Ravi",
  "Aman",
  "Simran",
  "Jordan",
  "Maya",
  "Noah",
  "Zara",
  "Leo",
  "Mehak",
  "Kabir",
];

const SERVICE_AREAS = [
  "Main Road",
  "Service Yard",
  "Market Street",
  "Industrial Lane",
  "School Road",
  "Park Gate",
  "Gym Parking",
  "Hospital Road",
  "Warehouse Zone",
  "Mall Parking",
  "Fuel Plaza",
];

const PART_CATALOG = [
  { name: "Tyre", unlock: 1, buy: 40, sell: 24 },
  { name: "Battery", unlock: 1, buy: 65, sell: 39 },
  { name: "Engine Oil", unlock: 1, buy: 45, sell: 27 },
  { name: "Brake Kit", unlock: 1, buy: 90, sell: 54 },
  { name: "Bulb Pack", unlock: 1, buy: 30, sell: 18 },
  { name: "7-Way Plug", unlock: 1, buy: 55, sell: 33 },
  { name: "Landing Leg Pin", unlock: 1, buy: 70, sell: 42 },
  { name: "Diagnostic Chip", unlock: 5, buy: 130, sell: 78 },
  { name: "Tow Hook", unlock: 5, buy: 150, sell: 90 },
  { name: "Fuel Seal Kit", unlock: 10, buy: 210, sell: 126 },
  { name: "Hydraulic Hose", unlock: 10, buy: 250, sell: 150 },
  { name: "ECU Sensor", unlock: 15, buy: 320, sell: 192 },
  { name: "Air Compressor", unlock: 20, buy: 420, sell: 252 },
  { name: "Transmission Kit", unlock: 25, buy: 620, sell: 372 },
];

const TOWN_BUILDINGS = [
  { id: "road", title: "Road", category: "road", unlock: 1, coins: 70, money: 0, buildTime: 12, value: 20, family: false, color: "#303b45" },
  { id: "tree", title: "Tree Decoration", category: "decoration", unlock: 1, coins: 40, money: 0, buildTime: 8, value: 10, family: false, color: "#2f9f5b" },
  { id: "familyHouse", title: "Family House", category: "building", unlock: 2, coins: 260, money: 12, buildTime: 35, value: 85, family: true, color: "#f2b84b" },
  { id: "park", title: "Park", category: "decoration", unlock: 3, coins: 220, money: 10, buildTime: 25, value: 70, family: true, color: "#6abd63" },
  { id: "school", title: "School", category: "building", unlock: 5, coins: 520, money: 45, buildTime: 55, value: 180, family: true, color: "#4f8ce8" },
  { id: "gym", title: "Gym", category: "building", unlock: 6, coins: 450, money: 35, buildTime: 48, value: 130, family: false, color: "#ed7d31" },
  { id: "hospital", title: "Hospital", category: "building", unlock: 7, coins: 760, money: 70, buildTime: 70, value: 240, family: true, color: "#58b7d3" },
  { id: "fireStation", title: "Fire Station", category: "building", unlock: 8, coins: 820, money: 85, buildTime: 75, value: 260, family: false, color: "#e34848" },
  { id: "warehouse", title: "Warehouse", category: "building", unlock: 10, coins: 900, money: 120, buildTime: 80, value: 300, family: false, color: "#8a8f98" },
  { id: "fuelStation", title: "Fuel Station", category: "building", unlock: 12, coins: 980, money: 150, buildTime: 85, value: 330, family: false, color: "#2fb18a" },
  { id: "trainingAcademy", title: "Training Academy", category: "building", unlock: 15, coins: 1300, money: 220, buildTime: 95, value: 420, family: false, color: "#8b5cf6" },
  { id: "apartment", title: "Apartment Block", category: "building", unlock: 18, coins: 1800, money: 310, buildTime: 115, value: 560, family: true, color: "#64748b" },
  { id: "mall", title: "Mall", category: "building", unlock: 21, coins: 2500, money: 500, buildTime: 135, value: 780, family: true, color: "#d946ef" },
  { id: "airportRoad", title: "Airport Road", category: "road", unlock: 30, coins: 3200, money: 750, buildTime: 110, value: 900, family: false, color: "#303b45" },
];

const JOBS = [
  {
    id: "battery-lot",
    title: "Dead Battery",
    district: "Market Street",
    vehicle: "compact car",
    skill: "Electrical",
    part: "Battery",
    unlock: 1,
    duration: 22,
    coins: 90,
    money: 6,
    partsCost: 1,
    xp: 20,
    rep: 1,
    className: "callGreen",
  },
  {
    id: "flat-van",
    title: "Flat Tire",
    district: "Main Road",
    vehicle: "delivery van",
    skill: "Tyre",
    part: "Tyre",
    unlock: 1,
    duration: 28,
    coins: 125,
    money: 8,
    partsCost: 2,
    xp: 26,
    rep: 1,
    className: "callAmber",
  },
  {
    id: "trailer-light",
    title: "Trailer Light Change",
    district: "Service Yard",
    vehicle: "trailer",
    skill: "Electrical",
    part: "Bulb Pack",
    unlock: 2,
    duration: 32,
    coins: 150,
    money: 10,
    partsCost: 1,
    xp: 30,
    rep: 1,
    className: "callGreen",
  },
  {
    id: "landing-leg",
    title: "Landing Leg Issue",
    district: "Industrial Lane",
    vehicle: "trailer",
    skill: "Mechanical",
    part: "Landing Leg Pin",
    unlock: 3,
    duration: 40,
    coins: 210,
    money: 18,
    partsCost: 2,
    xp: 44,
    rep: 2,
    className: "callAmber",
  },
  {
    id: "tow-pickup",
    title: "Roadside Tow",
    district: "Fuel Plaza",
    vehicle: "pickup",
    skill: "Towing",
    part: "Tow Hook",
    unlock: 5,
    duration: 38,
    coins: 190,
    money: 14,
    partsCost: 2,
    xp: 38,
    rep: 2,
    className: "callRed",
  },
  {
    id: "bus-inspection",
    title: "Bus Safety Check",
    district: "School Loop",
    vehicle: "city bus",
    skill: "Diagnostic",
    part: "Diagnostic Chip",
    unlock: 5,
    duration: 45,
    coins: 260,
    money: 22,
    partsCost: 3,
    xp: 52,
    rep: 3,
    className: "callBlue",
  },
  {
    id: "fleet-brakes",
    title: "Fleet Brake Job",
    district: "Warehouse Zone",
    vehicle: "box truck",
    skill: "Mechanical",
    part: "Brake Kit",
    unlock: 4,
    duration: 56,
    coins: 360,
    money: 32,
    partsCost: 4,
    xp: 74,
    rep: 4,
    className: "callAmber",
  },
  {
    id: "heavy-recovery",
    title: "Heavy Recovery",
    district: "Industrial Road",
    vehicle: "semi truck",
    skill: "Towing",
    part: "Hydraulic Hose",
    unlock: 10,
    duration: 70,
    coins: 520,
    money: 52,
    partsCost: 5,
    xp: 105,
    rep: 5,
    className: "callRed",
  },
  {
    id: "airport-shuttle",
    title: "Shuttle Rescue",
    district: "Airport Gate",
    vehicle: "passenger shuttle",
    skill: "Engine",
    part: "ECU Sensor",
    unlock: 7,
    duration: 82,
    coins: 720,
    money: 78,
    partsCost: 6,
    xp: 140,
    rep: 6,
    className: "callBlue",
  },
  {
    id: "charity-school",
    title: "No-Payment Family Rescue",
    district: "School Road",
    vehicle: "family van",
    skill: "All-Rounder",
    part: "Bulb Pack",
    unlock: 4,
    duration: 42,
    coins: 0,
    money: 0,
    partsCost: 1,
    xp: 36,
    rep: 8,
    charity: true,
    className: "callGreen",
  },
];

const TABS = [
  { id: "calls", label: "Calls" },
  { id: "town", label: "Town" },
  { id: "garage", label: "Garage" },
  { id: "crew", label: "Crew" },
  { id: "shop", label: "Shop" },
  { id: "goals", label: "Goals" },
];

const GOALS = [
  {
    id: "first-run",
    title: "Finish 3 calls",
    check: (game) => game.completedJobs >= 3,
    reward: { coins: 180, money: 20, parts: 4, xp: 25 },
  },
  {
    id: "busy-yard",
    title: "Finish 10 calls",
    check: (game) => game.completedJobs >= 10,
    reward: { coins: 450, money: 55, parts: 8, xp: 70 },
  },
  {
    id: "two-bays",
    title: "Run 2 service bays",
    check: (game) => game.bays >= 2,
    reward: { coins: 260, money: 35, parts: 4, xp: 40 },
  },
  {
    id: "trusted-town",
    title: "Reach 20 reputation",
    check: (game) => game.reputation >= 20,
    reward: { coins: 600, money: 95, parts: 10, xp: 100 },
  },
  {
    id: "city-operation",
    title: "Build the City Hub",
    check: (game) => game.buildings.cityHub,
    reward: { coins: 1200, money: 220, parts: 16, xp: 180 },
  },
  {
    id: "family-town",
    title: "Open 5 town buildings",
    check: (game) => completedTownBuildings(game).length >= 5,
    reward: { coins: 900, money: 150, parts: 12, xp: 150 },
  },
];

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function xpForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.35));
}

function levelFromXp(xp) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level += 1;
  return level;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function availableJobs(level) {
  return JOBS.filter((job) => job.unlock <= level);
}

function makeCall(level) {
  const job = pick(availableJobs(level));
  return {
    id: newId(),
    jobId: job.id,
    rushBonus: Math.floor(Math.random() * 24),
    createdAt: Date.now(),
  };
}

function getJob(jobId) {
  return JOBS.find((job) => job.id === jobId) || JOBS[0];
}

function getTownBuilding(buildingId) {
  return TOWN_BUILDINGS.find((building) => building.id === buildingId) || TOWN_BUILDINGS[0];
}

function completedTownBuildings(game) {
  return (game.townTiles || []).filter((tile) => tile.status === "complete" && tile.category === "building");
}

function townValue(game) {
  return (game.townTiles || []).reduce((sum, tile) => {
    if (tile.status !== "complete") return sum;
    return sum + (tile.value || 0);
  }, 0);
}

function storageCapacity(game) {
  const warehouses = (game.townTiles || []).filter((tile) => tile.type === "warehouse" && tile.status === "complete").length;
  return 24 + game.level * 2 + game.partsStoreLevel * 8 + warehouses * 24;
}

function startingTownTiles(now) {
  return [
    { id: "starter-garage", type: "garage", title: "Small Garage", category: "building", status: "complete", value: 90, color: "#e34848", createdAt: now, completesAt: now },
    { id: "starter-parts", type: "partsStore", title: "Parts Store", category: "building", status: "complete", value: 65, color: "#2fb18a", createdAt: now, completesAt: now },
    { id: "starter-clinic", type: "clinic", title: "Clinic", category: "building", status: "complete", value: 70, color: "#58b7d3", createdAt: now, completesAt: now },
    { id: "starter-road", type: "road", title: "Main Road", category: "road", status: "complete", value: 20, color: "#303b45", createdAt: now, completesAt: now },
  ];
}

function createCrewMember(name, role = "Field Tech", speed = 1, isOwner = false) {
  return {
    id: newId(),
    name,
    role,
    skill: isOwner ? "All-Rounder" : pick(["Tyre", "Electrical", "Engine", "Mechanical", "Diagnostic", "Towing"]),
    speed,
    level: 1,
    xp: 0,
    energy: 100,
    morale: 100,
    salary: isOwner ? 0 : 100,
    salaryDue: 0,
    pickupLevel: 1,
    assignedArea: "Service Yard",
    isOwner,
    status: "Ready",
  };
}

function createGame({ companyName, managerName, cityName, countryName = "Repair Nation" }) {
  const now = Date.now();
  const base = {
    started: true,
    companyName: companyName.trim() || "FleetFix Yard",
    managerName: managerName.trim() || "Owner",
    cityName: cityName.trim() || "Starter City",
    countryName: countryName.trim() || "Repair Nation",
    coins: 500,
    money: 100,
    parts: 18,
    xp: 0,
    level: 1,
    reputation: 0,
    completedJobs: 0,
    totalEarned: 0,
    bays: 1,
    truckLevel: 1,
    garageLevel: 1,
    partsStoreLevel: 1,
    trainingLevel: 1,
    unlockedAreas: 1,
    buildings: {
      partsDepot: false,
      trainingCenter: false,
      dispatchOffice: false,
      heavyPad: false,
      cityHub: false,
    },
    townTiles: startingTownTiles(now),
    crew: [createCrewMember(managerName.trim() || "Owner", "Owner / All-Rounder", 1.08, true)],
    openCalls: [],
    activeJobs: [],
    claimedGoals: [],
    log: ["Garage opened. Build the first repair town from one yard."],
    lastSavedAt: now,
    lastIncomeAt: now,
  };

  return fillOpenCalls(base, 3);
}

function cloneGame(game) {
  return {
    ...game,
    buildings: { ...game.buildings },
    townTiles: (game.townTiles || []).map((tile) => ({ ...tile })),
    crew: (game.crew || []).map((member) => ({ ...member })),
    openCalls: (game.openCalls || []).map((call) => ({ ...call })),
    activeJobs: (game.activeJobs || []).map((job) => ({ ...job })),
    claimedGoals: [...(game.claimedGoals || [])],
    log: [...(game.log || [])],
  };
}

function normalizeGame(game) {
  const starter = createGame({
    companyName: game?.companyName || "FleetFix Yard",
    managerName: game?.managerName || "Owner",
    cityName: game?.cityName || "Starter City",
    countryName: game?.countryName || "Repair Nation",
  });

  const safe = {
    ...starter,
    ...game,
    money: game?.money ?? starter.money,
    countryName: game?.countryName || starter.countryName,
    partsStoreLevel: game?.partsStoreLevel || starter.partsStoreLevel,
    trainingLevel: game?.trainingLevel || starter.trainingLevel,
    unlockedAreas: game?.unlockedAreas || starter.unlockedAreas,
    buildings: { ...starter.buildings, ...(game?.buildings || {}) },
    townTiles: Array.isArray(game?.townTiles) && game.townTiles.length ? game.townTiles : starter.townTiles,
    crew: Array.isArray(game?.crew) && game.crew.length ? game.crew : starter.crew,
    openCalls: Array.isArray(game?.openCalls) ? game.openCalls : starter.openCalls,
    activeJobs: Array.isArray(game?.activeJobs) ? game.activeJobs : [],
    claimedGoals: Array.isArray(game?.claimedGoals) ? game.claimedGoals : [],
    log: Array.isArray(game?.log) ? game.log.slice(0, 8) : starter.log,
  };

  safe.level = levelFromXp(safe.xp || 0);
  safe.crew = safe.crew.map((member) => ({
    ...createCrewMember(member.name || "Tech", member.role || "Field Tech", member.speed || 1, member.isOwner),
    ...member,
    salary: member.isOwner ? 0 : member.salary || 100,
    salaryDue: member.salaryDue || 0,
    energy: member.energy ?? 100,
    morale: member.morale ?? 100,
    pickupLevel: member.pickupLevel || 1,
    assignedArea: member.assignedArea || "Service Yard",
  }));
  safe.openCalls = safe.openCalls.filter((call) => getJob(call.jobId).unlock <= safe.level);
  return fillOpenCalls(safe, maxOpenCalls(safe));
}

function maxOpenCalls(game) {
  return 3 + Math.floor(game.level / 8) + (game.buildings.dispatchOffice ? 1 : 0) + (game.buildings.cityHub ? 1 : 0);
}

function maxActiveJobs(game) {
  return game.bays + (game.buildings.heavyPad ? 1 : 0);
}

function crewLimit(game) {
  if (game.level < 5) return 1;
  if (game.level < 21) return 2;
  return 2 + game.unlockedAreas + Math.floor((game.level - 21) / 5) + (game.buildings.trainingCenter ? 2 : 0) + (game.buildings.cityHub ? 2 : 0);
}

function passiveCoinsPerMinute(game) {
  return game.garageLevel * 2 + (game.buildings.dispatchOffice ? 3 : 0) + (game.buildings.cityHub ? 5 : 0);
}

function passiveMoneyPerMinute(game) {
  return Math.floor(game.garageLevel / 2) + (game.buildings.cityHub ? 2 : 0);
}

function fillOpenCalls(game, target = maxOpenCalls(game)) {
  const next = cloneGame(game);
  while (next.openCalls.length < target) {
    next.openCalls.push(makeCall(next.level));
  }
  return next;
}

function pushLog(game, text) {
  game.log = [text, ...(game.log || [])].slice(0, 8);
}

function completeActiveJob(game, active, report) {
  const job = getJob(active.jobId);
  const crew = game.crew.find((member) => member.id === active.crewId);
  const oldLevel = game.level;
  const earnedCoins = Math.round(job.coins + active.rushBonus + game.garageLevel * 12);
  const earnedMoney = Math.round((job.money || 0) + (job.charity ? 0 : game.garageLevel * 2));
  const earnedXp = Math.round(job.xp + (crew?.level || 1) * 2);
  const earnedRep = job.rep;
  const bonusParts = game.buildings.partsDepot && Math.random() > 0.55 ? 1 : 0;
  const energyLoss = Math.max(4, Math.round(12 - (crew?.pickupLevel || 1) * 1.5));

  game.coins += earnedCoins;
  game.money += earnedMoney;
  game.parts += bonusParts;
  game.xp += earnedXp;
  game.reputation += earnedRep;
  game.completedJobs += 1;
  game.totalEarned += earnedCoins;
  game.level = levelFromXp(game.xp);

  if (game.level > oldLevel) {
    const coinBonus = 80 + game.level * 20;
    const moneyBonus = 15 + game.level * 4;
    game.coins += coinBonus;
    game.money += moneyBonus;
    pushLog(game, `Level ${game.level} reached. Bonus ${coinBonus} coins and ${moneyBonus} money.`);
  }

  if (crew) {
    crew.status = "Ready";
    crew.xp += Math.round(job.xp * 0.8);
    crew.level = 1 + Math.floor(crew.xp / 120);
    crew.energy = Math.max(0, (crew.energy ?? 100) - energyLoss);
    if (!crew.isOwner && Math.random() < 0.03) {
      crew.status = "Recovering";
      crew.recoverUntil = Date.now() + 2 * 60 * 1000;
      game.coins = Math.max(0, game.coins - 80);
      pushLog(game, `${crew.name} had a minor incident. Clinic recovery started.`);
    }
  }

  report.completed += 1;
  report.coins += earnedCoins;
  report.money += earnedMoney;
  report.parts += bonusParts;
  report.xp += earnedXp;
  pushLog(game, `${crew?.name || "Crew"} finished ${job.title} for ${earnedCoins} coins and ${earnedMoney} money.`);
}

function processGame(game, now, mode = "live") {
  if (!game) return { game, report: null };

  const next = cloneGame(game);
  const report = { completed: 0, coins: 0, money: 0, parts: 0, xp: 0, calls: 0, construction: 0 };
  const lastSavedAt = next.lastSavedAt || now;
  const elapsedSeconds = Math.max(0, Math.floor((now - lastSavedAt) / 1000));
  const remainingJobs = [];

  next.activeJobs.forEach((active) => {
    if (active.endsAt <= now) {
      completeActiveJob(next, active, report);
    } else {
      remainingJobs.push(active);
    }
  });

  next.activeJobs = remainingJobs;
  next.crew = next.crew.map((member) => ({
    ...member,
    status: member.recoverUntil && member.recoverUntil > now ? "Recovering" : next.activeJobs.some((job) => job.crewId === member.id) ? "On Call" : "Ready",
    energy: member.energy ?? 100,
  }));

  next.townTiles = (next.townTiles || []).map((tile) => {
    if (tile.status !== "building" || tile.completesAt > now) return tile;
    report.construction += 1;
    if (tile.category === "road" || tile.category === "decoration") {
      pushLog(next, `${tile.title} completed.`);
      return { ...tile, status: "complete" };
    }
    pushLog(next, `${tile.title} is ready for ribbon cutting.`);
    return { ...tile, status: "ready" };
  });

  const incomeElapsed = Math.max(0, now - (next.lastIncomeAt || now));
  const cappedIncomeMs = mode === "offline" ? Math.min(incomeElapsed, MAX_AWAY_SECONDS * 1000) : incomeElapsed;

  if (cappedIncomeMs >= 60000) {
    const minutes = Math.floor(cappedIncomeMs / 60000);
    const passiveCoins = minutes * passiveCoinsPerMinute(next);
    const passiveMoney = minutes * passiveMoneyPerMinute(next);
    const depotParts = next.buildings.partsDepot ? Math.floor(minutes / 3) : 0;
    const salaryTicks = Math.floor(minutes / 5);

    next.coins += passiveCoins;
    next.money += passiveMoney;
    next.parts += depotParts;
    if (salaryTicks > 0) {
      next.crew = next.crew.map((member) => (member.isOwner ? member : { ...member, salaryDue: (member.salaryDue || 0) + salaryTicks * Math.round((member.salary || 100) / 12) }));
    }
    next.lastIncomeAt = mode === "offline" && incomeElapsed > cappedIncomeMs ? now : (next.lastIncomeAt || now) + minutes * 60000;
    report.coins += passiveCoins;
    report.money += passiveMoney;
    report.parts += depotParts;
  }

  if (mode === "offline" && elapsedSeconds >= 90) {
    const callsToAdd = Math.min(maxOpenCalls(next) - next.openCalls.length, Math.floor(elapsedSeconds / 90));
    for (let i = 0; i < callsToAdd; i += 1) {
      next.openCalls.push(makeCall(next.level));
      report.calls += 1;
    }
  }

  next.level = levelFromXp(next.xp);
  next.lastSavedAt = now;
  return { game: fillOpenCalls(next, maxOpenCalls(next)), report };
}

function formatTime(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins ? `${mins}m ${secs}s` : `${secs}s`;
}

function progressFor(active, now) {
  const total = active.endsAt - active.startedAt;
  const done = now - active.startedAt;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

export default function FleetFixTycoon() {
  const [ready, setReady] = useState(false);
  const [game, setGame] = useState(null);
  const [panel, setPanel] = useState("calls");
  const [now, setNow] = useState(Date.now());
  const [notice, setNotice] = useState("");
  const [awayReport, setAwayReport] = useState(null);
  const noticeTimer = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      try {
        const loaded = normalizeGame(JSON.parse(raw));
        const processed = processGame(loaded, Date.now(), "offline");
        setGame(processed.game);
        if (
          processed.report &&
          (processed.report.completed || processed.report.coins || processed.report.money || processed.report.parts || processed.report.calls || processed.report.construction)
        ) {
          setAwayReport(processed.report);
        }
      } catch {
        localStorage.removeItem(SAVE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!game?.started) return undefined;

    const timer = setInterval(() => {
      const tickNow = Date.now();
      setNow(tickNow);
      setGame((current) => processGame(current, tickNow, "live").game);
    }, 1000);

    return () => clearInterval(timer);
  }, [game?.started]);

  useEffect(() => {
    if (!game?.started) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...game, lastSavedAt: Date.now() }));
  }, [game]);

  function notify(text) {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3000);
  }

  function startGame(profile) {
    const fresh = createGame(profile);
    setGame(fresh);
    setNow(Date.now());
    setPanel("calls");
    notify("Garage opened. Dispatch your first call.");
  }

  function dispatchCall(callId) {
    if (!game) return;

    const call = game.openCalls.find((item) => item.id === callId);
    if (!call) return;

    const job = getJob(call.jobId);
    const openSlotCount = maxActiveJobs(game) - game.activeJobs.length;
    const freeCrew = game.crew.find((member) => member.status === "Ready");

    if (openSlotCount <= 0) {
      notify("All service bays are busy.");
      return;
    }
    if (!freeCrew) {
      notify("No crew is ready right now.");
      return;
    }
    if (game.parts < job.partsCost) {
      notify("Buy more parts before dispatching this call.");
      setPanel("shop");
      return;
    }

    const dispatchNow = Date.now();
    const next = cloneGame(game);
    const areaMatch = freeCrew.assignedArea === job.district;
    const speed = freeCrew.speed + ((freeCrew.pickupLevel || 1) - 1) * 0.08 + (game.truckLevel - 1) * 0.04 + (areaMatch ? 0.14 : 0) + (game.buildings.heavyPad ? 0.06 : 0);
    const duration = Math.max(8, Math.round(job.duration / speed));

    next.parts -= job.partsCost;
    next.openCalls = next.openCalls.filter((item) => item.id !== callId);
    next.activeJobs.push({
      id: newId(),
      callId,
      jobId: job.id,
      crewId: freeCrew.id,
      startedAt: dispatchNow,
      endsAt: dispatchNow + duration * 1000,
      stage: "Travel, repair, return",
      rushBonus: call.rushBonus,
    });
    next.crew = next.crew.map((member) => (member.id === freeCrew.id ? { ...member, status: "On Call" } : member));
    next.lastSavedAt = dispatchNow;
    pushLog(next, `${freeCrew.name} dispatched to ${job.title}.`);

    setGame(fillOpenCalls(next, maxOpenCalls(next)));
    setNow(dispatchNow);
    notify(`${freeCrew.name} is on the way.`);
  }

  function buyParts(amount) {
    if (!game) return;
    const price = game.buildings.partsDepot ? amount * 18 : amount * 24;
    if (game.parts + amount > storageCapacity(game)) {
      notify("Storage is full. Build a warehouse or upgrade the parts store.");
      setPanel("town");
      return;
    }
    if (game.coins < price) {
      notify("Not enough coins for that parts pack.");
      return;
    }

    const next = cloneGame(game);
    next.coins -= price;
    next.parts += amount;
    pushLog(next, `Bought ${amount} parts for ${price} coins.`);
    setGame(next);
    notify("Parts stocked.");
  }

  function sellParts(amount) {
    if (!game) return;
    if (game.parts < amount) {
      notify("Not enough excess parts to sell.");
      return;
    }

    const next = cloneGame(game);
    const earned = amount * 14;
    next.parts -= amount;
    next.coins += earned;
    pushLog(next, `Sold ${amount} excess parts for ${earned} coins.`);
    setGame(next);
    notify("Parts sold.");
  }

  function hireCrew() {
    if (!game) return;
    if (game.level < 5) {
      notify("The owner works alone until Level 5.");
      return;
    }
    if (game.crew.length >= crewLimit(game)) {
      notify(game.level < 21 ? "Only one technician unlocks before Level 21." : "Expand the globe or training system to fit more crew.");
      return;
    }

    const cost = 260 + game.crew.length * 160;
    if (game.coins < cost) {
      notify("Save more coins before hiring.");
      return;
    }

    const next = cloneGame(game);
    const name = pick(CREW_NAMES.filter((item) => !next.crew.some((member) => member.name === item)) || CREW_NAMES);
    next.coins -= cost;
    next.crew.push(createCrewMember(name, "Field Tech", 1 + Math.min(0.18, next.crew.length * 0.03)));
    pushLog(next, `${name} joined the crew.`);
    setGame(next);
    notify(`${name} is ready for calls.`);
  }

  function buyUpgrade(id) {
    if (!game) return;

    const next = cloneGame(game);
    let cost = 0;
    let money = 0;
    let parts = 0;
    let message = "";

    if (id === "bay") {
      cost = 320 + next.bays * 260;
      money = 20 + next.bays * 15;
      parts = 2 + next.bays;
      if (next.bays >= 4 + Math.floor(next.level / 10)) return notify("Build more town value to unlock extra bays.");
      message = "New service bay built.";
      next.bays += 1;
    }

    if (id === "truck") {
      cost = 80 + next.truckLevel * 60;
      money = 110 + next.truckLevel * 95;
      parts = 1 + next.truckLevel;
      if (next.truckLevel >= 20) return notify("Fleet trucks are ready for now.");
      message = "Response trucks upgraded.";
      next.truckLevel += 1;
    }

    if (id === "garage") {
      cost = 520 + next.garageLevel * 340;
      money = 60 + next.garageLevel * 45;
      parts = 4 + next.garageLevel * 2;
      if (next.garageLevel >= 50) return notify("Garage level is ready for now.");
      message = "Garage upgraded.";
      next.garageLevel += 1;
    }

    if (id === "partsStore") {
      cost = 300 + next.partsStoreLevel * 260;
      money = 50 + next.partsStoreLevel * 35;
      parts = 3 + next.partsStoreLevel;
      message = "Parts store upgraded.";
      next.partsStoreLevel += 1;
    }

    if (id === "training") {
      cost = 260 + next.trainingLevel * 210;
      money = 90 + next.trainingLevel * 55;
      parts = 2 + next.trainingLevel;
      message = "Training system upgraded.";
      next.trainingLevel += 1;
      next.crew = next.crew.map((member) => ({
        ...member,
        xp: member.xp + 70 * next.trainingLevel,
        morale: Math.min(100, (member.morale ?? 100) + 3),
        level: 1 + Math.floor((member.xp + 70 * next.trainingLevel) / 120),
      }));
    }

    if (id === "partsDepot") {
      cost = 560;
      parts = 6;
      if (next.buildings.partsDepot) return notify("Parts Depot is already built.");
      message = "Parts Depot built.";
      next.buildings.partsDepot = true;
    }

    if (id === "trainingCenter") {
      cost = 780;
      parts = 8;
      if (next.level < 3) return notify("Reach level 3 to build Training.");
      if (next.buildings.trainingCenter) return notify("Training is already built.");
      message = "Training Center built.";
      next.buildings.trainingCenter = true;
    }

    if (id === "dispatchOffice") {
      cost = 980;
      parts = 10;
      if (next.level < 4) return notify("Reach level 4 to build Dispatch.");
      if (next.buildings.dispatchOffice) return notify("Dispatch Office is already built.");
      message = "Dispatch Office built.";
      next.buildings.dispatchOffice = true;
    }

    if (id === "heavyPad") {
      cost = 1450;
      parts = 16;
      if (next.level < 5) return notify("Reach level 5 to build Heavy Recovery.");
      if (next.buildings.heavyPad) return notify("Heavy Recovery is already built.");
      message = "Heavy Recovery Pad built.";
      next.buildings.heavyPad = true;
    }

    if (id === "cityHub") {
      cost = 2400;
      parts = 24;
      if (next.level < 7) return notify("Reach level 7 to build the City Hub.");
      if (next.buildings.cityHub) return notify("City Hub is already built.");
      message = "City Hub built.";
      next.buildings.cityHub = true;
    }

    if (next.coins < cost || next.money < money || next.parts < parts) {
      notify(`Need ${cost} coins, ${money} money and ${parts} parts.`);
      return;
    }

    next.coins -= cost;
    next.money -= money;
    next.parts -= parts;
    next.xp += Math.round(cost / 18);
    next.level = levelFromXp(next.xp);
    pushLog(next, message);
    setGame(fillOpenCalls(next, maxOpenCalls(next)));
    notify(message);
  }

  function buildTown(buildingId) {
    if (!game) return;
    const building = getTownBuilding(buildingId);
    if (game.level < building.unlock) {
      notify(`Reach Level ${building.unlock} first.`);
      return;
    }
    if (game.coins < building.coins || game.money < building.money) {
      notify(`Need ${building.coins} coins and ${building.money} money.`);
      return;
    }

    const buildNow = Date.now();
    const next = cloneGame(game);
    next.coins -= building.coins;
    next.money -= building.money;
    next.townTiles.push({
      id: newId(),
      type: building.id,
      title: building.title,
      category: building.category,
      status: "building",
      value: building.value,
      color: building.color,
      family: building.family,
      createdAt: buildNow,
      completesAt: buildNow + building.buildTime * 1000,
    });
    pushLog(next, `${building.title} construction started.`);
    setGame(next);
    notify(`${building.title} is under construction.`);
  }

  function cutRibbon(tileId) {
    if (!game) return;
    const next = cloneGame(game);
    const tile = next.townTiles.find((item) => item.id === tileId);
    if (!tile || tile.status !== "ready") return;

    tile.status = "complete";
    next.reputation += tile.family ? 2 : 1;
    if (tile.type === "warehouse") next.buildings.partsDepot = true;
    if (tile.type === "trainingAcademy") next.buildings.trainingCenter = true;
    if (tile.type === "fuelStation") next.buildings.dispatchOffice = true;
    if (tile.type === "mall") next.buildings.cityHub = true;
    pushLog(next, `Ribbon cut. ${tile.title} is now open.`);
    setGame(fillOpenCalls(next, maxOpenCalls(next)));
    notify(`${tile.title} opened.`);
  }

  function paySalary(memberId) {
    if (!game) return;
    const member = game.crew.find((item) => item.id === memberId);
    if (!member || member.isOwner || !member.salaryDue) return;
    if (game.coins < member.salaryDue) {
      notify("Not enough coins to pay salary.");
      return;
    }

    const next = cloneGame(game);
    next.coins -= member.salaryDue;
    next.crew = next.crew.map((item) =>
      item.id === memberId ? { ...item, salaryDue: 0, morale: Math.min(100, (item.morale ?? 100) + 8) } : item
    );
    pushLog(next, `${member.name}'s salary was paid.`);
    setGame(next);
    notify("Salary paid.");
  }

  function upgradeCrewTruck(memberId) {
    if (!game) return;
    const member = game.crew.find((item) => item.id === memberId);
    if (!member) return;
    const cost = 65 + (member.pickupLevel || 1) * 55;
    if (game.money < cost) {
      notify(`Need ${cost} money to upgrade this pickup.`);
      return;
    }

    const next = cloneGame(game);
    next.money -= cost;
    next.crew = next.crew.map((item) =>
      item.id === memberId ? { ...item, pickupLevel: (item.pickupLevel || 1) + 1, speed: item.speed + 0.03, morale: Math.min(100, (item.morale ?? 100) + 2) } : item
    );
    setGame(next);
    notify(`${member.name}'s pickup upgraded.`);
  }

  function claimGoal(goalId) {
    if (!game) return;
    const goal = GOALS.find((item) => item.id === goalId);
    if (!goal || game.claimedGoals.includes(goal.id) || !goal.check(game)) return;

    const next = cloneGame(game);
    next.claimedGoals.push(goal.id);
    next.coins += goal.reward.coins;
    next.money += goal.reward.money || 0;
    next.parts += goal.reward.parts;
    next.xp += goal.reward.xp;
    next.level = levelFromXp(next.xp);
    pushLog(next, `Goal complete: ${goal.title}.`);
    setGame(fillOpenCalls(next, maxOpenCalls(next)));
    notify("Goal reward collected.");
  }

  function resetGame() {
    const confirmed = window.confirm("Start a fresh FleetFix yard?");
    if (!confirmed) return;
    localStorage.removeItem(SAVE_KEY);
    setGame(null);
    setPanel("calls");
    setAwayReport(null);
  }

  if (!ready) {
    return (
      <main className="loadingScreen">
        <div className="loadingLogo">FleetFix</div>
      </main>
    );
  }

  if (!game) {
    return <StartScreen onStart={startGame} />;
  }

  const nextLevel = xpForLevel(game.level + 1);
  const currentLevel = xpForLevel(game.level);
  const levelProgress = Math.round(((game.xp - currentLevel) / Math.max(1, nextLevel - currentLevel)) * 100);
  const activeCrew = game.crew.filter((member) => member.status === "On Call").length;

  return (
    <main className="appShell">
      <header className="topBar">
        <div>
          <p className="eyebrow">{game.cityName}</p>
          <h1>{game.companyName}</h1>
        </div>
        <div className="resourceBar" aria-label="Current resources">
          <Resource label="Coins" value={game.coins} />
          <Resource label="Money" value={game.money} />
          <Resource label="Parts" value={game.parts} />
          <Resource label="Rep" value={game.reputation} />
          <Resource label="Level" value={game.level} />
        </div>
      </header>

      <section className="playSurface">
        <div className="sceneBand">
          <FleetScene game={game} />
          <div className="sceneOverlay">
            <div>
              <span className="sceneKicker">3D Fleet Yard</span>
              <strong>{activeCrew ? `${activeCrew} crew on calls` : "Crew ready"}</strong>
            </div>
            <div className="sceneStats">
              <span>{game.bays} bays</span>
              <span>Truck L{game.truckLevel}</span>
              <span>{townValue(game)} value</span>
            </div>
          </div>
        </div>

        <aside className="commandPanel">
          <div className="levelPanel">
            <div>
              <span>Level {game.level}</span>
              <strong>{levelProgress}%</strong>
            </div>
            <div className="barTrack">
              <div className="barFill" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>

          {notice && <div className="notice">{notice}</div>}

          <div className="activeList">
            <h2>Active Calls</h2>
            {game.activeJobs.length === 0 ? (
              <p className="quiet">No trucks out. Pick a call and start earning.</p>
            ) : (
              game.activeJobs.map((active) => {
                const job = getJob(active.jobId);
                const crew = game.crew.find((member) => member.id === active.crewId);
                return (
                  <div className="activeJob" key={active.id}>
                    <div>
                      <strong>{job.title}</strong>
                      <span>{crew?.name || "Crew"} to {job.district}</span>
                    </div>
                    <span>{formatTime(active.endsAt - now)}</span>
                    <div className="barTrack">
                      <div className="barFill greenFill" style={{ width: `${progressFor(active, now)}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </section>

      <nav className="tabBar" aria-label="Game sections">
        {TABS.map((tab) => (
          <button className={panel === tab.id ? "tabButton active" : "tabButton"} key={tab.id} onClick={() => setPanel(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="panelArea">
        {panel === "calls" && <CallsPanel game={game} now={now} onDispatch={dispatchCall} />}
        {panel === "town" && <TownPanel game={game} now={now} onBuild={buildTown} onRibbon={cutRibbon} />}
        {panel === "garage" && <GaragePanel game={game} onUpgrade={buyUpgrade} />}
        {panel === "crew" && <CrewPanel game={game} onHire={hireCrew} onPaySalary={paySalary} onUpgradeTruck={upgradeCrewTruck} />}
        {panel === "shop" && <ShopPanel game={game} onBuyParts={buyParts} onSellParts={sellParts} />}
        {panel === "goals" && <GoalsPanel game={game} onClaim={claimGoal} onReset={resetGame} />}
      </section>

      {awayReport && <AwayDialog report={awayReport} onClose={() => setAwayReport(null)} />}
    </main>
  );
}

function StartScreen({ onStart }) {
  const [companyName, setCompanyName] = useState("FleetFix Yard");
  const [managerName, setManagerName] = useState("Owner");
  const [cityName, setCityName] = useState("Starter City");
  const [countryName, setCountryName] = useState("Repair Nation");

  return (
    <main className="startScreen">
      <section className="startScene" aria-hidden="true">
        <div className="startGarage" />
        <div className="startRoad" />
        <div className="startTruck" />
      </section>
      <form
        className="startForm"
        onSubmit={(event) => {
          event.preventDefault();
          onStart({ companyName, managerName, cityName, countryName });
        }}
      >
        <p className="eyebrow">FleetFix Tycoon</p>
        <h1>Build the repair yard.</h1>
        <label>
          Company
          <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
        </label>
        <label>
          Manager
          <input value={managerName} onChange={(event) => setManagerName(event.target.value)} />
        </label>
        <label>
          City
          <input value={cityName} onChange={(event) => setCityName(event.target.value)} />
        </label>
        <label>
          Country / World
          <input value={countryName} onChange={(event) => setCountryName(event.target.value)} />
        </label>
        <button type="submit" className="primaryButton">
          Start Yard
        </button>
      </form>
    </main>
  );
}

function Resource({ label, value }) {
  return (
    <div className="resource">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CallsPanel({ game, now, onDispatch }) {
  return (
    <div className="gridCards">
      {game.openCalls.map((call) => {
        const job = getJob(call.jobId);
        return (
          <article className={`gameCard ${job.className}`} key={call.id}>
            <div className="cardTop">
              <span>{job.district}</span>
              <strong>{job.charity ? "Trust call" : `+${job.coins + call.rushBonus}`}</strong>
            </div>
            <h2>{job.title}</h2>
            <p>{job.vehicle} · {job.skill} · {job.part}</p>
            <dl>
              <div>
                <dt>Time</dt>
                <dd>{formatTime(job.duration * 1000)}</dd>
              </div>
              <div>
                <dt>Parts</dt>
                <dd>{job.partsCost}</dd>
              </div>
              <div>
                <dt>Money</dt>
                <dd>{job.money}</dd>
              </div>
              <div>
                <dt>XP</dt>
                <dd>{job.xp}</dd>
              </div>
            </dl>
            <button className="primaryButton" onClick={() => onDispatch(call.id)}>
              Dispatch
            </button>
          </article>
        );
      })}

      {game.activeJobs.length > 0 && (
        <article className="gameCard wideCard">
          <h2>Trucks Out</h2>
          {game.activeJobs.map((active) => {
            const job = getJob(active.jobId);
            return (
              <div className="jobRow" key={active.id}>
                <span>{job.title}</span>
                <strong>{formatTime(active.endsAt - now)}</strong>
              </div>
            );
          })}
        </article>
      )}
    </div>
  );
}

function TownPanel({ game, now, onBuild, onRibbon }) {
  const readyTiles = (game.townTiles || []).filter((tile) => tile.status === "ready");

  return (
    <div className="townLayout">
      <article className="gameCard wideCard">
        <div className="cardTop">
          <span>{game.countryName}</span>
          <strong>{townValue(game)} town value</strong>
        </div>
        <h2>{game.cityName}</h2>
        <p>Build homes, safety, storage, training and services around the repair yard so crews and families can live near the business.</p>
        <dl>
          <div>
            <dt>Storage</dt>
            <dd>{game.parts}/{storageCapacity(game)}</dd>
          </div>
          <div>
            <dt>Areas</dt>
            <dd>{game.unlockedAreas}</dd>
          </div>
          <div>
            <dt>Ribbon</dt>
            <dd>{readyTiles.length}</dd>
          </div>
        </dl>
      </article>

      {readyTiles.map((tile) => (
        <article className="gameCard ribbonCard" key={tile.id}>
          <div className="cardTop">
            <span>Ribbon Cutting</span>
            <strong>Ready</strong>
          </div>
          <h2>{tile.title}</h2>
          <p>This reward moment is only for completed constructions, not roads or decorations.</p>
          <button className="primaryButton" onClick={() => onRibbon(tile.id)}>
            Open Building
          </button>
        </article>
      ))}

      <article className="gameCard wideCard">
        <h2>Current Town</h2>
        <div className="tileList">
          {(game.townTiles || []).map((tile) => (
            <div className={`townTile ${tile.status}`} key={tile.id}>
              <span style={{ background: tile.color || "#58b7d3" }} />
              <div>
                <strong>{tile.title}</strong>
                <small>
                  {tile.status === "building" ? `${formatTime(tile.completesAt - now)} left` : tile.status === "ready" ? "Ready for ribbon" : "Open"}
                </small>
              </div>
            </div>
          ))}
        </div>
      </article>

      {TOWN_BUILDINGS.map((building) => (
        <article className="gameCard" key={building.id}>
          <div className="cardTop">
            <span>{building.category}</span>
            <strong>L{building.unlock}</strong>
          </div>
          <h2>{building.title}</h2>
          <p>{building.family ? "Supports teams and their families." : building.category === "road" ? "Connects the town and future zones." : "Improves the town plan."}</p>
          <dl>
            <div>
              <dt>Coins</dt>
              <dd>{building.coins}</dd>
            </div>
            <div>
              <dt>Money</dt>
              <dd>{building.money}</dd>
            </div>
            <div>
              <dt>Build</dt>
              <dd>{formatTime(building.buildTime * 1000)}</dd>
            </div>
          </dl>
          <button className="secondaryButton" disabled={game.level < building.unlock} onClick={() => onBuild(building.id)}>
            Build
          </button>
        </article>
      ))}
    </div>
  );
}

function GaragePanel({ game, onUpgrade }) {
  const upgrades = [
    {
      id: "bay",
      title: "Service Bay",
      text: `${game.bays} built. More bays let you run more calls.`,
      cost: `${320 + game.bays * 260} coins, ${20 + game.bays * 15} money, ${2 + game.bays} parts`,
      disabled: false,
    },
    {
      id: "truck",
      title: "Response Trucks",
      text: `Level ${game.truckLevel}. Faster trucks shorten travel and return time.`,
      cost: `${80 + game.truckLevel * 60} coins, ${110 + game.truckLevel * 95} money, ${1 + game.truckLevel} parts`,
      disabled: false,
    },
    {
      id: "garage",
      title: "Main Garage",
      text: `Level ${game.garageLevel}. Raises payout and idle income forever.`,
      cost: `${520 + game.garageLevel * 340} coins, ${60 + game.garageLevel * 45} money, ${4 + game.garageLevel * 2} parts`,
      disabled: false,
    },
    {
      id: "partsStore",
      title: "Parts Store",
      text: `Level ${game.partsStoreLevel}. Raises storage capacity.`,
      cost: `${300 + game.partsStoreLevel * 260} coins, ${50 + game.partsStoreLevel * 35} money, ${3 + game.partsStoreLevel} parts`,
      disabled: false,
    },
    {
      id: "training",
      title: "Training System",
      text: `Level ${game.trainingLevel}. Trains every technician and improves morale.`,
      cost: `${260 + game.trainingLevel * 210} coins, ${90 + game.trainingLevel * 55} money, ${2 + game.trainingLevel} parts`,
      disabled: false,
    },
    {
      id: "partsDepot",
      title: "Parts Depot",
      text: "Cheaper parts and small parts income.",
      cost: game.buildings.partsDepot ? "Built" : "560 coins, 6 parts",
      disabled: game.buildings.partsDepot,
    },
    {
      id: "trainingCenter",
      title: "Training Center",
      text: "Higher crew limit. Unlocks at level 3.",
      cost: game.buildings.trainingCenter ? "Built" : "780 coins, 8 parts",
      disabled: game.buildings.trainingCenter,
    },
    {
      id: "dispatchOffice",
      title: "Dispatch Office",
      text: "More calls on the board. Unlocks at level 4.",
      cost: game.buildings.dispatchOffice ? "Built" : "980 coins, 10 parts",
      disabled: game.buildings.dispatchOffice,
    },
    {
      id: "heavyPad",
      title: "Heavy Recovery Pad",
      text: "Adds one heavy call slot. Unlocks at level 5.",
      cost: game.buildings.heavyPad ? "Built" : "1450 coins, 16 parts",
      disabled: game.buildings.heavyPad,
    },
    {
      id: "cityHub",
      title: "City Hub",
      text: "Bigger city operation. Unlocks at level 7.",
      cost: game.buildings.cityHub ? "Built" : "2400 coins, 24 parts",
      disabled: game.buildings.cityHub,
    },
  ];

  return (
    <div className="gridCards">
      {upgrades.map((upgrade) => (
        <article className="gameCard" key={upgrade.id}>
          <div className="cardTop">
            <span>{upgrade.title}</span>
            <strong>{upgrade.cost}</strong>
          </div>
          <p>{upgrade.text}</p>
          <button className="secondaryButton" disabled={upgrade.disabled} onClick={() => onUpgrade(upgrade.id)}>
            {upgrade.disabled ? "Owned" : "Build"}
          </button>
        </article>
      ))}
    </div>
  );
}

function CrewPanel({ game, onHire, onPaySalary, onUpgradeTruck }) {
  const cost = 260 + game.crew.length * 160;

  return (
    <div className="gridCards">
      <article className="gameCard wideCard">
        <div className="cardTop">
          <span>Crew Capacity</span>
          <strong>{game.crew.length}/{crewLimit(game)}</strong>
        </div>
        <button className="primaryButton" onClick={onHire}>
          Hire Crew - {cost} coins
        </button>
        <p>{game.level < 5 ? "Owner works alone until Level 5." : game.level < 21 ? "Only one technician is allowed before Level 21." : "Global expansion now increases crew capacity."}</p>
      </article>
      {game.crew.map((member) => (
        <article className="gameCard" key={member.id}>
          <div className="crewAvatar">{member.name.slice(0, 2).toUpperCase()}</div>
          <h2>{member.name}</h2>
          <p>{member.role} · {member.skill} · {member.assignedArea}</p>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{member.status}</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{member.level}</dd>
            </div>
            <div>
              <dt>Energy</dt>
              <dd>{member.energy}%</dd>
            </div>
            <div>
              <dt>Morale</dt>
              <dd>{member.morale}%</dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>L{member.pickupLevel}</dd>
            </div>
            <div>
              <dt>Salary Due</dt>
              <dd>{member.salaryDue || 0}</dd>
            </div>
          </dl>
          {!member.isOwner && (
            <div className="buttonRow">
              <button className="secondaryButton" onClick={() => onUpgradeTruck(member.id)}>
                Upgrade Pickup
              </button>
              <button className="primaryButton" disabled={!member.salaryDue} onClick={() => onPaySalary(member.id)}>
                Pay Salary
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function ShopPanel({ game, onBuyParts, onSellParts }) {
  const price = game.buildings.partsDepot ? 90 : 120;
  const unlockedParts = PART_CATALOG.filter((part) => part.unlock <= game.level);

  return (
    <div className="gridCards">
      <article className="gameCard">
        <div className="cardTop">
          <span>Parts Pack</span>
          <strong>{price} coins</strong>
        </div>
        <h2>5 repair parts</h2>
        <p>Used by dispatch calls. Storage: {game.parts}/{storageCapacity(game)}</p>
        <button className="primaryButton" onClick={() => onBuyParts(5)}>
          Buy 5
        </button>
      </article>
      <article className="gameCard">
        <div className="cardTop">
          <span>Bulk Stock</span>
          <strong>{price * 3} coins</strong>
        </div>
        <h2>15 repair parts</h2>
        <p>Best for running several calls before upgrading.</p>
        <button className="primaryButton" onClick={() => onBuyParts(15)}>
          Buy 15
        </button>
      </article>
      <article className="gameCard">
        <div className="cardTop">
          <span>Sell Excess</span>
          <strong>+140 coins</strong>
        </div>
        <h2>10 repair parts</h2>
        <p>Sell only when storage is crowded or salaries are due.</p>
        <button className="secondaryButton" onClick={() => onSellParts(10)}>
          Sell 10
        </button>
      </article>
      <article className="gameCard wideCard">
        <h2>Unlocked Part Lines</h2>
        <div className="partGrid">
          {unlockedParts.map((part) => (
            <div className="partPill" key={part.name}>
              <strong>{part.name}</strong>
              <span>Buy {part.buy} · Sell {part.sell}</span>
            </div>
          ))}
        </div>
      </article>
      <article className="gameCard wideCard">
        <h2>Yard Log</h2>
        <div className="logList">
          {game.log.map((item, index) => (
            <p key={`${item}-${index}`}>{item}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

function GoalsPanel({ game, onClaim, onReset }) {
  return (
    <div className="gridCards">
      {GOALS.map((goal) => {
        const ready = goal.check(game);
        const claimed = game.claimedGoals.includes(goal.id);
        return (
          <article className={ready ? "gameCard goalReady" : "gameCard"} key={goal.id}>
            <div className="cardTop">
              <span>{claimed ? "Collected" : ready ? "Ready" : "Goal"}</span>
              <strong>+{goal.reward.coins}</strong>
            </div>
            <h2>{goal.title}</h2>
            <p>{goal.reward.money || 0} money, {goal.reward.parts} parts and {goal.reward.xp} XP</p>
            <button className="primaryButton" disabled={!ready || claimed} onClick={() => onClaim(goal.id)}>
              {claimed ? "Done" : "Collect"}
            </button>
          </article>
        );
      })}
      <article className="gameCard dangerCard">
        <h2>Fresh Yard</h2>
        <p>Clears local progress on this browser.</p>
        <button className="dangerButton" onClick={onReset}>
          Reset Game
        </button>
      </article>
    </div>
  );
}

function AwayDialog({ report, onClose }) {
  return (
    <div className="dialogBackdrop">
      <section className="dialog">
        <p className="eyebrow">While You Were Away</p>
        <h2>FleetFix kept moving.</h2>
        <div className="awayGrid">
          <Resource label="Calls" value={report.completed} />
          <Resource label="Coins" value={report.coins} />
          <Resource label="Money" value={report.money} />
          <Resource label="Parts" value={report.parts} />
          <Resource label="XP" value={report.xp} />
        </div>
        {report.calls > 0 && <p>{report.calls} new calls reached the board.</p>}
        {report.construction > 0 && <p>{report.construction} construction project moved forward.</p>}
        <button className="primaryButton" onClick={onClose}>
          Collect
        </button>
      </section>
    </div>
  );
}

function FleetScene({ game }) {
  const mountRef = useRef(null);
  const signature = useMemo(
    () =>
      [
        game.garageLevel,
        game.bays,
        game.truckLevel,
        game.activeJobs.length,
        game.buildings.partsDepot,
        game.buildings.trainingCenter,
        game.buildings.dispatchOffice,
        game.buildings.heavyPad,
        game.buildings.cityHub,
        (game.townTiles || []).map((tile) => `${tile.type}-${tile.status}`).join(","),
      ].join("|"),
    [game]
  );

  useEffect(() => {
    let disposed = false;
    let renderer;
    let scene;
    let camera;
    let frameId;
    const mount = mountRef.current;
    const vehicles = [];
    const disposables = [];

    async function boot() {
      const THREE = await import("three");
      if (disposed || !mount) return;

      scene = new THREE.Scene();
      scene.background = new THREE.Color("#b8e3ff");
      scene.fog = new THREE.Fog("#b8e3ff", 28, 62);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);

      camera = new THREE.OrthographicCamera(-18, 18, 12, -12, 0.1, 120);
      camera.position.set(21, 18, 22);
      camera.lookAt(0, 0, 0);

      const hemi = new THREE.HemisphereLight("#ffffff", "#31513c", 2.25);
      scene.add(hemi);

      const sun = new THREE.DirectionalLight("#fff6d8", 2.2);
      sun.position.set(14, 22, 10);
      sun.castShadow = true;
      sun.shadow.mapSize.width = 1024;
      sun.shadow.mapSize.height = 1024;
      scene.add(sun);

      const mat = (color, roughness = 0.74) => {
        const material = new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 });
        disposables.push(material);
        return material;
      };

      const grass = mat("#64bd61");
      const deepGrass = mat("#43a956");
      const water = mat("#55b7ee", 0.45);
      const field = mat("#d9c35d");
      const fieldGreen = mat("#8fd163");
      const asphalt = mat("#27313a");
      const stripe = mat("#f8d76a");
      const concrete = mat("#d9e0e5");
      const red = mat("#d83a34");
      const cream = mat("#f9f2dc");
      const blue = mat("#2f80ed");
      const teal = mat("#0f9f8d");
      const amber = mat("#f4a62a");
      const slate = mat("#3d4856");
      const glass = mat("#8bd3ff", 0.35);
      const tire = mat("#15191f");

      function addBox(name, size, position, material, cast = true) {
        const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
        disposables.push(geometry);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = name;
        mesh.position.set(position[0], position[1], position[2]);
        mesh.castShadow = cast;
        mesh.receiveShadow = true;
        scene.add(mesh);
        return mesh;
      }

      addBox("ground", [42, 0.45, 28], [0, -0.25, 0], grass, false);
      addBox("river", [5.5, 0.08, 25], [17.6, 0.02, -0.8], water, false);
      addBox("field-a", [5.2, 0.08, 3.8], [-15.2, 0.04, 6.4], field, false);
      addBox("field-b", [4.2, 0.08, 3.6], [-14.2, 0.05, 1.3], fieldGreen, false);
      addBox("main-road", [36, 0.08, 3.2], [0, 0.03, 1.5], asphalt, false);
      addBox("cross-road", [3.2, 0.08, 20], [-4.8, 0.04, -1], asphalt, false);
      addBox("yard-pad", [12, 0.1, 8], [-8.2, 0.08, -4.8], concrete, false);
      addBox("service-pad", [15, 0.1, 6], [5.8, 0.08, -4.7], concrete, false);

      for (let i = -2; i <= 2; i += 1) {
        addBox(`stripe-${i}`, [1.6, 0.1, 0.12], [i * 5, 0.12, 1.5], stripe, false);
      }

      [
        [-17, 0, -8],
        [-14, 0, -7.1],
        [-12, 0, 7.5],
        [-9.3, 0, 7.8],
        [12.8, 0, -8.6],
        [14.8, 0, -6.7],
        [15.4, 0, 7.2],
      ].forEach((position, index) => addTree(THREE, scene, disposables, position, deepGrass, mat(index % 2 ? "#2f8f4f" : "#3fa85e"), mat("#8b5a2b")));

      addBuilding(addBox, "main-garage", [-10.5, 1.35, -5.2], [4.6, 2.7, 4.2], cream, red, glass);
      addBuilding(addBox, "office", [-5.8, 1.05, -6.1], [2.4, 2.1, 2.8], cream, slate, glass);

      for (let bay = 0; bay < game.bays; bay += 1) {
        addBuilding(addBox, `bay-${bay}`, [1.7 + bay * 3.3, 1.05, -5.3], [2.7, 2.1, 3.2], cream, red, glass);
      }

      if (game.buildings.partsDepot) addBuilding(addBox, "parts-depot", [10.8, 1.05, -6], [3, 2.1, 3.2], teal, slate, glass);
      if (game.buildings.trainingCenter) addBuilding(addBox, "training", [9.4, 1.15, 5.4], [3.5, 2.3, 3.3], blue, slate, glass);
      if (game.buildings.dispatchOffice) addBuilding(addBox, "dispatch", [-11.2, 1.15, 4.6], [3.4, 2.3, 3.2], amber, slate, glass);
      if (game.buildings.heavyPad) addBox("heavy-pad", [5.2, 0.16, 3.8], [1.6, 0.15, 6.2], slate, false);
      if (game.buildings.cityHub) addBuilding(addBox, "city-hub", [14.1, 1.7, 3.2], [3.2, 3.4, 3.2], blue, red, glass);

      const townPositions = [
        [-14.2, 1.0, -1.9],
        [-12.1, 1.0, 4.2],
        [-8.1, 1.0, 5.8],
        [-2.8, 1.0, 6.4],
        [5.2, 1.0, 6.6],
        [12.8, 1.0, 5.8],
        [13.6, 1.0, -2.0],
        [-15.8, 1.0, -6.1],
      ];
      (game.townTiles || [])
        .filter((tile) => !["garage", "partsStore", "clinic", "road"].includes(tile.type))
        .slice(0, townPositions.length)
        .forEach((tile, index) => {
          if (tile.category === "road") {
            addBox(`town-road-${tile.id}`, [4.8, 0.09, 1.25], [townPositions[index][0], 0.09, townPositions[index][2]], asphalt, false);
          } else if (tile.category === "decoration") {
            addTree(THREE, scene, disposables, [townPositions[index][0], 0, townPositions[index][2]], deepGrass, mat(tile.color || "#3fa85e"), mat("#8b5a2b"));
          } else {
            addTownBuilding(addBox, `town-${tile.id}`, [townPositions[index][0], 0.9, townPositions[index][2]], tile, cream, mat(tile.color || "#58b7d3"), glass);
          }
        });

      const idleCount = Math.max(1, Math.min(game.truckLevel, 3));
      for (let i = 0; i < idleCount; i += 1) {
        const truck = createTruck(THREE, red, cream, glass, tire, i % 2 ? "#2f80ed" : "#d83a34");
        truck.position.set(-3 + i * 2.2, 0.48, -0.3);
        truck.rotation.y = Math.PI / 2;
        scene.add(truck);
      }

      const movingCount = game.activeJobs.length;
      for (let i = 0; i < movingCount; i += 1) {
        const truck = createTruck(THREE, red, cream, glass, tire, i % 2 ? "#0f9f8d" : "#d83a34");
        truck.userData.offset = i * 8;
        truck.userData.lane = i % 2 === 0 ? 0.45 : 2.25;
        scene.add(truck);
        vehicles.push(truck);
      }

      function resize() {
        if (!renderer || !camera || !mount) return;
        const width = Math.max(320, mount.clientWidth);
        const height = Math.max(320, mount.clientHeight);
        const aspect = width / height;
        const zoom = 12.4;
        camera.left = -zoom * aspect;
        camera.right = zoom * aspect;
        camera.top = zoom;
        camera.bottom = -zoom;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }

      function animate() {
        if (disposed) return;
        const time = performance.now() / 1000;
        vehicles.forEach((truck, index) => {
          const loop = (time * (2.6 + game.truckLevel * 0.18) + truck.userData.offset) % 34;
          truck.position.x = -17 + loop;
          truck.position.y = 0.54 + Math.sin(time * 5 + index) * 0.02;
          truck.position.z = truck.userData.lane;
          truck.rotation.y = Math.PI / 2;
          truck.children.forEach((child) => {
            if (child.userData.wheel) child.rotation.x -= 0.18;
          });
        });
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      }

      resize();
      window.addEventListener("resize", resize);
      animate();

      disposables.push({
        dispose: () => window.removeEventListener("resize", resize),
      });
    }

    boot();

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      disposables.forEach((item) => item.dispose?.());
      if (renderer) {
        renderer.dispose();
        renderer.domElement?.parentNode?.removeChild(renderer.domElement);
      }
      if (scene) {
        scene.traverse((object) => {
          object.geometry?.dispose?.();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
          else object.material?.dispose?.();
        });
      }
    };
  }, [signature, game.truckLevel]);

  return <div className="threeYard" ref={mountRef} aria-label="Animated 3D FleetFix yard" />;
}

function addBuilding(addBox, name, position, size, wallMaterial, roofMaterial, glassMaterial) {
  addBox(`${name}-body`, size, position, wallMaterial);
  addBox(`${name}-roof`, [size[0] + 0.4, 0.45, size[2] + 0.5], [position[0], position[1] + size[1] / 2 + 0.25, position[2]], roofMaterial);
  addBox(`${name}-door`, [0.75, 1.15, 0.08], [position[0], 0.7, position[2] + size[2] / 2 + 0.05], glassMaterial);
}

function addTownBuilding(addBox, name, position, tile, wallMaterial, roofMaterial, glassMaterial) {
  const height = tile.status === "building" ? 1.2 : tile.type === "apartment" || tile.type === "mall" ? 3.0 : 1.9;
  const width = tile.type === "mall" ? 3.8 : tile.type === "hospital" || tile.type === "school" ? 3.2 : 2.3;
  const depth = tile.type === "mall" ? 3.2 : 2.2;
  addBox(`${name}-base`, [width + 0.5, 0.14, depth + 0.5], [position[0], 0.12, position[2]], wallMaterial, false);
  addBox(`${name}-body`, [width, height, depth], [position[0], height / 2 + 0.15, position[2]], wallMaterial);
  addBox(`${name}-roof`, [width + 0.35, 0.42, depth + 0.35], [position[0], height + 0.55, position[2]], roofMaterial);
  addBox(`${name}-door`, [0.48, 0.72, 0.08], [position[0], 0.56, position[2] + depth / 2 + 0.05], glassMaterial);
  if (tile.status === "ready") {
    addBox(`${name}-ribbon`, [width + 0.5, 0.1, 0.12], [position[0], 0.98, position[2] + depth / 2 + 0.13], roofMaterial);
  }
}

function addTree(THREE, scene, disposables, position, shadowMaterial, leafMaterial, trunkMaterial) {
  const trunkGeometry = new THREE.CylinderGeometry(0.13, 0.18, 0.7, 8);
  const leafGeometry = new THREE.ConeGeometry(0.62, 1.2, 8);
  disposables.push(trunkGeometry, leafGeometry);

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.72, 16), shadowMaterial);
  disposables.push(shadow.geometry);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(position[0], 0.08, position[2]);
  shadow.receiveShadow = true;
  scene.add(shadow);

  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(position[0], 0.42, position[2]);
  trunk.castShadow = true;
  scene.add(trunk);

  const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
  leaves.position.set(position[0], 1.24, position[2]);
  leaves.castShadow = true;
  scene.add(leaves);
}

function createTruck(THREE, redMaterial, creamMaterial, glassMaterial, tireMaterial, accentColor) {
  const group = new THREE.Group();
  const accent = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.55 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.62, 0.86), redMaterial);
  body.position.y = 0.5;
  body.castShadow = true;
  group.add(body);

  const bed = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.56, 0.78), creamMaterial);
  bed.position.set(-0.38, 0.88, 0);
  bed.castShadow = true;
  group.add(bed);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.78, 0.78), accent);
  cab.position.set(0.58, 0.9, 0);
  cab.castShadow = true;
  group.add(cab);

  const window = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.64), glassMaterial);
  window.position.set(0.96, 0.98, 0);
  group.add(window);

  const wheelGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 18);
  const wheelPositions = [
    [-0.58, 0.28, -0.48],
    [0.58, 0.28, -0.48],
    [-0.58, 0.28, 0.48],
    [0.58, 0.28, 0.48],
  ];

  wheelPositions.forEach((position) => {
    const wheel = new THREE.Mesh(wheelGeometry, tireMaterial);
    wheel.position.set(position[0], position[1], position[2]);
    wheel.rotation.z = Math.PI / 2;
    wheel.userData.wheel = true;
    wheel.castShadow = true;
    group.add(wheel);
  });

  return group;
}
