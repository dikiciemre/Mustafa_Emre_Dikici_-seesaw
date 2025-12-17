document.addEventListener('DOMContentLoaded', () => {
    // DOM Referansları
    const beam = document.getElementById('beam');
    // Pivot noktası (destek) koordinatları için gerekli
    const support = document.querySelector('.support'); 
    
    // UI Elementleri
    const txtLeft = document.getElementById('l-score');
    const txtRight = document.getElementById('r-score');
    const btnClear = document.getElementById('clear-data');

    // Simülasyon Sabitleri
    const LIMITS = { 
        maxAngle: 30, // Maksimum dönme açısı
        minW: 1,      // Min ağırlık (kg)
        maxW: 10      // Max ağırlık (kg)
    };
    
    // State: Tüm ağırlıkları burada tutuyoruz
    let items = [];

    // Uygulama başlangıcı
    const startApp = () => {
        // Varsa eski veriyi getir
        const savedData = localStorage.getItem('seesaw_data');
        if (savedData) {
            try {
                items = JSON.parse(savedData);
            } catch (error) {
                console.error("Veri okuma hatası, sıfırlanıyor...", error);
                items = [];
            }
        }
        updateSystem();
    };

    /**
     * Ana döngü: Fizik hesaplarını yapar ve ekranı günceller.
     * Hem veri değiştiğinde hem de ekran boyutu değiştiğinde çalışır.
     */
    function updateSystem() {
        let torqueL = 0, torqueR = 0;
        let weightL = 0, weightR = 0;

        // Responsive Hesaplama:
        // Çubuğun genişliği ekrana göre değiştiği için her render'da güncel genişliği alıyoruz.
        const currentWidth = beam.offsetWidth;
        const halfWidth = currentWidth / 2;

        // Önce temizle, sonra tekrar çiz
        beam.innerHTML = '';

        items.forEach(item => {
            // Uyumluluk modu: Eğer eski veri varsa (piksel bazlı), onu orana (factor) çevir.
            if (typeof item.factor === 'undefined') {
                item.factor = item.dist / 250; 
            }

            // --- 1. DOM Elemanını Oluştur ---
            const el = document.createElement('div');
            el.className = 'item';
            el.innerText = item.val;
            
            // Konumlandırma (CSS):
            // 'Factor' -1 (sol uç) ile +1 (sağ uç) arasındadır.
            // Bunu CSS % değerine çeviriyoruz (50% merkez).
            const cssPercent = 50 + (item.factor * 50);
            el.style.left = cssPercent + '%';
            
            // Elemanın kendi genişliğinin yarısı kadar sola kaydır (tam ortalamak için)
            el.style.transform = 'translateX(-50%)';
            
            beam.appendChild(el);

            // ---  Fizik Hesapları ---
            // Tork = Kuvvet x kuvvet kolu
            // Uzaklığı güncel ekran genişliğine göre yeniden hesaplıyoruz.
            const currentDist = item.factor * halfWidth; 
            const force = item.val * Math.abs(currentDist);

            if (item.factor < 0) {
                // Sol taraf (Negatif mesafe)
                torqueL += force;
                weightL += item.val;
            } else {
                // Sağ taraf
                torqueR += force;
                weightR += item.val;
            }
        });

        // --- 3. Açı ve Dönme Hesabı ---
        const diff = torqueR - torqueL; // toplam tork farkını hesapladım ve tahterevalli ne kadar döner hesabı yaptım.
        
        // Sönümleme (Damping): Tork farkını doğrudan açıya verirsek çok hızlı döner.
        // Genişliğe bağlı bir katsayıya bölerek hareketi yumuşatıyoruz.
        let rot = diff / (halfWidth / 25); 
        
        // Açıyı sınırla (Clamp)
        if (rot > LIMITS.maxAngle) rot = LIMITS.maxAngle;
        if (rot < -LIMITS.maxAngle) rot = -LIMITS.maxAngle;

        // UI Güncelleme
        beam.style.transform = `rotate(${rot}deg)`;
        txtLeft.innerText = `Sol Ağırlık: ${weightL} kg`;
        txtRight.innerText = `Sağ Ağırlık: ${weightR} kg`;
    }

    // --- Event Listeners ---

    // Çubuğa tıklama ve ağırlık ekleme
    beam.addEventListener('click', (e) => {
        const rect = beam.getBoundingClientRect();
        const width = rect.width;
        const center = rect.left + (width / 2);
        
        // Tıklanan noktanın merkeze olan uzaklığı (px)
        const rawDist = e.clientX - center;
        
        // ORAN HESABI (Critical):
        // Px değerini saklamak yerine, merkeze olan "oranı" saklıyoruz.
        // Böylece ekran büyüyüp küçülse de top aynı oransal noktada kalıyor.
        const half = width / 2;
        const factor = rawDist / half;

        // Tam merkeze (pivot üstüne) tıklanırsa işlem yapma (Tork etkisi 0'dır)
        if (Math.abs(factor) < 0.02) return;

        // Rastgele ağırlık üret
        const w = Math.floor(Math.random() * LIMITS.maxW) + LIMITS.minW;

        items.push({
            id: Date.now(),
            val: w,
            factor: factor // Px yerine factor saklıyoruz
        });

        saveAndRender();
    });

    // Sıfırlama butonu
    btnClear.addEventListener('click', () => {
        items = [];
        localStorage.removeItem('seesaw_data');
        updateSystem();
    });

    // Pencere boyutu değişirse (responsive) sistemi yeniden çizdirir.
    window.addEventListener('resize', updateSystem);

    // Kullanıcı sayfayı yenilediğinde veriler kaybolmasın diye tarayıcının localStorage özelliğini kullandım.
    // Yardımcı: Kaydet ve Çiz 
    function saveAndRender() {
        localStorage.setItem('seesaw_data', JSON.stringify(items));
        updateSystem();
    }

    // Başlat
    startApp();
});