// Enemy type definitions for all chapters
export const ENEMY_TEMPLATES = {
  // === V1 Original Enemies ===
  scavenger: { hp: 30, speed: 80, damage: 10, attackRange: 40, color: '#8b5a5a', size: 28, score: 10 },
  patroller: { hp: 50, speed: 60, damage: 15, attackRange: 60, color: '#5a8b5a', size: 32, score: 20 },
  ranged: { hp: 25, speed: 40, damage: 8, attackRange: 300, color: '#5a5a8b', size: 26, shootInterval: 1.5, score: 15 },
  elite: { hp: 120, speed: 50, damage: 25, attackRange: 50, color: '#8b5a8b', size: 40, score: 50 },
  boss: { hp: 500, speed: 30, damage: 30, attackRange: 80, color: '#8b0000', size: 64, score: 200 },

  // === Chapter 2: Abyss Enemies (6 + 1 boss) ===
  abyssal_crawler: { hp: 40, speed: 100, damage: 12, attackRange: 35, color: '#006688', size: 30, score: 15 },
  drifter: { hp: 20, speed: 60, damage: 6, attackRange: 200, color: '#00aacc', size: 22, shootInterval: 2.0, score: 10 },
  tide_caller: { hp: 60, speed: 50, damage: 18, attackRange: 250, color: '#0099bb', size: 34, shootInterval: 1.8, score: 25 },
  ripper: { hp: 55, speed: 120, damage: 20, attackRange: 30, color: '#005577', size: 28, score: 20 },
  elite_depths: { hp: 150, speed: 70, damage: 28, attackRange: 45, color: '#004466', size: 42, score: 60 },
  void_ray: { hp: 35, speed: 90, damage: 14, attackRange: 180, color: '#007799', size: 26, shootInterval: 1.2, score: 18 },
  boss_abyss_lord: { hp: 800, speed: 25, damage: 40, attackRange: 100, color: '#003355', size: 80, score: 500 },

  // === Chapter 3: Spacetime Enemies (6 + 1 boss) ===
  void_wraith: { hp: 45, speed: 85, damage: 15, attackRange: 40, color: '#6622aa', size: 30, score: 18 },
  chronofrog: { hp: 30, speed: 110, damage: 8, attackRange: 150, color: '#8844cc', size: 24, shootInterval: 1.5, score: 12 },
  echo_shade: { hp: 50, speed: 70, damage: 18, attackRange: 35, color: '#5533bb', size: 32, score: 22 },
  temporal_rift: { hp: 40, speed: 55, damage: 22, attackRange: 280, color: '#9966dd', size: 28, shootInterval: 2.2, score: 28 },
  elite_temple: { hp: 180, speed: 60, damage: 30, attackRange: 50, color: '#4411aa', size: 44, score: 70 },
  void_specter: { hp: 25, speed: 130, damage: 10, attackRange: 120, color: '#7755ee', size: 20, shootInterval: 0.8, score: 15 },
  boss_eternal_guardian: { hp: 1000, speed: 20, damage: 45, attackRange: 90, color: '#330099', size: 90, score: 600 },

  // === Chapter 4: Ash Ruins — Elite Enemies ===
  elite_inferno: { hp: 200, speed: 65, damage: 30, attackRange: 50, color: '#aa3300', size: 42, score: 75 },        // Ch4-1
  elite_ironclad: { hp: 350, speed: 35, damage: 25, attackRange: 55, color: '#555555', size: 46, score: 80 },         // Ch4-2 — armored, slow
  elite_pyromancer: { hp: 140, speed: 75, damage: 18, attackRange: 220, color: '#ff5500', size: 38, shootInterval: 1.8, score: 85 }, // Ch4-3 — ranged + fire
  boss_ruins_king: { hp: 1200, speed: 28, damage: 50, attackRange: 90, color: '#8b2200', size: 88, score: 700 },     // Ch4-6 — Earthquake + Summon + SpinCharge

  // === Chapter 5: Base Omega — Elite Enemies ===
  elite_grenadier: { hp: 160, speed: 70, damage: 22, attackRange: 180, color: '#556b2f', size: 36, shootInterval: 2.0, score: 80 },   // Ch5-1 — throws grenades
  elite_shield: { hp: 400, speed: 30, damage: 15, attackRange: 40, color: '#2f4f4f', size: 48, score: 90 },         // Ch5-2 — massive HP, low damage
  elite_commander: { hp: 180, speed: 80, damage: 35, attackRange: 60, color: '#4b0082', size: 40, score: 95 },       // Ch5-3 — fast + buffs nearby
  boss_base_commander: { hp: 1500, speed: 22, damage: 45, attackRange: 100, color: '#191970', size: 92, score: 800 }, // Ch5-6 — SummonTurrets + EMP + Retreat

  // === Chapter 6: Core Will — Elite Enemies ===
  elite_warden: { hp: 220, speed: 60, damage: 32, attackRange: 50, color: '#8b008b', size: 44, score: 90 },         // Ch6-1 — balanced
  elite_dissolver: { hp: 120, speed: 90, damage: 40, attackRange: 30, color: '#dc143c', size: 34, score: 100 },      // Ch6-2 — glass cannon, high burst
  elite_nexus: { hp: 260, speed: 50, damage: 15, attackRange: 200, color: '#9400d3', size: 40, shootInterval: 1.5, score: 110 }, // Ch6-3 — support ranged
  boss_core_will: { hp: 2000, speed: 18, damage: 55, attackRange: 95, color: '#b8860b', size: 100, score: 1000 },     // Ch6-6 — 3-Phase: Melee→Ranged→Berserk
};

export function getEnemyTemplate(type) {
  return ENEMY_TEMPLATES[type] || ENEMY_TEMPLATES.scavenger;
}
