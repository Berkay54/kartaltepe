# Kartaltepe Makina: tasarım sistemi

Sektör standardı (canon) yön, çıta: DMG MORI. Açık tema, büyük ve gerçek makine fotoğrafları, kurumsal netlik. Kaynak: `style.css` `:root`.

## Renk (Restrained: nötr + tek vurgu)
| Token | Değer | Kullanım |
|---|---|---|
| `--paper` | #f3f4f5 | Sayfa zemini (soğuk kırık beyaz, krem değil) |
| `--white` | #ffffff | Header, hizmet bölümü, form kutusu, footer |
| `--ink` | #0d1014 | Başlıklar, ana metin |
| `--ink-2` | #3a4149 | Paragraf metni |
| `--mut` | #5b636c | İkincil metin (paper üzerinde ≥4.5:1) |
| `--line` / `--line-2` | #d8dbdf / #c3c8ce | Ayırıcılar / input ve outline buton çerçevesi |
| `--acc` | #1848d0 | Tek vurgu: birincil buton, linkler, aktif sekme, ikonlar |
| `--ok` / `--err` | #11734b / #b42318 | Form başarı / hata |

## Tipografi
Tek aile: **Archivo** (değişken, wdth 62–125, wght 100–900), `fonts/` içinden self-host.
- Başlık: wght 650, `font-stretch:110%`, tracking −0.028em, line-height 1.02. H1 `clamp(44px,5.7vw,86px)`, H2 `clamp(34px,4.4vw,60px)`.
- Gövde: 17px / 1.6, wght 400, stretch 100%.
- Logo ve footer wordmark: stretch 122–125%, wght 750–800.
- Sayılar: `font-variant-numeric: tabular-nums`.
- Bölüm başlıklarının üstünde etiket (eyebrow) yok.

## Şekil
Fotoğraflar 0 radius, kenardan kenara. Buton, input ve form kutusu 4px (`--r`). Pill yok.

## Bileşenler
- Butonlar: `.btn-acc` (dolu vurgu) / `.btn-line` (outline), yükseklik 52px (header'da 44px), `:active scale(.97)`.
- Tek CTA etiketi: **"Teklif Al"** (header, hero, mobil çubuk, form). Model linkleri: "Bu model için teklif al".
- Sekmeler: ARIA tablist, ok tuşlarıyla gezinme, alt çizgi göstergesi `translateX + scaleX` ile.
- Teknik değerler: tablo değil; büyük sayı + birim + etiket + "neden önemli" satırı.
- Süreç: yatay zaman çizelgesi (mobilde dikey), adım numarası yok, süre rozetleri var.
- Mobil (≤640px): sabit alt çubuk Ara / WhatsApp / Teklif Al.

## Hareket
Araçlar `vendor/` içinde yerel: GSAP 3.13 + ScrollTrigger + SplitText, Lenis 1.1 (yumuşak kaydırma). CSS easing: `--ease-out cubic-bezier(.23,1,.32,1)`, `--ease-io cubic-bezier(.77,0,.175,1)`; GSAP tarafında `expo.out` / `expo.inOut`.
- Hero: H1 harf harf maskeden yükselir (18ms kademe). Fotoğraf `inset(26% 4% 0 4%)` konumundan açılır, kaydırınca kenarlara kadar genişler ve paralaks yapar.
- Kinetik şerit (sayfadaki tek şerit): iki satır kaydırmayla ters yönlere akar, dolu/kontur/vurgu kelimeler sırayla gelir.
- Makineler (≥901px): bölüm sabitlenir, 3 slayt yatay kayar. Model ilerleme çubukları ve görsel içi paralaks vardır, değerler sayarak artar. ≤900px'te dikey dizilir ve görseller perde gibi açılır.
- Süreç: zaman çizelgesi çizgisi kaydırmayla çizilir (mobilde dikey), noktalar sırayla dolar.
- Galeri: 3 sütun farklı hızlarda kayar, kareler clip-path ile açılır.
- Kalite: tam ekran döngü video, bölüm sabitlenir ve başlık kelime kelime yanar (opaklık .14→1). Video yalnızca görünürken oynar.
- Bölüm H2'leri satır satır maskeden gelir. Footer wordmark harf harf yükselir.
- Yalnızca fare: `mix-blend-mode: difference` imleç halkası (yatay vitrinde "Kaydırın" etiketi) ve mıknatıslı birincil butonlar.
- `prefers-reduced-motion` ya da GSAP yüklenemezse: hiçbir hareket katmanı çalışmaz, Lenis kapalı kalır, video oynamaz (poster görünür) ve sayfa statik düzende okunur.

## İçerik kuralları
Firma kurgusaldır. Teknik değerler, süreler, adres ve telefonlar örnektir ve footer'da bu belirtilir. Fotoğraflar açık lisanslıdır, yazarları footer'da yer alır. Hero fotoğrafındaki üretici logoları silinmiştir; başka bir markanın logosu görünen fotoğraf kullanılmaz.
