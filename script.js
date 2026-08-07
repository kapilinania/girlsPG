// Aeronest Girls PG & Luxury Apartments - Master Script (v5 Redesign & 5-Menu Layout)

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

  // Photo Gallery Filter Logic
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-gallery-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-gallery-cat');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
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
        btn.style.background = '#e11d48';
        countSpan.innerText = currentCount + 1;
      } else {
        btn.classList.remove('liked');
        btn.style.background = 'rgba(225, 29, 72, 0.88)';
        countSpan.innerText = currentCount - 1;
      }
    });
  });

  // Lightbox Modal for Photo Gallery
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.querySelector('img').getAttribute('src');
      const title = card.querySelector('.gallery-title-badge').innerText;

      if (lightboxImg && lightboxModal) {
        lightboxImg.setAttribute('src', imgSrc);
        lightboxCaption.innerText = title;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
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
});
