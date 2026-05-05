// Ash Echoes - All Chapter Definitions (V4: Chapters 4-6)

// Chapter 1: 回响废墟 (Ruins of Echo) - Original V1
export const CHAPTER1 = {
  id: 1,
  name: '回响废墟',
  theme: 'ruins',
  bgColor1: '#0a0a0f',
  bgColor2: '#12121a',
  accentColor: '#ff6b35',
};

// Chapter 2: 回响深渊 (Abyss of Echoes) - underwater ruins theme
export const CHAPTER2 = {
  id: 2,
  name: '回响深渊',
  theme: 'underwater',
  bgColor1: '#0a0a1a',
  bgColor2: '#0d1a2a',
  accentColor: '#00d4ff',
  levels: [
    {
      id: '2-1', name: '深渊入口', width: 2400, height: 800,
      enemies: [
        { type: 'abyssal_crawler', x: 300, y: 460 },
        { type: 'abyssal_crawler', x: 600, y: 460 },
        { type: 'drifter', x: 500, y: 280 },
        { type: 'tide_caller', x: 800, y: 460 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
        { x: 450, y: 320, w: 120, h: 20, type: 'platform' },
        { x: 700, y: 280, w: 180, h: 20, type: 'platform' },
        { x: 950, y: 380, w: 100, h: 20, type: 'platform' },
        { x: 1100, y: 300, w: 140, h: 20, type: 'platform' },
        { x: 1350, y: 250, w: 160, h: 20, type: 'platform' },
        { x: 1550, y: 350, w: 120, h: 20, type: 'platform' },
        { x: 1750, y: 280, w: 200, h: 20, type: 'platform' },
        { x: 2000, y: 350, w: 150, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 270, y: 360 }, { x: 500, y: 300 }, { x: 780, y: 260 },
        { x: 990, y: 360 }, { x: 1170, y: 280 },
      ],
      shrines: [{ x: 150, y: 460, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '2-2', name: '潮汐通道', width: 2400, height: 800,
      enemies: [
        { type: 'abyssal_crawler', x: 300, y: 460 },
        { type: 'drifter', x: 400, y: 300 },
        { type: 'drifter', x: 700, y: 250 },
        { type: 'tide_caller', x: 600, y: 460 },
        { type: 'abyssal_crawler', x: 900, y: 460 },
        { type: 'ripper', x: 1200, y: 280 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 150, y: 360, w: 120, h: 20, type: 'platform' },
        { x: 380, y: 280, w: 140, h: 20, type: 'platform' },
        { x: 620, y: 320, w: 100, h: 20, type: 'platform' },
        { x: 850, y: 380, w: 130, h: 20, type: 'platform' },
        { x: 1080, y: 300, w: 110, h: 20, type: 'platform' },
        { x: 1300, y: 250, w: 160, h: 20, type: 'platform' },
        { x: 1550, y: 350, w: 120, h: 20, type: 'platform' },
        { x: 1800, y: 280, w: 180, h: 20, type: 'platform' },
        { x: 2100, y: 400, w: 200, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 210, y: 340 }, { x: 450, y: 260 }, { x: 670, y: 300 },
        { x: 915, y: 360 }, { x: 1135, y: 280 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1100, y: 280, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '2-3', name: '淹没神殿', width: 2400, height: 800,
      enemies: [
        { type: 'tide_caller', x: 350, y: 460 },
        { type: 'drifter', x: 550, y: 280 },
        { type: 'drifter', x: 750, y: 320 },
        { type: 'abyssal_crawler', x: 800, y: 460 },
        { type: 'ripper', x: 1100, y: 280 },
        { type: 'ripper', x: 1400, y: 250 },
        { type: 'tide_caller', x: 1600, y: 460 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 180, y: 380, w: 140, h: 20, type: 'platform' },
        { x: 420, y: 300, w: 120, h: 20, type: 'platform' },
        { x: 680, y: 350, w: 100, h: 20, type: 'platform' },
        { x: 900, y: 280, w: 150, h: 20, type: 'platform' },
        { x: 1150, y: 320, w: 130, h: 20, type: 'platform' },
        { x: 1380, y: 250, w: 160, h: 20, type: 'platform' },
        { x: 1620, y: 350, w: 120, h: 20, type: 'platform' },
        { x: 1850, y: 280, w: 200, h: 20, type: 'platform' },
        { x: 2100, y: 400, w: 180, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 250, y: 360 }, { x: 480, y: 280 }, { x: 730, y: 330 },
        { x: 975, y: 260 }, { x: 1215, y: 300 }, { x: 1460, y: 230 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1200, y: 300, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '2-4', name: '回响漩涡', width: 2400, height: 800,
      enemies: [
        { type: 'ripper', x: 300, y: 280 },
        { type: 'abyssal_crawler', x: 400, y: 460 },
        { type: 'ripper', x: 650, y: 320 },
        { type: 'drifter', x: 800, y: 250 },
        { type: 'tide_caller', x: 850, y: 460 },
        { type: 'abyssal_crawler', x: 1100, y: 460 },
        { type: 'drifter', x: 1300, y: 300 },
        { type: 'ripper', x: 1500, y: 250 },
        { type: 'tide_caller', x: 1700, y: 460 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 150, y: 360, w: 130, h: 20, type: 'platform' },
        { x: 380, y: 280, w: 150, h: 20, type: 'platform' },
        { x: 630, y: 350, w: 120, h: 20, type: 'platform' },
        { x: 850, y: 280, w: 140, h: 20, type: 'platform' },
        { x: 1100, y: 380, w: 100, h: 20, type: 'platform' },
        { x: 1280, y: 300, w: 160, h: 20, type: 'platform' },
        { x: 1520, y: 250, w: 180, h: 20, type: 'platform' },
        { x: 1780, y: 350, w: 140, h: 20, type: 'platform' },
        { x: 2020, y: 280, w: 200, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 215, y: 340 }, { x: 455, y: 260 }, { x: 690, y: 330 },
        { x: 920, y: 260 }, { x: 1150, y: 360 }, { x: 1360, y: 280 },
        { x: 1610, y: 230 }, { x: 1860, y: 330 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1400, y: 230, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '2-5', name: '深渊之心', width: 2400, height: 800,
      enemies: [
        { type: 'ripper', x: 300, y: 280 },
        { type: 'ripper', x: 500, y: 320 },
        { type: 'tide_caller', x: 450, y: 460 },
        { type: 'drifter', x: 700, y: 250 },
        { type: 'abyssal_crawler', x: 800, y: 460 },
        { type: 'drifter', x: 1000, y: 300 },
        { type: 'ripper', x: 1200, y: 280 },
        { type: 'tide_caller', x: 1350, y: 460 },
        { type: 'drifter', x: 1500, y: 250 },
        { type: 'abyssal_crawler', x: 1650, y: 460 },
        { type: 'elite_depths', x: 1850, y: 280 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 200, y: 380, w: 120, h: 20, type: 'platform' },
        { x: 420, y: 300, w: 140, h: 20, type: 'platform' },
        { x: 680, y: 350, w: 100, h: 20, type: 'platform' },
        { x: 880, y: 280, w: 150, h: 20, type: 'platform' },
        { x: 1120, y: 380, w: 130, h: 20, type: 'platform' },
        { x: 1350, y: 300, w: 110, h: 20, type: 'platform' },
        { x: 1550, y: 250, w: 170, h: 20, type: 'platform' },
        { x: 1820, y: 350, w: 140, h: 20, type: 'platform' },
        { x: 2080, y: 400, w: 200, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 260, y: 360 }, { x: 490, y: 280 }, { x: 730, y: 330 },
        { x: 955, y: 260 }, { x: 1185, y: 360 }, { x: 1405, y: 280 },
        { x: 1635, y: 230 }, { x: 1890, y: 330 }, { x: 2180, y: 380 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1600, y: 230, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '2-6', name: '深渊领主', isBoss: true, width: 2400, height: 800,
      enemies: [{ type: 'boss_abyss_lord', x: 2000, y: 380 }],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
        { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
        { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
        { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
        { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
        { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
      ],
      collectibles: [],
      shrines: [{ x: 150, y: 460, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
  ],
};

// Chapter 3: 永恒回廊 (Eternal Corridor) - fractured spacetime theme
export const CHAPTER3 = {
  id: 3,
  name: '永恒回廊',
  theme: 'spacetime',
  bgColor1: '#0f0a1a',
  bgColor2: '#1a0a2a',
  accentColor: '#9b59b6',
  levels: [
    {
      id: '3-1', name: '时空裂缝', width: 2400, height: 800,
      enemies: [
        { type: 'void_wraith', x: 300, y: 460 },
        { type: 'chronofrog', x: 500, y: 280 },
        { type: 'void_wraith', x: 650, y: 460 },
        { type: 'echo_shade', x: 800, y: 300 },
        { type: 'chronofrog', x: 1000, y: 460 },
        { type: 'void_wraith', x: 1200, y: 460 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
        { x: 450, y: 300, w: 130, h: 20, type: 'platform' },
        { x: 700, y: 250, w: 180, h: 20, type: 'platform' },
        { x: 980, y: 380, w: 120, h: 20, type: 'platform' },
        { x: 1200, y: 300, w: 160, h: 20, type: 'platform' },
        { x: 1450, y: 250, w: 140, h: 20, type: 'platform' },
        { x: 1680, y: 350, w: 200, h: 20, type: 'platform' },
        { x: 1950, y: 280, w: 180, h: 20, type: 'platform' },
        { x: 2180, y: 400, w: 200, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 275, y: 360 }, { x: 515, y: 280 }, { x: 790, y: 230 },
        { x: 1040, y: 360 }, { x: 1280, y: 280 }, { x: 1520, y: 230 },
      ],
      shrines: [{ x: 150, y: 460, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '3-2', name: '回溯迷宫', width: 2400, height: 800,
      enemies: [
        { type: 'echo_shade', x: 300, y: 460 },
        { type: 'chronofrog', x: 450, y: 280 },
        { type: 'void_wraith', x: 600, y: 460 },
        { type: 'echo_shade', x: 800, y: 300 },
        { type: 'chronofrog', x: 950, y: 460 },
        { type: 'void_wraith', x: 1150, y: 460 },
        { type: 'echo_shade', x: 1400, y: 280 },
        { type: 'temporal_rift', x: 1600, y: 460 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 150, y: 360, w: 130, h: 20, type: 'platform' },
        { x: 380, y: 280, w: 150, h: 20, type: 'platform' },
        { x: 630, y: 350, w: 120, h: 20, type: 'platform' },
        { x: 850, y: 280, w: 140, h: 20, type: 'platform' },
        { x: 1080, y: 380, w: 110, h: 20, type: 'platform' },
        { x: 1280, y: 300, w: 170, h: 20, type: 'platform' },
        { x: 1550, y: 250, w: 160, h: 20, type: 'platform' },
        { x: 1800, y: 350, w: 200, h: 20, type: 'platform' },
        { x: 2100, y: 400, w: 180, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 215, y: 340 }, { x: 455, y: 260 }, { x: 690, y: 330 },
        { x: 920, y: 260 }, { x: 1135, y: 360 }, { x: 1365, y: 280 },
        { x: 1630, y: 230 }, { x: 1900, y: 330 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1300, y: 280, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '3-3', name: '永恒夹缝', width: 2400, height: 800,
      enemies: [
        { type: 'void_wraith', x: 300, y: 460 },
        { type: 'echo_shade', x: 450, y: 280 },
        { type: 'void_wraith', x: 600, y: 460 },
        { type: 'chronofrog', x: 750, y: 300 },
        { type: 'echo_shade', x: 900, y: 460 },
        { type: 'temporal_rift', x: 1100, y: 280 },
        { type: 'void_wraith', x: 1300, y: 460 },
        { type: 'echo_shade', x: 1500, y: 300 },
        { type: 'chronofrog', x: 1700, y: 460 },
        { type: 'elite_temple', x: 1900, y: 280 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 180, y: 380, w: 140, h: 20, type: 'platform' },
        { x: 420, y: 300, w: 120, h: 20, type: 'platform' },
        { x: 660, y: 350, w: 110, h: 20, type: 'platform' },
        { x: 880, y: 280, w: 150, h: 20, type: 'platform' },
        { x: 1120, y: 320, w: 130, h: 20, type: 'platform' },
        { x: 1350, y: 250, w: 160, h: 20, type: 'platform' },
        { x: 1600, y: 350, w: 120, h: 20, type: 'platform' },
        { x: 1820, y: 280, w: 180, h: 20, type: 'platform' },
        { x: 2100, y: 400, w: 200, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 250, y: 360 }, { x: 480, y: 280 }, { x: 720, y: 330 },
        { x: 955, y: 260 }, { x: 1185, y: 300 }, { x: 1430, y: 230 },
        { x: 1680, y: 330 }, { x: 1910, y: 260 }, { x: 2200, y: 380 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1650, y: 330, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '3-4', name: '时间洪流', width: 2400, height: 800,
      enemies: [
        { type: 'chronofrog', x: 300, y: 280 },
        { type: 'chronofrog', x: 500, y: 320 },
        { type: 'echo_shade', x: 450, y: 460 },
        { type: 'void_wraith', x: 700, y: 460 },
        { type: 'temporal_rift', x: 850, y: 300 },
        { type: 'echo_shade', x: 1000, y: 460 },
        { type: 'void_wraith', x: 1200, y: 460 },
        { type: 'chronofrog', x: 1400, y: 280 },
        { type: 'temporal_rift', x: 1600, y: 300 },
        { type: 'void_wraith', x: 1800, y: 460 },
        { type: 'echo_shade', x: 2000, y: 280 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 150, y: 360, w: 130, h: 20, type: 'platform' },
        { x: 380, y: 280, w: 150, h: 20, type: 'platform' },
        { x: 630, y: 350, w: 120, h: 20, type: 'platform' },
        { x: 850, y: 280, w: 140, h: 20, type: 'platform' },
        { x: 1100, y: 380, w: 100, h: 20, type: 'platform' },
        { x: 1280, y: 300, w: 160, h: 20, type: 'platform' },
        { x: 1520, y: 250, w: 180, h: 20, type: 'platform' },
        { x: 1780, y: 350, w: 140, h: 20, type: 'platform' },
        { x: 2020, y: 280, w: 200, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 215, y: 340 }, { x: 455, y: 260 }, { x: 690, y: 330 },
        { x: 920, y: 260 }, { x: 1150, y: 360 }, { x: 1360, y: 280 },
        { x: 1610, y: 230 }, { x: 1860, y: 330 }, { x: 2120, y: 260 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 230, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '3-5', name: '回廊核心', width: 2400, height: 800,
      enemies: [
        { type: 'echo_shade', x: 300, y: 460 },
        { type: 'void_wraith', x: 400, y: 280 },
        { type: 'echo_shade', x: 600, y: 320 },
        { type: 'chronofrog', x: 750, y: 460 },
        { type: 'temporal_rift', x: 900, y: 280 },
        { type: 'void_wraith', x: 1100, y: 460 },
        { type: 'echo_shade', x: 1300, y: 300 },
        { type: 'chronofrog', x: 1500, y: 460 },
        { type: 'temporal_rift', x: 1650, y: 280 },
        { type: 'void_wraith', x: 1850, y: 460 },
        { type: 'elite_temple', x: 2000, y: 280 },
      ],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 200, y: 380, w: 120, h: 20, type: 'platform' },
        { x: 420, y: 300, w: 140, h: 20, type: 'platform' },
        { x: 680, y: 350, w: 100, h: 20, type: 'platform' },
        { x: 880, y: 280, w: 150, h: 20, type: 'platform' },
        { x: 1120, y: 380, w: 130, h: 20, type: 'platform' },
        { x: 1350, y: 300, w: 110, h: 20, type: 'platform' },
        { x: 1550, y: 250, w: 170, h: 20, type: 'platform' },
        { x: 1820, y: 350, w: 140, h: 20, type: 'platform' },
        { x: 2050, y: 280, w: 200, h: 20, type: 'platform' },
      ],
      collectibles: [
        { x: 260, y: 360 }, { x: 490, y: 280 }, { x: 730, y: 330 },
        { x: 955, y: 260 }, { x: 1185, y: 360 }, { x: 1405, y: 280 },
        { x: 1635, y: 230 }, { x: 1890, y: 330 }, { x: 2150, y: 260 },
      ],
      shrines: [{ x: 150, y: 460, active: false }, { x: 1600, y: 230, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
    {
      id: '3-6', name: '永恒守护者', isBoss: true, width: 2400, height: 800,
      enemies: [{ type: 'boss_eternal_guardian', x: 2000, y: 380 }],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
        { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
        { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
        { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
        { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
        { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
      ],
      collectibles: [],
      shrines: [{ x: 150, y: 460, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    },
  ],
};

// ============================================================
// Chapter 4: 废墟都市 (Ruined Metropolis) - industrial ruins theme
// 12 Levels (4-1 to 4-6 normal, 4-7 to 4-11 hard, 4-12 boss)
// ============================================================
const ch4Levels = [];
const ch4Base = {
  width: 2400, height: 800,
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 180, y: 380, w: 140, h: 20, type: 'platform' },
    { x: 420, y: 300, w: 130, h: 20, type: 'platform' },
    { x: 680, y: 350, w: 120, h: 20, type: 'platform' },
    { x: 900, y: 260, w: 160, h: 20, type: 'platform' },
    { x: 1150, y: 320, w: 130, h: 20, type: 'platform' },
    { x: 1380, y: 250, w: 170, h: 20, type: 'platform' },
    { x: 1620, y: 360, w: 120, h: 20, type: 'platform' },
    { x: 1850, y: 280, w: 190, h: 20, type: 'platform' },
    { x: 2100, y: 400, w: 180, h: 20, type: 'platform' },
  ],
};

// Ch4-1: 城市入口
ch4Levels.push({
  id: '4-1', name: '城市入口', ...ch4Base,
  enemies: [
    { type: 'bomber', x: 300, y: 460 },
    { type: 'bomber', x: 550, y: 460 },
    { type: 'patroller', x: 700, y: 280 },
    { type: 'scavenger', x: 850, y: 460 },
    { type: 'patroller', x: 1100, y: 300 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 480, y: 280 }, { x: 740, y: 330 }, { x: 990, y: 240 }],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-2: 废弃街区
ch4Levels.push({
  id: '4-2', name: '废弃街区', ...ch4Base,
  enemies: [
    { type: 'bomber', x: 350, y: 460 },
    { type: 'patroller', x: 500, y: 300 },
    { type: 'bomber', x: 600, y: 460 },
    { type: 'shield', x: 900, y: 280 },
    { type: 'scavenger', x: 1100, y: 460 },
    { type: 'shield', x: 1350, y: 280 },
    { type: 'patroller', x: 1600, y: 350 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 540, y: 280 }, { x: 970, y: 240 }, { x: 1420, y: 230 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1200, y: 300, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-3: 崩塌高架
ch4Levels.push({
  id: '4-3', name: '崩塌高架', ...ch4Base,
  enemies: [
    { type: 'turret', x: 400, y: 440 },
    { type: 'bomber', x: 550, y: 460 },
    { type: 'shield', x: 700, y: 300 },
    { type: 'patroller', x: 900, y: 460 },
    { type: 'turret', x: 1100, y: 440 },
    { type: 'bomber', x: 1300, y: 460 },
    { type: 'shield', x: 1500, y: 280 },
    { type: 'patroller', x: 1750, y: 350 },
  ],
  collectibles: [{ x: 220, y: 360 }, { x: 750, y: 280 }, { x: 1180, y: 230 }, { x: 1580, y: 330 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-4: 工业区
ch4Levels.push({
  id: '4-4', name: '工业区', ...ch4Base,
  enemies: [
    { type: 'bomber', x: 300, y: 460 },
    { type: 'turret', x: 450, y: 440 },
    { type: 'shield', x: 600, y: 300 },
    { type: 'patroller', x: 800, y: 460 },
    { type: 'bomber', x: 950, y: 460 },
    { type: 'turret', x: 1150, y: 440 },
    { type: 'shield', x: 1350, y: 280 },
    { type: 'bomber', x: 1550, y: 460 },
    { type: 'patroller', x: 1750, y: 350 },
    { type: 'turret', x: 1950, y: 440 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 660, y: 280 }, { x: 1030, y: 230 }, { x: 1430, y: 330 }, { x: 1830, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1400, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-5: 炼油厂
ch4Levels.push({
  id: '4-5', name: '炼油厂', ...ch4Base,
  enemies: [
    { type: 'shield', x: 300, y: 460 },
    { type: 'bomber', x: 400, y: 300 },
    { type: 'turret', x: 600, y: 440 },
    { type: 'patroller', x: 750, y: 460 },
    { type: 'bomber', x: 900, y: 280 },
    { type: 'shield', x: 1100, y: 460 },
    { type: 'turret', x: 1300, y: 440 },
    { type: 'patroller', x: 1450, y: 300 },
    { type: 'bomber', x: 1650, y: 460 },
    { type: 'elite_ruins', x: 1850, y: 280 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 460, y: 280 }, { x: 820, y: 330 }, { x: 1180, y: 230 }, { x: 1530, y: 280 }, { x: 1930, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1600, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-6: 废墟之王 (Boss)
ch4Levels.push({
  id: '4-6', name: '废墟之王', isBoss: true, ...ch4Base,
  enemies: [{ type: 'boss_ruins_king', x: 2000, y: 380 }],
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
    { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
    { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
    { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
    { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
    { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
  ],
  collectibles: [],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-7: 危楼群 (hard)
ch4Levels.push({
  id: '4-7', name: '危楼群', ...ch4Base,
  enemies: [
    { type: 'turret', x: 350, y: 440 },
    { type: 'bomber', x: 500, y: 460 },
    { type: 'shield', x: 650, y: 300 },
    { type: 'bomber', x: 800, y: 460 },
    { type: 'turret', x: 950, y: 440 },
    { type: 'patroller', x: 1150, y: 350 },
    { type: 'shield', x: 1350, y: 280 },
    { type: 'bomber', x: 1550, y: 460 },
    { type: 'turret', x: 1750, y: 440 },
    { type: 'patroller', x: 1950, y: 300 },
  ],
  collectibles: [{ x: 220, y: 360 }, { x: 710, y: 280 }, { x: 1230, y: 230 }, { x: 1680, y: 330 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1450, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-8: 坍塌隧道
ch4Levels.push({
  id: '4-8', name: '坍塌隧道', ...ch4Base,
  enemies: [
    { type: 'bomber', x: 300, y: 460 },
    { type: 'bomber', x: 480, y: 460 },
    { type: 'shield', x: 620, y: 300 },
    { type: 'patroller', x: 800, y: 460 },
    { type: 'turret', x: 1000, y: 440 },
    { type: 'bomber', x: 1200, y: 460 },
    { type: 'shield', x: 1400, y: 280 },
    { type: 'turret', x: 1600, y: 440 },
    { type: 'patroller', x: 1800, y: 350 },
    { type: 'elite_ruins', x: 2000, y: 280 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 670, y: 280 }, { x: 1080, y: 230 }, { x: 1480, y: 330 }, { x: 1880, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1500, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-9: 废弃商场
ch4Levels.push({
  id: '4-9', name: '废弃商场', ...ch4Base,
  enemies: [
    { type: 'patroller', x: 300, y: 460 },
    { type: 'turret', x: 480, y: 440 },
    { type: 'bomber', x: 620, y: 460 },
    { type: 'shield', x: 780, y: 300 },
    { type: 'turret', x: 950, y: 440 },
    { type: 'bomber', x: 1150, y: 460 },
    { type: 'patroller', x: 1300, y: 350 },
    { type: 'shield', x: 1500, y: 280 },
    { type: 'turret', x: 1700, y: 440 },
    { type: 'bomber', x: 1900, y: 460 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 650, y: 280 }, { x: 1050, y: 230 }, { x: 1380, y: 330 }, { x: 1780, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-10: 废墟中心
ch4Levels.push({
  id: '4-10', name: '废墟中心', ...ch4Base,
  enemies: [
    { type: 'shield', x: 300, y: 460 },
    { type: 'turret', x: 500, y: 440 },
    { type: 'bomber', x: 680, y: 460 },
    { type: 'patroller', x: 850, y: 300 },
    { type: 'shield', x: 1050, y: 460 },
    { type: 'turret', x: 1250, y: 440 },
    { type: 'bomber', x: 1450, y: 460 },
    { type: 'patroller', x: 1600, y: 350 },
    { type: 'elite_ruins', x: 1850, y: 280 },
    { type: 'turret', x: 2050, y: 440 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 740, y: 280 }, { x: 1130, y: 230 }, { x: 1530, y: 330 }, { x: 1930, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1600, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-11: 暗区前沿
ch4Levels.push({
  id: '4-11', name: '暗区前沿', ...ch4Base,
  enemies: [
    { type: 'bomber', x: 300, y: 460 },
    { type: 'shield', x: 450, y: 300 },
    { type: 'turret', x: 650, y: 440 },
    { type: 'bomber', x: 800, y: 460 },
    { type: 'patroller', x: 950, y: 460 },
    { type: 'shield', x: 1150, y: 280 },
    { type: 'turret', x: 1350, y: 440 },
    { type: 'bomber', x: 1550, y: 460 },
    { type: 'patroller', x: 1700, y: 350 },
    { type: 'turret', x: 1900, y: 440 },
    { type: 'elite_ruins', x: 2100, y: 280 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 500, y: 280 }, { x: 880, y: 330 }, { x: 1230, y: 230 }, { x: 1630, y: 280 }, { x: 2030, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1650, y: 260, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch4-12: 城市之心 (Boss hard)
ch4Levels.push({
  id: '4-12', name: '城市之心', isBoss: true, ...ch4Base,
  enemies: [{ type: 'boss_ruins_king', x: 2000, y: 380 }],
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
    { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
    { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
    { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
    { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
    { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
  ],
  collectibles: [],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

export const CHAPTER4 = {
  id: 4,
  name: '废墟都市',
  theme: 'ruins_city',
  bgColor1: '#1a0a0a',
  bgColor2: '#2a1010',
  accentColor: '#ff4400',
  levels: ch4Levels,
};

// ============================================================
// Chapter 5: 地下基地 (Underground Base) - military facility theme
// 12 Levels (5-1 to 5-6 normal, 5-7 to 5-11 hard, 5-12 boss)
// ============================================================
const ch5Levels = [];
const ch5Base = {
  width: 2400, height: 800,
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 370, w: 150, h: 20, type: 'platform' },
    { x: 450, y: 290, w: 140, h: 20, type: 'platform' },
    { x: 700, y: 340, w: 130, h: 20, type: 'platform' },
    { x: 930, y: 260, w: 160, h: 20, type: 'platform' },
    { x: 1180, y: 310, w: 130, h: 20, type: 'platform' },
    { x: 1420, y: 250, w: 170, h: 20, type: 'platform' },
    { x: 1650, y: 350, w: 130, h: 20, type: 'platform' },
    { x: 1880, y: 280, w: 190, h: 20, type: 'platform' },
    { x: 2130, y: 390, w: 180, h: 20, type: 'platform' },
  ],
};

// Ch5-1: 基地入口
ch5Levels.push({
  id: '5-1', name: '基地入口', ...ch5Base,
  enemies: [
    { type: 'stalker', x: 350, y: 460 },
    { type: 'patroller', x: 550, y: 290 },
    { type: 'stalker', x: 700, y: 460 },
    { type: 'hacker', x: 950, y: 280 },
    { type: 'patroller', x: 1200, y: 460 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 500, y: 270 }, { x: 780, y: 320 }, { x: 1020, y: 240 }],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-2: 通道走廊
ch5Levels.push({
  id: '5-2', name: '通道走廊', ...ch5Base,
  enemies: [
    { type: 'hacker', x: 300, y: 460 },
    { type: 'stalker', x: 500, y: 290 },
    { type: 'artillery', x: 750, y: 460 },
    { type: 'patroller', x: 1000, y: 460 },
    { type: 'hacker', x: 1250, y: 280 },
    { type: 'stalker', x: 1500, y: 460 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 560, y: 270 }, { x: 820, y: 320 }, { x: 1320, y: 240 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1100, y: 290, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-3: 实验舱
ch5Levels.push({
  id: '5-3', name: '实验舱', ...ch5Base,
  enemies: [
    { type: 'artillery', x: 350, y: 460 },
    { type: 'stalker', x: 550, y: 290 },
    { type: 'hacker', x: 750, y: 460 },
    { type: 'patroller', x: 950, y: 460 },
    { type: 'artillery', x: 1200, y: 460 },
    { type: 'stalker', x: 1450, y: 290 },
    { type: 'hacker', x: 1700, y: 460 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 600, y: 270 }, { x: 830, y: 320 }, { x: 1280, y: 240 }, { x: 1780, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1350, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-4: 动力核心
ch5Levels.push({
  id: '5-4', name: '动力核心', ...ch5Base,
  enemies: [
    { type: 'patroller', x: 300, y: 460 },
    { type: 'stalker', x: 500, y: 290 },
    { type: 'artillery', x: 700, y: 460 },
    { type: 'hacker', x: 900, y: 280 },
    { type: 'stalker', x: 1150, y: 460 },
    { type: 'artillery', x: 1400, y: 460 },
    { type: 'patroller', x: 1600, y: 350 },
    { type: 'hacker', x: 1850, y: 460 },
    { type: 'elite_base', x: 2050, y: 290 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 560, y: 270 }, { x: 970, y: 240 }, { x: 1380, y: 320 }, { x: 1780, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1500, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-5: 废弃研究所
ch5Levels.push({
  id: '5-5', name: '废弃研究所', ...ch5Base,
  enemies: [
    { type: 'hacker', x: 300, y: 460 },
    { type: 'artillery', x: 480, y: 460 },
    { type: 'stalker', x: 680, y: 290 },
    { type: 'patroller', x: 880, y: 460 },
    { type: 'artillery', x: 1100, y: 460 },
    { type: 'stalker', x: 1300, y: 290 },
    { type: 'hacker', x: 1550, y: 460 },
    { type: 'patroller', x: 1750, y: 350 },
    { type: 'elite_base', x: 1950, y: 290 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 540, y: 270 }, { x: 950, y: 320 }, { x: 1380, y: 240 }, { x: 1630, y: 290 }, { x: 2030, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-6: 基地指挥官 (Boss)
ch5Levels.push({
  id: '5-6', name: '基地指挥官', isBoss: true, ...ch5Base,
  enemies: [{ type: 'boss_base_commander', x: 2000, y: 380 }],
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
    { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
    { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
    { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
    { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
    { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
  ],
  collectibles: [],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-7: 隔离区 (hard)
ch5Levels.push({
  id: '5-7', name: '隔离区', ...ch5Base,
  enemies: [
    { type: 'stalker', x: 350, y: 460 },
    { type: 'artillery', x: 550, y: 460 },
    { type: 'hacker', x: 750, y: 290 },
    { type: 'stalker', x: 950, y: 460 },
    { type: 'artillery', x: 1200, y: 460 },
    { type: 'patroller', x: 1400, y: 350 },
    { type: 'hacker', x: 1650, y: 460 },
    { type: 'stalker', x: 1850, y: 290 },
    { type: 'elite_base', x: 2050, y: 460 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 600, y: 270 }, { x: 1030, y: 320 }, { x: 1480, y: 240 }, { x: 1930, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-8: 燃料库
ch5Levels.push({
  id: '5-8', name: '燃料库', ...ch5Base,
  enemies: [
    { type: 'hacker', x: 300, y: 460 },
    { type: 'patroller', x: 500, y: 290 },
    { type: 'artillery', x: 700, y: 460 },
    { type: 'stalker', x: 900, y: 460 },
    { type: 'hacker', x: 1150, y: 280 },
    { type: 'artillery', x: 1400, y: 460 },
    { type: 'patroller', x: 1600, y: 350 },
    { type: 'stalker', x: 1800, y: 460 },
    { type: 'elite_base', x: 2000, y: 290 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 560, y: 270 }, { x: 980, y: 320 }, { x: 1230, y: 240 }, { x: 1680, y: 290 }, { x: 2080, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1500, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-9: 通讯室
ch5Levels.push({
  id: '5-9', name: '通讯室', ...ch5Base,
  enemies: [
    { type: 'artillery', x: 300, y: 460 },
    { type: 'hacker', x: 500, y: 290 },
    { type: 'stalker', x: 700, y: 460 },
    { type: 'patroller', x: 900, y: 460 },
    { type: 'artillery', x: 1150, y: 460 },
    { type: 'hacker', x: 1350, y: 290 },
    { type: 'stalker', x: 1600, y: 460 },
    { type: 'patroller', x: 1800, y: 350 },
    { type: 'artillery', x: 2000, y: 460 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 560, y: 270 }, { x: 980, y: 320 }, { x: 1230, y: 240 }, { x: 1680, y: 290 }, { x: 2080, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1600, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-10: 要塞大门
ch5Levels.push({
  id: '5-10', name: '要塞大门', ...ch5Base,
  enemies: [
    { type: 'patroller', x: 300, y: 460 },
    { type: 'stalker', x: 500, y: 290 },
    { type: 'artillery', x: 700, y: 460 },
    { type: 'hacker', x: 900, y: 280 },
    { type: 'stalker', x: 1150, y: 460 },
    { type: 'artillery', x: 1400, y: 460 },
    { type: 'patroller', x: 1600, y: 350 },
    { type: 'hacker', x: 1800, y: 460 },
    { type: 'elite_base', x: 2000, y: 290 },
    { type: 'artillery', x: 2150, y: 460 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 560, y: 270 }, { x: 970, y: 320 }, { x: 1230, y: 240 }, { x: 1680, y: 290 }, { x: 2080, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-11: 指挥中枢
ch5Levels.push({
  id: '5-11', name: '指挥中枢', ...ch5Base,
  enemies: [
    { type: 'hacker', x: 300, y: 460 },
    { type: 'artillery', x: 480, y: 460 },
    { type: 'stalker', x: 680, y: 290 },
    { type: 'patroller', x: 880, y: 460 },
    { type: 'artillery', x: 1100, y: 460 },
    { type: 'hacker', x: 1300, y: 280 },
    { type: 'stalker', x: 1550, y: 460 },
    { type: 'patroller', x: 1750, y: 350 },
    { type: 'elite_base', x: 1950, y: 290 },
    { type: 'artillery', x: 2100, y: 460 },
  ],
  collectibles: [{ x: 270, y: 350 }, { x: 540, y: 270 }, { x: 950, y: 320 }, { x: 1380, y: 240 }, { x: 1630, y: 290 }, { x: 2030, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1600, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch5-12: 基地核心 (Boss hard)
ch5Levels.push({
  id: '5-12', name: '基地核心', isBoss: true, ...ch5Base,
  enemies: [{ type: 'boss_base_commander', x: 2000, y: 380 }],
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
    { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
    { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
    { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
    { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
    { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
  ],
  collectibles: [],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

export const CHAPTER5 = {
  id: 5,
  name: '地下基地',
  theme: 'underground_base',
  bgColor1: '#0a0f0a',
  bgColor2: '#0a150a',
  accentColor: '#00ff44',
  levels: ch5Levels,
};

// ============================================================
// Chapter 6: 核心区域 (Core Region) - final chapter theme
// 10 Levels (6-1 to 6-5 normal, 6-6 boss, 6-7 to 6-9 hard, 6-10 final boss)
// ============================================================
const ch6Levels = [];
const ch6Base = {
  width: 2400, height: 800,
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 180, y: 380, w: 140, h: 20, type: 'platform' },
    { x: 420, y: 300, w: 130, h: 20, type: 'platform' },
    { x: 660, y: 340, w: 120, h: 20, type: 'platform' },
    { x: 880, y: 260, w: 150, h: 20, type: 'platform' },
    { x: 1130, y: 310, w: 140, h: 20, type: 'platform' },
    { x: 1370, y: 250, w: 160, h: 20, type: 'platform' },
    { x: 1610, y: 350, w: 130, h: 20, type: 'platform' },
    { x: 1840, y: 280, w: 190, h: 20, type: 'platform' },
    { x: 2100, y: 400, w: 180, h: 20, type: 'platform' },
  ],
};

// Ch6-1: 核心入口
ch6Levels.push({
  id: '6-1', name: '核心入口', ...ch6Base,
  enemies: [
    { type: 'elite_mutant', x: 350, y: 460 },
    { type: 'guardian', x: 600, y: 460 },
    { type: 'patroller', x: 850, y: 280 },
    { type: 'elite_mutant', x: 1100, y: 460 },
    { type: 'guardian', x: 1400, y: 460 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 480, y: 280 }, { x: 760, y: 320 }, { x: 1180, y: 240 }],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-2: 融合通道
ch6Levels.push({
  id: '6-2', name: '融合通道', ...ch6Base,
  enemies: [
    { type: 'guardian', x: 300, y: 460 },
    { type: 'elite_mutant', x: 500, y: 300 },
    { type: 'guardian', x: 750, y: 460 },
    { type: 'patroller', x: 1000, y: 460 },
    { type: 'elite_mutant', x: 1250, y: 300 },
    { type: 'guardian', x: 1500, y: 460 },
    { type: 'core_fusion_drone', x: 1750, y: 280 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 560, y: 280 }, { x: 830, y: 320 }, { x: 1330, y: 240 }, { x: 1830, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1200, y: 280, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-3: 变异区
ch6Levels.push({
  id: '6-3', name: '变异区', ...ch6Base,
  enemies: [
    { type: 'elite_mutant', x: 300, y: 460 },
    { type: 'guardian', x: 520, y: 460 },
    { type: 'core_fusion_drone', x: 750, y: 300 },
    { type: 'elite_mutant', x: 950, y: 460 },
    { type: 'guardian', x: 1200, y: 460 },
    { type: 'patroller', x: 1450, y: 350 },
    { type: 'elite_mutant', x: 1700, y: 460 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 580, y: 280 }, { x: 820, y: 320 }, { x: 1280, y: 240 }, { x: 1780, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1350, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-4: 核心回廊
ch6Levels.push({
  id: '6-4', name: '核心回廊', ...ch6Base,
  enemies: [
    { type: 'guardian', x: 300, y: 460 },
    { type: 'elite_mutant', x: 500, y: 300 },
    { type: 'guardian', x: 700, y: 460 },
    { type: 'core_fusion_drone', x: 900, y: 280 },
    { type: 'elite_mutant', x: 1150, y: 460 },
    { type: 'guardian', x: 1400, y: 460 },
    { type: 'patroller', x: 1600, y: 350 },
    { type: 'elite_mutant', x: 1850, y: 280 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 560, y: 280 }, { x: 970, y: 320 }, { x: 1230, y: 240 }, { x: 1680, y: 290 }, { x: 1930, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1500, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-5: 能量熔炉
ch6Levels.push({
  id: '6-5', name: '能量熔炉', ...ch6Base,
  enemies: [
    { type: 'core_fusion_drone', x: 300, y: 280 },
    { type: 'elite_mutant', x: 500, y: 460 },
    { type: 'guardian', x: 700, y: 460 },
    { type: 'core_fusion_drone', x: 900, y: 300 },
    { type: 'elite_mutant', x: 1150, y: 460 },
    { type: 'guardian', x: 1400, y: 460 },
    { type: 'core_fusion_drone', x: 1600, y: 280 },
    { type: 'patroller', x: 1800, y: 350 },
    { type: 'elite_mutant', x: 2000, y: 460 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 560, y: 280 }, { x: 970, y: 320 }, { x: 1230, y: 240 }, { x: 1680, y: 290 }, { x: 2080, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-6: 核心守护者 (Boss)
ch6Levels.push({
  id: '6-6', name: '核心守护者', isBoss: true, ...ch6Base,
  enemies: [{ type: 'boss_core_guardian', x: 2000, y: 380 }],
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
    { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
    { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
    { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
    { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
    { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
  ],
  collectibles: [],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-7: 意志侵蚀 (hard)
ch6Levels.push({
  id: '6-7', name: '意志侵蚀', ...ch6Base,
  enemies: [
    { type: 'elite_mutant', x: 300, y: 460 },
    { type: 'guardian', x: 520, y: 460 },
    { type: 'core_fusion_drone', x: 750, y: 300 },
    { type: 'elite_mutant', x: 950, y: 460 },
    { type: 'guardian', x: 1200, y: 460 },
    { type: 'core_fusion_drone', x: 1450, y: 280 },
    { type: 'elite_mutant', x: 1700, y: 460 },
    { type: 'guardian', x: 1950, y: 460 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 580, y: 280 }, { x: 1030, y: 320 }, { x: 1530, y: 240 }, { x: 2030, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-8: 核心深处
ch6Levels.push({
  id: '6-8', name: '核心深处', ...ch6Base,
  enemies: [
    { type: 'guardian', x: 300, y: 460 },
    { type: 'elite_mutant', x: 500, y: 300 },
    { type: 'core_fusion_drone', x: 720, y: 460 },
    { type: 'guardian', x: 950, y: 460 },
    { type: 'elite_mutant', x: 1200, y: 300 },
    { type: 'core_fusion_drone', x: 1450, y: 460 },
    { type: 'guardian', x: 1700, y: 460 },
    { type: 'patroller', x: 1900, y: 350 },
    { type: 'elite_mutant', x: 2100, y: 280 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 560, y: 280 }, { x: 1030, y: 320 }, { x: 1280, y: 240 }, { x: 1780, y: 290 }, { x: 2180, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1550, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-9: 核心融合
ch6Levels.push({
  id: '6-9', name: '核心融合', ...ch6Base,
  enemies: [
    { type: 'elite_mutant', x: 300, y: 460 },
    { type: 'core_fusion_drone', x: 500, y: 300 },
    { type: 'guardian', x: 700, y: 460 },
    { type: 'elite_mutant', x: 920, y: 460 },
    { type: 'core_fusion_drone', x: 1150, y: 280 },
    { type: 'guardian', x: 1400, y: 460 },
    { type: 'elite_mutant', x: 1650, y: 300 },
    { type: 'core_fusion_drone', x: 1850, y: 460 },
    { type: 'guardian', x: 2050, y: 460 },
  ],
  collectibles: [{ x: 250, y: 360 }, { x: 560, y: 280 }, { x: 1030, y: 320 }, { x: 1230, y: 240 }, { x: 1730, y: 290 }, { x: 2130, y: 260 }],
  shrines: [{ x: 150, y: 460, active: false }, { x: 1600, y: 270, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

// Ch6-10: 核心意志 (Final Boss - Multi-phase)
ch6Levels.push({
  id: '6-10', name: '核心意志', isBoss: true, ...ch6Base,
  enemies: [{ type: 'boss_core_will', x: 2000, y: 380 }],
  platforms: [
    { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
    { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
    { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
    { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
    { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
    { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
    { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
  ],
  collectibles: [],
  shrines: [{ x: 150, y: 460, active: true }],
  portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
});

export const CHAPTER6 = {
  id: 6,
  name: '核心区域',
  theme: 'core_region',
  bgColor1: '#05051a',
  bgColor2: '#0a052a',
  accentColor: '#ff00ff',
  levels: ch6Levels,
};

export const ALL_CHAPTERS = [CHAPTER1, CHAPTER2, CHAPTER3, CHAPTER4, CHAPTER5, CHAPTER6];
