// Aeronest Girls PG & Luxury Apartments - Master Script (Smooth Scroll & Interactive Animations)

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Lenis Smooth Scroll Engine
  // =========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    try {
      window.lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        smoothTouch: false, // Keep snappy native touch responsiveness on mobile
        touchMultiplier: 1.5,
        infinite: false
      });

      function lenisRaf(time) {
        if (window.lenis) {
          window.lenis.raf(time);
        }
        requestAnimationFrame(lenisRaf);
      }
      requestAnimationFrame(lenisRaf);

      if (typeof AOS !== 'undefined') {
        window.lenis.on('scroll', () => {
          AOS.refresh();
        });
      }
    } catch (e) {
      console.warn('Lenis initialization skipped:', e);
    }
  }

  // Helper functions for modal background scroll lock
  window.pauseScroll = function() {
    if (window.lenis) window.lenis.stop();
    document.body.style.overflow = 'hidden';
  };

  window.resumeScroll = function() {
    if (window.lenis) window.lenis.start();
    document.body.style.overflow = '';
  };

  // =========================================================================
  // 2. Smooth Anchor Navigation with Offset (Header Aware)
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.startsWith('#!')) return;
      if (this.classList.contains('open-modal-btn')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Close mobile navigation menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileToggle = document.getElementById('mobileNavToggle');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (mobileToggle) {
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
          }
        }

        if (window.lenis) {
          window.lenis.scrollTo(targetEl, {
            offset: -75,
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          const headerOffset = 75;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      }
    });
  });

  // =========================================================================
  // 3. Top Reading Progress Bar & Circular Back-To-Top Button
  // =========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const progressRingCircle = document.getElementById('progressRingCircle');
  const RING_CIRCUMFERENCE = 2 * Math.PI * 19; // ~119.38

  if (progressRingCircle) {
    progressRingCircle.style.strokeDasharray = `${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`;
    progressRingCircle.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;
  }

  const spySections = document.querySelectorAll('section[id], div[id="gallery"]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');
  const counterSpans = document.querySelectorAll('.counter-val');
  let countersDone = false;

  function updateActiveNavLink(currentScroll) {
    const scrollPos = currentScroll + 120;
    let activeId = '';

    spySections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = sec.getAttribute('id');
      }
    });

    if (activeId) {
      desktopNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  function checkCounterTrigger() {
    if (countersDone || counterSpans.length === 0) return;
    const statsContainer = document.querySelector('.proximity-stats');
    if (!statsContainer) return;

    const rect = statsContainer.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.92 && rect.bottom >= 0) {
      countersDone = true;

      counterSpans.forEach(span => {
        const target = parseInt(span.getAttribute('data-target'), 10);
        if (isNaN(target) || target === 0) return;

        const duration = 1200;
        const startTime = performance.now();

        function updateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * target);

          span.innerText = current;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            span.innerText = target;
          }
        }
        requestAnimationFrame(updateCounter);
      });
    }
  }

  function handleScrollInteractions() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

    // Update top progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.transform = `scaleX(${progress})`;
    }

    // Update Floating Back-To-Top button
    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      if (progressRingCircle) {
        const offset = RING_CIRCUMFERENCE - (progress * RING_CIRCUMFERENCE);
        progressRingCircle.style.strokeDashoffset = `${offset}`;
      }
    }

    // ScrollSpy active link update
    updateActiveNavLink(scrollY);

    // Number counters trigger
    checkCounterTrigger();
  }

  window.addEventListener('scroll', handleScrollInteractions, { passive: true });
  // Trigger once on load
  handleScrollInteractions();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  }

  // =========================================================================
  // 4. AOS Scroll Reveal Initialization & High-Performance Fallback
  // =========================================================================
  if (!prefersReducedMotion) {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 750,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        once: true,
        offset: 50
      });
    } else if ('IntersectionObserver' in window) {
      const fallbackObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      document.querySelectorAll('[data-aos]').forEach(el => {
        fallbackObserver.observe(el);
      });
    } else {
      document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
      });
    }
  }

  // =========================================================================
  // 5. Interactive 3D Card Hover Tilt (Desktop Fine Pointer Only)
  // =========================================================================
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.feature-card, .room-card, .amenity-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // Navbar Scroll Styling
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Google Reviews Carousel Slider Logic
  const reviewsTrack = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');

  if (reviewsTrack && prevBtn && nextBtn) {
    let currentSlide = 0;

    const getVisibleCards = () => {
      const width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 992) return 2;
      return 4;
    };

    const updateSlider = () => {
      const cards = reviewsTrack.querySelectorAll('.review-slide-item');
      const totalCards = cards.length;
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, totalCards - visibleCards);

      if (currentSlide > maxSlide) currentSlide = 0;
      if (currentSlide < 0) currentSlide = maxSlide;

      const cardWidth = cards[0].getBoundingClientRect().width + 20; // 20px gap
      reviewsTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
      currentSlide++;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      currentSlide--;
      updateSlider();
    });

    window.addEventListener('resize', updateSlider);

    // Auto Scroll Every 5 Seconds
    setInterval(() => {
      currentSlide++;
      updateSlider();
    }, 5000);
  }

  // Accommodation Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn:not(.gallery-filter-btn)');
  const roomCards = document.querySelectorAll('.room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Photo Gallery Filter & Lightbox Logic
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxSubcaption = document.getElementById('lightboxSubcaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxWhatsappBtn = document.getElementById('lightboxWhatsappBtn');

  let currentActiveCards = Array.from(galleryCards);
  let currentLightboxIndex = 0;

  // Lazy Image Skeleton & Smooth Fade-in Handler
  const galleryImages = document.querySelectorAll('.gallery-card img');
  galleryImages.forEach(img => {
    const card = img.closest('.gallery-card');
    function handleImgLoad() {
      img.classList.add('is-loaded');
      if (card) {
        card.classList.remove('skeleton-loading');
      }
    }

    if (img.complete && img.naturalWidth !== 0) {
      handleImgLoad();
    } else {
      img.addEventListener('load', handleImgLoad);
      img.addEventListener('error', handleImgLoad);
    }
  });

  // Filter Logic
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-gallery-filter');

      // Special action for Reel Video tab: Smooth jump & flash
      if (filter === 'reel') {
        const reelSpotlight = document.getElementById('reelSpotlight');
        const reelCard = document.getElementById('reelCard');
        if (reelSpotlight) {
          reelSpotlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (reelCard) {
          reelCard.classList.remove('highlight-flash');
          void reelCard.offsetWidth;
          reelCard.classList.add('highlight-flash');
        }
        const poster = document.getElementById('reelPosterOverlay');
        if (poster) poster.classList.add('is-hidden');
        return;
      }

      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentActiveCards = [];

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-gallery-cat');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          currentActiveCards.push(card);
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Heart Likes Counter
  const heartBtns = document.querySelectorAll('.heart-like-btn');
  heartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countSpan = btn.querySelector('.like-count');
      let currentCount = parseInt(countSpan.innerText, 10);
      
      if (!btn.classList.contains('liked')) {
        btn.classList.add('liked');
        countSpan.innerText = currentCount + 1;
      } else {
        btn.classList.remove('liked');
        countSpan.innerText = currentCount - 1;
      }
    });
  });

  // Lightbox Modal Functions
  function updateLightboxData(index) {
    if (currentActiveCards.length === 0) return;

    if (index < 0) {
      currentLightboxIndex = currentActiveCards.length - 1;
    } else if (index >= currentActiveCards.length) {
      currentLightboxIndex = 0;
    } else {
      currentLightboxIndex = index;
    }

    const targetCard = currentActiveCards[currentLightboxIndex];
    if (!targetCard) return;

    const imgSrc = targetCard.querySelector('img').getAttribute('src');
    const title = targetCard.querySelector('.gallery-title-badge').innerText;
    const subcaption = targetCard.getAttribute('data-sub') || '';

    // Smooth image transition
    if (lightboxImg) {
      lightboxImg.style.opacity = '0.3';
      lightboxImg.style.transform = 'scale(0.96)';
      
      setTimeout(() => {
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', title);
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 150);
    }

    if (lightboxCaption) lightboxCaption.innerText = title;
    if (lightboxSubcaption) lightboxSubcaption.innerText = subcaption;
    if (lightboxCounter) {
      lightboxCounter.innerText = `Photo ${currentLightboxIndex + 1} of ${currentActiveCards.length}`;
    }

    if (lightboxWhatsappBtn) {
      const waText = encodeURIComponent(`Hello Aeronest! I am viewing your photo gallery and interested in: "${title}". Can you share details & pricing?`);
      lightboxWhatsappBtn.setAttribute('href', `https://wa.me/916001351178?text=${waText}`);
    }
  }

  function openLightbox(card) {
    const cardIndexInActive = currentActiveCards.indexOf(card);
    currentLightboxIndex = cardIndexInActive >= 0 ? cardIndexInActive : 0;
    
    updateLightboxData(currentLightboxIndex);

    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      if (window.pauseScroll) window.pauseScroll(); else document.body.style.overflow = 'hidden';
    }
  }

  function closeLightboxModal() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      if (window.resumeScroll) window.resumeScroll(); else document.body.style.overflow = '';
    }
  }

  // Open Lightbox on card or zoom click
  galleryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Avoid opening if clicking directly on like button
      if (e.target.closest('.heart-like-btn')) return;
      openLightbox(card);
    });
  });

  // Prev / Next Navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxData(currentLightboxIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxData(currentLightboxIndex + 1);
    });
  }

  // Close handlers
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightboxModal);
  }
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightboxModal);
  }

  // Keyboard Navigation (Left / Right Arrows & Escape)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightboxModal();
    } else if (e.key === 'ArrowLeft') {
      updateLightboxData(currentLightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateLightboxData(currentLightboxIndex + 1);
    }
  });

  // Touch Swipe for Mobile Lightbox Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left -> Next Image
      updateLightboxData(currentLightboxIndex + 1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right -> Previous Image
      updateLightboxData(currentLightboxIndex - 1);
    }
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // FAQ Search Filter
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question h4').innerText.toLowerCase();
        const answerText = item.querySelector('.faq-answer p').innerText.toLowerCase();

        if (questionText.includes(query) || answerText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Booking Visit Modal
  const modalOverlay = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalClose');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalOptionSelect = document.getElementById('modalRoomOption');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const option = btn.getAttribute('data-room-target');
      if (option && modalOptionSelect) {
        modalOptionSelect.value = option;
      }
      modalOverlay.classList.add('active');
      if (window.pauseScroll) window.pauseScroll();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      if (window.resumeScroll) window.resumeScroll();
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        if (window.resumeScroll) window.resumeScroll();
      }
    });
  }

  // Booking Form Submit Handler -> WhatsApp Integration
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const option = document.getElementById('modalRoomOption').value;
      const date = document.getElementById('modalMoveDate').value;
      const notes = document.getElementById('modalNotes').value.trim();

      const text = `Hello Aeronest Team!%0A%0AI'd like to schedule a visit.%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Option:* ${encodeURIComponent(option)}%0A*Move-in Date:* ${encodeURIComponent(date)}%0A*Notes:* ${encodeURIComponent(notes)}`;

      const whatsappUrl = `https://wa.me/916001351178?text=${text}`;
      window.open(whatsappUrl, '_blank');

      modalOverlay.classList.remove('active');
      bookingForm.reset();
    });
  }

  // Hero Quick Form Handler
  const heroForm = document.getElementById('heroQuickForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('heroPhone').value.trim();
      const option = document.getElementById('heroOption').value;

      const text = `Hello Aeronest Team!%0A%0AI am interested in *${encodeURIComponent(option)}* near LGBI Guwahati Airport.%0A*My Phone:* ${encodeURIComponent(phone)}%0APlease contact me with details.`;

      const whatsappUrl = `https://wa.me/916001351178?text=${text}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Hero Background Animated Slider (1.png, 2.png, 3.png) with Live Progress Bar
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrevBtn = document.getElementById('heroSliderPrev');
  const heroNextBtn = document.getElementById('heroSliderNext');
  const heroProgressFill = document.getElementById('heroProgressFill');

  if (heroSlides.length > 0) {
    let currentHeroIndex = 0;
    let heroSliderTimer = null;

    function resetProgressBar() {
      if (!heroProgressFill) return;
      heroProgressFill.style.transition = 'none';
      heroProgressFill.style.width = '0%';
      // Force Reflow
      void heroProgressFill.offsetWidth;
      heroProgressFill.style.transition = 'width 5s linear';
      heroProgressFill.style.width = '100%';
    }

    function showHeroSlide(index) {
      if (index < 0) {
        currentHeroIndex = heroSlides.length - 1;
      } else if (index >= heroSlides.length) {
        currentHeroIndex = 0;
      } else {
        currentHeroIndex = index;
      }

      heroSlides.forEach((slide, i) => {
        if (i === currentHeroIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      heroDots.forEach((dot, i) => {
        if (i === currentHeroIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      resetProgressBar();
    }

    function nextHeroSlide() {
      showHeroSlide(currentHeroIndex + 1);
    }

    function prevHeroSlide() {
      showHeroSlide(currentHeroIndex - 1);
    }

    function startHeroTimer() {
      stopHeroTimer();
      resetProgressBar();
      heroSliderTimer = setInterval(nextHeroSlide, 5000);
    }

    function stopHeroTimer() {
      if (heroSliderTimer) {
        clearInterval(heroSliderTimer);
        heroSliderTimer = null;
      }
    }

    // Navigation Controls
    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        nextHeroSlide();
        startHeroTimer();
      });
    }

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        prevHeroSlide();
        startHeroTimer();
      });
    }

    // Dot Indicators Click
    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showHeroSlide(i);
        startHeroTimer();
      });
    });

    // Touch Swipe Support for Mobile Viewports
    let heroTouchStartX = 0;
    let heroTouchEndX = 0;
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
      heroSection.addEventListener('touchstart', (e) => {
        heroTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        heroTouchEndX = e.changedTouches[0].screenX;
        const diff = heroTouchEndX - heroTouchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            nextHeroSlide();
          } else {
            prevHeroSlide();
          }
          startHeroTimer();
        }
      }, { passive: true });
    }

    // Initialize Auto Slider
    startHeroTimer();
  }

  // Interactive Hero Dynamic Punchlines Switcher
  const punchlineSlides = document.querySelectorAll('.punchline-slide');
  const punchlinePills = document.querySelectorAll('.punchline-pill');
  const punchlinePrevBtn = document.getElementById('prevPunchlineBtn');
  const punchlineNextBtn = document.getElementById('nextPunchlineBtn');
  const punchlineCounter = document.getElementById('punchlineCounter');
  const punchlineProgressFill = document.getElementById('punchlineProgressFill');
  const punchlineWrapper = document.getElementById('heroPunchlineWrapper');

  if (punchlineSlides.length > 0) {
    let currentPunchlineIndex = 0;
    let punchlineTimer = null;

    function resetPunchlineProgress() {
      if (!punchlineProgressFill) return;
      punchlineProgressFill.style.transition = 'none';
      punchlineProgressFill.style.width = '0%';
      void punchlineProgressFill.offsetWidth;
      punchlineProgressFill.style.transition = 'width 4s linear';
      punchlineProgressFill.style.width = '100%';
    }

    function showPunchline(index) {
      if (index < 0) {
        currentPunchlineIndex = punchlineSlides.length - 1;
      } else if (index >= punchlineSlides.length) {
        currentPunchlineIndex = 0;
      } else {
        currentPunchlineIndex = index;
      }

      punchlineSlides.forEach((slide, i) => {
        if (i === currentPunchlineIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      punchlinePills.forEach((pill, i) => {
        if (i === currentPunchlineIndex) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      if (punchlineCounter) {
        punchlineCounter.textContent = `${currentPunchlineIndex + 1} / ${punchlineSlides.length}`;
      }

      resetPunchlineProgress();
    }

    function nextPunchline() {
      showPunchline(currentPunchlineIndex + 1);
    }

    function prevPunchline() {
      showPunchline(currentPunchlineIndex - 1);
    }

    function startPunchlineTimer() {
      stopPunchlineTimer();
      resetPunchlineProgress();
      punchlineTimer = setInterval(nextPunchline, 4000);
    }

    function stopPunchlineTimer() {
      if (punchlineTimer) {
        clearInterval(punchlineTimer);
        punchlineTimer = null;
      }
    }

    // Pill Tab Click Handlers
    punchlinePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const idx = parseInt(pill.getAttribute('data-punchline'), 10);
        showPunchline(idx);
        startPunchlineTimer();
      });
    });

    // Arrow Button Click Handlers
    if (punchlineNextBtn) {
      punchlineNextBtn.addEventListener('click', () => {
        nextPunchline();
        startPunchlineTimer();
      });
    }

    if (punchlinePrevBtn) {
      punchlinePrevBtn.addEventListener('click', () => {
        prevPunchline();
        startPunchlineTimer();
      });
    }

    // Pause Auto-Rotation on Hover
    if (punchlineWrapper) {
      punchlineWrapper.addEventListener('mouseenter', stopPunchlineTimer);
      punchlineWrapper.addEventListener('mouseleave', startPunchlineTimer);
    }

    // Initialize Auto-Rotation
    startPunchlineTimer();
  }

  // Hero Card Widget Top Image Slider Logic
  const cardSlides = document.querySelectorAll('.card-slide');
  const cardDots = document.querySelectorAll('.card-dot');
  const cardPrevBtn = document.getElementById('cardSliderPrev');
  const cardNextBtn = document.getElementById('cardSliderNext');

  if (cardSlides.length > 0) {
    let currentCardSlideIndex = 0;
    let cardSliderTimer = null;

    function showCardSlide(index) {
      if (index < 0) {
        currentCardSlideIndex = cardSlides.length - 1;
      } else if (index >= cardSlides.length) {
        currentCardSlideIndex = 0;
      } else {
        currentCardSlideIndex = index;
      }

      cardSlides.forEach((slide, i) => {
        if (i === currentCardSlideIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      cardDots.forEach((dot, i) => {
        if (i === currentCardSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function nextCardSlide() {
      showCardSlide(currentCardSlideIndex + 1);
    }

    function prevCardSlide() {
      showCardSlide(currentCardSlideIndex - 1);
    }

    function startCardTimer() {
      stopCardTimer();
      cardSliderTimer = setInterval(nextCardSlide, 4000);
    }

    function stopCardTimer() {
      if (cardSliderTimer) {
        clearInterval(cardSliderTimer);
        cardSliderTimer = null;
      }
    }

    if (cardNextBtn) {
      cardNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextCardSlide();
        startCardTimer();
      });
    }

    if (cardPrevBtn) {
      cardPrevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevCardSlide();
        startCardTimer();
      });
    }

    cardDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showCardSlide(i);
        startCardTimer();
      });
    });

    startCardTimer();
  }

  // Interactive Hero Category Selector Pills
  const heroCatPills = document.querySelectorAll('.hero-cat-pill');
  const heroOptionSelect = document.getElementById('heroOption');

  heroCatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      heroCatPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetVal = pill.getAttribute('data-option');
      if (targetVal && heroOptionSelect) {
        heroOptionSelect.value = targetVal;
        
        // Highlight form dropdown visually
        heroOptionSelect.classList.add('highlight-select');
        setTimeout(() => {
          heroOptionSelect.classList.remove('highlight-select');
        }, 1000);
      }
    });
  });

  // Interactive Girls PG Disclaimer Modal Controller (Auto 7-Second Timer)
  const disclaimerModal = document.getElementById('disclaimerModal');
  const disclaimerCloseBtn = document.getElementById('disclaimerCloseBtn');
  const disclaimerAgreeBtn = document.getElementById('disclaimerAgreeBtn');
  const disclaimerBackdrop = document.getElementById('disclaimerBackdrop');
  const triggerDisclaimerBtn = document.getElementById('triggerDisclaimerBtn');
  const floatingDisclaimerPill = document.getElementById('floatingDisclaimerPill');

  function openDisclaimerModal() {
    if (disclaimerModal) {
      disclaimerModal.classList.add('active');
      disclaimerModal.setAttribute('aria-hidden', 'false');
      if (window.pauseScroll) window.pauseScroll(); else document.body.style.overflow = 'hidden';
    }
  }

  function closeDisclaimerModal() {
    if (disclaimerModal) {
      disclaimerModal.classList.remove('active');
      disclaimerModal.setAttribute('aria-hidden', 'true');
      if (window.resumeScroll) window.resumeScroll(); else document.body.style.overflow = '';
      try {
        sessionStorage.setItem('aeronest_disclaimer_viewed', 'true');
      } catch (err) {
        // Fallback if sessionStorage blocked
      }
    }
  }

  // Trigger disclaimer popup automatically 7 seconds after site load
  setTimeout(() => {
    let alreadyViewed = false;
    try {
      alreadyViewed = sessionStorage.getItem('aeronest_disclaimer_viewed') === 'true';
    } catch (e) {
      alreadyViewed = false;
    }
    
    if (!alreadyViewed) {
      openDisclaimerModal();
    }
  }, 7000);

  // Manual Trigger via Hero Tag
  if (triggerDisclaimerBtn) {
    triggerDisclaimerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDisclaimerModal();
    });
  }

  // Manual Trigger via Floating Pill
  if (floatingDisclaimerPill) {
    floatingDisclaimerPill.addEventListener('click', () => {
      openDisclaimerModal();
    });
  }

  // Close Event Handlers
  if (disclaimerCloseBtn) {
    disclaimerCloseBtn.addEventListener('click', closeDisclaimerModal);
  }

  if (disclaimerAgreeBtn) {
    disclaimerAgreeBtn.addEventListener('click', closeDisclaimerModal);
  }

  if (disclaimerBackdrop) {
    disclaimerBackdrop.addEventListener('click', closeDisclaimerModal);
  }

  // Keyboard Escape Key Handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && disclaimerModal && disclaimerModal.classList.contains('active')) {
      closeDisclaimerModal();
    }
  });

  // Pure Video Reels Interactive Controller (Zero Clutter, 100% Mobile Responsive)
  const instaCards = document.querySelectorAll('.insta-square-card');
  const instaModal = document.getElementById('instaVideoModal');
  const modalVideo = document.getElementById('instaModalVideo');
  const modalTitle = document.getElementById('instaModalTitle');
  const modalDirectBtn = document.getElementById('instaModalDirectBtn');
  const instaModalCloseBtn = document.getElementById('instaModalClose');
  const instaModalBackdropEl = document.getElementById('instaModalBackdrop');
  const galleryReelTab = document.querySelector('.gallery-reel-tab');

  // Smooth scroll from gallery "Watch Video Reel" tab
  if (galleryReelTab) {
    galleryReelTab.addEventListener('click', (e) => {
      e.preventDefault();
      const reelSec = document.getElementById('instaReelsSection') || document.getElementById('instaVideoGrid');
      if (reelSec) {
        reelSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Handle Autoplay & Sound Toggle for each card
  instaCards.forEach(card => {
    const video = card.querySelector('.insta-square-video');
    const media = card.querySelector('.insta-square-media');
    const audioBtn = card.querySelector('.insta-audio-toggle');
    const watchBtn = card.querySelector('.insta-card-watch-btn');

    if (video) {
      // Ensure initial muted autoplay
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }

      // Audio Toggle
      if (audioBtn) {
        audioBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const willUnmute = video.muted;
          
          // If unmuting, mute all other videos first
          if (willUnmute) {
            document.querySelectorAll('.insta-square-video').forEach(v => {
              if (v !== video) {
                v.muted = true;
                const parentCard = v.closest('.insta-square-card');
                const parentBtn = parentCard ? parentCard.querySelector('.insta-audio-toggle') : null;
                if (parentBtn) {
                  parentBtn.classList.remove('is-unmuted');
                  parentBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                  parentBtn.setAttribute('title', 'Tap to unmute sound');
                }
              }
            });
          }

          video.muted = !willUnmute;
          if (!video.muted) {
            audioBtn.classList.add('is-unmuted');
            audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            audioBtn.setAttribute('title', 'Tap to mute sound');
          } else {
            audioBtn.classList.remove('is-unmuted');
            audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            audioBtn.setAttribute('title', 'Tap to unmute sound');
          }
        });
      }

      // Play / Pause toggle on media tap
      if (media) {
        media.addEventListener('click', (e) => {
          if (e.target.closest('.insta-audio-toggle')) return;
          if (video.paused) {
            video.play().catch(() => {});
            media.classList.remove('is-paused');
          } else {
            video.pause();
            media.classList.add('is-paused');
          }
        });
      }
    } else if (media) {
      // Direct Instagram post launch on media tap
      media.addEventListener('click', () => {
        const directLink = card.getAttribute('data-direct-link');
        if (directLink) {
          window.open(directLink, '_blank', 'noopener');
        }
      });
    }

    // Watch Fullscreen button
    if (watchBtn) {
      watchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPureVideoModal(card);
      });
    }
  });

  // Pure Video Modal Function (Full Controls, No Clutter)
  function openPureVideoModal(card) {
    const videoSrc = card.getAttribute('data-video-src');
    const directLink = card.getAttribute('data-direct-link');
    const title = card.getAttribute('data-title');
    const cardVideo = card.querySelector('.insta-square-video');

    if (videoSrc) {
      if (modalVideo) {
        modalVideo.src = videoSrc;
        if (cardVideo && !isNaN(cardVideo.currentTime)) {
          modalVideo.currentTime = cardVideo.currentTime;
        }
        modalVideo.muted = false;
        modalVideo.play().catch(() => {});
      }
      if (modalTitle && title) {
        modalTitle.innerText = title;
      }
      if (modalDirectBtn && directLink) {
        modalDirectBtn.setAttribute('href', directLink);
      }
      if (instaModal) {
        instaModal.classList.add('active');
        instaModal.setAttribute('aria-hidden', 'false');
        if (window.pauseScroll) window.pauseScroll(); else document.body.style.overflow = 'hidden';
      }
    } else if (directLink) {
      window.open(directLink, '_blank', 'noopener');
    }
  }

  function closePureVideoModal() {
    if (instaModal) {
      instaModal.classList.remove('active');
      instaModal.setAttribute('aria-hidden', 'true');
      if (window.resumeScroll) window.resumeScroll(); else document.body.style.overflow = '';
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.src = '';
      }
    }
  }

  if (instaModalCloseBtn) instaModalCloseBtn.addEventListener('click', closePureVideoModal);
  if (instaModalBackdropEl) instaModalBackdropEl.addEventListener('click', closePureVideoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && instaModal && instaModal.classList.contains('active')) {
      closePureVideoModal();
    }
  });

  // IntersectionObserver to pause out-of-screen videos for optimal performance
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        const mediaBox = vid.closest('.insta-square-media');
        if (entry.isIntersecting) {
          if (vid.paused && mediaBox && !mediaBox.classList.contains('is-paused')) {
            vid.play().catch(() => {});
          }
        } else {
          if (!vid.paused) {
            vid.pause();
          }
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.insta-square-video').forEach(v => videoObserver.observe(v));
  }
});
