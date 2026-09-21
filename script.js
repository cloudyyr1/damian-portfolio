(function(){
    var words = ["START", "BEING", "CREATIVE"];
    var colors = ["#7FD8FF", "#5AC8FA", "#FFFFFF"];
    var glows = [
      '0 0 18px #7FD8FFaa, 0 0 46px #7FD8FF55',
      '0 0 18px #5AC8FAaa, 0 0 46px #5AC8FA55',
      '0 0 22px #FFFFFFcc, 0 0 55px #3FA9F5cc, 0 0 90px #1E6FD966'
    ];
    var el = document.getElementById('cycleWord');
    if(!el) return;
    var i = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function swap(){
      if(reduceMotion){
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.style.color = colors[i];
        el.style.textShadow = glows[i];
        return;
      }
      el.classList.add('swap-out');
      setTimeout(function(){
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.style.color = colors[i];
        el.style.textShadow = glows[i];
        el.classList.remove('swap-out');
      }, 700);
    }

    setInterval(swap, 3000);
  })();

  (function(){
    var counters = document.querySelectorAll('.count-up');
    if(!counters.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animated = [];

    function animateCount(el){
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if(reduceMotion){
        el.textContent = target;
        return;
      }

      var phase1Duration = 1700;
      var phase2Duration = 1000;
      var splitPoint = target * 1;
      var startTime = null;

      function step(timestamp){
        if(startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var value;

        if(elapsed <= phase1Duration){
          var t1 = elapsed / phase1Duration;
          var eased1 = 1 - Math.pow(1 - t1, 4);
          value = eased1 * splitPoint;
        }else{
          var t2 = Math.min((elapsed - phase1Duration) / phase2Duration, 1);
          var eased2 = 1 - Math.pow(1 - t2, 2.2);
          value = splitPoint + eased2 * (target - splitPoint);
        }

        el.textContent = Math.round(value);
        if(elapsed < phase1Duration + phase2Duration){
          requestAnimationFrame(step);
        }else{
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    }

    function checkCounters(){
      counters.forEach(function(el){
        if(animated.indexOf(el) !== -1) return;
        var rect = el.getBoundingClientRect();
        var visible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        if(visible){
          animated.push(el);
          animateCount(el);
        }
      });
    }

    // Deliberately does NOT run on page load — only after the user scrolls,
    // even if the stat happens to already be visible when the page opens.
    window.addEventListener('scroll', checkCounters, { passive: true });
  })();

  (function(){
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMobileMenu');
    if(!toggle || !menu) return;

    toggle.addEventListener('click', function(){
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  (function(){
    var revealEls = document.querySelectorAll('.reveal');
    if(!revealEls.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion){
      revealEls.forEach(function(el){ el.classList.add('in-view'); });
      return;
    }

    if('IntersectionObserver' in window){
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach(function(el){
        observer.observe(el);
      });
    }else{
      revealEls.forEach(function(el){ el.classList.add('in-view'); });
    }
  })();

  (function(){
    var btn = document.getElementById('backToTop');
    if(!btn) return;

    window.addEventListener('scroll', function(){
      if(window.scrollY > 500){
        btn.classList.add('visible');
      }else{
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  (function(){
    var supportsHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!supportsHoverFine || reduceMotion) return;

    var tiltCards = document.querySelectorAll('.work-card, .service');
    if(!tiltCards.length) return;

    tiltCards.forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var midX = rect.width / 2;
        var midY = rect.height / 2;
        var rotateX = ((y - midY) / midY) * -4;
        var rotateY = ((x - midX) / midX) * 4;
        card.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  })();