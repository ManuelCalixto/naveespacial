const canvas = document.getElementById('game');
const ctx = canvas.getContext("2d");

//Cargar las imagenes

const imgJugardor = new Image();
imgJugardor.src = 'img/jugador.png';

const imgSol = new Image();
imgSol.src = 'img/sol.png';

const imgGota = new Image();
imgGota.src = 'img/gota.png';

const imgFondo = new Image();
imgFondo.src = 'img/fondo.png';

// Posicion Inicial del Jugador
const player = { x: 80, y: 380, w: 70, h: 70, vx: 0, vy: 0, onGround: true };
// ENEMIGO


//evento para capturar las teclas
let keys = {};
//evento para el enemigo
let enemigos = [];
let amigos = [];


function crearEnemigo() {
    enemigos.push({
        x: 800,
        y: Math.random() * 200 + 200,
        w: 30,
        h: 30,
        vx: Math.random() * 3 + 2
    });

}

function crearAmigo() {
    amigos.push({
        x: 800,
        y: Math.random() * 200 + 200,
        w: 30,
        h: 30,
        vx: Math.random() * 3 + 2
    });

}



document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function update() {
    /*
    if (keys["ArrowLeft"]) {
        player.vx = -4;
    } else if (keys["ArrowRight"]) {
        player.vx = 4;
    } else {
        player.vx = 0;
    }

    if (keys["ArrowUp"] && player.onGround) {
        player.vy = -10;
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
*/
    //movimiento del enemigo
    // MUEVO EL ENEMIGO 
    enemigos = enemigos.filter(enemigo => enemigo.x + enemigo.w > 0);
    // Elimino al enemigo que llego al border
    enemigos.forEach(enemigo => enemigo.x -= enemigo.vx);
    
    //Movimiento del amigo
    amigos = amigos.filter(amigo => amigo.x + amigo.w > 0);
    // Elimino al amigo que llego al border
    amigos.forEach(amigo => amigo.x -= amigo.vx);


    if (Math.random() < 0.02) {
        crearEnemigo();
    }

    if (Math.random() < 0.004) {
        crearAmigo();
    }


    // if (enemigos.x + enemigos.w < 0) {
    //     enemigos.x = 800;

    //     enemigos.y = Math.random() * 200 + 200;

    // }
    //enemigo.forEach(e => e.x -= e.vx);

}
//funcion para dibujar las imagnes
function draw() {

    ctx.clearRect(0, 0, 800, 480);

    //condicion para dibujar la imagen de fondo

    if (imgFondo.complete) {
        ctx.drawImage(imgFondo, 0, 0, 800, 480);
    }

    //condicion para llamar a la imagen del jugador

    if (imgJugardor.complete) {
        ctx.drawImage(imgJugardor, player.x, player.y, player.w, player.h)

    }
    // condicion para dibujar la imagen del sol
    
    
    enemigos.forEach(enemigo =>{
         if (imgSol.complete) {
            ctx.drawImage(imgSol, enemigo.x, enemigo.y, enemigo.w, enemigo.h);
        }
    });

    //condicion para dibujar la imagen del amigo
    amigos.forEach(amigo =>{
         if (imgGota.complete) {
            ctx.drawImage(imgGota, amigo.x, amigo.y, amigo.w, amigo.h);
        }
    });

    //});
    //condicion para dibujar la imagen de la  gota
    
}

function loop() {
    update();
    draw();
    console.log(Math.random());
    requestAnimationFrame(loop);
}

loop();