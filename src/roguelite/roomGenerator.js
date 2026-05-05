import { SeededRandom } from '../core/SeededRandom.js';
import { ENEMY_TEMPLATES } from '../gameplay/enemies.js';

export const ROOM_TYPES = ['combat', 'elite', 'boss', 'shop', 'event', 'shrine'];

// Generate 10 rooms using seeded random
export function generateRooms(seed) {
  const rng = new SeededRandom(seed);
  const rooms = [];
  
  // First room is always combat
  rooms.push(_generateRoom('combat', rng, 1));
  
  for (let i = 2; i <= 9; i++) {
    let type;
    const roll = rng.next();
    if (i === 10) {
      type = 'boss';
    } else if (i === 5 || i === 8) {
      // Guaranteed shop at wave 5, shrine at wave 8
      type = i === 5 ? 'shop' : 'shrine';
    } else if (roll < 0.45) {
      type = 'combat';
    } else if (roll < 0.7) {
      type = 'elite';
    } else if (roll < 0.8) {
      type = 'event';
    } else if (roll < 0.9) {
      type = 'shop';
    } else {
      type = 'shrine';
    }
    rooms.push(_generateRoom(type, rng, i));
  }
  
  return rooms;
}

function _generateRoom(type, rng, waveNumber) {
  const difficultyMultiplier = 1 + (waveNumber - 1) * 0.2; // +20% HP per wave
  
  const room = {
    type,
    wave: waveNumber,
    enemies: [],
    platforms: _generatePlatforms(rng),
    collectibles: [],
    width: 2400,
    height: 800,
  };
  
  if (type === 'combat') {
    const count = Math.min(3 + Math.floor(waveNumber / 3), 6);
    for (let i = 0; i < count; i++) {
      room.enemies.push(_randomEnemy(rng, difficultyMultiplier, 'normal'));
    }
    room.collectibles = _generateCollectibles(rng, 2);
  } else if (type === 'elite') {
    room.enemies.push(_randomEnemy(rng, difficultyMultiplier, 'elite'));
    const count = Math.min(1 + Math.floor(waveNumber / 4), 3);
    for (let i = 0; i < count; i++) {
      room.enemies.push(_randomEnemy(rng, difficultyMultiplier, 'normal'));
    }
    room.collectibles = _generateCollectibles(rng, 3);
  } else if (type === 'boss') {
    room.enemies.push(_bossEnemy(rng, difficultyMultiplier));
    room.platforms = _generateBossPlatforms(rng);
    room.collectibles = [];
  } else if (type === 'shop') {
    room.shopItems = _generateShopItems(rng);
    room.enemies = [];
    room.collectibles = [];
  } else if (type === 'event') {
    room.event = _randomEvent(rng);
    room.enemies = [];
  } else if (type === 'shrine') {
    room.shrineActive = true;
    room.collectibles = _generateCollectibles(rng, 1);
  }
  
  return room;
}

function _randomEnemy(rng, difficultyMult, tier) {
  const normalEnemies = ['scavenger', 'patroller', 'ranged', 'abyssal_crawler', 'drifter', 'tide_caller', 'ripper', 'void_wraith', 'chronofrog', 'echo_shade'];
  const eliteEnemies = ['elite', 'elite_depths', 'elite_temple'];
  
  const pool = tier === 'elite' ? eliteEnemies : normalEnemies;
  const type = rng.pick(pool);
  const template = ENEMY_TEMPLATES[type];
  
  return {
    type,
    x: rng.nextInt(300, 2000),
    y: 460,
    hp: Math.floor(template.hp * difficultyMult),
    scaled: true,
  };
}

function _bossEnemy(rng, difficultyMult) {
  const bosses = ['boss', 'boss_abyss_lord', 'boss_eternal_guardian'];
  const type = rng.pick(bosses);
  const template = ENEMY_TEMPLATES[type];
  
  return {
    type,
    x: 2000,
    y: 380,
    hp: Math.floor(template.hp * difficultyMult),
    scaled: true,
  };
}

function _generatePlatforms(rng) {
  const platforms = [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
  ];
  
  const positions = [
    [200, 380], [450, 300], [700, 280], [950, 380], [1100, 300],
    [1350, 250], [1550, 350], [1750, 280], [2000, 350],
  ];
  
  const count = rng.nextInt(4, 7);
  const shuffled = rng.shuffle(positions).slice(0, count);
  
  for (const [x, y] of shuffled) {
    platforms.push({
      x, y,
      w: rng.nextInt(100, 200),
      h: 20,
      type: 'platform',
    });
  }
  
  return platforms;
}

function _generateBossPlatforms(rng) {
  return [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
    { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
    { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
    { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
    { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
    { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
  ];
}

function _generateCollectibles(rng, count) {
  const collectibles = [];
  const positions = [
    [270, 360], [500, 300], [780, 260], [990, 360], [1170, 280],
    [1430, 230], [1600, 330], [1850, 260], [2070, 330],
  ];
  
  const shuffled = rng.shuffle(positions).slice(0, count);
  for (const [x, y] of shuffled) {
    collectibles.push({ x, y, collected: false });
  }
  
  return collectibles;
}

function _generateShopItems(rng) {
  const items = [];
  
  // Random weapon fragment
  const weapons = ['scatter_gun', 'resonance_cannon', 'echo_blade'];
  if (rng.chance(0.6)) {
    items.push({ type: 'weapon', id: rng.pick(weapons), price: rng.nextInt(30, 50) });
  }
  
  // Random passive
  const passives = ['resonance_boost', 'vital_strike', 'echo_mastery', 'rapid_fire', 'dash_master', 'corruption_shield'];
  if (rng.chance(0.5)) {
    items.push({ type: 'passive', id: rng.pick(passives), price: rng.nextInt(20, 40) });
  }
  
  // Heal
  if (rng.chance(0.7)) {
    items.push({ type: 'heal', amount: 30, price: rng.nextInt(10, 20) });
  }
  
  // Buff options
  const buffs = ['damage_up', 'speed_up', 'resonance_up'];
  items.push({ type: 'buff', id: rng.pick(buffs), duration: 3, price: rng.nextInt(15, 25) });
  
  return items;
}

function _randomEvent(rng) {
  const events = [
    { id: 'treasure', desc: '发现一个神秘的宝箱！', effect: 'bonus_loot' },
    { id: 'curse', desc: '回响侵蚀加剧...', effect: 'corruption_up' },
    { id: 'blessing', desc: '古老的祝福！', effect: 'full_heal' },
    { id: 'ambush', desc: '伏击！', effect: 'extra_elite' },
  ];
  
  const event = rng.pick(events);
  
  if (event.effect === 'bonus_loot') {
    return { ...event, collectibles: _generateCollectibles(rng, 4) };
  } else if (event.effect === 'extra_elite') {
    return { ...event, enemies: [_randomEnemy(rng, 1.0, 'normal'), _randomEnemy(rng, 1.0, 'normal')] };
  }
  
  return event;
}
