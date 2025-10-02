const canvas = document.getElementById('game');
const ctx = canvas.getContext("2d");

// Cargar las imágenes
const imgJugardor = new Image();
imgJugardor.src = 'img/jugador.png';

const imgSol = new Image();
imgSol.src = 'img/sol.png';

const imgGota = new Image();
imgGota.src = 'img/gota.png';

const imgFondo = new Image();
imgFondo.src = 'img/fondo.png';

// Música del juego
const musica = new Audio('audio/musica2.mp3');
musica.loop = true;

// Música del Game Over
const musicaGameOver = new Audio('audio/gameover.mp3');

// Música de Win
const musicaWin = new Audio('audio/win.mp3');

// Jugador
const player = { x: 80, y: 380, w: 55, h: 60, vx: 0, vy: 0, onGround: true };

// Estados y variables
let keys = {};
let enemigos = [];
let amigos = [];
let vidas = 3;
// Estadoo del juego (instrucciones, jugando, pausa, gameover, win)
let estadoJuego = "menu";

// Crear enemigos y amigos
function crearEnemigo() {
    enemigos.push({ x: 800, y: Math.random() * 200 + 200, w: 40, h: 40, vx: Math.random() * 3 + 2, vy: 0, tipo: "horizontal" });
}
function crearEnemigoVertical() {
    enemigos.push({ x: Math.random() * 760, y: -30, w: 40, h: 40, vx: 0, vy: Math.random() * 3 + 2, tipo: "vertical" });
}
function crearAmigo() {
    amigos.push({ x: 800, y: Math.random() * 200 + 200, w: 30, h: 30, vx: Math.random() * 3 + 2 });
}

// Eventos teclado
document.addEventListener('keydown', e => {
    keys[e.key] = true;

    if (estadoJuego === "menu") {
        estadoJuego = "jugando";
        musica.play();
    }

    if ((estadoJuego === "gameover" || estadoJuego === "win") && e.key === "Enter") {
        estadoJuego = "menu";
        vidas = 3;
        enemigos = [];
        amigos = [];
        player.x = 80;
        player.y = 380;

        // Pausar todas las músicas
        musicaGameOver.pause();
        musicaGameOver.currentTime = 0;
        musicaWin.pause();
        musicaWin.currentTime = 0;
        musica.currentTime = 0;
    }

    if (e.key === "p" || e.key === "P") pauseGame();
});
document.addEventListener('keyup', e => keys[e.key] = false);

// Función de pausa
function pauseGame() {
    if (estadoJuego === "jugando") {
        estadoJuego = "pausa";
        musica.pause();
    } else if (estadoJuego === "pausa") {
        estadoJuego = "jugando";
        musica.play();
    }
}

// Actualización
function update() {
    if (estadoJuego !== "jugando") return;

    // Movimiento jugador
    if (keys["ArrowLeft"]) player.vx = -4;
    else if (keys["ArrowRight"]) player.vx = 4;
    else player.vx = 0;

    if (keys["ArrowUp"] && player.onGround) {
        player.vy = -13;
        player.onGround = false;
    }

    player.x += player.vx;
    player.y += player.vy;
    player.vy += 0.5;

    if (player.y + player.h > 440) {
        player.y = 440 - player.h;
        player.vy = 0;
        player.onGround = true;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.w > 800) player.x = 800 - player.w;

    // Dificultad
    if (vidas >= 0 && vidas < 5) {
        if (Math.random() < 0.002) crearEnemigo();
        if (Math.random() < 0.01) crearAmigo();
    } else if (vidas >= 5 && vidas < 10) {
        if (Math.random() < 0.02) crearEnemigoVertical();
        if (Math.random() < 0.008) crearAmigo();
    } else if (vidas >= 10 && vidas < 15) {
        if (Math.random() < 0.02) crearEnemigo();
        if (Math.random() < 0.015) crearEnemigoVertical();
        if (Math.random() < 0.005) crearAmigo();
    } else if (vidas >= 10) {
        estadoJuego = "win";
        musica.pause();
        musica.currentTime = 0;
        musicaWin.play();
    }

    // Movimiento enemigos
    enemigos = enemigos.filter(enemigo => enemigo.tipo === "horizontal" ? enemigo.x + enemigo.w > 0 : enemigo.y < 480);
    enemigos.forEach(enemigo => {
        if (enemigo.tipo === "horizontal") enemigo.x -= enemigo.vx;
        if (enemigo.tipo === "vertical") enemigo.y += enemigo.vy;
    });

    // Movimiento amigos
    amigos = amigos.filter(amigo => amigo.x + amigo.w > 0);
    amigos.forEach(amigo => amigo.x -= amigo.vx);

    // Colisiones
    enemigos.forEach((enemigo, i) => {
        if (colision(player, enemigo)) {
            vidas--;
            enemigos.splice(i, 1);
            if (vidas <= 0) {
                estadoJuego = "gameover";
                musica.pause();
                musica.currentTime = 0;
                musicaGameOver.play();
            }
        }
    });

    amigos.forEach((amigo, i) => {
        if (colision(player, amigo)) {
            vidas++;
            amigos.splice(i, 1);
        }
    });

    function colision(player, item) {
        return player.x < item.x + item.w &&
            player.x + player.w > item.x &&
            player.y < item.y + item.h &&
            player.y + player.h > item.y;
    }
}

// Dibujar
function draw() {
    ctx.clearRect(0, 0, 800, 480);

    if (imgFondo.complete) ctx.drawImage(imgFondo, 0, 0, 800, 480);
    if (imgJugardor.complete) ctx.drawImage(imgJugardor, player.x, player.y, player.w, player.h);

    enemigos.forEach(enemigo => { if (imgSol.complete) ctx.drawImage(imgSol, enemigo.x, enemigo.y, enemigo.w, enemigo.h); });
    amigos.forEach(amigo => { if (imgGota.complete) ctx.drawImage(imgGota, amigo.x, amigo.y, amigo.w, amigo.h); });

    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText(`Vidas: ${vidas}/15`, 600, 40);

    // Pantallas
    if (estadoJuego === "menu") dibujarMenu();
    if (estadoJuego === "gameover") dibujarGameOver();
    if (estadoJuego === "win") dibujarWin();
    if (estadoJuego === "pausa") dibujarPausa();
}

// Dibujar pantallas
function dibujarMenu() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, 800, 480);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("INSTRUCCIONES", 400, 70);

    ctx.fillStyle = "#2ddafc";
    ctx.font = "22px Arial";
    ctx.fillText("Presiona cualquier tecla para continuar", 400, 110);

    ctx.shadowColor = "transparent";
    ctx.textAlign = "left";
    ctx.font = "20px Arial";

    ctx.fillStyle = "#ffffff";
    ctx.fillText("Usa las flechas para moverte:", 50, 150);

    ctx.fillStyle = "#ffcc00";
    ctx.fillText("- Izquierda: Mover a la izquierda", 70, 180);
    ctx.fillText("- Derecha: Mover a la derecha", 70, 210);
    ctx.fillText("- Arriba: Saltar", 70, 240);

    ctx.fillStyle = "#00ff66";
    ctx.fillText("Recoge hamburguesas para ganar vidas", 50, 280);

    ctx.fillStyle = "#ff5050";
    ctx.fillText("Evita enemigos (meteoritos) que te quitan vidas", 50, 310);

    ctx.fillStyle = "#ffffff";
    ctx.fillText("Dificultad por niveles:", 50, 350);

    ctx.fillStyle = "#ff9900";
    ctx.fillText("Nivel 1: Enemigos de derecha a izquierda", 70, 380);
    ctx.fillText("Nivel 2: Enemigos caen desde arriba", 70, 410);
    ctx.fillText("Nivel 3: Enemigos de ambos tipos", 70, 440);
}
function dibujarGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, 800, 480);
    ctx.fillStyle = "red";
    ctx.font = "40px Arial Black";
    ctx.fillText("GAME OVER! :(", 250, 200);
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Presiona ENTER para volver al menú", 180, 300);
}
function dibujarWin() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, 800, 480);
    ctx.fillStyle = "lime";
    ctx.font = "50px Arial Black";
    ctx.fillText("🎊 GANASTE! 🎊", 250, 200);
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText("Presiona ENTER para volver al menú", 180, 300);
}
function dibujarPausa() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, 800, 480);
    ctx.fillStyle = "yellow";
    ctx.font = "40px Arial Black";
    ctx.fillText("PAUSA", 320, 200);
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Presiona P para continuar", 250, 300);
}

// Loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();
