(() => {
  const modal = document.getElementById('surpriseModal');
  const openButton = document.getElementById('openSurprise');
  const continueButton = document.getElementById('continueButton');
  const secretButton = document.getElementById('secretButton');
  const secretMessage = document.getElementById('secretMessage');
  const heartButton = document.getElementById('heartButton');
  const heartHint = document.getElementById('heartHint');
  let previousFocus = null;
  let heartCount = 0;

  // Photo placeholders remain visible until matching image files are added.
  document.querySelectorAll('.photo-frame img').forEach((img) => {
    const showPhoto = () => {
      img.style.display = 'block';
      const placeholder = img.parentElement.querySelector('.photo-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    };
    img.addEventListener('load', showPhoto);
    img.addEventListener('error', () => { img.style.display = 'none'; });
    if (img.complete && img.naturalWidth > 0) showPhoto();
  });

  function openModal() {
    previousFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => modal.querySelector('.modal-close').focus(), 60);
    burstHearts(9);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  openButton.addEventListener('click', openModal);
  modal.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
  continueButton.addEventListener('click', () => {
    closeModal();
    window.setTimeout(() => document.getElementById('letter').scrollIntoView({ behavior: 'smooth' }), 100);
  });

  secretButton.addEventListener('click', () => {
    const isHidden = secretMessage.hidden;
    secretMessage.hidden = !isHidden;
    secretButton.innerHTML = isHidden
      ? 'Keep this little thought close <span>♡</span>'
      : 'There\'s one more thing... <span>↗</span>';
    if (isHidden) {
      secretMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      burstHearts(5);
    }
  });

  function makeHeart(x = Math.random() * 100, fromButton = false) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = ['♡', '♥', '✧'][Math.floor(Math.random() * 3)];
    heart.style.setProperty('--x', `${Math.max(2, Math.min(96, x + (Math.random() * 12 - 6)))}%`);
    heart.style.setProperty('--size', `${14 + Math.random() * (fromButton ? 22 : 14)}px`);
    heart.style.setProperty('--duration', `${3.2 + Math.random() * 2.3}s`);
    heart.style.setProperty('--heart-color', ['#d990aa', '#e6bdcb', '#d7b783', '#c17c98'][Math.floor(Math.random() * 4)]);
    document.body.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }

  function burstHearts(count) {
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => makeHeart(34 + Math.random() * 32, true), i * 85);
    }
  }

  heartButton.addEventListener('click', () => {
    heartCount += 1;
    burstHearts(heartCount % 3 === 0 ? 18 : 8);
    heartButton.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
      { duration: 360, easing: 'ease-out' }
    );
    const messages = [
      'A little heart, just for you. ♡',
      'Sending another smile your way. ✧',
      'Okay, that was a tiny heart storm. ♥',
      'May something lovely find you today. ♡',
      'One more, because why not? ✨'
    ];
    heartHint.textContent = messages[(heartCount - 1) % messages.length];
  });

  // Gentle, infrequent ambient hearts keep the page alive without overwhelming it.
  window.setInterval(() => {
    if (document.visibilityState === 'visible' && Math.random() > 0.42) makeHeart(Math.random() * 100, false);
  }, 2100);

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
})();
