/* ===== CANVAS DOT GRID HERO WITH ANTI-GRAVITY ===== */
(function() {
  var canvas = document.getElementById('heroCanvas');
  var ctx = canvas.getContext('2d');
  var dots = [];
  var mouse = { x: -9999, y: -9999 };
  var W, H, cols, rows;
  var SPACING = 36;
  var RADIUS = 1.5;
  var REPEL_RADIUS = 200;
  var REPEL_STRENGTH = 80;
  var RETURN_SPEED = 0.08;

  function getAccentRGB() {
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    var el = document.createElement('div');
    el.style.color = accent; document.body.appendChild(el);
    var rgb = getComputedStyle(el).color.match(/[\d.]+/g);
    document.body.removeChild(el);
    return rgb ? rgb.slice(0,3).map(Number) : [0,229,204];
  }
  var accentRGB = getAccentRGB();
  setInterval(function() { accentRGB = getAccentRGB(); }, 2000);

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.ceil(W / SPACING) + 1;
    rows = Math.ceil(H / SPACING) + 1;
    dots = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var baseX = c * SPACING;
        var baseY = r * SPACING;
        dots.push({ 
          baseX: baseX, 
          baseY: baseY, 
          x: baseX, 
          y: baseY, 
          vx: 0, 
          vy: 0,
          baseAlpha: 0.12 + Math.random() * 0.1 
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var now = Date.now() * 0.0005;
    
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      
      // Calculate distance from mouse
      var dx = d.x - mouse.x;
      var dy = d.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      
      // Anti-gravity repulsion
      if (dist < REPEL_RADIUS && dist > 0) {
        var force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        var angle = Math.atan2(dy, dx);
        d.vx += Math.cos(angle) * force * 0.06;
        d.vy += Math.sin(angle) * force * 0.06;
      }
      
      // Apply velocity
      d.x += d.vx;
      d.y += d.vy;
      
      // Return to base position
      var backToCenterX = (d.baseX - d.x) * RETURN_SPEED;
      var backToCenterY = (d.baseY - d.y) * RETURN_SPEED;
      d.vx += backToCenterX;
      d.vy += backToCenterY;
      
      // Apply damping
      d.vx *= 0.88;
      d.vy *= 0.88;
      
      // Calculate visual properties
      var distanceFromBase = Math.sqrt(
        (d.x - d.baseX) * (d.x - d.baseX) + 
        (d.y - d.baseY) * (d.y - d.baseY)
      );
      var displacement = Math.min(1, distanceFromBase / 20);
      var alpha = d.baseAlpha + displacement * 0.7;
      var pulse = d.baseAlpha + Math.sin(now + d.baseX * 0.03 + d.baseY * 0.02) * 0.04;
      
      // Draw dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, RADIUS + displacement * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = displacement > 0.15
        ? 'rgba(' + accentRGB[0] + ',' + accentRGB[1] + ',' + accentRGB[2] + ',' + alpha + ')'
        : 'rgba(100,120,150,' + pulse + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', function() { mouse.x = -9999; mouse.y = -9999; });
  resize();
  draw();
})();

/* ===== TYPEWRITER ===== */
(function() {
  var roles = ["Aspiring Backend Developer", "Full-Stack Enthusiast", "Cloud Explorer"];
  var el = document.getElementById("typewriter");
  var roleIdx = 0, charIdx = 0, deleting = false;
  var TYPING_SPEED = 80, DELETE_SPEED = 40, PAUSE = 1800;

  function type() {
    var current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, DELETE_SPEED);
    }
  }
  setTimeout(type, 600);
})();

/* ===== SCROLL REVEAL ===== */
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-scale").forEach(function(el) {
    observer.observe(el);
  });
})();

/* ===== NAVBAR SCROLL ===== */
(function() {
  var nav = document.getElementById("navbar");
  window.addEventListener("scroll", function() {
    if (window.scrollY > 40) { nav.classList.add("scrolled"); }
    else { nav.classList.remove("scrolled"); }
  });
})();

/* ===== HAMBURGER MENU ===== */
(function() {
  var btn = document.getElementById("hamburger");
  var menu = document.getElementById("mobileMenu");
  btn.addEventListener("click", function() {
    menu.classList.toggle("open");
  });
  menu.querySelectorAll(".mob-link").forEach(function(link) {
    link.addEventListener("click", function() { menu.classList.remove("open"); });
  });
})();

/* ===== SMOOTH NAV ACTIVE LINK ===== */
(function() {
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  window.addEventListener("scroll", function() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function(sec) {
      var top = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function(a) { a.style.color = ""; });
        var active = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
        if (active) active.style.color = "var(--accent)";
      }
    });
  });
})();

/* ===== CONTACT FORM ===== */
function handleContactForm(e) {
  e.preventDefault();
  var note = document.getElementById("formNote");
  var name = document.getElementById("name").value;
  note.textContent = "Thanks " + name + "! I will get back to you soon.";
  e.target.reset();
}