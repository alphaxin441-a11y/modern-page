function initPlayer() {
    const audio = document.getElementById('mobileAudio');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const seekBar = document.getElementById('seekBar');
    const volumeBar = document.getElementById('volumeBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const vinylDisc = document.getElementById('vinylDisc');
    const lyricsContainer = document.getElementById('lyricsContainer');
    const lyricsTrack = document.getElementById('lyricsTrack');

    if (!audio || !playBtn || !seekBar || !lyricsTrack) {
        console.log("Waiting for SoloLearn DOM layout to completely settle...");
        setTimeout(initPlayer, 100);
        return;
    }

    let isPlaying = false;

const lyricsData = [
        { time: 0, text: "🎵 (Intro - Piano & Violin) 🎵" },          // 00:00
        { time: 20, text: "Thought I found a way" },                  // 00:20
        { time: 24, text: "Thought I found a way out (found)" },      // 00:24
        { time: 28, text: "But you never go away (never go away)" },  // 00:28
        { time: 32, text: "So I guess I gotta stay now" },            // 00:32
        { time: 35, text: "Oh, I hope some day I'll make it out of here" }, // 00:35
        { time: 44, text: "Even if it takes all night or a hundred years" }, // 00:44
        { time: 52, text: "Need a place to hide, but I can't find one near" }, // 00:52
        { time: 60, text: "Wanna feel alive, outside I can't fight my fear" }, // 01:00 (60 detik)
        { time: 70, text: "Isn't it lovely, all alone?" },            // 01:10 (70 detik)
        { time: 74, text: "Heart made of glass, my mind of stone" },  // 01:14 (74 detik)
        { time: 79, text: "Tear me to pieces, skin to bone" },        // 01:19 (79 detik)
        { time: 83, text: "Hello, welcome home" },                   // 01:23 (83 detik)
        { time: 87, text: "🎵 (Instrumental Interlude) 🎵" },          // 01:27 (87 detik)
        { time: 91, text: "Walking out of town" },                    // 01:31 (91 detik)
        { time: 95, text: "Looking for a better place" },             // 01:35 (95 detik)
        { time: 99, text: "Something's on my mind" },                 // 01:39 (99 detik)
        { time: 104, text: "Always space to head space" },            // 01:44 (104 detik)
        { time: 106, text: "Oh, I hope some day I'll make it out of here" }, // 01:46 (106 detik)
        { time: 115, text: "Even if it takes all night or a hundred years" }, // 01:55 (115 detik)
        { time: 123, text: "Need a place to hide, but I can't find one near" }, // 02:03 (123 detik)
        { time: 131, text: "Wanna feel alive, outside I can't fight my fear" }, // 02:11 (131 detik)
        { time: 141, text: "Isn't it lovely, all alone?" },            // 02:21 (141 detik)
        { time: 145, text: "Heart made of glass, my mind of stone" },  // 02:25 (145 detik)
        { time: 149, text: "Tear me to pieces, skin to bone" },        // 02:29 (149 detik)
        { time: 154, text: "Hello, welcome home" },                   // 02:34 (154 detik)
        { time: 160, text: "Woah, yeah" },                             // 02:40 (160 detik)
        { time: 166, text: "Yeah, ah" },                               // 02:46 (166 detik)
        { time: 173, text: "Woah, woah" },                             // 02:53 (173 detik)
        { time: 175, text: "🎵🎵" },                                   // 02:55 (175 detik)
        { time: 187, text: "Hello, welcome home" }                      // 03:07 (187 detik)
    ];

    const parsedLyrics = lyricsData.map(line => {
        return {
            time: line.time,
            text: line.text,
            element: null
        }
    });

    function renderLyrics() {
        lyricsTrack.innerHTML = '';
        parsedLyrics.forEach((line, index) => {
            if (line.text.trim() !== "") {
                const div = document.createElement('div');
                div.classList.add('lyric-line');
                div.innerText = line.text;
                div.dataset.index = index;
                
                div.addEventListener('click', () => {
                    audio.currentTime = line.time;
                    updateUI(line.time);
                });
                line.element = div;
                lyricsTrack.appendChild(div);
            }
        });
    }

    audio.addEventListener('loadedmetadata', () => {
        seekBar.max = Math.floor(audio.duration);
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (!audio.paused) {
            updateUI(audio.currentTime);
        }
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        vinylDisc.classList.remove("playing");
    });

    playBtn.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            vinylDisc.classList.remove("playing");
        } else {
            audio.play().catch(err => console.log("Audio setup initialization blocked:", err));
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            vinylDisc.classList.add("playing");
        }
    });

    seekBar.addEventListener("input", () => {
        currentTimeEl.textContent = formatTime(seekBar.value);
        updateLyrics(seekBar.value);
    });

    seekBar.addEventListener("change", () => {
        audio.currentTime = seekBar.value;
    });

    volumeBar.addEventListener("input", () => {
        audio.volume = volumeBar.value / 100;
    });

    function updateUI(currentTime) {
        seekBar.value = Math.floor(currentTime);
        currentTimeEl.textContent = formatTime(currentTime);
        updateLyrics(currentTime);
    }

    function updateLyrics(currentTime) {
        let activeIndex = -1;

        for (let i = 0; i < parsedLyrics.length; i++) {
            if (currentTime >= parsedLyrics[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }

        parsedLyrics.forEach((line, i) => {
            if (!line.element) return;
            
            if (i === activeIndex) {
                if (!line.element.classList.contains('active')) {
                    line.element.classList.add('active');
                    line.element.classList.remove('past');
                    line.element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else if (i < activeIndex) {
                line.element.classList.add('past');
                line.element.classList.remove('active');
            } else {
                line.element.classList.remove('active', 'past');
            }
        });
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    renderLyrics();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
} else {
    initPlayer();
}