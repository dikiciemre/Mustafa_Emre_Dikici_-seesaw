class SeesawSimulation {
    constructor() {
        // Sabitler
        this.MAX_ANGLE = 30;
        this.MIN_WEIGHT = 1;
        this.MAX_WEIGHT = 10;
        
        // State (Durum)
        this.blocks = []; 
        
        // DOM Element Seçimleri
        this.plankElement = document.getElementById('plank');
        // Pivot elementini referans noktası olarak alıyoruz
        this.pivotElement = document.querySelector('.pivot'); 
        this.leftWeightDisplay = document.getElementById('left-total');
        this.rightWeightDisplay = document.getElementById('right-total');
        this.resetBtn = document.getElementById('reset-btn');

        // Uygulamayı Başlat
        this.init();
    }

    init() {
        // 1. Kayıtlı veriyi yükle
        this.loadState();

        // 2. Event Listener'ları bağla
        if (this.plankElement) {
            this.plankElement.addEventListener('click', this.handlePlankClick.bind(this));
        }

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', this.handleReset.bind(this));
        }

        // 3. İlk render
        this.render();
    }

    handlePlankClick(event) {
        // HATA DÜZELTMESİ:
        // Tahta döndüğünde koordinatları bozulur. Sabit pivotu referans alıyoruz.
        const pivotRect = this.pivotElement.getBoundingClientRect();
        const pivotCenter = pivotRect.left + (pivotRect.width / 2);
        
        // Tıklanan yerin X koordinatı
        const clickX = event.clientX;
        
        // Merkezden uzaklık (Negatif: Sol, Pozitif: Sağ)
        const distanceFromPivot = clickX - pivotCenter;

        // Çok küçük tıklamalarda (tam merkez) işlem yapma
        if (Math.abs(distanceFromPivot) < 5) return;

        // Rastgele ağırlık oluştur
        const randomWeight = Math.floor(Math.random() * (this.MAX_WEIGHT - this.MIN_WEIGHT + 1)) + this.MIN_WEIGHT;

        // Görsel pozisyon hesabı (CSS left için):
        // Tahta genişliği 500px, merkezi 250px.
        const positionOnPlank = 250 + distanceFromPivot;

        const newBlock = {
            id: Date.now(),
            weight: randomWeight,
            distance: distanceFromPivot,
            position: positionOnPlank
        };

        this.blocks.push(newBlock);
        this.saveState();
        this.render();
    }

    handleReset() {
        // State'i sıfırla
        this.blocks = [];
        // LocalStorage'ı temizle
        localStorage.removeItem('insider_seesaw_state');
        // Sahneyi güncelle
        this.render();
    }

    calculatePhysics() {
        let leftTorque = 0;
        let rightTorque = 0;
        let leftTotalWeight = 0;
        let rightTotalWeight = 0;

        this.blocks.forEach(block => {
            // Tork = Ağırlık x Mesafe (Mutlak değer)
            const torque = block.weight * Math.abs(block.distance);

            if (block.distance < 0) {
                leftTorque += torque;
                leftTotalWeight += block.weight;
            } else {
                rightTorque += torque;
                rightTotalWeight += block.weight;
            }
        });

        // Açı hesaplama: Fark / 10
        let angle = (rightTorque - leftTorque) / 10;
        
        // Açıyı sınırla (+- 30 derece)
        angle = Math.max(-this.MAX_ANGLE, Math.min(this.MAX_ANGLE, angle));

        return { angle, leftTotalWeight, rightTotalWeight };
    }

    render() {
        const physics = this.calculatePhysics();

        // 1. Tahtayı döndür
        this.plankElement.style.transform = `rotate(${physics.angle}deg)`;

        // 2. Yazıları güncelle
        this.leftWeightDisplay.innerText = `Sol Ağırlık: ${physics.leftTotalWeight} kg`;
        this.rightWeightDisplay.innerText = `Sağ Ağırlık: ${physics.rightTotalWeight} kg`;

        // 3. Blokları çiz
        this.plankElement.innerHTML = ''; 
        
        this.blocks.forEach(block => {
            const blockEl = document.createElement('div');
            blockEl.classList.add('block'); 
            
            // Pozisyonlandırma
            blockEl.style.left = `${block.position}px`;
            
            // Sadece yatayda ortala (Dikey hizalama CSS bottom ile yapılıyor)
            blockEl.style.transform = 'translateX(-50%)'; 
            
            blockEl.innerText = block.weight;
            this.plankElement.appendChild(blockEl);
        });
    }

    saveState() {
        localStorage.setItem('insider_seesaw_state', JSON.stringify(this.blocks));
    }

    loadState() {
        const saved = localStorage.getItem('insider_seesaw_state');
        if (saved) {
            try {
                this.blocks = JSON.parse(saved);
            } catch (e) {
                this.blocks = [];
            }
        }
    }
}

// Uygulama Başlatıcı
document.addEventListener('DOMContentLoaded', () => {
    new SeesawSimulation();
});