const s1 = document.getElementById("song1");
const s2 = document.getElementById("song2");
const audioUI = document.getElementById("audio-ui");
let currentSong = s1;

function unlockAudio() {
    const gk = document.getElementById("gatekeeper");
    if (gk) {
        gk.style.opacity = "0";
        setTimeout(() => {
            gk.remove();
            currentSong.play().catch(() => console.log("Audio waiting for interaction"));
            audioUI.classList.add("playing");
        }, 800);
    }
}

function togglePlay(event) {
    if (event) event.stopPropagation();
    if (currentSong.paused) {
        currentSong.play();
        audioUI.classList.add("playing");
        document.getElementById("audio-status").innerText = "Playing";
    } else {
        currentSong.pause();
        audioUI.classList.remove("playing");
        document.getElementById("audio-status").innerText = "Paused";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const wand = document.getElementById("magic-wand");
    const ambient = document.getElementById("ambient-container");
    const noBtn = document.getElementById("btn-no");
    const yesBtn = document.getElementById("btn-yes");
    const volSlider = document.getElementById("reel-volume-slider");
    const videoContainer = document.getElementById("video-container");

    const reelFiles = [
        "reels/reel2.mp4", "./reels/reel3.mp4", "./reels/reel4.mp4", "./reels/reel25.mp4",
        "./reels/reel5.mp4", "./reels/reel6.mp4", "./reels/reel7.mp4", "./reels/reel8.mp4",
        "./reels/reel9.mp4", "./reels/reel10.mp4", "./reels/reel11.mp4", "./reels/reel12.mp4",
        "./reels/reel13.mp4", "./reels/reel14.mp4", "./reels/reel15.mp4", "./reels/reel6.mp4",
        "./reels/reel7.mp4", "./reels/reel8.mp4", "./reels/reel9.mp4", "./reels/reel20.mp4",
        "./reels/reel21.mp4", "./reels/reel22.mp4", "./reels/reel23.mp4", "./reels/reel24.mp4"
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffled = shuffle([...reelFiles]);
    shuffled.forEach(file => {
        const video = document.createElement("video");
        video.className = "gift-reel";
        video.src = `./reels/${file}`;
        video.loop = true;
        video.muted = true;
        video.setAttribute("playsinline", ""); 
        video.setAttribute("preload", "metadata");
        videoContainer.appendChild(video);
    });

    const reels = document.querySelectorAll('.gift-reel');

    const reelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
                video.classList.add("active-reel");
                const val = parseFloat(volSlider.value);
                video.muted = (val === 0);
                video.volume = val;
            } else {
                video.pause();
                video.classList.remove("active-reel");
                video.muted = true;
            }
        });
    }, { threshold: 0.6 });

    reels.forEach(reel => reelObserver.observe(reel));

    if (volSlider) {
        volSlider.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            reels.forEach(video => {
                if (!video.paused) {
                    video.muted = (val === 0);
                    video.volume = val;
                }
            });
            currentSong.volume = val > 0 ? 0.2 : 1.0;
        });
        volSlider.addEventListener("click", (e) => e.stopPropagation());
    }

    // --- WAND EFFECTS (Disabled for small screens) ---
    document.addEventListener("mousemove", (e) => {
        if (window.innerWidth < 768) return; 
        const x = e.clientX, y = e.clientY;
        wand.style.left = x + "px"; 
        wand.style.top = y + "px";
        document.documentElement.style.setProperty('--mx', x + "px");
        document.documentElement.style.setProperty('--my', y + "px");

        const items = document.querySelectorAll('.rising-heart, .falling-word');
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const dist = Math.hypot(x - (rect.left + rect.width/2), y - (rect.top + rect.height/2));
            if (dist < 60) {
                spawnSparks(rect.left, rect.top);
                item.style.opacity = "0";
                setTimeout(() => item.remove(), 400);
            }
        });
        if (Math.random() > 0.85) spawnTrailHeart(x, y);
    });

    function spawnSparks(x, y) {
        for (let i = 0; i < 6; i++) {
            const s = document.createElement("div");
            s.className = "stardust-spark"; 
            s.innerHTML = "✨";
            s.style.left = x + "px"; 
            s.style.top = y + "px";
            s.style.setProperty('--dx', (Math.random() - 0.5) * 150 + "px");
            s.style.setProperty('--dy', (Math.random() - 0.5) * 150 + "px");
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 1000);
        }
    }

    function spawnTrailHeart(x, y) {
        const h = document.createElement("div");
        h.className = "stardust-heart"; 
        h.innerHTML = "💖";
        h.style.left = x + "px"; 
        h.style.top = y + "px";
        h.style.setProperty('--dx', (Math.random() - 0.5) * 80 + "px");
        h.style.setProperty('--dy', (Math.random() - 0.5) * 80 + "px");
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1000);
    }

    noBtn.addEventListener("mouseenter", () => {
        // Only run away on desktop, otherwise mobile users can't click anything!
        if (window.innerWidth < 768) return; 
        const radius = 150 + Math.random() * 50;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        noBtn.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 20 - 10}deg)`;
    });

    yesBtn.addEventListener("click", () => {
        const flash = document.getElementById("transition-overlay");
        flash.style.opacity = "1";
        document.body.classList.add("hot-weather");

        setTimeout(() => {
            currentSong.pause(); 
            currentSong = s2; 
            currentSong.play().catch(() => {});
            document.getElementById("song-name").innerText = "Forever Mine";
            document.getElementById("page-ask").classList.remove("active");
            document.getElementById("page-journal").classList.add("active");
            document.getElementById("petal-canvas").style.opacity = "1";
            startPetals(); 
            typeLetter(); 
            flash.style.opacity = "0";
        }, 900);
    });

    const words = ["CHUP RO", "KOHLI", "AIYOOO", " 🤙 ", "HARI OM", "DOSA", "FOOD", "BHUUKHAD"];
    setInterval(() => {
        if (document.getElementById("page-ask").classList.contains("active")) {
            const h = document.createElement("div");
            h.className = "rising-heart"; h.innerHTML = "💖";
            h.style.left = Math.random() * 95 + "vw";
            ambient.appendChild(h);
            setTimeout(() => h.remove(), 12000);

            const w = document.createElement("div");
            w.className = "falling-word"; 
            w.innerText = words[Math.floor(Math.random() * words.length)];
            w.style.left = Math.random() * 95 + "vw";
            ambient.appendChild(w);
            setTimeout(() => w.remove(), 14000);
        }
    }, 1500);

    function startPetals() {
        const c = document.getElementById("petal-canvas");
        const ctx = c.getContext("2d");
        const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();

        let p = Array.from({length: 50}, () => ({
            x: Math.random() * c.width, 
            y: Math.random() * c.height, 
            v: Math.random() * 1.8 + 1, 
            s: Math.random() * 6 + 4
        }));

        function anim() {
            ctx.clearRect(0, 0, c.width, c.height);
            p.forEach(i => {
                i.y += i.v; i.x += Math.sin(i.y / 70);
                if (i.y > c.height) i.y = -20;
                ctx.fillStyle = "#ff8da1"; 
                ctx.beginPath(); 
                ctx.ellipse(i.x, i.y, i.s, i.s / 1.5, Math.PI / 4, 0, Math.PI * 2); 
                ctx.fill();
            });
            requestAnimationFrame(anim);
        }
        anim();
    }

    function typeLetter() {
        const msg = "My calm in a world full of chaos……… \n " +
                    " I never thought i would fall this hard for anyone or i'll ever feel this deep  "  + "\n   but then………you happened.       " +
                    " Now i know why people go crazy for someone's one glance.\n  I know i'm cooked😄 yet i wanna keep gazing at you forever, your smile brightens my whole world and makes me forget everything around me, the girl who made me fall in love with herself and Dosa.   " +
                    " I know the ending so i'll try not to bother you,  i said try😆 so don't let your hopes get high😂. But some feelings are too beautiful to hide completely.  " +
                    " Please never let your fiery spirit dim because of this world. It needs your light.  " +
                    " I pray that Jatadhari gives you everything you have ever wished for, be happy, be healthy, and spiritually at peace.  " +
                    "  And if you ever feel low, remember this -  somewhere in this world, there is someone who silently prays for your happiness and your well-being every single day. Someone who wants nothing more than to see you win at life.  " +
                    " Keep pushing forward. Keep shining. Achieve everything your heart dares to dream.`";
        
        let i = 0; 
        const target = document.getElementById("typewriter-content");
        target.innerHTML = "";
        function t() {
            if (i < msg.length) { 
                target.innerHTML += msg.charAt(i); 
                i++; 
                target.scrollTo({ top: target.scrollHeight });
                setTimeout(t, 50); 
            } else { 
                document.getElementById("signature-final").style.opacity = "1"; 
            }
        }
        t();
    }

});




