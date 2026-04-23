const poster = document.querySelector(".poster");
const audio = document.querySelector("audio");
const playerButton = document.querySelector(".player-button");
const fakePlay = document.querySelector("#fake-play");
const rsvpForm = document.querySelector(".rsvp-form");
const formNote = document.querySelector(".form-note");
const countdown = document.querySelector(".countdown-live");
const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz4i-nmh4fdpyrNq8FRwtZ_GFAdcDF5O6vnw2EgH6LwD8lnYo4CFrAt0wsjN7DPlksb/exec";
const RSVP_IFRAME_NAME = "rsvp-get-frame";

const revealSelectors = [
  ".dynamic-player",
  ".invite-title",
  ".invite-date-small",
  ".guest-text",
  ".couple-label",
  ".couple-names",
  ".invite-copy",
  ".date-main",
  ".calendar",
  ".countdown-title",
  ".countdown-live",
  ".location-card",
  ".divider-location",
  ".hosts-block",
  ".rsvp-title",
  ".rsvp-help",
  ".rsvp-form",
  ".choice-text-1",
  ".choice-text-2",
  ".choice-text-3",
  ".closing",
];

function updateCountdown() {
  if (!countdown) return;

  const deadline = new Date(countdown.dataset.deadline).getTime();
  const diff = Math.max(deadline - Date.now(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.querySelector('[data-unit="days"]').textContent = String(days);
  countdown.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, "0");
  countdown.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2, "0");
  countdown.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealElements = revealSelectors
  .map((selector) => document.querySelector(selector))
  .filter(Boolean);

revealElements.forEach((element) => {
  element.classList.add("scroll-reveal");
});

if ("IntersectionObserver" in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

if (audio && playerButton && poster) {
  let isTogglingAudio = false;
  let userPausedAudio = false;
  let wasPlayingBeforeHidden = false;
  let playPromise = null;

  const syncProgress = () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    const percent = `${Math.max(0, Math.min(ratio, 1)) * 100}%`;
    poster.style.setProperty("--progress-pct", percent);
  };

  const syncPlayerState = () => {
    const isPlaying = !audio.paused;
    playerButton.setAttribute("aria-pressed", String(isPlaying));
    playerButton.setAttribute(
      "aria-label",
      isPlaying ? "Поставить на паузу" : "Воспроизвести музыку"
    );
    poster.classList.toggle("is-playing", isPlaying);
  };

  syncPlayerState();
  syncProgress();

  const playAudio = async () => {
    if (!audio.paused || playPromise) return;

    try {
      playPromise = audio.play();
      await playPromise;
    } catch (error) {
      if (error.name !== "NotAllowedError") {
        console.error(error);
      }
    } finally {
      playPromise = null;
      syncPlayerState();
    }
  };

  const pauseAudio = () => {
    audio.pause();
    syncPlayerState();
  };

  playerButton.addEventListener("click", async (event) => {
    event.stopPropagation();

    if (isTogglingAudio) return;

    isTogglingAudio = true;

    try {
      if (audio.paused) {
        userPausedAudio = false;

        if (audio.ended) {
          audio.currentTime = 0;
        }

        await playAudio();
      } else {
        userPausedAudio = true;
        pauseAudio();
      }
    } catch (error) {
      console.error(error);
    } finally {
      syncPlayerState();
      isTogglingAudio = false;
    }
  });

  const tryAutoplay = () => {
    if (!userPausedAudio && !document.hidden) {
      void playAudio();
    }
  };

  const removeAutoplayUnlock = () => {
    document.removeEventListener("pointerdown", unlockAutoplay);
    document.removeEventListener("touchstart", unlockAutoplay);
  };

  const unlockAutoplay = async (event) => {
    if (playerButton.contains(event.target)) return;

    await playAudio();

    if (!audio.paused) {
      removeAutoplayUnlock();
    }
  };

  audio.addEventListener("pause", syncPlayerState);
  audio.addEventListener("play", syncPlayerState);
  audio.addEventListener("ended", syncPlayerState);
  audio.addEventListener("timeupdate", syncProgress);
  audio.addEventListener("loadedmetadata", syncProgress);
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    syncProgress();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      wasPlayingBeforeHidden = !audio.paused;

      if (wasPlayingBeforeHidden) {
        pauseAudio();
      }

      return;
    }

    if (wasPlayingBeforeHidden && !userPausedAudio) {
      wasPlayingBeforeHidden = false;
      tryAutoplay();
    }
  });

  window.addEventListener("blur", () => {
    wasPlayingBeforeHidden = !audio.paused;

    if (wasPlayingBeforeHidden) {
      pauseAudio();
    }
  });

  window.addEventListener("focus", () => {
    if (wasPlayingBeforeHidden && !userPausedAudio) {
      wasPlayingBeforeHidden = false;
      tryAutoplay();
    }
  });

  if (document.readyState === "complete") {
    tryAutoplay();
  } else {
    window.addEventListener("load", tryAutoplay, { once: true });
  }

  document.addEventListener("pointerdown", unlockAutoplay);
  document.addEventListener("touchstart", unlockAutoplay, { passive: true });
}

if (rsvpForm && formNote && poster) {
  let rsvpFrame = document.querySelector(`iframe[name="${RSVP_IFRAME_NAME}"]`);

  if (!rsvpFrame) {
    rsvpFrame = document.createElement("iframe");
    rsvpFrame.name = RSVP_IFRAME_NAME;
    rsvpFrame.hidden = true;
    rsvpFrame.tabIndex = -1;
    document.body.appendChild(rsvpFrame);
  }

  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(rsvpForm);
    const guestName = String(formData.get("guestName") || "").trim();
    const attendance = formData.get("attendance");

    if (!guestName) {
      formNote.textContent = "Аты-жөніңізді жазыңыз.";
      return;
    }

    if (!attendance) {
      formNote.textContent = "Келу жауабыңызды таңдаңыз.";
      return;
    }

    const payload = {
      guestName,
      attendance,
      createdAt: new Date().toISOString(),
    };

    const submitButton = rsvpForm.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
    }

    formNote.textContent = "Жіберіліп жатыр...";

    try {
      const query = new URLSearchParams({
        guestName,
        attendance,
        createdAt: payload.createdAt,
      });
      const requestUrl = `${RSVP_ENDPOINT}?${query.toString()}`;

      await new Promise((resolve) => {
        let done = false;
        const finish = () => resolve();
        const cleanup = () => {
          rsvpFrame.removeEventListener("load", handleLoad);
          rsvpFrame.removeEventListener("error", handleError);
        };
        const settle = () => {
          if (done) return;
          done = true;
          cleanup();
          finish();
        };
        const handleLoad = () => settle();
        const handleError = () => settle();

        rsvpFrame.addEventListener("load", handleLoad, { once: true });
        rsvpFrame.addEventListener("error", handleError, { once: true });
        rsvpFrame.src = requestUrl;
        setTimeout(settle, 2500);
      });

      localStorage.setItem("rsvp-response", JSON.stringify(payload));
      formNote.textContent = "Рақмет! Жауабыңыз жіберілді.";
      rsvpForm.reset();
      poster.classList.remove("is-sent");
      void poster.offsetWidth;
      poster.classList.add("is-sent");
    } catch (error) {
      console.error(error);
      formNote.textContent = "Жіберу сәтсіз болды. Қайтадан көріңіз.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
