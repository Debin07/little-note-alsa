(() => {
  'use strict';

  const PASSWORD = '300506';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const photoFiles = [
    'WhatsApp Image 2026-09-27 at 11.05.30 PM.jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.31 PM.jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.31 PM (1).jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.32 PM.jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.32 PM (1).jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.32 PM (2).jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.33 PM.jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.33 PM (1).jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.34 PM.jpeg',
    'WhatsApp Image 2026-09-27 at 11.05.34 PM (1).jpeg'
  ];
  const photoCaptions = [
    'senyum favorit', 'soft girl moment', 'cantik sekali', 'little sunshine', 'pretty in red',
    'our sweet memory', 'you look adorable', 'always lovely', 'the cutest view', 'my favourite person'
  ];
  const photoSources = photoFiles.map((file) => encodeURI(`poto alsa/${file}`));

  const $ = (selector) => document.querySelector(selector);
  const loginScreen = $('#login-screen');
  const siteContent = $('#site-content');
  const loginForm = $('#login-form');
  const passwordInput = $('#password-input');
  const loginMessage = $('#login-message');
  const togglePasswordButton = $('#toggle-password');
  const heartsLayer = $('#hearts-layer');
  const galleryGrid = $('#gallery-grid');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxCaption = $('#lightbox-caption');
  const lightboxCounter = $('#lightbox-counter');
  let currentPhoto = 0;
  let lightboxIsOpen = false;

  function setLoginMessage(message, isSuccess = false) {
    loginMessage.textContent = message;
    loginMessage.classList.toggle('is-success', isSuccess);
  }

  function createFloatingHearts(amount = 12) {
    if (prefersReducedMotion) return;
    heartsLayer.replaceChildren();
    for (let index = 0; index < amount; index += 1) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = index % 4 === 0 ? '✦' : '♥';
      heart.style.left = `${8 + Math.random() * 84}%`;
      heart.style.setProperty('--size', `${.65 + Math.random() * .9}rem`);
      heart.style.setProperty('--duration', `${3.5 + Math.random() * 2.5}s`);
      heart.style.setProperty('--delay', `${Math.random() * .7}s`);
      heart.style.setProperty('--drift', `${-55 + Math.random() * 110}px`);
      heartsLayer.appendChild(heart);
    }
    window.setTimeout(() => heartsLayer.replaceChildren(), 6500);
  }

  function finishLogin() {
    loginScreen.classList.add('is-leaving');
    createFloatingHearts(16);
    const delay = prefersReducedMotion ? 0 : 450;
    window.setTimeout(() => {
      loginScreen.hidden = true;
      loginScreen.classList.remove('is-leaving');
      siteContent.hidden = false;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      $('#open-letter-button').focus();
      document.querySelectorAll('.reveal-section').forEach((section) => section.classList.add('is-visible'));
    }, delay);
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const password = passwordInput.value;

    if (password !== PASSWORD) {
      setLoginMessage('Password-nya belum tepat. Coba ingat-ingat tanggal favorit kita.');
      passwordInput.select();
      return;
    }

    setLoginMessage('Berhasil! Sebentar, kejutan sedang disiapkan...', true);
    loginForm.querySelector('button[type="submit"]').disabled = true;
    window.setTimeout(finishLogin, prefersReducedMotion ? 50 : 350);
  });

  togglePasswordButton.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordButton.textContent = isPassword ? 'sembunyikan' : 'lihat';
    togglePasswordButton.setAttribute('aria-label', isPassword ? 'Sembunyikan password' : 'Tampilkan password');
    togglePasswordButton.setAttribute('aria-pressed', String(isPassword));
  });

  function renderGallery() {
    galleryGrid.replaceChildren();
    photoSources.forEach((source, index) => {
      const button = document.createElement('button');
      button.className = 'gallery-item';
      button.type = 'button';
      button.style.setProperty('--tilt', `${index % 2 === 0 ? '-1.5' : '1.5'}deg`);
      button.setAttribute('aria-label', `Buka foto ${index + 1}: ${photoCaptions[index]}`);
      button.addEventListener('click', () => openLightbox(index));

      const image = document.createElement('img');
      image.src = source;
      image.alt = `Foto Alsa, ${photoCaptions[index]}`;
      image.loading = index < 2 ? 'eager' : 'lazy';
      image.addEventListener('error', () => {
        button.classList.add('is-fallback');
        image.alt = 'Foto tidak dapat dimuat';
        image.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22330%22 viewBox=%220 0 300 330%22%3E%3Crect width=%22300%22 height=%22330%22 fill=%22%23f8e6e7%22/%3E%3Ctext x=%22150%22 y=%22165%22 fill=%22%23c95379%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22%3Efoto kenangan%3C/text%3E%3C/svg%3E';
      });

      const number = document.createElement('span');
      number.className = 'gallery-item__number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1).padStart(2, '0');
      const caption = document.createElement('span');
      caption.className = 'gallery-item__caption';
      caption.textContent = photoCaptions[index];
      button.append(image, number, caption);
      galleryGrid.appendChild(button);
    });
  }

  function updateLightbox() {
    lightboxImage.src = photoSources[currentPhoto];
    lightboxImage.alt = `Foto Alsa, ${photoCaptions[currentPhoto]}`;
    lightboxCaption.textContent = photoCaptions[currentPhoto];
    lightboxCounter.textContent = `${currentPhoto + 1} / ${photoSources.length}`;
  }

  function openLightbox(index) {
    currentPhoto = index;
    updateLightbox();
    lightboxIsOpen = true;
    lightbox.hidden = false;
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    }
    $('#lightbox-close').focus();
  }

  function closeLightbox() {
    lightboxIsOpen = false;
    if (lightbox.open && typeof lightbox.close === 'function') {
      lightbox.close();
    } else {
      lightbox.hidden = true;
    }
  }

  function movePhoto(step) {
    currentPhoto = (currentPhoto + step + photoSources.length) % photoSources.length;
    updateLightbox();
  }

  $('#lightbox-close').addEventListener('click', closeLightbox);
  $('#lightbox-prev').addEventListener('click', () => movePhoto(-1));
  $('#lightbox-next').addEventListener('click', () => movePhoto(1));
  lightbox.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (!lightboxIsOpen) return;
    if (event.key === 'ArrowLeft') movePhoto(-1);
    if (event.key === 'ArrowRight') movePhoto(1);
  });

  function openLetter() {
    const letterCard = $('#letter-card');
    const letterContent = $('#letter-content');
    const isOpen = letterCard.classList.toggle('is-open');
    letterContent.hidden = !isOpen;
    $('#open-letter-button').setAttribute('aria-expanded', String(isOpen));
    $('#letter-toggle').setAttribute('aria-expanded', String(isOpen));
    $('#letter-toggle').innerHTML = isOpen ? 'Tutup surat <span aria-hidden="true">↟</span>' : 'Buka surat <span aria-hidden="true">✦</span>';
    if (isOpen) {
      createFloatingHearts(20);
      letterContent.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }

  $('#open-letter-button').addEventListener('click', openLetter);
  $('#letter-toggle').addEventListener('click', openLetter);

  $('#replay-button').addEventListener('click', () => window.location.reload());

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal-section').forEach((section) => observer.observe(section));
  } else {
    document.querySelectorAll('.reveal-section').forEach((section) => section.classList.add('is-visible'));
  }

  renderGallery();
  window.setTimeout(() => passwordInput.focus(), 150);
})();
