const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let flowers = [];
let autoMode = false;
let time = 0;

// Set up the canvas to fill the screen
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// The Colour Palette: Added several shades of Blue as requested
const palette = [
    '#FFD700', // Gold
    '#FF69B4', // Hot Pink
    '#00BFFF', // Deep Sky Blue
    '#1E90FF', // Dodger Blue
    '#4169E1', // Royal Blue
    '#00FFFF', // Cyan
    '#7FFFD4', // Aquamarine
    '#8A2BE2', // Blue Violet
    '#F0F8FF'  // Alice Blue
];

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.stemHeight = canvas.height - y;
        this.growProgress = 0;
        this.bloomSize = 0;
        this.maxBloomSize = Math.random() * 30 + 25;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.swayOffset = Math.random() * 100;
        this.swaySpeed = 0.015 + Math.random() * 0.02;
        this.petals = Math.floor(Math.random() * 3) + 6;
    }

    draw() {
        // Calculate swaying motion
        const wind = Math.sin(time * this.swaySpeed + this.swayOffset) * 18;

        // 1. Draw the Stem (Dark Green)
        ctx.beginPath();
        ctx.moveTo(this.x, canvas.height);
        ctx.bezierCurveTo(
            this.x + 10 + wind, canvas.height - this.stemHeight / 2,
            this.x - 10 + wind, canvas.height - this.stemHeight * 0.8,
            this.x + wind, this.y
        );
        ctx.strokeStyle = '#2d4c1e';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 2. Draw Tiny White Glow Leaves
        if (this.growProgress > 0.4) {
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.beginPath();
            ctx.ellipse(this.x + wind - 8, this.y + 40, 3, 6, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + wind + 8, this.y + 60, 3, 6, -Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Draw the Flower Head
        if (this.growProgress >= 1) {
            ctx.save();
            ctx.translate(this.x + wind, this.y);
            
            // Bloom Neon Glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;

            for (let i = 0; i < this.petals; i++) {
                ctx.beginPath();
                ctx.rotate((Math.PI * 2) / this.petals);
                ctx.ellipse(0, -this.bloomSize/2, this.bloomSize/3, this.bloomSize, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Bright Center Spark
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
            this.growProgress += 0.02; // Growing up
        } else if (this.bloomSize < this.maxBloomSize) {
            this.bloomSize += 0.5; // Petals opening
        }
    }
}

// Unified input handler for Mouse and Touch
function handleInput(e) {
    if (e.type === 'touchstart') e.preventDefault();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
        flowers.push(new Flower(clientX, clientY));
        // Simple haptic for mobile
        if (navigator.vibrate) navigator.vibrate(5);
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

    if (autoMode && Math.random() < 0.04) {
        flowers.push(new Flower(Math.random() * canvas.width, Math.random() * (canvas.height * 0.7)));
    }
    
    requestAnimationFrame(animate);
}

// Event Listeners
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput, {passive: false});

document.getElementById('clearBtn').onclick = () => { flowers = []; };
document.getElementById('autoBtn').onclick = () => { 
    autoMode = !autoMode; 
    document.getElementById('autoBtn').innerText = autoMode ? "✨ Auto: ON" : "✨ Auto Bloom";
};

// Start the loop
animate();