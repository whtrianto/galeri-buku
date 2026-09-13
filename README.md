# 📖 Lumina Archive Gallery — Curated Literature & Visual Books

Website interaktif dan elegan untuk ruang pamer literatur kurasi, monograf arsitektur, dan edisi buku bersampul indah (*fine binding editions*). Dibangun dengan estetika *luxury dark mode*, tipografi berkelas, animasi kanvas interaktif, dan galeri 3D bertumpuk (*isometric depth cards*).

---

## ✨ Fitur Unggulan

- **🌌 Interactive Kinetic Grid Background (`KineticGrid`)**:
  - Animasi kanvas geometris interaktif yang melengkung (*warp*) secara dinamis mengikuti kursor mouse.
  - Efek gelombang air emas (*golden ripples*) saat layar diklik.
  - Partikel debu kertas melayang lembut (*floating gold leaf specks*) yang menciptakan suasana perpustakaan klasik mewah.
- **🎬 Animated Marquee Hero (`hero-3`)**:
  - Tipografi besar dengan animasi *staggered spring word-by-word*.
  - Pita *infinite loop marquee* dengan rotasi bergantian menampilkan sampul-sampul buku resolusi tinggi.
- **📚 3D Depth Isometric Stack Gallery (`HERITAGE BOOK 18`)**:
  - Tampilan kartu bertumpuk dengan sudut pandang isometrik 3D yang realistis.
  - **Dapat Digeser (*Draggable*)**: Geser kartu depan dengan mouse/touch gesture untuk beralih buku.
  - **Dapat Diklik**: Mengklik kartu belakang akan memindahkannya ke depan, dan mengklik kartu utama akan membuka **Lightbox Modal Dialog** detail naskah, jenis jilid, dan sertifikat arsip.
- **🏛️ Professional High-End Navbar & Footer**:
  - Navbar lengkap dengan *top announcement bar*, pencarian instan (shortcut `⌘K`), menu navigasi kuratorial, dan *responsive mobile drawer*.
  - Footer multi-kolom berstandar galeri internasional berisi informasi arsip, jam buka galeri fisik, dan tautan legalitas.
- **📖 Filter Katalog Edisi Terpilih**:
  - Filter genre instan (*Desain & Arsitektur, Sastra & Puisi, Filosofi, Fotografi, Koleksi Terbatas*).
  - Fitur simpan/bookmark buku dan peringkat ulasan.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + HTML5 Canvas API
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Architecture**: shadcn/ui pattern (`@/components/ui/`, `@/lib/utils`)

---

## 📁 Struktur Folder

```text
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── hero-3.tsx              # Komponen Animated Marquee Hero
│   │       ├── kinetic-grid.tsx        # Canvas background interaktif emas & debu kertas
│   │       └── perspective-gallery.tsx # Galeri 3D isometric stack (Drag & Click)
│   ├── lib/
│   │   └── utils.ts                    # Utility helper cn() (clsx + tailwind-merge)
│   ├── App.tsx                         # Halaman utama Galeri Buku
│   ├── index.css                       # Design tokens & Tailwind CSS
│   └── main.tsx                        # Entry point aplikasi
├── index.html                          # HTML template dengan Plus Jakarta Sans & Playfair Display
├── package.json                        # Konfigurasi dependensi dan skrip
├── tsconfig.json                       # Konfigurasi TypeScript dengan path alias @/*
├── vite.config.ts                      # Konfigurasi bundler Vite
└── .gitignore                          # Daftar file yang diabaikan (node_modules, dist, dll.)
```

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/whtrianto/galeri-buku.git
   cd galeri-buku
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka browser Anda di `http://localhost:3000` (atau port yang tertera).

4. **Build untuk Production:**
   ```bash
   npm run build
   ```

---

## 🌐 Cara Deploy ke Vercel (Gratis)

1. Buka [Vercel](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **Add New...** > **Project**.
3. Pilih repository **`galeri-buku`**.
4. Vercel akan otomatis mendeteksi konfigurasi:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy**. Website Anda akan langsung aktif dengan domain gratis SSL (`https://galeri-buku-xxx.vercel.app`).

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan showcase galeri buku interaktif dan portfolio personal.
