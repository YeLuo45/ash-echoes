// Skill Tree System - Each character has 6-8 skills across 3 tiers
import { CHARACTERS } from './characters.js';

// Skill definitions per character
export const SKILL_TREES = {
  even: {
    // Tier 1 (layers 0-1) - 2 skills
    // Tier 2 (layers 2-3) - 2 skills  
    // Tier 3 (layers 4-5) - 2 skills
    skills: [
      // === Tier 1 ===
      {
        id: 'even_t1_1', name: '强化脉冲', desc: '回响脉冲伤害+30%', tier: 1, layer: 0,
        maxLevel: 3, currentLevel: 0,
        effect: { pulseDamageBonus: 0.3 },
        cost: 1, icon: '◆',
      },
      {
        id: 'even_t1_2', name: '脉冲连锁', desc: '回响脉冲可弹射1次', tier: 1, layer: 1,
        maxLevel: 1, currentLevel: 0,
        effect: { pulseChain: 1 },
        cost: 2, icon: '◇',
      },
      // === Tier 2 ===
      {
        id: 'even_t2_1', name: '迅捷移动', desc: '移动速度+15%', tier: 2, layer: 2,
        maxLevel: 3, currentLevel: 0,
        effect: { speedBonus: 0.15 },
        cost: 2, icon: '▷',
        requires: ['even_t1_1'],
      },
      {
        id: 'even_t2_2', name: '能量灌注', desc: '共振上限+20', tier: 2, layer: 3,
        maxLevel: 3, currentLevel: 0,
        effect: { resonanceBonus: 20 },
        cost: 2, icon: '◁',
        requires: ['even_t1_2'],
      },
      // === Tier 3 ===
      {
        id: 'even_t3_1', name: '毁灭共振', desc: '回响脉冲暴击率+20%', tier: 3, layer: 4,
        maxLevel: 1, currentLevel: 0,
        effect: { pulseCrit: 0.2 },
        cost: 3, icon: '★',
        requires: ['even_t2_1'],
      },
      {
        id: 'even_t3_2', name: '无限脉冲', desc: '技能冷却-25%', tier: 3, layer: 5,
        maxLevel: 1, currentLevel: 0,
        effect: { cooldownReduction: 0.25 },
        cost: 3, icon: '☆',
        requires: ['even_t2_2'],
      },
    ],
  },
  ren: {
    skills: [
      // === Tier 1 ===
      {
        id: 'ren_t1_1', name: '深化伤口', desc: '流血伤害+25%', tier: 1, layer: 0,
        maxLevel: 3, currentLevel: 0,
        effect: { bleedDamageBonus: 0.25 },
        cost: 1, icon: '◆',
      },
      {
        id: 'ren_t1_2', name: '疾风剑舞', desc: '双刃攻速+20%', tier: 1, layer: 1,
        maxLevel: 3, currentLevel: 0,
        effect: { attackSpeedBonus: 0.2 },
        cost: 1, icon: '◇',
      },
      // === Tier 2 ===
      {
        id: 'ren_t2_1', name: '吸血打击', desc: '命中恢复HP', tier: 2, layer: 2,
        maxLevel: 3, currentLevel: 0,
        effect: { lifesteal: 3 },
        cost: 2, icon: '▷',
        requires: ['ren_t1_1'],
      },
      {
        id: 'ren_t2_2', name: '穿刺', desc: '双刃穿透+1敌人', tier: 2, layer: 3,
        maxLevel: 3, currentLevel: 0,
        effect: { pierceBonus: 1 },
        cost: 2, icon: '◁',
        requires: ['ren_t1_2'],
      },
      // === Tier 3 ===
      {
        id: 'ren_t3_1', name: '死亡标记', desc: '流血层数上限+3', tier: 3, layer: 4,
        maxLevel: 1, currentLevel: 0,
        effect: { bleedStackBonus: 3 },
        cost: 3, icon: '★',
        requires: ['ren_t2_1'],
      },
      {
        id: 'ren_t3_2', name: '暗影突袭', desc: '闪避后下次攻击伤害+50%', tier: 3, layer: 5,
        maxLevel: 1, currentLevel: 0,
        effect: { dashAttackBonus: 0.5 },
        cost: 3, icon: '☆',
        requires: ['ren_t2_2'],
      },
    ],
  },
  rong: {
    skills: [
      // === Tier 1 ===
      {
        id: 'rong_t1_1', name: '过热打击', desc: '共振炮伤害+20%', tier: 1, layer: 0,
        maxLevel: 3, currentLevel: 0,
        effect: { cannonDamageBonus: 0.2 },
        cost: 1, icon: '◆',
      },
      {
        id: 'rong_t1_2', name: '快速填充', desc: '共振炮蓄力-20%', tier: 1, layer: 1,
        maxLevel: 3, currentLevel: 0,
        effect: { chargeReduction: 0.2 },
        cost: 1, icon: '◇',
      },
      // === Tier 2 ===
      {
        id: 'rong_t2_1', name: '爆炸范围', desc: '爆炸半径+30%', tier: 2, layer: 2,
        maxLevel: 3, currentLevel: 0,
        effect: { explosionRadiusBonus: 0.3 },
        cost: 2, icon: '▷',
        requires: ['rong_t1_1'],
      },
      {
        id: 'rong_t2_2', name: '能量溢出', desc: '击杀敌人回复共振+5', tier: 2, layer: 3,
        maxLevel: 3, currentLevel: 0,
        effect: { killResonanceGain: 5 },
        cost: 2, icon: '◁',
        requires: ['rong_t1_2'],
      },
      // === Tier 3 ===
      {
        id: 'rong_t3_1', name: '毁灭爆发', desc: '爆炸伤害+50%，附带眩晕', tier: 3, layer: 4,
        maxLevel: 1, currentLevel: 0,
        effect: { explosionDamageBonus: 0.5, stun: true },
        cost: 3, icon: '★',
        requires: ['rong_t2_1'],
      },
      {
        id: 'rong_t3_2', name: '过载', desc: '能量消耗+50%，伤害+100%', tier: 3, layer: 5,
        maxLevel: 1, currentLevel: 0,
        effect: { overloadDamage: 1.0, overloadCost: 0.5 },
        cost: 3, icon: '☆',
        requires: ['rong_t2_2'],
      },
    ],
  },
};

// Skill point management
export class SkillPointManager {
  constructor() {
    this.pointsPerCharacter = {}; // { characterId: { points: number, totalEarned: number } }
  }

  // Load from save data
  loadFromSave(characterId, saveData) {
    const charKey = `char_${characterId}`;
    if (saveData?.skillTrees?.[charKey]) {
      this.pointsPerCharacter[characterId] = saveData.skillTrees[charKey];
    } else {
      this.pointsPerCharacter[characterId] = { points: 0, totalEarned: 0, skills: {} };
    }
  }

  // Save to compatible format
  toSave() {
    return { skillTrees: this.pointsPerCharacter };
  }

  getPoints(characterId) {
    return this.pointsPerCharacter[characterId]?.points || 0;
  }

  getTotalEarned(characterId) {
    return this.pointsPerCharacter[characterId]?.totalEarned || 0;
  }

  addPoints(characterId, amount) {
    if (!this.pointsPerCharacter[characterId]) {
      this.pointsPerCharacter[characterId] = { points: 0, totalEarned: 0, skills: {} };
    }
    this.pointsPerCharacter[characterId].points += amount;
    this.pointsPerCharacter[characterId].totalEarned += amount;
  }

  spendPoints(characterId, amount) {
    if (!this.pointsPerCharacter[characterId]) return false;
    if (this.pointsPerCharacter[characterId].points < amount) return false;
    this.pointsPerCharacter[characterId].points -= amount;
    return true;
  }

  getSkillLevel(characterId, skillId) {
    return this.pointsPerCharacter[characterId]?.skills?.[skillId] || 0;
  }

  setSkillLevel(characterId, skillId, level) {
    if (!this.pointsPerCharacter[characterId]) {
      this.pointsPerCharacter[characterId] = { points: 0, totalEarned: 0, skills: {} };
    }
    if (!this.pointsPerCharacter[characterId].skills) {
      this.pointsPerCharacter[characterId].skills = {};
    }
    this.pointsPerCharacter[characterId].skills[skillId] = level;
  }

  // Check if skill requirements are met
  canUnlock(characterId, skillId) {
    const tree = SKILL_TREES[characterId];
    if (!tree) return false;
    const skill = tree.skills.find(s => s.id === skillId);
    if (!skill) return false;
    if (skill.requires && skill.requires.length > 0) {
      const currentLevel = this.getSkillLevel(characterId, skillId);
      if (currentLevel >= skill.maxLevel) return false;
      for (const reqId of skill.requires) {
        if (this.getSkillLevel(characterId, reqId) < 1) return false;
      }
    }
    return true;
  }
}

// Skill Tree Manager for UI and logic
export class SkillTreeManager {
  constructor(skillPointManager) {
    this.spm = skillPointManager;
  }

  getSkillsForCharacter(characterId) {
    const tree = SKILL_TREES[characterId];
    if (!tree) return [];
    return tree.skills.map(skill => ({
      ...skill,
      currentLevel: this.spm.getSkillLevel(characterId, skill.id),
      canUnlock: this.spm.canUnlock(characterId, skill.id),
    }));
  }

  tryUpgradeSkill(characterId, skillId) {
    if (!this.spm.canUnlock(characterId, skillId)) return false;
    const tree = SKILL_TREES[characterId];
    const skill = tree.skills.find(s => s.id === skillId);
    if (!skill) return false;

    const currentLevel = this.spm.getSkillLevel(characterId, skillId);
    if (currentLevel >= skill.maxLevel) return false;

    if (!this.spm.spendPoints(characterId, skill.cost)) return false;
    this.spm.setSkillLevel(characterId, skillId, currentLevel + 1);
    return true;
  }

  // Collect all active effects from learned skills
  getActiveEffects(characterId) {
    const effects = {};
    const tree = SKILL_TREES[characterId];
    if (!tree) return effects;

    for (const skill of tree.skills) {
      const level = this.spm.getSkillLevel(characterId, skill.id);
      if (level === 0) continue;

      for (const [key, value] of Object.entries(skill.effect)) {
        if (!effects[key]) effects[key] = 0;
        effects[key] += value * level;
      }
    }
    return effects;
  }

  // Apply effects to player stats
  applyToPlayer(characterId, player) {
    const effects = this.getActiveEffects(characterId);

    if (effects.speedBonus) player.speed *= (1 + effects.speedBonus);
    if (effects.resonanceBonus) player.maxResonance += effects.resonanceBonus;
    if (effects.damageBonus) player.damageBonus = (player.damageBonus || 0) + effects.damageBonus;
    if (effects.cooldownReduction) player.skillCooldown *= (1 - effects.cooldownReduction);
    if (effects.attackSpeedBonus) player.attackSpeed *= (1 + effects.attackSpeedBonus);
    if (effects.lifesteal) player.lifesteal = (player.lifesteal || 0) + effects.lifesteal;
    if (effects.pierceBonus) player.pierce = (player.pierce || 0) + effects.pierceBonus;
    if (effects.bleedStackBonus) player.bleedStackMax = (player.bleedStackMax || 0) + effects.bleedStackBonus;
    if (effects.dashAttackBonus) player.dashAttackBonus = (player.dashAttackBonus || 0) + effects.dashAttackBonus;
    if (effects.cannonDamageBonus) player.cannonDamageBonus = (player.cannonDamageBonus || 0) + effects.cannonDamageBonus;
    if (effects.chargeReduction) player.chargeReduction = (player.chargeReduction || 0) + effects.chargeReduction;
    if (effects.explosionRadiusBonus) player.explosionRadiusBonus = (player.explosionRadiusBonus || 0) + effects.explosionRadiusBonus;
    if (effects.killResonanceGain) player.killResonanceGain = (player.killResonanceGain || 0) + effects.killResonanceGain;
    if (effects.explosionDamageBonus) player.explosionDamageBonus = (player.explosionDamageBonus || 0) + effects.explosionDamageBonus;
    if (effects.pulseDamageBonus) player.pulseDamageBonus = (player.pulseDamageBonus || 0) + effects.pulseDamageBonus;
    if (effects.pulseCrit) player.pulseCrit = (player.pulseCrit || 0) + effects.pulseCrit;
    if (effects.pulseChain) player.pulseChain = (player.pulseChain || 0) + effects.pulseChain;
  }
}
