// Aeronest Girls PG & Luxury Apartments - Master Script (v7 Slider & New Sections)

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 80
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
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-gallery-filter');
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
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightboxModal() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
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
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
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
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDisclaimerModal() {
    if (disclaimerModal) {
      disclaimerModal.classList.remove('active');
      disclaimerModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
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
});
