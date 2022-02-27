const canvas = document.getElementById('canvas1');

const ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let particlesArray;
// Hello there 
let mouse = {
    x : null,
    y : null,
    radius : (canvas.height/100) * (canvas.width/100)
};

window.addEventListener('mousemove', 
    function(e) {
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
        
    }
);

class Particle {
    constructor(x, y, directionX, directionY, size, colour) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.colour = colour;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI *2, false);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if (distance <= mouse.radius + this.size *3) {
            if (mouse.x <= this.x - this.size * 10 && this.x <= canvas.width - this.size * 10) {
                this.x += 10;
            }

            if (mouse.x >= this.x - this.size * 10 && this.x >= this.size * 10) {
                this.x -= 10;
            }

            if (mouse.y <= this.y - this.size * 10 && this.y <= canvas.height - this.size * 10) {
                this.y += 10;
            }

            if (mouse.y >= this.y - this.size * 10 && this.y >= this.size * 10) {
                this.y -=10;
            }
            
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
    
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width)/ 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let colour = '#ff0000'

        particlesArray.push( new Particle(x, y, directionX, directionY, size, colour));

    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();

    }
    connect();
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2 + (particlesArray[a].y - particlesArray[b].y) ** 2  );
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(256,256,256,'+ opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = this.innerHeight;
        mouse.radius = ((canvas.height/160) * (canvas.width/160));
        init();
    }
);

window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    })

init();
animate();
