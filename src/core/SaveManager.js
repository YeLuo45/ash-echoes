// Dual-key save system for Classic and Roguelite modes
import { SeededRandom } from './SeededRandom.js';

export class SaveManager {
  constructor() {
    this.CLASSIC_PREFIX = 'ash_classic_';
    this.ROGUELITE_PREFIX = 'ash_roguelite_';
  }

  // Classic mode saves
  saveClassicChapter(chapter, level, playerData) {
    const key = `${this.CLASSIC_PREFIX}chapter_${chapter}`;
    localStorage.setItem(key, JSON.stringify({
      chapter,
      level,
      playerData,
      timestamp: Date.now()
    }));
  }

  loadClassicChapter(chapter) {
    const key = `${this.CLASSIC_PREFIX}chapter_${chapter}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  saveClassicProgress(chapter, levelIndex, unlockedWeapons, unlockedPassives) {
    const key = `${this.CLASSIC_PREFIX}progress`;
    const existing = this.loadClassicProgress();
    const progress = existing || { chapters: {}, unlockedWeapons: [], unlockedPassives: [] };
    if (!progress.chapters[chapter]) progress.chapters[chapter] = {};
    progress.chapters[chapter].lastLevel = levelIndex;
    if (unlockedWeapons) progress.unlockedWeapons = unlockedWeapons;
    if (unlockedPassives) progress.unlockedPassives = unlockedPassives;
    progress.timestamp = Date.now();
    localStorage.setItem(key, JSON.stringify(progress));
  }

  loadClassicProgress() {
    const key = `${this.CLASSIC_PREFIX}progress`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Roguelite permanent unlocks
  saveRogueliteUnlocks(unlocks) {
    const key = `${this.ROGUELITE_PREFIX}unlocks`;
    localStorage.setItem(key, JSON.stringify({
      ...unlocks,
      timestamp: Date.now()
    }));
  }

  loadRogueliteUnlocks() {
    const key = `${this.ROGUELITE_PREFIX}unlocks`;
    const data = localStorage.getItem(key);
    if (data) {
      const d = JSON.parse(data);
      return {
        unlockedWeapons: d.unlockedWeapons || ['pistol'],
        unlockedPassives: d.unlockedPassives || [],
        bonusStartingEnergy: d.bonusStartingEnergy || 0,
        entropyCrystals: d.entropyCrystals || 0
      };
    }
    return {
      unlockedWeapons: ['pistol'],
      unlockedPassives: [],
      bonusStartingEnergy: 0,
      entropyCrystals: 0
    };
  }

  // Roguelite run save (for mid-run continue)
  saveRogueliteRun(runData) {
    const key = `${this.ROGUELITE_PREFIX}run`;
    localStorage.setItem(key, JSON.stringify({
      ...runData,
      timestamp: Date.now()
    }));
  }

  loadRogueliteRun() {
    const key = `${this.ROGUELITE_PREFIX}run`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  clearRogueliteRun() {
    const key = `${this.ROGUELITE_PREFIX}run`;
    localStorage.removeItem(key);
  }

  // Daily challenge leaderboard
  saveDailyScore(seed, score) {
    const key = SeededRandom.leaderboardKey();
    let board = this.loadDailyLeaderboard();
    board.push({ score, timestamp: Date.now() });
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(board));
  }

  loadDailyLeaderboard() {
    const key = SeededRandom.leaderboardKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // Add entropy crystals (roguelite currency)
  addEntropyCrystals(amount) {
    const unlocks = this.loadRogueliteUnlocks();
    unlocks.entropyCrystals += amount;
    this.saveRogueliteUnlocks(unlocks);
    return unlocks.entropyCrystals;
  }

  spendEntropyCrystals(amount) {
    const unlocks = this.loadRogueliteUnlocks();
    if (unlocks.entropyCrystals >= amount) {
      unlocks.entropyCrystals -= amount;
      this.saveRogueliteUnlocks(unlocks);
      return true;
    }
    return false;
  }
}
