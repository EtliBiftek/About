(function() {
	const screenEl = document.getElementById('screen');
	const startBtn = document.getElementById('startBtn');
	const messageEl = document.getElementById('message');
	const bestEl = document.getElementById('best');

	let state = 'idle'; // idle | waiting | go
	let timeoutId = null;
	let startTime = 0;
	let best = null;

	function loadBest() {
		try {
			const v = localStorage.getItem('reaction_best_ms');
			best = v ? Number(v) : null;
			bestEl.textContent = best != null ? String(best) : '-';
		} catch (_) {
			best = null;
			bestEl.textContent = '-';
		}
	}

	function saveBest(ms) {
		if (best == null || ms < best) {
			best = ms;
			bestEl.textContent = String(best);
			try { localStorage.setItem('reaction_best_ms', String(ms)); } catch (_) {}
		}
	}

	function resetToIdle() {
		clearTimer();
		state = 'idle';
		screenEl.classList.remove('wait', 'go');
		screenEl.classList.add('ready');
		screenEl.textContent = "Hazır olduğunuzda Başla'ya basın";
		messageEl.textContent = 'Beklemede';
	}

	function clearTimer() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	function startWaiting() {
		clearTimer();
		state = 'waiting';
		screenEl.classList.remove('ready', 'go');
		screenEl.classList.add('wait');
		screenEl.textContent = 'Renk değişince tıklayın!';
		messageEl.textContent = 'Bekleniyor (2-5 sn)';
		const delay = 2000 + Math.random() * 3000;
		timeoutId = setTimeout(() => {
			state = 'go';
			screenEl.classList.remove('wait');
			screenEl.classList.add('go');
			screenEl.textContent = '';
			messageEl.textContent = 'Tıkla ve süren hesaplansın';
			// Align start time to when the color change is actually painted
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					startTime = performance.now();
				});
			});
			timeoutId = null;
		}, delay);
	}

	function handleScreenClick(e) {
		// Only accept primary button if using mouse
		if (e && e.pointerType === 'mouse' && e.button !== 0) return;
		// Start by clicking the screen when idle
		if (state === 'idle') {
			startWaiting();
			return;
		}
		if (state === 'waiting') {
			// False start
			clearTimer();
			state = 'idle';
			screenEl.classList.remove('wait', 'go');
			screenEl.classList.add('ready');
			screenEl.textContent = 'Çok erken tıkladınız.';
			messageEl.textContent = 'Uyarı: Renk değişmeden tıkladınız.';
			return;
		}
		if (state === 'go') {
			const elapsed = Math.round(performance.now() - startTime);
			screenEl.textContent = `${elapsed} ms`; 
			messageEl.textContent = '';
			saveBest(elapsed);
			state = 'idle';
			screenEl.classList.remove('go');
			screenEl.classList.add('ready');
			return;
		}
	}

	function onKey(e) {
		if (e.code === 'Space') {
			e.preventDefault();
			if (state === 'idle') startWaiting();
			else if (state === 'go') handleScreenClick();
		}
		if (e.code === 'Enter') {
			if (state === 'go') handleScreenClick();
		}
	}

	startBtn.addEventListener('click', () => {
		if (state === 'idle') startWaiting();
	});
	
	// pointerdown fires earlier than click/mouseup on many platforms
	screenEl.addEventListener('pointerdown', handleScreenClick);
	document.addEventListener('keydown', onKey);

	// Init
	loadBest();
	resetToIdle();
})();


