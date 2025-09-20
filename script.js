/* ====== MÚSICA (YouTube IFrame API) ====== */
let ytPlayer = null;
let playerReady = false;
let pendingPlay = false;

function onYouTubeIframeAPIReady(){
  ytPlayer = new YT.Player('ytplayer', {
    height: '0', width: '0',
    videoId: 'SfIP3E9LPZY',        // tu canción
    playerVars: { rel:0, modestbranding:1, playsinline:1 },
    events: {
      onReady: (e)=>{ playerReady = true; e.target.setVolume(60); if (pendingPlay) playMusic(); }
    }
  });
}
function playMusic(){
  if (!playerReady){ pendingPlay = true; return; }   // por si el API aún carga
  pendingPlay = false;
  try { ytPlayer.seekTo(0, true); ytPlayer.playVideo(); } catch(e){}
}
/* ========================================= */

// --- Cabeza gerbera (pétalos delgados) ---
function buildHead(group, small=false) {
  const petalsWrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const petals = 30, rx = small ? 4.8 : 5.2, ry = small ? 37 : 40;
  for (let i = 0; i < petals; i++) {
    const angle = (i * 360) / petals;
    const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    el.setAttribute("class", "petal");
    el.setAttribute("cx", 0); el.setAttribute("cy", -18);
    el.setAttribute("rx", rx); el.setAttribute("ry", ry);
    el.setAttribute("transform", `rotate(${angle})`);
    petalsWrap.appendChild(el);
  }
  group.appendChild(petalsWrap);
  const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c1.setAttribute("class", "centerMain"); c1.setAttribute("r", 22); group.appendChild(c1);
  const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c2.setAttribute("class", "centerDot"); c2.setAttribute("r", 10); group.appendChild(c2);
}

// Construcción de cabezas
document.querySelectorAll(".flowerHead").forEach((g)=>
  buildHead(g, g.classList.contains("small"))
);

const btn = document.getElementById("cta");
const replayBtn = document.getElementById("replay");
const flowers = Array.from(document.querySelectorAll(".flower"));
const wrapBack = document.getElementById("wrapBack");
const wrapFront = document.getElementById("wrapFront");
const greens = document.getElementById("greens");
const bow = document.getElementById("bow");
const kdgs = document.getElementById("kdgs");
const dedicatoria = document.getElementById("dedicatoria");
const glitterLayer = document.getElementById("glitterLayer");
const stars = document.getElementById("stars");
const bubbles = document.getElementById("bubbles");

let playing = false;

// ------- Fondo animado (estrellas + burbujas) -------
function seedStars(n=18){
  stars.innerHTML = "";
  for(let i=0;i<n;i++){
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = (5 + Math.random()*90) + "%";
    s.style.top = (5 + Math.random()*40) + "%";
    s.style.animationDelay = (Math.random()*2.4) + "s";
    s.style.width = s.style.height = (4 + Math.random()*4) + "px";
    stars.appendChild(s);
  }
}
function seedBubbles(n=14){
  bubbles.innerHTML = "";
  for(let i=0;i<n;i++){
    const b = document.createElement("div");
    b.className = "bubble";
    b.style.left = (10 + Math.random()*80) + "%";
    b.style.bottom = (Math.random()*10) + "%";
    const size = 6 + Math.random()*10;
    b.style.width = b.style.height = size + "px";
    b.style.animationDuration = (5 + Math.random()*4) + "s";
    b.style.animationDelay = (Math.random()*3) + "s";
    bubbles.appendChild(b);
  }
}
seedStars();
seedBubbles();

// ------- Utilidades -------
function clearGlitter(){ while (glitterLayer.firstChild) glitterLayer.removeChild(glitterLayer.firstChild); }
function spawnGlitter(){
  const count = 24;
  for (let i=0; i<count; i++){
    const s = document.createElementNS("http://www.w3.org/2000/svg","ellipse");
    s.setAttribute("class","glit");
    const rx = 3 + Math.random()*3.5, ry = 5 + Math.random()*6;
    s.setAttribute("rx", rx.toFixed(1)); s.setAttribute("ry", ry.toFixed(1));
    const x = 200 + Math.random()*200; const y = 455 - Math.random()*60;
    s.setAttribute("cx", x.toFixed(1)); s.setAttribute("cy", y.toFixed(1));
    s.style.animationDelay = (Math.random()*1.1) + "s";
    glitterLayer.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
}
function show(el){ el.classList.add("visible"); el.classList.remove("oculto"); }
function hide(el){ el.classList.add("oculto"); el.classList.remove("visible"); }

// ------- Secuencia -------
function playSequence(){
  if (playing) return; playing = true;

  // Estado inicial totalmente vacío
  flowers.forEach(f => f.classList.remove("visible"));
  [wrapBack, wrapFront, greens, bow, kdgs].forEach(hide);
  hide(dedicatoria); hide(replayBtn);
  clearGlitter();

  btn.style.opacity = "0"; btn.style.pointerEvents = "none";

  // 1) Papel trasero
  show(wrapBack);

  // 2) Papel frontal (tapa tallos)
  setTimeout(()=> show(wrapFront), 500);

  // 3) Verdes (hojas + relleno) crecen suavemente
  setTimeout(()=>{
    show(greens);
    greens.style.animation = "growIn .7s ease-out forwards";
  }, 900);

  // 4) Flores una a una (dos filas)
  const delayBetween = 480;
  setTimeout(()=>{
    flowers.forEach((f, idx) => setTimeout(() => f.classList.add("visible"), idx * delayBetween));
  }, 1200);

  // 5) Moño
  const afterFlowers = 1200 + flowers.length * delayBetween + 600;
  setTimeout(()=> show(bow), afterFlowers);

  // 6) KDGS
  setTimeout(()=> show(kdgs), afterFlowers + 300);

  // 7) Escarcha
  setTimeout(spawnGlitter, afterFlowers + 400);

  // 8) Dedicatoria + botón repetir
  setTimeout(() => {
    show(dedicatoria); show(replayBtn);
    playing = false;
  }, afterFlowers + 900);

  // 9) Música (se reproduce con este clic)
  playMusic();
}

btn.addEventListener("click", playSequence);

// Botón "De nuevo"
replayBtn.addEventListener("click", () => {
  hide(replayBtn);
  btn.style.opacity="1"; btn.style.pointerEvents="auto";
  setTimeout(playSequence, 80);
});
