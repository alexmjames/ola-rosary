document.addEventListener('DOMContentLoaded', () => {
  // === 1. DOM References ===
  const fab = document.getElementById('menu-fab');
  const modal = document.getElementById('nav-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const navLinks = document.querySelectorAll('.nav-link');

  // === 2. Haptic Feedback Utility ===
  const triggerHaptic = (pattern = 10) => {
    if (navigator.vibrate) {
      // Catch in case browser policy blocks it without interaction
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  };

  // === 3. Modal Logic ===
  const settingsFab = document.getElementById('settings-fab');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings');

  const openNavModal = () => {
    triggerHaptic(15);
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    setTimeout(() => closeModalBtn.focus(), 100);
  };

  const closeNavModal = () => {
    triggerHaptic(10);
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  };

  const openSettingsModal = () => {
    triggerHaptic(15);
    settingsModal.classList.remove('hidden');
    settingsModal.setAttribute('aria-hidden', 'false');
    settingsFab.setAttribute('aria-expanded', 'true');
    setTimeout(() => closeSettingsBtn.focus(), 100);
  };

  const closeSettingsModal = () => {
    triggerHaptic(10);
    settingsModal.classList.add('hidden');
    settingsModal.setAttribute('aria-hidden', 'true');
    settingsFab.setAttribute('aria-expanded', 'false');
    settingsFab.focus();
  };

  fab.addEventListener('click', openNavModal);
  closeModalBtn.addEventListener('click', closeNavModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeNavModal();
  });

  if (settingsFab) {
    settingsFab.addEventListener('click', openSettingsModal);
    closeSettingsBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeSettingsModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!modal.classList.contains('hidden')) closeNavModal();
      if (settingsModal && !settingsModal.classList.contains('hidden')) closeSettingsModal();
    }
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      triggerHaptic(10);
      closeNavModal();
    });
  });

  // === 4. In-App Text Resizer ===
  const btnDecrease = document.getElementById('btn-text-decrease');
  const btnIncrease = document.getElementById('btn-text-increase');
  // Initialize from localStorage, fall back to responsive CSS default if none
  let currentFontSize = parseFloat(localStorage.getItem('fontSize'));
  
  const applyFontSize = () => {
    if (currentFontSize) {
      document.documentElement.style.fontSize = `${currentFontSize}px`;
      localStorage.setItem('fontSize', currentFontSize);
    }
  };
  applyFontSize();

  btnDecrease.addEventListener('click', () => {
    triggerHaptic([10, 30, 10]);
    if (!currentFontSize) currentFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    if (currentFontSize > 14) currentFontSize -= 2;
    applyFontSize();
  });
  btnIncrease.addEventListener('click', () => {
    triggerHaptic([10, 30, 10]);
    if (!currentFontSize) currentFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    if (currentFontSize < 32) currentFontSize += 2;
    applyFontSize();
  });

  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

  // === 5. Theme Toggle Logic ===
  let isDarkTheme = false;
  const currentSavedTheme = localStorage.getItem('theme');
  const toggleTheme = document.getElementById('toggle-theme');

  if (currentSavedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    isDarkTheme = true;
    if (toggleTheme) toggleTheme.checked = true;
  }

  if (toggleTheme) {
    toggleTheme.addEventListener('change', (e) => {
      triggerHaptic(15);
      if (e.target.checked) {
        document.body.classList.add('dark-theme');
        isDarkTheme = true;
      } else {
        document.body.classList.remove('dark-theme');
        isDarkTheme = false;
      }
      localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });
  }

  // === 6. Interactive Beads Logic ===
  const toggleInteractiveBeads = document.getElementById('toggle-interactive-beads');
  if (toggleInteractiveBeads) {
    const savedBeadsState = localStorage.getItem('interactiveBeads');
    const shouldShowBeads = savedBeadsState === null ? true : savedBeadsState === 'true';
    
    if (shouldShowBeads) {
      document.body.classList.add('show-interactive-beads');
      toggleInteractiveBeads.checked = true;
    }
    
    toggleInteractiveBeads.addEventListener('change', (e) => {
      triggerHaptic(15);
      const isChecked = e.target.checked;
      if (isChecked) {
        document.body.classList.add('show-interactive-beads');
      } else {
        document.body.classList.remove('show-interactive-beads');
        // Reset beads when turned off
        document.querySelectorAll('.bead-btn').forEach(btn => btn.classList.remove('filled'));
      }
      localStorage.setItem('interactiveBeads', isChecked);
    });
  }

  const handleBeadClick = (bead) => {
    bead.classList.toggle('filled');
    if (bead.classList.contains('filled')) {
      triggerHaptic(15);
    } else {
      triggerHaptic(5);
    }
  };

  // Inject 3 beads into the 3-Hail-Marys card
  const threeHailMarysCard = document.getElementById('three-hail-marys-card');
  if (threeHailMarysCard) {
    const container = document.createElement('div');
    container.className = 'interactive-beads-container opening-beads-container';
    const hmContainer = document.createElement('div');
    hmContainer.className = 'hail-mary-beads';
    
    for (let i = 0; i < 3; i++) {
      const hmBead = document.createElement('button');
      hmBead.className = 'bead-btn hail-mary-bead';
      hmBead.setAttribute('aria-label', `Opening Hail Mary Bead ${i + 1}`);
      hmBead.addEventListener('click', () => handleBeadClick(hmBead));
      hmContainer.appendChild(hmBead);
    }
    container.appendChild(hmContainer);
    threeHailMarysCard.appendChild(container);
  }

  // Inject beads into mysteries
  const mysteryItems = document.querySelectorAll('.mystery-item');
  mysteryItems.forEach((item) => {
    const container = document.createElement('div');
    container.className = 'interactive-beads-container';
    
    const hmContainer = document.createElement('div');
    hmContainer.className = 'hail-mary-beads';
    
    for (let i = 0; i < 10; i++) {
      const hmBead = document.createElement('button');
      hmBead.className = 'bead-btn hail-mary-bead';
      hmBead.setAttribute('aria-label', `Hail Mary Bead ${i + 1}`);
      hmBead.addEventListener('click', () => handleBeadClick(hmBead));
      hmContainer.appendChild(hmBead);
    }
    
    container.appendChild(hmContainer);
    item.appendChild(container);
  });

  // === 7. Mystery of the Day Logic ===
  const mysterySections = document.querySelectorAll('.mystery-section');
  let todayMysteryId = '#joyful-mysteries'; 

  mysterySections.forEach(section => {
    const daysStr = section.getAttribute('data-days');
    if (daysStr) {
      const daysArr = daysStr.split(',').map(Number);
      if (daysArr.includes(currentDay)) {
        section.classList.add('active-mystery');
        const badge = section.querySelector('.today-badge');
        if (badge) badge.classList.remove('hidden');
        todayMysteryId = '#' + section.id;
      } else {
        section.classList.add('inactive-mystery');
      }
    }
  });

  const dynamicMysteryLink = document.getElementById('dynamic-mystery-link');
  if (dynamicMysteryLink) {
    dynamicMysteryLink.setAttribute('href', todayMysteryId);
    dynamicMysteryLink.addEventListener('click', (e) => {
      e.preventDefault();
      triggerHaptic(10);
      const target = document.querySelector(todayMysteryId);
      if (target) {
        target.classList.add('reveal-visible'); // Guarantee visibility
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const jumpBtns = document.querySelectorAll('.jump-btn:not(#dynamic-mystery-link)');
  jumpBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    triggerHaptic(10);
    const targetId = btn.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      target.classList.add('reveal-visible'); // Guarantee visibility
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }));

  // === 7. Scroll Reveal (Intersection Observer) ===
  const prayerSections = document.querySelectorAll('.prayer-section');
  
  prayerSections.forEach((section) => {
    // Add scroll reveal classes dynamically so non-JS users aren't hidden
    section.classList.add('reveal-hidden');
  });

  // Setup observers
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Scroll Reveal
        entry.target.classList.add('reveal-visible');
      }
    });
  }, { threshold: 0.01, rootMargin: "0px 0px -10% 0px" });

  prayerSections.forEach(section => sectionObserver.observe(section));

  // === 8. Screen Wake Lock ===
  let wakeLock = null;
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.log('Wake Lock request failed:', err.name);
      }
    }
  };
  
  // Request on initial interaction to ensure browser doesn't block it
  const initialWakeLock = () => {
    requestWakeLock();
    document.removeEventListener('click', initialWakeLock);
  };
  document.addEventListener('click', initialWakeLock);

  // Re-acquire wake lock if document becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });

  // === 9. Custom "Install App" Prompt ===
  let deferredPrompt;
  const installBtn = document.getElementById('btn-install-app');
  
  if (installBtn) {
    installBtn.classList.remove('hidden');
  }
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      triggerHaptic(20);
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          installBtn.textContent = 'Installed';
          installBtn.disabled = true;
        }
        deferredPrompt = null;
      } else {
        alert("This app is either already installed, or your browser does not support installation right now. Try using 'Add to Home Screen' from your browser menu.");
      }
    });
  }

  // === 10. Service Worker Registration ===
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
});
