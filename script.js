const poster = document.querySelector(".poster");
const audio = document.querySelector("audio");
const playerButton = document.querySelector(".player-button");
const fakePlay = document.querySelector("#fake-play");
const rsvpForm = document.querySelector(".rsvp-form");
const formNote = document.querySelector(".form-note");
const countdown = document.querySelector(".countdown-live");
const descriptionMeta = document.querySelector('meta[name="description"]');
const langButtons = document.querySelectorAll(".lang-btn");
const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz4i-nmh4fdpyrNq8FRwtZ_GFAdcDF5O6vnw2EgH6LwD8lnYo4CFrAt0wsjN7DPlksb/exec";
const RSVP_IFRAME_NAME = "rsvp-get-frame";
const DEFAULT_LANG = "kk";
let currentLang = localStorage.getItem("site-lang") || DEFAULT_LANG;

const translations = {
  kk: {
    pageTitle: "Руслан мен Ақнур",
    pageDescription: "Руслан мен Ақнурдың үйлену тойына шақыру.",
    playerTitle: "Әуенді қосу үшін,<br />батырманы басыңыз",
    inviteTitle: "ҮЙЛЕНУ ТОЙҒА ШАҚЫРУ!",
    guestLead: "Құрметті",
    guestText: "ағайын-туыс, бауырлар, құда-жекжат, нағашы-жиен, бөлелер, дос-жаран, әріптестер және көршілер!",
    coupleLabel: "СІЗДЕРДІ<br />ҰЛЫМЫЗ БЕН КЕЛІНІМІЗ",
    coupleNames: "Руслан<br />мен<br />Ақнур",
    inviteCopy: "ҮЙЛЕНУ ТОЙЫНА АРНАЛҒАН АҚ ДАСТАРХАНЫМЫЗДЫҢ ҚАДІРЛІ ҚОНАҒЫ БОЛУҒА ШАҚЫРАМЫЗ",
    dateMain: "27 маусым, 2026 жыл<br />17:00",
    countdownTitle: "ТОЙ САЛТАНАТЫНА ДЕЙІН:",
    countdownAria: "Тойға дейінгі кері санау",
    locationTitle: "МЕКЕН-ЖАЙЫМЫЗ:",
    locationText: "СЕМЕЙ ҚАЛАСЫ<br />“TAMIRLAN HALL”<br />МЕЙРАМХАНАСЫ",
    locationAria: "Мекен-жайымыз",
    mapLinkAria: "2GIS-та мекен-жайды ашу",
    hostsTitle: "ТОЙ ИЕЛЕРІ:",
    hostsName: "Кисановтар",
    hostsFamily: "Әулеті",
    hostsAria: "Той иелері",
    rsvpTitle: "Тойға қатысуыңызды<br />растауыңызды сұраймыз!",
    rsvpHelp: "Аты-жөніңізді жазыңыз,<br />(жұбайыңызбен келетін болсаңыз, есімдеріңізді бірге жазуды өтінеміз)",
    rsvpQuestion: "Тойға келесіз бе?",
    submitButton: "Жауапты жіберу",
    guestNameAria: "Аты-жөні",
    choice1: "Әрине, келемін!",
    choice2: "Жұбайыммен келемін!",
    choice3: "Өкінішке орай, келе алмаймын",
    attendanceValues: [
      "ӘРИНЕ, КЕЛЕМІН!",
      "ЖҰБАЙЫММЕН КЕЛЕМІН!",
      "ӨКІНІШКЕ ОРАЙ, КЕЛЕ АЛМАЙМЫН",
    ],
    closing: "Қуанышымыздың<br />куәсі болыңыздар!",
    audioPlayLabel: "Әуенді қосу",
    audioPauseLabel: "Әуенді тоқтату",
    formNameRequired: "Аты-жөніңізді жазыңыз.",
    formAttendanceRequired: "Келу жауабыңызды таңдаңыз.",
    formSending: "Жіберіліп жатыр...",
    formSuccess: "Рақмет! Жауабыңыз жіберілді.",
    formError: "Жіберу сәтсіз болды. Қайтадан көріңіз.",
  },
  ru: {
    pageTitle: "Руслан и Акнур",
    pageDescription: "Приглашение на свадьбу Руслана и Акнур.",
    playerTitle: "Чтобы включить музыку,<br />нажмите кнопку",
    inviteTitle: "ПРИГЛАШЕНИЕ НА СВАДЬБУ!",
    guestLead: "Дорогие",
    guestText: "родственники, братья, сваты, дяди и племянники, двоюродные братья и сёстры, друзья, коллеги и соседи!",
    coupleLabel: "ПРИГЛАШАЕМ ВАС<br />НА СВАДЬБУ НАШИХ",
    coupleNames: "Руслан<br />и<br />Акнур",
    inviteCopy: "ПРИГЛАШАЕМ ВАС СТАТЬ ДОРОГИМИ ГОСТЯМИ НАШЕГО СВАДЕБНОГО ТОРЖЕСТВА",
    dateMain: "27 июня 2026 года<br />17:00",
    countdownTitle: "ДО НАЧАЛА СВАДЬБЫ:",
    countdownAria: "Обратный отсчет до начала свадьбы",
    locationTitle: "НАШ АДРЕС:",
    locationText: "ГОРОД СЕМЕЙ<br />РЕСТОРАН<br />“TAMIRLAN HALL”",
    locationAria: "Наш адрес",
    mapLinkAria: "Открыть адрес в 2GIS",
    hostsTitle: "ХОЗЯЕВА ТОЯ:",
    hostsName: "семья",
    hostsFamily: "Кисановых",
    hostsAria: "Организаторы торжества",
    rsvpTitle: "Просим подтвердить<br />ваше присутствие!",
    rsvpHelp: "Напишите ваше ФИО,<br />(если придёте с супругом или супругой, укажите имена вместе)",
    rsvpQuestion: "Вы придёте на свадьбу?",
    submitButton: "Отправить ответ",
    guestNameAria: "ФИО",
    choice1: "Обязательно приду!",
    choice2: "Приду с супругом(ой)!",
    choice3: "К сожалению, не смогу прийти",
    attendanceValues: [
      "ОБЯЗАТЕЛЬНО ПРИДУ!",
      "ПРИДУ С СУПРУГОМ(ОЙ)!",
      "К СОЖАЛЕНИЮ, НЕ СМОГУ ПРИЙТИ",
    ],
    closing: "Разделите с нами<br />радость этого дня!",
    audioPlayLabel: "Включить музыку",
    audioPauseLabel: "Поставить музыку на паузу",
    formNameRequired: "Введите ваше ФИО.",
    formAttendanceRequired: "Выберите ваш ответ.",
    formSending: "Отправка...",
    formSuccess: "Спасибо! Ваш ответ отправлен.",
    formError: "Не удалось отправить. Попробуйте ещё раз.",
  },
};

const textNodes = {
  playerTitle: document.querySelector(".player-title"),
  inviteTitle: document.querySelector(".invite-title"),
  guestLead: document.querySelector(".guest-text p:first-child"),
  guestText: document.querySelector(".guest-text p:last-child"),
  coupleLabel: document.querySelector(".couple-label"),
  coupleNames: document.querySelector(".couple-names"),
  inviteCopy: document.querySelector(".invite-copy"),
  dateMain: document.querySelector(".date-main"),
  countdownTitle: document.querySelector(".countdown-title"),
  locationTitle: document.querySelector(".location-card p:first-of-type"),
  locationText: document.querySelector(".location-card p:last-of-type"),
  hostsTitle: document.querySelector(".hosts-title"),
  hostsName: document.querySelector(".hosts-name"),
  hostsFamily: document.querySelector(".hosts-family"),
  rsvpTitle: document.querySelector(".rsvp-title"),
  rsvpHelp: document.querySelector(".rsvp-help"),
  rsvpQuestion: document.querySelector(".rsvp-question"),
  submitButton: document.querySelector(".submit-btn"),
  choice1: document.querySelector(".choice-text-1"),
  choice2: document.querySelector(".choice-text-2"),
  choice3: document.querySelector(".choice-text-3"),
  closing: document.querySelector(".closing"),
};

const attendanceInputs = Array.from(document.querySelectorAll('input[name="attendance"]'));

function t(key) {
  return translations[currentLang][key];
}

function applyLanguage(lang) {
  currentLang = translations[lang] ? lang : DEFAULT_LANG;
  const dictionary = translations[currentLang];

  document.documentElement.lang = currentLang;
  document.title = dictionary.pageTitle;

  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", dictionary.pageDescription);
  }

  textNodes.playerTitle.innerHTML = dictionary.playerTitle;
  textNodes.inviteTitle.textContent = dictionary.inviteTitle;
  textNodes.guestLead.textContent = dictionary.guestLead;
  textNodes.guestText.textContent = dictionary.guestText;
  textNodes.coupleLabel.innerHTML = dictionary.coupleLabel;
  textNodes.coupleNames.innerHTML = dictionary.coupleNames;
  textNodes.inviteCopy.textContent = dictionary.inviteCopy;
  textNodes.dateMain.innerHTML = dictionary.dateMain;
  textNodes.countdownTitle.textContent = dictionary.countdownTitle;
  textNodes.locationTitle.textContent = dictionary.locationTitle;
  textNodes.locationText.innerHTML = dictionary.locationText;
  textNodes.hostsTitle.textContent = dictionary.hostsTitle;
  textNodes.hostsName.textContent = dictionary.hostsName;
  textNodes.hostsFamily.textContent = dictionary.hostsFamily;
  textNodes.rsvpTitle.innerHTML = dictionary.rsvpTitle;
  textNodes.rsvpHelp.innerHTML = dictionary.rsvpHelp;
  textNodes.rsvpQuestion.textContent = dictionary.rsvpQuestion;
  textNodes.submitButton.textContent = dictionary.submitButton;
  textNodes.choice1.textContent = dictionary.choice1;
  textNodes.choice2.textContent = dictionary.choice2;
  textNodes.choice3.textContent = dictionary.choice3;
  textNodes.closing.innerHTML = dictionary.closing;

  if (countdown) {
    countdown.setAttribute("aria-label", dictionary.countdownAria);
  }

  document.querySelector(".location-card")?.setAttribute("aria-label", dictionary.locationAria);
  document.querySelector(".hosts-block")?.setAttribute("aria-label", dictionary.hostsAria);
  document.querySelector(".map-hotspot")?.setAttribute("aria-label", dictionary.mapLinkAria);
  document.querySelector("#guest-name")?.setAttribute("aria-label", dictionary.guestNameAria);

  attendanceInputs.forEach((input, index) => {
    input.value = dictionary.attendanceValues[index];
  });

  langButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLang);
  });

  localStorage.setItem("site-lang", currentLang);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

applyLanguage(currentLang);

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
  let playPromise = null;
  let autoplayArmed = false;

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
      isPlaying ? t("audioPauseLabel") : t("audioPlayLabel")
    );
    poster.classList.toggle("is-playing", isPlaying);
  };

  syncPlayerState();
  syncProgress();
  audio.preload = "auto";
  audio.load();

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
    if (autoplayArmed && !userPausedAudio && !document.hidden) {
      void playAudio();
    }
  };

  const removeAutoplayUnlock = () => {
    document.removeEventListener("pointerdown", unlockAutoplay);
    document.removeEventListener("touchstart", unlockAutoplay);
  };

  const unlockAutoplay = async (event) => {
    if (playerButton.contains(event.target)) return;

    autoplayArmed = true;
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
  audio.addEventListener("canplaythrough", () => {
    autoplayArmed = true;
    tryAutoplay();
  }, { once: true });
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    syncProgress();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (!audio.paused) {
        pauseAudio();
      }
    }
  });

  if (document.readyState === "complete") {
    autoplayArmed = true;
    tryAutoplay();
  } else {
    window.addEventListener("load", () => {
      autoplayArmed = true;
      tryAutoplay();
    }, { once: true });
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
      formNote.textContent = t("formNameRequired");
      return;
    }

    if (!attendance) {
      formNote.textContent = t("formAttendanceRequired");
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

    formNote.textContent = t("formSending");

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
      formNote.textContent = t("formSuccess");
      rsvpForm.reset();
      poster.classList.remove("is-sent");
      void poster.offsetWidth;
      poster.classList.add("is-sent");
    } catch (error) {
      console.error(error);
      formNote.textContent = t("formError");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
