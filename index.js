document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementleri tanılandı.
    const beam = document.getElementById('beam');
    const support = document.querySelector('.support');
    const txtLeft = document.getElementById('l-score');
    const txtRight = document.getElementById('r-score');
    const btnClear = document.getElementById('clear-data');

    const LIMITS = { maxAngle: 30, minW: 1, maxW: 10 };
    let items = [];

    // Başlangıç fonksiyonu tanımlmandı.
    const startApp = () => {
        const savedData = localStorage.getItem('seesaw_data');
        if (savedData) {
            items = JSON.parse(savedData);
        }
        updateSystem();
    };

    // Sistemi güncelle ve çiz
    function updateSystem() {
        // Hesaplamalar
        let torqueL = 0, torqueR = 0;
        let weightL = 0, weightR = 0;

        beam.innerHTML = '';

        items.forEach(item => {
            // HTML oluşturma alanı.
            const el = document.createElement('div');
            el.className = 'item';
            el.innerText = item.val;
            el.style.left = item.pos + 'px';
            el.style.transform = 'translateX(-50%)'; // Ortalamak için
            beam.appendChild(el);

            // Fizik hesapları yapılma alanı.
            const force = item.val * Math.abs(item.dist);
            if (item.dist < 0) {
                torqueL += force;
                weightL += item.val;
            } else {
                torqueR += force;
                weightR += item.val;
            }
        });

        // Açı hesabı
        const diff = torqueR - torqueL;
        let rot = diff / 10;
        
        // Clamp (Sınırlama)
        if (rot > LIMITS.maxAngle) rot = LIMITS.maxAngle;
        if (rot < -LIMITS.maxAngle) rot = -LIMITS.maxAngle;

        // Görsel güncelleme
        beam.style.transform = `rotate(${rot}deg)`;
        txtLeft.innerText = `Sol Ağırlık: ${weightL} kg`;
        txtRight.innerText = `Sağ Ağırlık: ${weightR} kg`;
    }

    // Tıklama Olayı burada yapıldı.
    beam.addEventListener('click', (e) => {
        const rect = support.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        
        const clickPos = e.clientX;
        const dist = clickPos - centerX;

        // Çok merkeze tıklanırsa işlem yapma
        if (Math.abs(dist) < 5) return;

        // Rastgele ağırlık
        const w = Math.floor(Math.random() * LIMITS.maxW) + LIMITS.minW;

        // 500px genişlikteki çubukta pozisyon (merkez 250)
        const cssPos = 250 + dist;

        items.push({
            id: Date.now(),
            val: w,
            dist: dist,
            pos: cssPos
        });

        saveAndRender();
    });

    // Reset Olayı burada tanımlandı.
    btnClear.addEventListener('click', () => {
        items = [];
        localStorage.removeItem('seesaw_data');
        updateSystem();
    });

    // Helper fonksiyonu burada yazıldı. 
    function saveAndRender() {
        localStorage.setItem('seesaw_data', JSON.stringify(items));
        updateSystem();
    }

    // Başlatma.
    startApp();
});