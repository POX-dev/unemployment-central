const messages = [
    "go get a life",
    "you failed your job application, is that why you're here?",
    "go earn money",
    "Monero de monero",
    "frogiesarcade is ahh",
    "luminal vibecoded",
    "zxs why the iframe :sob:",
    "touch grass challenge (impossible)",
    "your resume called, it's disappointed",
    "productivity? never heard of her",
    "the unemployment rate thanks you for your service"
];

const msgEl = document.getElementById('randomMessage');
msgEl.textContent = messages[Math.floor(Math.random() * messages.length)];

function createConstellation() {
    const container = document.getElementById('constellation');
    const stars = 80;
    const starPositions = [];

    for (let i = 0; i < stars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    container.appendChild(star);
    starPositions.push({ x, y, element: star });
    }

    for (let i = 0; i < stars; i++) {
    const star1 = starPositions[i];
    const connections = Math.floor(Math.random() * 2) + 1;
    
    for (let j = 0; j < connections; j++) {
        const nearbyStars = starPositions
        .map((star2, idx) => ({
            star: star2,
            idx: idx,
            distance: Math.sqrt(Math.pow(star1.x - star2.x, 2) + Math.pow(star1.y - star2.y, 2))
        }))
        .filter(s => s.idx !== i && s.distance < 20)
        .sort((a, b) => a.distance - b.distance);

        if (nearbyStars.length > 0) {
        const star2 = nearbyStars[Math.floor(Math.random() * Math.min(3, nearbyStars.length))].star;
        const line = document.createElement('div');
        line.className = 'constellation-line';
        
        const length = Math.sqrt(
            Math.pow((star2.x - star1.x) * window.innerWidth / 100, 2) +
            Math.pow((star2.y - star1.y) * window.innerHeight / 100, 2)
        );
        const angle = Math.atan2(
            (star2.y - star1.y) * window.innerHeight / 100,
            (star2.x - star1.x) * window.innerWidth / 100
        ) * 180 / Math.PI;
        
        line.style.width = length + 'px';
        line.style.left = star1.x + '%';
        line.style.top = star1.y + '%';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.animationDelay = Math.random() * 4 + 's';
        
        container.appendChild(line);
        }
    }
    }
}

createConstellation();

function openInAboutBlank() {
    const url = window.location.href;
    const win = window.open('about:blank', '_blank');
    if (win) {
    win.document.write('<iframe src="' + url + '" style="position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;z-index:999999;"></iframe>');
    win.document.close();
    window.location.replace('https://google.com');
    }
}

function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

document.getElementById('settingsModal').addEventListener('click', function(e) {
    if (e.target === this) {
    closeSettings();
    }
});

let panicKey = localStorage.getItem('panicKey') || '';
let panicUrl = localStorage.getItem('panicUrl') || 'https://google.com';

if (panicKey) {
    document.getElementById('panicKey').value = panicKey;
}

document.getElementById('panicKey').addEventListener('click', function() {
    this.value = 'Press any key...';
    const keyListener = function(e) {
    e.preventDefault();
    document.getElementById('panicKey').value = e.key.toUpperCase();
    document.removeEventListener('keydown', keyListener);
    };
    document.addEventListener('keydown', keyListener);
});

document.addEventListener('keydown', function(e) {
    const savedPanicKey = localStorage.getItem('panicKey');
    if (savedPanicKey && e.key.toLowerCase() === savedPanicKey.toLowerCase()) {
    window.location.href = localStorage.getItem('panicUrl') || 'https://google.com';
    }
});

function saveSettings() {
    const wispUrl = document.getElementById('websocket').value;
    const tabTitle = document.getElementById('tabTitle').value;
    const panicKey = document.getElementById('panicKey').value;

    if (wispUrl) {
    localStorage.setItem('wispUrl', wispUrl);
    if (window.setTransport) {
        window.setTransport('epoxy');
    }
    }

    if (tabTitle) {
    document.title = tabTitle;
    localStorage.setItem('tabTitle', tabTitle);
    }

    if (panicKey && panicKey !== 'Press any key...') {
    localStorage.setItem('panicKey', panicKey);
    }

    closeSettings();
    
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✓ Saved!';
    setTimeout(() => {
    saveBtn.textContent = originalText;
    }, 2000);
}

window.addEventListener('load', function() {
    const savedTabTitle = localStorage.getItem('tabTitle');
    const savedWispUrl = localStorage.getItem('wispUrl');
    const savedPanicKey = localStorage.getItem('panicKey');

    if (savedTabTitle) {
    document.title = savedTabTitle;
    document.getElementById('tabTitle').value = savedTabTitle;
    }

    if (savedWispUrl) {
    document.getElementById('websocket').value = savedWispUrl;
    }

    if (savedPanicKey) {
    document.getElementById('panicKey').value = savedPanicKey;
    }
});

window.loadUrl = function(url) {
    if (typeof scramjet === 'undefined' || typeof window.search === 'undefined') {
    setTimeout(() => loadUrl(url), 100);
    return;
    }
    const fixedurl = window.search(url);
    const src = scramjet.encodeUrl(fixedurl);
    document.getElementById('iframe').src = src;
    document.getElementById('iframeWrapper').classList.add('active');
    document.getElementById('homepage').style.display = 'none';
}