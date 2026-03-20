const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let flowers = [];
let autoMode = false;
let time = 0;

// Initialize Canvas Size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.stemHeight = canvas.height - y;
        this.growProgress = 0;
        this.bloomSize = 0;
        this.maxBloomSize = Math.random() * 35 + 25;
        this.color = Math.random() > 0.5 ? '#FFD700' : '#FF69B4'; // Yellow or Pink
        this.swayOffset = Math.random() * 100;
        this.swaySpeed = 0.02 + Math.random() * 0.02;
    }

    draw() {
        const wind = Math.sin(time * this.swaySpeed + this.swayOffset) * 20;

        // Draw Stem
        ctx.beginPath();
        ctx.moveTo(this.x, canvas.height);
        ctx.bezierCurveTo(
            this.x + 20 + wind, canvas.height - this.stemHeight / 2,
            this.x - 20 + wind, canvas.height - this.stemHeight * 0.8,
            this.x + wind, this.y
        );
        ctx.strokeStyle = '#4A7c2c';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Leaves
        if (this.growProgress > 0.4) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.ellipse(this.x + wind - 10, this.y + 40, 4, 7, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x + wind + 8, this.y + 60, 4, 7, -Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Bloom
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
            
            // White Center
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(0, 0, this.bloomSize/6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    update() {
        if (this.growProgress < 1) {
            this.growProgress += 0.015;
        } else if (this.bloomSize < this.maxBloomSize) {
            this.bloomSize += 0.5;
        }
    }
}

function handleInput(e) {
    // Prevent scrolling when touching the canvas
    if (e.type === 'touchstart') e.preventDefault();
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
        flowers.push(new Flower(clientX, clientY));
        // Add haptic feedback for mobile if supported
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    time++;

    flowers.forEach(f => {
        f.update();
        f.draw();
    });

    if (autoMode && Math.random() < 0.05) {
        flowers.push(new Flower(Math.random() * canvas.width, Math.random() * (canvas.height * 0.7)));
    }
    requestAnimationFrame(animate);
}

// Listeners
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput, {passive: false});

document.getElementById('clearBtn').onclick = () => { flowers = []; };
document.getElementById('autoBtn').onclick = () => { 
    autoMode = !autoMode; 
    document.getElementById('autoBtn').innerText = autoMode ? "✨ Auto: ON" : "✨ Auto Bloom";
};

animate();