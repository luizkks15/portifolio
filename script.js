document.addEventListener("DOMContentLoaded", () => {


  document.getElementById("year").textContent = new Date().getFullYear();

 
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });


  const toggle = document.querySelector(".menu-toggle");
  const navUl  = document.querySelector("nav ul");
  const spans  = toggle.querySelectorAll("span");

  toggle.addEventListener("click", () => {
    const open = navUl.classList.toggle("active");
    spans[0].style.transform = open ? "rotate(45deg) translate(4px, 4px)"  : "";
    spans[1].style.opacity   = open ? "0" : "1";
    spans[2].style.transform = open ? "rotate(-45deg) translate(4px, -4px)" : "";
  });
  document.querySelectorAll(".nav-link").forEach(l => {
    l.addEventListener("click", () => {
      navUl.classList.remove("active");
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    });
  });

 
  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (dot && ring && window.innerWidth > 768) {
    let rx = 0, ry = 0, mx = window.innerWidth/2, my = window.innerHeight/2;
    document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      dot.style.left  = mx + "px"; dot.style.top  = my + "px";
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    })();
  }

  const typingEl = document.getElementById("typing-text");


  const fullText  = "Olá, sou João Luiz";
  const highlight = "João Luiz"; 

  let i = 0;
  let started = false;

  function buildHTML(str) {
    const idx = str.indexOf(highlight.substring(0, Math.min(highlight.length, str.length - fullText.indexOf(highlight))));
    const splitAt = fullText.indexOf(highlight);

    if (str.length <= splitAt) {
      // ainda na parte normal
      return str;
    } else {
      const before  = fullText.substring(0, splitAt);           // "Olá, sou "
      const colored = str.substring(splitAt);                    // parte do nome já digitada
      return `${before}<span class="hero-name-blue">${colored}</span>`;
    }
  }

  function typeChar() {
    if (i <= fullText.length) {
      typingEl.innerHTML = buildHTML(fullText.substring(0, i));
      i++;
  
      let delay = 75;
      if (fullText[i - 1] === ",") delay = 250;
      if (fullText[i - 1] === " " && i > 5) delay = 50;
      setTimeout(typeChar, delay);
    }
  }

  
  setTimeout(() => {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
    setTimeout(typeChar, 400);
  }, 80);


  const fObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
  }, { threshold: 0.08, rootMargin: "0px 0px -50px 0px" });
  document.querySelectorAll(".fade").forEach(el => fObs.observe(el));

 
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const nObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          const active = l.getAttribute("href") === "#" + e.target.id;
          l.style.color = active ? "var(--blue-lt)" : "";
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => nObs.observe(s));

  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener("resize", () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  let mouse = { x: W / 2, y: H / 2 };
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  }, { passive: true });

  const N = 55, DIST = 120;

  class P {
    constructor() {
      this.x  = Math.random() * W; this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.r  = Math.random() * 1.2 + .4;
      this.a  = Math.random() * .35 + .1;
      this.isBlue = Math.random() > .4;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 90) { this.x += dx/d; this.y += dy/d; }
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.isBlue
        ? `rgba(37,99,235,${this.a})`
        : `rgba(124,58,237,${this.a})`;
      ctx.fill();
    }
  }

  const pts = Array.from({ length: N }, () => new P());

  function connect() {
    for (let a = 0; a < pts.length; a++) {
      for (let b = a+1; b < pts.length; b++) {
        const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < DIST) {
          const alpha = (1 - d/DIST) * 0.11;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
          ctx.lineWidth = .7;
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawOrb() {
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
    g.addColorStop(0, "rgba(37,99,235,0.04)");
    g.addColorStop(.6,"rgba(124,58,237,0.02)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 200, 0, Math.PI*2);
    ctx.fill();
  }

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    drawOrb();
    pts.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  })();

});
