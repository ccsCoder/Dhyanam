// Preload the sounds when app starts.
const initSoundLib = () => {
    const HowlerOptions = {
        autoplay: false,
        loop: true,
        volume: 0.4,
    };

    return {
        om: new Howl({
            src: ['res/sounds/om.mp3'],
            ...HowlerOptions,
        }),
        fire: new Howl({
            src: ['res/sounds/fire.mp3'],
            ...HowlerOptions,
        }),
        forest: new Howl({
            src: ['res/sounds/forest.mp3'],
            ...HowlerOptions,
        }),
        sea: new Howl({
            src: ['res/sounds/sea.mp3'],
            ...HowlerOptions,
        }),
        wind: new Howl({
            src: ['res/sounds/wind.mp3'],
            ...HowlerOptions,
        }),
        rain: new Howl({
            src: ['res/sounds/rain.mp3'],
            ...HowlerOptions,
        }),
    }
};

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

const handleControls = iconRef => {
    let iconElement = iconRef.closest('.ambient-sound-icon').querySelector('.pause-play');
    iconElement.classList.toggle('icon-pause');
    iconElement.classList.toggle('icon-play');
}

const activatePanel = panelIndex => {
    const prevPanel = getPrevPanel(panelIndex);
    const activePanel = getPanelAt(panelIndex);
    activePanel.addEventListener('animationend', onAnimationEnd);

    if (prevPanel !== null) {
        prevPanel.removeEventListener('animationend', onAnimationEnd);
        prevPanel.addEventListener('animationend', e => e.target.style.display = 'none');
        prevPanel.classList.remove('delayed-fade-in');
        prevPanel.classList.add(...['animated', 'fadeOut']);
        activePanel.classList.add('delayed-fade-in');
    } else {
        activePanel.classList.add('delayed-fade-in');
    }

    // Attach event.
    activePanel.querySelector('.panel-action-button').addEventListener('click', e => {
        activatePanel(panelIndex + 1);
    });
    // Event listeners for clicks
    const iconContainer = activePanel.querySelector('.panel-icon-list');
    iconContainer && iconContainer.addEventListener('click', e => {
        if (
            e.target.classList.contains('ambient-sound-icon') ||
            e.target.classList.contains('controls') ||
            e.target.classList.contains('pause-play') ||
            e.target.classList.contains('play-indicator')
        ) {
            const icon = e.target.closest('.ambient-sound-icon');
            const soundName = icon.getAttribute('data-sound');
            const operation = icon.getAttribute('data-playing');
            if (operation == '0') {
                SoundLibrary[soundName].play();
                icon.setAttribute('data-playing', '1');
                // Set the animation.
                icon.querySelectorAll('.play-indicator').forEach(pi => {
                    pi.style.visibility = 'visible';
                });
            } else {
                SoundLibrary[soundName].pause();
                icon.setAttribute('data-playing', '0');
                // Set the animation.
                icon.querySelectorAll('.play-indicator').forEach(pi => {
                    pi.style.visibility = 'hidden';
                });
            }
            // Also show the Controls
            handleControls(e.target, soundName);
        }
    });

    //Event listener for volume rocker
    const volumeRockers = activePanel.querySelectorAll('.volume-range');
    volumeRockers.length > 0 && volumeRockers.forEach(volumeRocker => {
            volumeRocker.addEventListener('input', e => {
                const newValue = e.target.value;
                console.log(`New Volume = ${newValue}`)
                const sound = e.target.parentNode.getAttribute('data-sound');
                console.log(sound);
                SoundLibrary[sound].volume(newValue);
            });
        })
        // volumeRocker &&
}

const onAnimationEnd = e => {
    e.target.style.opacity = 1;
}

const initCarousel = () => {
    const carouselRef = document.querySelector('.carousel');
    const panels = carouselRef.querySelectorAll('.panel');
    activatePanel(1);
}

let SoundLibrary = null;

const init = () => {
    SoundLibrary = initSoundLib();
    console.log(SoundLibrary);
    initCarousel();
};

window.addEventListener('DOMContentLoaded', init);