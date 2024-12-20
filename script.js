const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const commentsDisplay = document.getElementById("comments");

let drawing = false;
let path = [];
let currentScore = 0;
let highScore = 0;

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Touch event listeners
canvas.addEventListener("touchstart", startDrawingTouch, { passive: true });
canvas.addEventListener("touchmove", drawTouch, { passive: true });
canvas.addEventListener("touchend", stopDrawing);

// Functions for touch events
function startDrawingTouch(e) {
    const touch = e.touches[0];
    startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
}

function drawTouch(e) {
    const touch = e.touches[0];
    draw({ clientX: touch.clientX, clientY: touch.clientY });
}

function startDrawing(e) {
    drawing = true;
    path = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCenterPoint();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const pos = getMousePos(e);
    ctx.moveTo(pos.x, pos.y);
    path.push(pos);
}

function draw(e) {
    if (!drawing) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    path.push(pos);
    updateLiveScore();
}

function stopDrawing() {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
    calculateFinalScore();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;   
    const scaleY = canvas.height / rect.height; 
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function updateLiveScore() {
    const score = evaluateCircle(path);
    scoreDisplay.textContent = `Score: ${score}%`;
}

function calculateFinalScore() {
    currentScore = evaluateCircle(path);
    scoreDisplay.textContent = `Score: ${currentScore}%`;

    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreDisplay.textContent = `Best Score: ${highScore}%`;
        showCelebration(); 
    }

    displayComment(currentScore);
}

function evaluateCircle(path) {
    if (path.length < 2) return 0;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let totalDistance = 0;
    let totalPoints = path.length;

    path.forEach(point => {
        const distance = Math.sqrt((point.x - centerX) ** 2 + (point.y - centerY) ** 2);
        totalDistance += distance;
    });

    const averageDistance = totalDistance / totalPoints;
    const idealRadius = 150;
    const error = Math.abs(idealRadius - averageDistance);
    const score = Math.max(0, 100 - (error / idealRadius) * 100);

    return score.toFixed(1);
}

function displayComment(score) {
    if (score > 90) {
        commentsDisplay.textContent = "Amazing! Perfect Circle!";
    } else if (score > 75) {
        commentsDisplay.textContent = "Well Done! Almost Perfect!";
    } else if (score > 50) {
        commentsDisplay.textContent = "Good Job! Try Again!";
    } else {
        commentsDisplay.textContent = "Better Luck Next Time!";
    }
}

function drawCenterPoint() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

function showCelebration() {
    const celebrationDiv = document.getElementById("celebration");
    celebrationDiv.style.display = "block"; 
    setTimeout(() => {
        celebrationDiv.style.display = "none"; 
    }, 1500); 
}

drawCenterPoint();




















