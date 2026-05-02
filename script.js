// --- AUDIO LOGIC ---
function playSong(file, btnElement) {
    let player = document.getElementById("player");
    player.src = file;
    player.play().catch(e => console.log("Audio play prevented or file not found."));
    
    // Visual feedback: Dim all buttons, then highlight the clicked one
    document.querySelectorAll('.song-grid button').forEach(btn => btn.style.opacity = '0.5');
    document.getElementById('surprise-btn').style.opacity = '0.5';
    
    if (btnElement) {
        btnElement.style.opacity = '1';
    }
}

function randomSong() {
    let songs = ["1.mp3", "2.mp3", "3.mp3", "4.mp3"];
    let pick = songs[Math.floor(Math.random() * songs.length)];
    let surpriseBtn = document.getElementById('surprise-btn');
    playSong(pick, surpriseBtn);
}

// --- SCREEN TRANSITION LOGIC ---
function transitionScreen(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);
    
    hideEl.style.opacity = '0';
    hideEl.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        hideEl.classList.remove('active');
        hideEl.style.display = 'none'; 
        
        showEl.style.display = 'flex';
        void showEl.offsetWidth; 
        
        showEl.classList.add('active');
    }, 500);
}

// --- COUNTDOWN LOGIC ---
function startCountdown() {
    let count = 3;
    let el = document.getElementById("countdown");
    
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'pop 1s infinite';

    let interval = setInterval(() => {
        count--;
        if(count > 0) {
            el.innerText = count;
        } else {
            clearInterval(interval);
            transitionScreen('screen-1', 'screen-2');
            startLoading();
        }
    }, 1000);
}

// --- LOADING LOGIC ---
function startLoading() {
    let progress = 0;
    let bar = document.getElementById("bar");

    let load = setInterval(() => {
        progress += Math.random() * 5 + 1; 
        if(progress > 100) progress = 100;
        
        bar.style.width = progress + "%";

        if(progress >= 100) {
            clearInterval(load);
            setTimeout(() => {
                transitionScreen('screen-2', 'screen-3');
            }, 400); 
        }
    }, 100);
}

// --- CAKE CUTTING LOGIC ---
let pressCount = 0;
const totalPresses = 5;

function blowCandles() {
    pressCount++;
    let remaining = totalPresses - pressCount;
    
    const percentage = (pressCount / totalPresses) * 100;
    document.getElementById('cake-bar').style.width = percentage + '%';
    
    const cakeImg = document.getElementById("interactive-cake");
    const scaleAmount = 1 + (pressCount * 0.1); 
    cakeImg.style.transform = `scale(${scaleAmount}) rotate(${Math.random() * 10 - 5}deg)`;

    if(remaining > 0) {
        document.getElementById("pressText").innerText = "Keep going! " + remaining + " taps left!";
    } else {
        document.getElementById("pressText").innerText = "Boom! 💥";
        setTimeout(() => {
            transitionScreen('screen-5', 'screen-6');
            startConfetti();
        }, 500);
    }
}

// --- CONFETTI ENGINE ---
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4fa1', '#ff9a9e', '#ffd700', '#a1c4fd', '#fff'];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 5 + 5,
            c: colors[Math.floor(Math.random() * colors.length)],
            dx: Math.random() * 4 - 2,
            dy: Math.random() * 5 + 2,
            rot: Math.random() * 360,
            rotSpeed: Math.random() * 5 - 2.5
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            p.y += p.dy;
            p.x += p.dx;
            p.rot += p.rotSpeed;

            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
    }
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
