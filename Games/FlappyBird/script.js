// script.js
// Flappy Bird Clone - HTML5 Canvas (No external libraries)
// Author: You
// Notes:
// - Default canvas size is 400x600 (logical units). Responsive scaling is handled via CSS aspect-ratio.
// - Drawn art (no external images), WebAudio for tiny SFX, localStorage for high score.
// - Clear organization: constants, state, systems (audio, input, spawn/pool), update, draw, UI binding.

// ============================
// Tunable Physics & Game Config
// ============================
let GRAVITY = 0.08;            // px/frame^2 (range: 0.25–0.6) — lowered for slower fall
let FLAP_VELOCITY = -3.5;      // px/frame
let PIPE_VELOCITY = 2.5;       // px/frame
let PIPE_SPAWN_INTERVAL = 1600;// ms
let PIPE_GAP = 150;            // px (recommend 130–200)
let GROUND_HEIGHT = 112;       // px

// Visual/Gameplay parameters
const LOGICAL_WIDTH = 400;
const LOGICAL_HEIGHT = 600;
const BIRD_X = 100;
const PIPE_WIDTH = 80;
const PIPE_MIN_Y = 60; // minimum top pipe height
const SKY_COLOR_TOP = '#8be7ff';
const SKY_COLOR_BOTTOM = '#e0f9ff';

// Debug default
let DEBUG = false;

// Difficulty presets
const EASY_MODE = {
	pipeGap: 180,
	pipeVelocity: 2.2
};

const NORMAL_MODE = {
	pipeGap: 150,
	pipeVelocity: 2.5
};

// ============================
// Canvas & Context (DPR aware)
// ============================
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });
let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

function setupCanvas() {
	// Render at device pixel ratio for crispness, draw in logical units
	dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
	canvas.width = Math.floor(LOGICAL_WIDTH * dpr);
	canvas.height = Math.floor(LOGICAL_HEIGHT * dpr);
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
setupCanvas();
window.addEventListener('resize', setupCanvas);

// ============================
// Game State
// ============================
const State = Object.freeze({
	Menu: 'menu',
	Playing: 'playing',
	GameOver: 'gameover',
	Paused: 'paused'
});

let gameState = State.Menu;
let lastTime = performance.now();
let spawnTimer = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem('flappy_highscore') || '0', 10);

// Bird
const bird = {
	x: BIRD_X,
	y: LOGICAL_HEIGHT * 0.4,
	radius: 12,
	vy: 0,
	angle: 0,            // rotation in radians
	wingPhase: 0,        // 0..1 for wing animation
	wingTimer: 0,        // ms
	alive: true
};

// Particles (for collision)
const particles = [];
function spawnExplosion(x, y) {
	for (let i = 0; i < 28; i++) {
		const angle = Math.random() * Math.PI * 2;
		const speed = 2 + Math.random() * 3.5;
		particles.push({
			x, y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed - 1,
			life: 600 + Math.random() * 400,
			age: 0,
			size: 2 + Math.random() * 2,
			color: `hsl(${Math.floor(10 + Math.random() * 50)}, 90%, ${60 + Math.random() * 20}%)`
		});
	}
}

// Pipes (object pool of pairs)
const pipePool = [];
const activePipes = []; // references to active pairs
const MAX_POOL = 8;

// Each pair: { x, gapY, scored, active }
function createPipePair() {
	return { x: LOGICAL_WIDTH + PIPE_WIDTH, gapY: 260, scored: false, active: false };
}
for (let i = 0; i < MAX_POOL; i++) pipePool.push(createPipePair());

function acquirePipePair() {
	for (const p of pipePool) {
		if (!p.active) return p;
	}
	// As a fallback (should not happen with reasonable pool size), reuse oldest
	return pipePool[0];
}

function spawnPipePair() {
	const pair = acquirePipePair();
	const minCenter = Math.max(PIPE_MIN_Y + PIPE_GAP * 0.5, 80);
	const maxCenter = LOGICAL_HEIGHT - GROUND_HEIGHT - PIPE_MIN_Y - PIPE_GAP * 0.5;
	pair.gapY = Math.floor(minCenter + Math.random() * (maxCenter - minCenter));
	pair.x = LOGICAL_WIDTH + PIPE_WIDTH;
	pair.scored = false;
	pair.active = true;
	if (!activePipes.includes(pair)) activePipes.push(pair);
}

// ============================
// Input
// ============================
const keysDown = new Set();

function handleFlap() {
	if (gameState === State.Menu) {
		startGame();
		return;
	}
	if (gameState === State.GameOver) {
		// Oyun bitti ekranında yalnızca buton veya 'R' ile yeniden başlatılacak
		return;
	}
	if (gameState === State.Playing) {
		bird.vy = FLAP_VELOCITY;
		bird.angle = -0.4; // tilt up quickly
		playFlapSfx();
	}
}

function onKeyDown(e) {
	if (e.repeat) return;
	if (e.code === 'Space' || e.code === 'ArrowUp') {
		e.preventDefault();
		keysDown.add(e.code);
		handleFlap();
	}
	if (e.code === 'KeyP') {
		if (gameState === State.Playing) gameState = State.Paused;
		else if (gameState === State.Paused) gameState = State.Playing;
	}
	if (e.code === 'KeyR') {
		restartGame();
	}
	if (e.code === 'KeyM') {
		toggleMute();
	}
}
function onKeyUp(e) {
	keysDown.delete(e.code);
}
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// Pointer/touch flap
canvas.addEventListener('pointerdown', () => {
	resumeAudioIfNeeded();
	// Oyun bitti ekranında tıklama ile yeniden başlatma yok
	if (gameState !== State.GameOver) handleFlap();
});

// On-screen buttons
document.getElementById('playBtn').addEventListener('click', () => { resumeAudioIfNeeded(); startGame(); });
document.getElementById('restartBtn').addEventListener('click', () => { resumeAudioIfNeeded(); restartGame(); });
document.getElementById('mobilePlayBtn').addEventListener('click', () => { resumeAudioIfNeeded(); startGame(); });
document.getElementById('mobileRestartBtn').addEventListener('click', () => { resumeAudioIfNeeded(); restartGame(); });
document.getElementById('muteBtn').addEventListener('click', () => toggleMute());

const easyToggle = document.getElementById('easyToggle');
const debugToggle = document.getElementById('debugToggle');
const aiToggle = document.getElementById('aiToggle');
const volumeSlider = document.getElementById('volume');

easyToggle.addEventListener('change', () => {
	if (easyToggle.checked) {
		PIPE_GAP = EASY_MODE.pipeGap;
		PIPE_VELOCITY = EASY_MODE.pipeVelocity;
	} else {
		PIPE_GAP = NORMAL_MODE.pipeGap;
		PIPE_VELOCITY = NORMAL_MODE.pipeVelocity;
	}
});
debugToggle.addEventListener('change', () => { DEBUG = debugToggle.checked; });
aiToggle.addEventListener('change', () => {
	aiEnabled = aiToggle.checked;
	// AI açıldığında menüdeyse başlat; Game Over ekranında otomatik restart yapma
	if (aiEnabled && gameState === State.Menu) startGame();
});
volumeSlider.addEventListener('input', () => setVolume(parseFloat(volumeSlider.value)));

// ============================
// Audio (WebAudio, generated)
// ============================
let audioCtx = null;
let masterGain = null;
let muted = false;

function ensureAudio() {
	if (!audioCtx) {
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		masterGain = audioCtx.createGain();
		masterGain.gain.value = parseFloat(volumeSlider.value);
		masterGain.connect(audioCtx.destination);
	}
}
function resumeAudioIfNeeded() {
	ensureAudio();
	if (audioCtx.state === 'suspended') audioCtx.resume();
}
function setVolume(v) {
	ensureAudio();
	masterGain.gain.value = muted ? 0 : v;
}
function toggleMute() {
	muted = !muted;
	document.getElementById('muteBtn').setAttribute('aria-pressed', String(muted));
	setVolume(parseFloat(volumeSlider.value));
}

function blip(freq = 600, duration = 0.08, type = 'sine', gain = 0.25) {
	if (!audioCtx || muted) return;
	const osc = audioCtx.createOscillator();
	const g = audioCtx.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	g.gain.value = gain;
	osc.connect(g);
	g.connect(masterGain);
	const now = audioCtx.currentTime;
	osc.start(now);
	g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
	osc.stop(now + duration + 0.01);
}
function noiseHit(duration = 0.18, gain = 0.28) {
	if (!audioCtx || muted) return;
	const bufferSize = 1 * audioCtx.sampleRate;
	const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2);
	}
	const noise = audioCtx.createBufferSource();
	noise.buffer = buffer;

	const g = audioCtx.createGain();
	g.gain.value = gain;

	noise.connect(g);
	g.connect(masterGain);

	const now = audioCtx.currentTime;
	noise.start(now);
	g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
	noise.stop(now + duration + 0.01);
}

function playFlapSfx() { blip(650, 0.07, 'sine', 0.25); }
function playScoreSfx() { blip(880, 0.11, 'square', 0.22); }
function playHitSfx() { noiseHit(0.18, 0.3); blip(120, 0.2, 'triangle', 0.14); }

// ============================
// UI helpers
// ============================
const menuEl = document.getElementById('menu');
const gameOverEl = document.getElementById('gameover');
const bestMenuEl = document.getElementById('bestMenu');
const scoreOverEl = document.getElementById('scoreOver');
const bestOverEl = document.getElementById('bestOver');
const scoreTextEl = document.getElementById('scoreText');

function showMenu() {
	menuEl.classList.add('visible');
	gameOverEl.classList.remove('visible');
	bestMenuEl.textContent = String(highScore);
}
function showGameOver() {
	scoreOverEl.textContent = String(score);
	bestOverEl.textContent = String(highScore);
	menuEl.classList.remove('visible');
	gameOverEl.classList.add('visible');
}
function hideOverlays() {
	menuEl.classList.remove('visible');
	gameOverEl.classList.remove('visible');
}

// ============================
// Background Layers (parallax)
// ============================
const clouds = [];
for (let i = 0; i < 5; i++) {
	clouds.push({
		x: Math.random() * LOGICAL_WIDTH,
		y: 30 + Math.random() * 160,
		scale: 0.7 + Math.random() * 0.8,
		speed: 0.2 + Math.random() * 0.25
	});
}
let groundOffset = 0;

// ============================
// AI-play (optional)
// ============================
let aiEnabled = false;
let aiLastFlapTime = 0;
function aiThinkAndMaybeFlap() {
	// Bir sonraki boru boşluğu; yoksa güvenli hedef olarak ekranın %60 yüksekliği
	const next = activePipes.find(p => p.active && p.x + PIPE_WIDTH > BIRD_X - 5);
	const targetY = next ? next.gapY : (LOGICAL_HEIGHT * 0.6);

	// Histerezis ve güvenlik marjları
	const ceilMargin = 80; // tavandan güvenli mesafe
	const flapHysteresis = 10; // hedefin altına indiğinde ne kadar farkla flap başlasın

	// Çok sık flap engeli
	const now = performance.now();
	if (now - aiLastFlapTime < 160) return;

	// Tavana yakınken flap yapma
	if (bird.y < ceilMargin) return;

	// Basit öngörü (10 frame ileri): y + v*dt + 1/2*g*dt^2
	const dtFrames = 10;
	const projectedY = bird.y + bird.vy * dtFrames + 0.5 * GRAVITY * dtFrames * dtFrames;

	// Sadece düşüşteyken (veya neredeyse dururken) flap yap
	const nearlyRising = bird.vy < -0.5; // güçlü şekilde yükseliyorsa asla flap atma
	if (!nearlyRising && (projectedY > (targetY + flapHysteresis))) {
		bird.vy = FLAP_VELOCITY;
		bird.angle = -0.4;
		aiLastFlapTime = now;
		playFlapSfx();
	}
}

// ============================
// Game Flow
// ============================
function resetWorld() {
	score = 0;
	scoreTextEl.textContent = '0';
	spawnTimer = 0;
	groundOffset = 0;
	for (const p of pipePool) p.active = false;
	activePipes.length = 0;

	bird.x = BIRD_X;
	bird.y = LOGICAL_HEIGHT * 0.4;
	bird.vy = 0;
	bird.angle = 0;
	bird.alive = true;
	bird.wingPhase = 0;
	bird.wingTimer = 0;

	particles.length = 0;
}

function startGame() {
	resetWorld();
	gameState = State.Playing;
	hideOverlays();
}

function endGame() {
	gameState = State.GameOver;
	playHitSfx();
	spawnExplosion(bird.x, bird.y);
	if (score > highScore) {
		highScore = score;
		localStorage.setItem('flappy_highscore', String(highScore));
	}
	showGameOver();
}

function restartGame() {
	resetWorld();
	gameState = State.Playing;
	hideOverlays();
}

// ============================
// Collision Helpers
// ============================
function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
	// Find the closest point to the circle within the rectangle
	const closestX = Math.max(rx, Math.min(cx, rx + rw));
	const closestY = Math.max(ry, Math.min(cy, ry + rh));
	const dx = cx - closestX;
	const dy = cy - closestY;
	return (dx * dx + dy * dy) <= (cr * cr);
}

// ============================
// Update & Draw
// ============================
let fps = 60;
let fpsAccum = 0;
let fpsFrames = 0;
let fpsTimer = 0;

function update(dtMs) {
	const dt = Math.min(dtMs, 32); // clamp to avoid jumps
	if (gameState === State.Paused || gameState === State.Menu || gameState === State.GameOver) {
		// Allow subtle background motion even when not playing
		scrollBackground(dt);
		updateParticles(dt);
		return;
	}

	// AI assist
	if (aiEnabled) aiThinkAndMaybeFlap();

	// Bird physics
	bird.vy += GRAVITY;
	bird.y += bird.vy;
	// Smooth tilt: lerp towards velocity-based angle
	const targetAngle = Math.max(-0.5, Math.min(1.4, bird.vy / 10));
	bird.angle += (targetAngle - bird.angle) * 0.15;

	// Wing animation (~100ms/frame => 10 fps cycle)
	bird.wingTimer += dt;
	if (bird.wingTimer >= 100) {
		bird.wingTimer = 0;
		bird.wingPhase = (bird.wingPhase + 1) % 3; // 3-frame "flap" illusion
	}

	// Ground & ceiling collisions
	if (bird.y - bird.radius < 0) {
		bird.y = bird.radius;
		bird.vy = 0;
		endGame();
		return;
	}
	const groundY = LOGICAL_HEIGHT - GROUND_HEIGHT;
	if (bird.y + bird.radius >= groundY) {
		bird.y = groundY - bird.radius;
		endGame();
		return;
	}

	// Spawn pipes on timer
	spawnTimer += dt;
	if (spawnTimer >= PIPE_SPAWN_INTERVAL) {
		spawnTimer -= PIPE_SPAWN_INTERVAL;
		spawnPipePair();
	}

	// Move pipes, scoring and collisions
	for (const p of activePipes) {
		if (!p.active) continue;
		p.x -= PIPE_VELOCITY;

		// Scoring: when bird passes center of pipe pair
		const pipeCenterX = p.x + PIPE_WIDTH / 2;
		if (!p.scored && pipeCenterX < bird.x) {
			p.scored = true;
			score += 1;
			scoreTextEl.textContent = String(score);
			playScoreSfx();
		}

		// Collisions (circle-rect)
		const topRect = { x: p.x, y: 0, w: PIPE_WIDTH, h: p.gapY - PIPE_GAP / 2 };
		const botRect = { x: p.x, y: p.gapY + PIPE_GAP / 2, w: PIPE_WIDTH, h: LOGICAL_HEIGHT - GROUND_HEIGHT - (p.gapY + PIPE_GAP / 2) };
		if (circleRectCollision(bird.x, bird.y, bird.radius, topRect.x, topRect.y, topRect.w, topRect.h) ||
		    circleRectCollision(bird.x, bird.y, bird.radius, botRect.x, botRect.y, botRect.w, botRect.h)) {
			endGame();
			return;
		}

		// Deactivate if off-screen
		if (p.x + PIPE_WIDTH < -10) {
			p.active = false;
		}
	}

	scrollBackground(dt);
	updateParticles(dt);
}

function scrollBackground(dt) {
	groundOffset += PIPE_VELOCITY * (dt / (1000 / 60));
	// Cloud drift
	for (const c of clouds) {
		c.x -= c.speed * (dt / (1000 / 60));
		if (c.x < -60) {
			c.x = LOGICAL_WIDTH + 40;
			c.y = 20 + Math.random() * 180;
			c.scale = 0.7 + Math.random() * 0.8;
			c.speed = 0.2 + Math.random() * 0.25;
		}
	}
}

function updateParticles(dt) {
	for (let i = particles.length - 1; i >= 0; i--) {
		const p = particles[i];
		p.age += dt;
		p.x += p.vx;
		p.y += p.vy;
		p.vy += 0.12; // gravity on particles
		if (p.age >= p.life) particles.splice(i, 1);
	}
}

function draw() {
	// Sky gradient
	const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
	sky.addColorStop(0, SKY_COLOR_TOP);
	sky.addColorStop(1, SKY_COLOR_BOTTOM);
	ctx.fillStyle = sky;
	ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

	// Far mountains (simple polygons)
	drawMountains();

	// Clouds
	for (const c of clouds) drawCloud(c.x, c.y, c.scale);

	// Pipes
	for (const p of activePipes) if (p.active) drawPipePair(p);

	// Ground
	drawGround();

	// Bird
	drawBird();

	// Particles (on hit)
	drawParticles();

	// Score (center-top)
	drawScore();

	// Debug overlay
	if (DEBUG) drawDebug();
}

function drawMountains() {
	// Far layer
	ctx.fillStyle = '#b9e1f2';
	ctx.beginPath();
	ctx.moveTo(0, 280);
	ctx.lineTo(60, 200);
	ctx.lineTo(140, 260);
	ctx.lineTo(220, 180);
	ctx.lineTo(300, 260);
	ctx.lineTo(380, 190);
	ctx.lineTo(400, 250);
	ctx.lineTo(400, 320);
	ctx.lineTo(0, 320);
	ctx.closePath();
	ctx.fill();

	// Mid layer
	ctx.fillStyle = '#a6d6ec';
	ctx.beginPath();
	ctx.moveTo(0, 330);
	ctx.lineTo(70, 250);
	ctx.lineTo(150, 300);
	ctx.lineTo(230, 240);
	ctx.lineTo(320, 310);
	ctx.lineTo(400, 260);
	ctx.lineTo(400, 360);
	ctx.lineTo(0, 360);
	ctx.closePath();
	ctx.fill();
}

function drawCloud(x, y, s) {
	ctx.fillStyle = 'rgba(255,255,255,0.92)';
	ctx.beginPath();
	ctx.ellipse(x, y, 18*s, 12*s, 0, 0, Math.PI*2);
	ctx.ellipse(x+16*s, y+2*s, 14*s, 10*s, 0, 0, Math.PI*2);
	ctx.ellipse(x-16*s, y+4*s, 14*s, 10*s, 0, 0, Math.PI*2);
	ctx.fill();
}

function drawGround() {
	const groundY = LOGICAL_HEIGHT - GROUND_HEIGHT;
	// Dirt
	const grd = ctx.createLinearGradient(0, groundY, 0, LOGICAL_HEIGHT);
	grd.addColorStop(0, '#c0ad6e');
	grd.addColorStop(1, '#a58d4a');
	ctx.fillStyle = grd;
	ctx.fillRect(0, groundY, LOGICAL_WIDTH, GROUND_HEIGHT);

	// Grass strip with repeating pattern
	const tileW = 32;
	const offset = Math.floor(groundOffset % tileW);
	for (let x = -tileW + offset; x < LOGICAL_WIDTH + tileW; x += tileW) {
		ctx.fillStyle = '#79c64b';
		ctx.fillRect(x, groundY - 10, tileW, 14);
		ctx.fillStyle = '#6ab03f';
		ctx.fillRect(x + tileW * 0.5, groundY - 6, tileW * 0.5, 6);
	}
}

function drawPipePair(p) {
	const topH = p.gapY - PIPE_GAP / 2;
	const botY = p.gapY + PIPE_GAP / 2;
	const botH = (LOGICAL_HEIGHT - GROUND_HEIGHT) - botY;

	const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
	grad.addColorStop(0, '#2fbf33');
	grad.addColorStop(1, '#188e1c');
	ctx.fillStyle = grad;
	ctx.strokeStyle = '#0c5e10';
	ctx.lineWidth = 3;

	// Top pipe
	ctx.fillRect(p.x, 0, PIPE_WIDTH, topH);
	ctx.strokeRect(p.x, 0, PIPE_WIDTH, topH);
	// Top cap
	ctx.fillRect(p.x - 6, topH - 14, PIPE_WIDTH + 12, 14);
	ctx.strokeRect(p.x - 6, topH - 14, PIPE_WIDTH + 12, 14);

	// Bottom pipe
	ctx.fillRect(p.x, botY, PIPE_WIDTH, botH);
	ctx.strokeRect(p.x, botY, PIPE_WIDTH, botH);
	// Bottom cap
	ctx.fillRect(p.x - 6, botY, PIPE_WIDTH + 12, 14);
	ctx.strokeRect(p.x - 6, botY, PIPE_WIDTH + 12, 14);
}

function drawBird() {
	ctx.save();
	ctx.translate(bird.x, bird.y);
	ctx.rotate(bird.angle);

	// Body
	ctx.fillStyle = '#ffd447';
	ctx.beginPath();
	ctx.ellipse(0, 0, bird.radius + 2, bird.radius, 0, 0, Math.PI * 2);
	ctx.fill();

	// Belly
	ctx.fillStyle = '#ffe89a';
	ctx.beginPath();
	ctx.ellipse(2, 4, bird.radius - 2, bird.radius - 4, 0, 0, Math.PI * 2);
	ctx.fill();

	// Wing (3-frame illusion via vertical offset)
	const wingOffset = bird.wingPhase === 0 ? -4 : bird.wingPhase === 1 ? 0 : 4;
	ctx.fillStyle = '#ffbf3b';
	ctx.beginPath();
	ctx.ellipse(-2, wingOffset, 8, 6, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
	ctx.stroke();

	// Eye
	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.ellipse(6, -4, 4.5, 4.5, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#1b1e2b';
	ctx.beginPath();
	ctx.ellipse(7, -4, 1.8, 1.8, 0, 0, Math.PI * 2);
	ctx.fill();

	// Beak
	ctx.fillStyle = '#ff8f2c';
	ctx.beginPath();
	ctx.moveTo(12, 0);
	ctx.lineTo(20, 2);
	ctx.lineTo(12, 5);
	ctx.closePath();
	ctx.fill();

	ctx.restore();
}

function drawParticles() {
	for (const p of particles) {
		const alpha = 1 - (p.age / p.life);
		ctx.fillStyle = p.color.replace(')', `, ${Math.max(0, alpha)})`).replace('hsl', 'hsla');
		ctx.beginPath();
		ctx.rect(p.x, p.y, p.size, p.size);
		ctx.fill();
	}
}

function drawScore() {
	ctx.save();
	ctx.fillStyle = 'rgba(0,0,0,0.25)';
	ctx.font = 'bold 42px system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText(String(score), LOGICAL_WIDTH / 2, 64 + 3);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(String(score), LOGICAL_WIDTH / 2, 64);
	ctx.restore();
}

function drawDebug() {
	// FPS
	ctx.fillStyle = 'rgba(0,0,0,0.6)';
	ctx.fillRect(8, 8, 120, 48);
	ctx.fillStyle = '#00ffb3';
	ctx.font = '12px monospace';
	ctx.fillText(`FPS: ${fps.toFixed(0)}`, 14, 24);
	ctx.fillText(`Pipes: ${activePipes.filter(p => p.active).length}`, 14, 38);

	// Collision circle
	ctx.strokeStyle = '#ff4f4f';
	ctx.beginPath();
	ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
	ctx.stroke();

	// Pipe rects
	ctx.strokeStyle = '#4fff6a';
	for (const p of activePipes) if (p.active) {
		const topH = p.gapY - PIPE_GAP / 2;
		const botY = p.gapY + PIPE_GAP / 2;
		const botH = (LOGICAL_HEIGHT - GROUND_HEIGHT) - botY;

		ctx.strokeRect(p.x, 0, PIPE_WIDTH, topH);
		ctx.strokeRect(p.x, botY, PIPE_WIDTH, botH);
	}
}

// ============================
// Game Loop
// ============================
function loop(now) {
	const dt = now - lastTime;
	lastTime = now;

	// FPS calc
	fpsAccum += dt;
	fpsFrames += 1;
	fpsTimer += dt;
	if (fpsTimer >= 500) {
		fps = (fpsFrames * 1000) / fpsTimer;
		fpsFrames = 0;
		fpsTimer = 0;
	}

	update(dt);
	draw();

	requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ============================
// Init UI
// ============================
showMenu();
bestMenuEl.textContent = String(highScore);

// Accessibility: allow Enter/Space to press buttons
for (const el of document.querySelectorAll('button')) {
	el.addEventListener('keydown', (e) => {
		if (e.code === 'Space' || e.code === 'Enter') {
			e.preventDefault();
			el.click();
		}
	});
}