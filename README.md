# Seesaw Logic - Balance & Torque Simulation

Bu proje, tork ve denge prensiplerini görselleştiren, interaktif ve mobil uyumlu (responsive) bir web tabanlı fizik simülasyonudur. Saf JavaScript (Vanilla JS) kullanılarak geliştirilmiştir ve harici bir kütüphane gerektirmez.

## 🎯 Proje Hakkında

Kullanıcılar, bir kaldıraç (tahterevalli) mekanizması üzerine tıklayerek rastgele ağırlıklara sahip bloklar ekler. Sistem, her bloğun ağırlığını ve destek noktasına (pivot) olan uzaklığını hesaplayarak tork (dönme momenti) değerini bulur ve çubuğun açısını gerçek zamanlı olarak günceller.

## ✨ Özellikler

* **Dinamik Fizik Motoru:** Sol ve sağ taraftaki toplam tork farkına göre açısal sapma hesaplanır.
* **Responsive Tasarım:** CSS ve JS tarafında yapılan oransal hesaplamalar sayesinde simülasyon, masaüstü, tablet ve mobil cihazlarda sorunsuz çalışır. Çubuk boyutu değişse bile blokların göreceli konumları korunur.
* **Veri Kalıcılığı (Persistence):** `localStorage` kullanılarak sahne durumu kaydedilir. Sayfa yenilense bile bloklar ve denge durumu kaybolmaz.
* **Rastgele Ağırlık Üretimi:** Her tıklamada 1kg ile 10kg arasında rastgele bir ağırlık atanır.
* **Görsel Geri Bildirim:** Sol ve sağ taraftaki toplam ağırlıklar anlık olarak panelde gösterilir.

## 🛠 Kullanılan Teknolojiler

* **HTML5:** Semantik yapı.
* **CSS3:** Flexbox düzeni, CSS transform animasyonları ve responsive tasarım (`@media` sorguları).
* **JavaScript (ES6+):** DOM manipülasyonu, olay dinleyicileri (event listeners) ve matematiksel fizik algoritmaları.

## 🚀 Kurulum ve Çalıştırma

Bu proje statik bir web uygulamasıdır. Herhangi bir derleyiciye veya sunucu kurulumuna ihtiyaç duymaz.

1.  Projeyi bilgisayarınıza indirin veya klonlayın.
2.  `index.html` dosyasını herhangi bir modern web tarayıcısında (Chrome, Firefox, Safari vb.) açın.

## 🧮 Nasıl Çalışır? (Fizik Mantığı)

Sistem, temel fizik kuralları üzerine kuruludur:

1.  **Tork Hesabı:** Her bir bloğun yarattığı tork şu formülle hesaplanır:
    $$\tau = F \times d$$
    * $\tau$ (Tork)
    * $F$ (Kuvvet / Ağırlık)
    * $d$ (Merkeze olan uzaklık)

2.  **Denge Durumu:**
    * Sol Tork Toplamı ($\Sigma \tau_{sol}$) ve Sağ Tork Toplamı ($\Sigma \tau_{sag}$) karşılaştırılır.
    * Fark, bir sönümleme katsayısına (damping factor) bölünerek çubuğun açısı belirlenir.

3.  **Responsive Konumlandırma:**
    * Ekran boyutu değiştikçe blokların kaymaması için piksel tabanlı değil, **oran (ratio)** tabanlı bir sistem kullanılır. Blokların konumu, çubuğun merkezine olan yüzdelik uzaklıklarına göre saklanır.

## 🖥️ Uygulama Ekran Görüntüsü
<img width="600" height="400" alt="Proje_Ekran_Goruntusu" src="https://github.com/user-attachments/assets/b9271bae-cf6a-4fcf-ba6b-78ce9619b914" />

