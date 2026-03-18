document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    document.getElementById("year").textContent =
        new Date().getFullYear();

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    const text = "Olá, sou João Luiz";
    const element = document.getElementById("typing-title");

    let i = 0;

    function typing() {

        if (i < text.length) {

            let char = text.charAt(i);

            if (text.substring(0, i + 1).startsWith("Olá")) {
                element.innerHTML =
                    "<span class='ola'>" + text.substring(0, 4) + "</span>" +
                    text.substring(4, i + 1) +
                    "<span class='cursor'>|</span>";
            } else {
                element.innerHTML =
                    text.substring(0, i + 1) +
                    "<span class='cursor'>|</span>";
            }

            i++;
            setTimeout(typing, 80);
        }

    }

    typing();

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    });

    document.querySelectorAll(".fade").forEach(el => {
        observer.observe(el);
    });

    const bg = document.getElementById("interactive-bg");

    const canvas = document.createElement("canvas");

    bg.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    const total = 90;

    class Particle {

        constructor() {

            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;

            this.size = 2;

        }

        move() {

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        }

        draw() {

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();

        }

    }

    for (let i = 0; i < total; i++) {
        particles.push(new Particle());
    }

    function connect() {

        for (let a = 0; a < particles.length; a++) {

            for (let b = a; b < particles.length; b++) {

                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;

                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {

                    ctx.beginPath();

                    ctx.strokeStyle = "rgba(80,150,255,0.4)";
                    ctx.lineWidth = 1;

                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);

                    ctx.stroke();

                }

            }

        }

    }

    function animate() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {

            p.move();
            p.draw();

        });

        connect();

        requestAnimationFrame(animate);

    }

    animate();

    window.addEventListener("resize", () => {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    });

});
