import { SaveManager } from '../core/SaveManager.js';

export const PERMANENT_UNLOCKS = {
  // Unlockable weapons (cost in entropy crystals)
  weapons: {
    pistol: { cost: 0, unlockable: false }, // Default
    echo_blade: { cost: 80, unlockable: true },
    scatter_gun: { cost: 60, unlockable: true },
    resonance_cannon: { cost: 100, unlockable: true },
  },
  // Unlockable passives
  passives: {
    resonance_boost: { cost: 40, unlockable: true },
    vital_strike: { cost: 50, unlockable: true },
    echo_mastery: { cost: 45, unlockable: true },
    rapid_fire: { cost: 40, unlockable: true },
    dash_master: { cost: 55, unlockable: true },
    corruption_shield: { cost: 50, unlockable: true },
  },
  // Starting bonuses
  bonuses: {
    extra_starting_energy: { id: 'bonusStartingEnergy', cost: 30, max: 5, desc: '初始共振+10' },
    extra_starting_hp: { id: 'bonusStartingHP', cost: 35, max: 3, desc: '初始HP+20' },
  },
};

export class PermanentUnlockManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.unlocks = saveManager.loadRogueliteUnlocks();
  }

  getUnlockedWeapons() {
    return this.unlocks.unlockedWeapons || ['pistol'];
  }

  getUnlockedPassives() {
    return this.unlocks.unlockedPassives || [];
  }

  getBonusStartingEnergy() {
    return this.unlocks.bonusStartingEnergy || 0;
  }

  getEntropyCrystals() {
    return this.unlocks.entropyCrystals || 0;
  }

  unlockWeapon(weaponId) {
    const info = PERMANENT_UNLOCKS.weapons[weaponId];
    if (!info || !info.unlockable) return false;
    if (this.getUnlockedWeapons().includes(weaponId)) return false; // already unlocked

    const cost = info.cost;
    if (this.unlocks.entropyCrystals < cost) return false;

    this.unlocks.entropyCrystals -= cost;
    this.unlocks.unlockedWeapons = this.getUnlockedWeapons();
    this.unlocks.unlockedWeapons.push(weaponId);
    this.saveManager.saveRogueliteUnlocks(this.unlocks);
    return true;
  }

  unlockPassive(passiveId) {
    const info = PERMANENT_UNLOCKS.passives[passiveId];
    if (!info || !info.unlockable) return false;
    if (this.getUnlockedPassives().includes(passiveId)) return false;

    const cost = info.cost;
    if (this.unlocks.entropyCrystals < cost) return false;

    this.unlocks.entropyCrystals -= cost;
    this.unlocks.unlockedPassives = this.getUnlockedPassives();
    this.unlocks.unlockedPassives.push(passiveId);
    this.saveManager.saveRogueliteUnlocks(this.unlocks);
    return true;
  }

  buyBonus(bonusId) {
    const info = PERMANENT_UNLOCKS.bonuses[bonusId];
    if (!info) return false;

    const currentLevel = this.unlocks[info.id] || 0;
    if (currentLevel >= info.max) return false;

    const cost = info.cost * (currentLevel + 1);
    if (this.unlocks.entropyCrystals < cost) return false;

    this.unlocks.entropyCrystals -= cost;
    this.unlocks[info.id] = currentLevel + 1;
    this.saveManager.saveRogueliteUnlocks(this.unlocks);
    return true;
  }

  addEntropyCrystals(amount) {
    this.unlocks.entropyCrystals = (this.unlocks.entropyCrystals || 0) + amount;
    this.saveManager.saveRogueliteUnlocks(this.unlocks);
    return this.unlocks.entropyCrystals;
  }

  // Called when a roguelite run is won - award entropy crystals
  onRunComplete(waveReached, score) {
    const reward = 10 + waveReached * 5 + Math.floor(score / 100);
    return this.addEntropyCrystals(reward);
  }
}
