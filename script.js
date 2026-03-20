const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let flowers = [];
let autoMode = false;
let time = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// VARIETY PALETTE: Dominant Blues + Pink & Gold
const palette = [
    '#00FFFF', // Cyan
    '#1E90FF', // Dodger Blue
    '#00BFFF', // Deep Sky Blue
    '#4169E1', // Royal Blue
    '#87CEEB', // Sky Blue
    '#5f9ea0', // Cadet Blue
    '#FF69B4', // Hot Pink
    '#FFD700', // Gold
    '#FFFFFF'  // White Glow
];

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.stemHeight = canvas.height - y;
        this.growProgress = 0;
        this.bloomSize = 0;
        this.maxBloomSize = Math.random() * 30 + 25;
        
        // Pick a random color from the expanded palette
        this.color = palette[Math.floor(Math.random() * palette.length)];
        
        this.swayOffset = Math.random() * 100;
        this.swaySpeed = 0.02 + Math.random() * 0.01;
        this.petals = Math.floor(Math.random() * 3) + 6;
    }

    draw() {
        // Natural wind sway math
        const wind = Math.sin(time * this.swaySpeed + this.swayOffset) * 15;

        // Draw the curved stem
        ctx.beginPath();
        ctx.moveTo(this.x, canvas.height);
        ctx.bezierCurveTo(
            this.x + 15 + wind, canvas.height - this.stemHeight / 2,
            this.x - 15 + wind, canvas.height - this.stemHeight * 0.8,
            this.x + wind, this.y
        );
        ctx.strokeStyle = '#3d5a2b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // White glowing leaves
        if (this.growProgress > 0.4) {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.beginPath();
            ctx.ellipse(this.x + wind - 8, this.y + 45, 3, 6, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + wind + 8, this.y + 65, 3, 6, -Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw the glowing flower head
        if (this.growProgress >= 1) {
            ctx.save();
            ctx.translate(this.x + wind, this.y);
            
            ctx.shadowBlur = 25;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;

            for (let i = 0; i < this.petals; i++) {
                ctx.beginPath();
                ctx.rotate((Math.PI * 2) / this.petals);
                ctx.ellipse(0, -this.bloomSize/2, this.bloomSize/3, this.bloomSize, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // White glowing center
            ctx.shadowBlur = 5;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(0, 0, this.bloomSize/6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    update() {
        if (this.growProgress < 1) {
            this.growProgress += 0.02;
        } else if (this.bloomSize < this.maxBloomSize) {
            this.bloomSize += 0.5;
        }
    }
}

function handleInput(e) {
    if (e.type === 'touchstart') e.preventDefault();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX && clientY) {
        flowers.push(new Flower(clientX, clientY));
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    time += 1;

    flowers.forEach(f => {
        f.update();
        f.draw();
    });

    if (autoMode && Math.random() < 0.05) {
        flowers.push(new Flower(Math.random() * canvas.width, Math.random() * (canvas.height * 0.7)));
    }
    requestAnimationFrame(animate);
}

// Event Listeners for Interaction
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput, {passive: false});

document.getElementById('clearBtn').onclick = () => { flowers = []; };
document.getElementById('autoBtn').onclick = () => { 
    autoMode = !autoMode; 
    document.getElementById('autoBtn').innerText = autoMode ? "✨ Auto: ON" : "✨ Auto Bloom";
};

// Start the animation
animate();