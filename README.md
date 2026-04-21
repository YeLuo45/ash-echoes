# 残响纪元 (Ash Echoes)

2.5D 侧视角射击类魂游戏 / 2.5D Side-Scrolling Soulslike Shooter

## 访问地址

https://yeluo45.github.io/ash-echoes/

## 游戏说明

大崩灭后的碎片世界，你是一名失忆的残响猎人，在漂浮的残岛遗迹中探索并对抗被回响污染的敌人。

## 操作方式

| 按键 | 动作 |
|------|------|
| WASD / 方向键 | 移动 |
| 空格 | 闪避（无敌帧） |
| J | 射击 |
| K | 回响脉冲（消耗共振能量） |

## 核心机制

- **快节奏弹幕射击** — 精准射击 + 闪避无敌帧
- **回响能力** — 收集回响碎片释放技能（脉冲/诱饵/减速）
- **类魂惩罚** — 死亡损失携带的回响碎片
- **回响侵蚀** — 角色会逐渐被回响污染（视觉变化 + 属性下降）

## 游戏内容

- 13个敌人（含 BOSS）
- 3个存档点（回响祭坛）
- 10个回响碎片收集
- 4种敌人类型：拾荒者、巡逻兵、远程兵、精英
- 1个 BOSS 战

## 目录结构

```
ash-echoes/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js
│   ├── core/         # 游戏核心（Game, Input, Camera）
│   ├── gameplay/     # 玩法逻辑（Player, Enemy, Projectile, Level）
│   ├── ui/           # UI 渲染
│   └── utils/        # 粒子系统
└── dist/             # 构建产物（GitHub Pages 部署）
```

## 本地运行

```bash
npm install
npm run dev    # 开发服务器 localhost:5173
npm run build  # 生产构建
```
