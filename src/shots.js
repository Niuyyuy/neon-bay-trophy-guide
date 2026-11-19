// Deterministic screenshot scenes for the Neon Bay Trophy Guide.
// The browser opens index.html with ?shot=<name>&seed=1; this module stages
// that scene on the real app state and sets window.__shotReady when the page
// is ready to capture. No network, no randomness: the same URL always stages
// the same screen.
import { setEarned, setKind, setSpoiler, scrollToSection, scrollToTrophy } from '../app.js';

const scenes = {
  // Cover: the checklist with a dozen earned and the Sneakthief guide open,
  // its sources visible beside it.
  guide() {
    setKind('all');
    setSpoiler(false);
    setEarned([2, 3, 4, 5, 8, 15, 17, 20, 21, 28, 30, 35, 39]);
    scrollToTrophy(39);
  },
  // Tracker: twenty earned, the progress bar and the filters at the top.
  tracker() {
    setKind('all');
    setSpoiler(false);
    setEarned([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 30]);
    scrollToSection('controls');
  },
  // Roadmap: the three stages and the 100% checklist at a glance.
  roadmap() {
    setKind('all');
    setSpoiler(false);
    setEarned([2, 3, 4, 5, 6, 7]);
    scrollToSection('roadmapSection');
  },
  // Spoiler-free mode: story trophies hidden until earned, earned ones shown.
  spoiler() {
    setKind('all');
    setSpoiler(true);
    setEarned([2, 3, 15, 17]);
    scrollToSection('controls');
  },
};

function stageWhenReady() {
  const shot = new URLSearchParams(location.search).get('shot') ?? 'guide';
  const stage = scenes[shot] ?? scenes.guide;
  stage();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  });
}

if (window.__appReady) {
  stageWhenReady();
} else {
  window.addEventListener('neonbay:ready', stageWhenReady, { once: true });
}
