const Sound = new Howl({
  src: ['res/meditate3.mp3'],
  autoplay: false,
  loop: true,
  volume: 1,
  onend: function() {
    console.log('Finished!');
  }
});

const playBackgroundMusic = () => {
  Sound.play();
}

const panelToActionMap = {
  1: () => {},
}

const getPanelAt = position => document.querySelector(`.panel:nth-child(${position})`);

const getNextPanel = (currPanel, maxPanels) => {
  if (currPanel === maxPanels) {
    return null;
  }
  return getPanelAt(currPanel + 1);
}

const getPrevPanel = currentPanel => {
  if (currentPanel === 1) {
    return null;
  }
  return getPanelAt(currentPanel - 1);
}


const activatePanel = panelIndex => {
  const prevPanel = getPrevPanel(panelIndex);
  const activePanel = getPanelAt(panelIndex);

  // Remove the previous panel
  if (prevPanel !== null) {
    prevPanel.removeEventListener('animationend', onAnimationEnd);
    prevPanel.addEventListener('animationend', e => e.target.style.display = 'none');
    prevPanel.classList.remove('delayed-fade-in');
    prevPanel.classList.add(...['animated', 'fadeOutLeft']);
    // prevPanel.style.display = 'none';
  }
  activePanel.addEventListener('animationend', onAnimationEnd);
  activePanel.classList.add(...['delayed-fade-in']);
  // Attach event.
  activePanel.querySelector('.panel-action-button').addEventListener('click', e => {
    activatePanel(panelIndex + 1);
  });
}

const onAnimationEnd = e => {
  console.log('Aniamation end invoked.')
  e.target.style.opacity = 1;
}

const initCarousel = () => {
  const carouselRef = document.querySelector('.carousel');
  const panels = carouselRef.querySelectorAll('.panel');
  // panels.forEach(panel => {
  //   panel.addEventListener('animationend', onAnimationEnd);
  // });
  activatePanel(1);
}

const init = () => {
  initCarousel();
}

window.addEventListener('DOMContentLoaded', init);