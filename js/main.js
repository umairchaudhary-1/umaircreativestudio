/* ============================================================
   UMAIR CREATIVE STUDIO — MAIN JS
   ============================================================ */
(function(){
  "use strict";

  document.documentElement.classList.add('js');

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function(){
    var pre = document.querySelector('.preloader');
    if(pre){ setTimeout(function(){ pre.classList.add('done'); }, 420); }
  });

  /* ---------- Nav scroll state ---------- */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 24){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    var toTop = document.querySelector('.to-top');
    if(toTop){ toTop.classList.toggle('show', window.scrollY > 700); }
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.nav-burger');
  var mnav = document.querySelector('.mnav');
  var mnavClose = document.querySelector('.mnav-close');
  function toggleMnav(open){
    if(!mnav) return;
    mnav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if(burger){ burger.addEventListener('click', function(){ toggleMnav(true); }); }
  if(mnavClose){ mnavClose.addEventListener('click', function(){ toggleMnav(false); }); }
  document.querySelectorAll('.mnav a').forEach(function(a){ a.addEventListener('click', function(){ toggleMnav(false); }); });

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector('.to-top');
  if(toTop){ toTop.addEventListener('click', function(){ window.scrollTo({ top:0, behavior:'smooth' }); }); }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  function animateCounter(el){
    var target = parseFloat(el.getAttribute('data-counter'));
    var decimals = (el.getAttribute('data-counter').split('.')[1] || '').length;
    var dur = 1600, start = null, from = 0;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = from + (target - from) * eased;
      el.textContent = val.toFixed(decimals);
      if(p < 1){ requestAnimationFrame(step); } else { el.textContent = target.toFixed(decimals); }
    }
    requestAnimationFrame(step);
  }
  if(counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ animateCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold:0.6 });
    counters.forEach(function(c){ cio.observe(c); });
  }

  /* ---------- Cursor glow ---------- */
  var glow = document.querySelector('.cursor-glow');
  if(glow && window.matchMedia('(hover:hover)').matches){
    var gx=0, gy=0, cx=0, cy=0;
    window.addEventListener('mousemove', function(e){ gx = e.clientX; gy = e.clientY; });
    (function raf(){
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    })();
  }

  /* ---------- Portfolio filter ---------- */
  var filterBar = document.querySelector('.filter-bar');
  if(filterBar){
    var buttons = filterBar.querySelectorAll('[data-filter]');
    var items = document.querySelectorAll('[data-cat]');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        items.forEach(function(item){
          var match = (f === 'all' || item.getAttribute('data-cat') === f);
          item.style.display = match ? '' : 'none';
          if(match){ item.classList.remove('reveal'); }
        });
      });
    });
  }

  /* ---------- Before / After slider ---------- */
  document.querySelectorAll('.ba').forEach(function(ba){
    var before = ba.querySelector('.ba-before');
    var handle = ba.querySelector('.ba-handle');
    function setPos(px){
      var rect = ba.getBoundingClientRect();
      var pct = Math.min(Math.max((px - rect.left) / rect.width, 0), 1) * 100;
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }
    var dragging = false;
    ba.addEventListener('pointerdown', function(e){ dragging = true; setPos(e.clientX); });
    window.addEventListener('pointermove', function(e){ if(dragging) setPos(e.clientX); });
    window.addEventListener('pointerup', function(){ dragging = false; });
    ba.addEventListener('mousemove', function(e){ if(!dragging) setPos(e.clientX); });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!isOpen){ item.classList.add('open'); }
    });
  });

  /* ---------- Skill bars ---------- */
  var bars = document.querySelectorAll('[data-bar]');
  if(bars.length && 'IntersectionObserver' in window){
    var bio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var el = e.target;
          el.style.width = el.getAttribute('data-bar') + '%';
          bio.unobserve(el);
        }
      });
    }, { threshold:0.4 });
    bars.forEach(function(b){ bio.observe(b); });
  }

  /* ---------- Contact form (static demo) ---------- */
  var form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;
      setTimeout(function(){
        form.reset();
        btn.innerHTML = 'Message sent ✓';
        setTimeout(function(){ btn.innerHTML = original; btn.disabled = false; }, 2600);
      }, 1000);
    });
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width/2;
      var y = e.clientY - r.top - r.height/2;
      el.style.transform = 'translate(' + x*0.18 + 'px,' + y*0.28 + 'px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  });

  /* ---------- Card tilt (hero spotlight stack) ---------- */
  document.querySelectorAll('[data-tilt]').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(900px) rotateY(' + (px*8) + 'deg) rotateX(' + (py*-8) + 'deg) translateY(-4px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  });

})();
