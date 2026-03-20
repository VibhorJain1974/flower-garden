const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let flowers = [];
let autoMode = false;
let time = 0; // Global timer for the wind effect

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.stemHeight = canvas.height - y;
        this.growProgress = 0;
        this.bloomSize = 0;
        this.maxBloomSize = Math.random() * 40 + 30;
        // Specific colors from your image
        this.color = Math.random() > 0.5 ? '#FFD700' : '#FF69B4'; 
        this.swayOffset = Math.random() * 100; // Gives each flower a unique rhythm
    }

    draw() {
        // Calculate wind sway using Sine wave
        // Math.sin(time + offset) creates a value between -1 and 1
        const wind = Math.sin(time + this.swayOffset) * 15; 

        // 1. Draw Stem with Sway
        ctx.beginPath();
        ctx.moveTo(this.x, canvas.height); // Fixed at the bottom
        ctx.bezierCurveTo(
            this.x + 20 + wind, canvas.height - this.stemHeight / 2, // Middle bend
            this.x - 20 + wind, canvas.height - this.stemHeight * 0.8, // Upper bend
            this.x + wind, this.y // Flower head follows the wind
        );
        ctx.strokeStyle = '#4A7c2c';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 2. Draw Bloom (following the swayed X position)
        if (this.growProgress >= 1) {
            ctx.save();
            ctx.translate(this.x + wind, this.y);
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;

            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.rotate(Math.PI / 4);
                ctx.ellipse(0, -this.bloomSize/2, this.bloomSize/3, this.bloomSize, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Inner glow center
            ctx.shadowBlur = 5;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(0, 0, this.bloomSize/5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    update() {
        if (this.growProgress < 1) {
            this.growProgress += 0.01;
        } else if (this.bloomSize < this.maxBloomSize) {
            this.bloomSize += 0.5;
        }
    }
}

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Increase time to move the "wind"
    time += 0.02;

    flowers.forEach(f => {
        f.update();
        f.draw();
    });

    if (autoMode && Math.random() < 0.03) {
        flowers.push(new Flower(Math.random() * canvas.width, Math.random() * (canvas.height * 0.6)));
    }
    requestAnimationFrame(animate);
}

// Interaction
canvas.addEventListener('click', (e) => {
    flowers.push(new Flower(e.clientX, e.clientY));
});

document.getElementById('clearBtn').onclick = () => flowers = [];
document.getElementById('autoBtn').onclick = () => autoMode = !autoMode;

animate();