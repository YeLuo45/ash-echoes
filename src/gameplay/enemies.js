// Enemy type definitions for all chapters (V4: +9 new enemy types)
// ============================================================
// V1 Original Enemies
// ============================================================
export const ENEMY_TEMPLATES = {
  // === V1 Original Enemies ===
  scavenger: { hp: 30, speed: 80, damage: 10, attackRange: 40, color: '#8b5a5a', size: 28, score: 10 },
  patroller: { hp: 50, speed: 60, damage: 15, attackRange: 60, color: '#5a8b5a', size: 32, score: 20 },
  ranged: { hp: 25, speed: 40, damage: 8, attackRange: 300, color: '#5a5a8b', size: 26, shootInterval: 1.5, score: 15 },
  elite: { hp: 120, speed: 50, damage: 25, attackRange: 50, color: '#8b5a8b', size: 40, score: 50 },
  boss: { hp: 500, speed: 30, damage: 30, attackRange: 80, color: '#8b0000', size: 64, score: 200 },

  // ============================================================
  // Chapter 2: Abyss Enemies (6 + 1 boss)
  // ============================================================
  abyssal_crawler: { hp: 40, speed: 100, damage: 12, attackRange: 35, color: '#006688', size: 30, score: 15 },
  drifter: { hp: 20, speed: 60, damage: 6, attackRange: 200, color: '#00aacc', size: 22, shootInterval: 2.0, score: 10 },
  tide_caller: { hp: 60, speed: 50, damage: 18, attackRange: 250, color: '#0099bb', size: 34, shootInterval: 1.8, score: 25 },
  ripper: { hp: 55, speed: 120, damage: 20, attackRange: 30, color: '#005577', size: 28, score: 20 },
  elite_depths: { hp: 150, speed: 70, damage: 28, attackRange: 45, color: '#004466', size: 42, score: 60 },
  void_ray: { hp: 35, speed: 90, damage: 14, attackRange: 180, color: '#007799', size: 26, shootInterval: 1.2, score: 18 },
  boss_abyss_lord: { hp: 800, speed: 25, damage: 40, attackRange: 100, color: '#003355', size: 80, score: 500 },

  // ============================================================
  // Chapter 3: Spacetime Enemies (6 + 1 boss)
  // ============================================================
  void_wraith: { hp: 45, speed: 85, damage: 15, attackRange: 40, color: '#6622aa', size: 30, score: 18 },
  chronofrog: { hp: 30, speed: 110, damage: 8, attackRange: 150, color: '#8844cc', size: 24, shootInterval: 1.5, score: 12 },
  echo_shade: { hp: 50, speed: 70, damage: 18, attackRange: 35, color: '#5533bb', size: 32, score: 22 },
  temporal_rift: { hp: 40, speed: 55, damage: 22, attackRange: 280, color: '#9966dd', size: 28, shootInterval: 2.2, score: 28 },
  elite_temple: { hp: 180, speed: 60, damage: 30, attackRange: 50, color: '#4411aa', size: 44, score: 70 },
  void_specter: { hp: 25, speed: 130, damage: 10, attackRange: 120, color: '#7755ee', size: 20, shootInterval: 0.8, score: 15 },
  boss_eternal_guardian: { hp: 1000, speed: 20, damage: 45, attackRange: 90, color: '#330099', size: 90, score: 600 },

  // ============================================================
  // Chapter 4: 废墟都市 (Ruined Metropolis) - 3 new enemies
  // ============================================================
  // Bomber: Contact explosion - rushes at player and explodes on proximity
  bomber: { hp: 35, speed: 95, damage: 22, attackRange: 55, color: '#ff4400', size: 26, score: 18, explosionRadius: 120, explosionDamage: 30 },
  // Shield: Holds shield that blocks player attacks; must jump over or flank
  shield: { hp: 80, speed: 40, damage: 12, attackRange: 40, color: '#cc8800', size: 32, score: 25, hasShield: true },
  // Turret: Fixed-position shooter, high damage but stationary
  turret: { hp: 100, speed: 0, damage: 18, attackRange: 320, color: '#884400', size: 30, shootInterval: 1.2, score: 30 },
  // Elite for Ch4
  elite_ruins: { hp: 200, speed: 65, damage: 30, attackRange: 50, color: '#aa3300', size: 46, score: 80 },
  // Boss Ch4
  boss_ruins_king: { hp: 1200, speed: 22, damage: 38, attackRange: 90, color: '#cc2200', size: 84, score: 700 },

  // ============================================================
  // Chapter 5: 地下基地 (Underground Base) - 3 new enemies
  // ============================================================
  // Stalker: Goes invisible, ambushes player from stealth
  stalker: { hp: 45, speed: 100, damage: 20, attackRange: 35, color: '#00aa44', size: 28, score: 22, isStealth: true },
  // Hacker: Disrupts player skills/special abilities temporarily
  hacker: { hp: 55, speed: 50, damage: 10, attackRange: 280, color: '#00ff88', size: 28, shootInterval: 2.0, score: 28, disruptsSkills: true },
  // Artillery: Long-range arcing projectile, damages through platforms
  artillery: { hp: 70, speed: 35, damage: 28, attackRange: 400, color: '#0088ff', size: 34, shootInterval: 2.5, score: 35, isArcing: true },
  // Elite for Ch5
  elite_base: { hp: 220, speed: 55, damage: 32, attackRange: 50, color: '#006633', size: 48, score: 90 },
  // Boss Ch5
  boss_base_commander: { hp: 1400, speed: 20, damage: 42, attackRange: 95, color: '#004422', size: 88, score: 800 },

  // ============================================================
  // Chapter 6: 核心区域 (Core Region) - 3 new enemies
  // ============================================================
  // Elite Mutant: Combined abilities - ranged + melee hybrid
  elite_mutant: { hp: 250, speed: 70, damage: 28, attackRange: 45, color: '#ff00ff', size: 44, score: 85, shootInterval: 1.8 },
  // Guardian: Mechanical trap enemy, activates when player approaches
  guardian: { hp: 160, speed: 10, damage: 35, attackRange: 70, color: '#ff0088', size: 40, score: 65, isGuardian: true },
  // Core Fusion: Orbiting core - splits into smaller homing drones when damaged
  core_fusion_drone: { hp: 100, speed: 75, damage: 20, attackRange: 200, color: '#ff66ff', size: 32, score: 55, shootInterval: 1.5, splitsInto: 2 },
  // Boss Ch6 - Core Guardian (mechanical)
  boss_core_guardian: { hp: 1600, speed: 18, damage: 48, attackRange: 100, color: '#cc0066', size: 92, score: 900 },
  // Boss Ch6 - Core Will (multi-phase final boss)
  boss_core_will: { hp: 2000, speed: 22, damage: 50, attackRange: 95, color: '#ff00cc', size: 96, score: 1200 },
};

export function getEnemyTemplate(type) {
  return ENEMY_TEMPLATES[type] || ENEMY_TEMPLATES.scavenger;
}
