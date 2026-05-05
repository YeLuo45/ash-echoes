import { GameV2 } from './core/GameV2.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 960;
canvas.height = 540;

const game = new GameV2(canvas, ctx);

// Hide start screen and show V2 mode select
document.getElementById('start-screen').style.display = 'none';
document.getElementById('game-over-screen').style.display = 'none';

game.start();

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  game.showModeSelect();
});

document.getElementById('restart-btn').addEventListener('click', () => {
  document.getElementById('game-over-screen').style.display = 'none';
  game.showModeSelect();
});
