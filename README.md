# Kartaltepe Makina

DAB Labs'ın hazırladığı tasarım örneği: kurgusal bir makine üreticisi (CNC işleme merkezi, torna, hidrolik pres) için tek sayfalık tanıtım sitesi. Teknik değerler, iletişim bilgileri ve firma örnektir.

## Yapı
- `index.html`, `style.css`, `main.js`: build adımı olmayan statik site.
- `vendor/`: GSAP 3.13 (ScrollTrigger, SplitText) ve Lenis, yerelde.
- `fonts/`: Archivo (değişken), kendi sunucusunda.
- `img/`, `video/`: açık lisanslı görseller. Kaynakları sayfanın footer'ında.
- `DESIGN.md`: renk, tipografi, bileşen ve hareket kuralları.

## Çalıştırma
Herhangi bir statik sunucu yeterli, örneğin `npx serve .`. Fontlar `file://` üzerinden yüklenmeyebilir.

Hareketler `prefers-reduced-motion` ayarına uyar. `?reel=1` parametresi yalnızca video kaydı içindir: yumuşak kaydırmayı ve imleç efektini kapatır.
