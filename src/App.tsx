import React, { useState } from "react";
import KineticGrid from "@/components/ui/kinetic-grid";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { PerspectiveGallery, GalleryItem } from "@/components/ui/perspective-gallery";
import {
  BookOpen,
  Search,
  Bookmark,
  Sparkles,
  Star,
  Award,
  BookMarked,
  Layers,
  Compass,
  ArrowUpRight,
  Library,
  Mail,
  Globe,
  MessageCircle,
  Menu,
  X,
  Flame
} from "lucide-react";

// Curated high quality aesthetic book & editorial covers for Hero marquee
const BOOK_HERO_COVERS = [
  // Elegant modern hardcovers and minimal book designs
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=700&auto=format&fit=crop&q=80",
];

// Curated 3D stack items for Book Gallery
const BOOK_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "The Architecture of Silence",
    category: "Monograph & Design",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    specs: "Edisi kolektor terbatas, hardbound cloth dengan tipografi embos foil perak. Kertas Munken Pure 140gsm."
  },
  {
    id: 2,
    title: "Chronicles of the Lost Epoch",
    category: "Historical Fiction",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    specs: "Novel epik pemenang penghargaan literatur. Ilustrasi interior tinta duotone dengan pita pembatas sutra."
  },
  {
    id: 3,
    title: "Kinfolk & Contemporary Spaces",
    category: "Editorial & Lifestyle",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80",
    specs: "Kompilasi fotografi ruang arsitektur Skandinavia dan esai kuratorial mengenai seni hidup tenang."
  },
  {
    id: 4,
    title: "Principles of Visual Synthesis",
    category: "Design Theory",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=80",
    specs: "Buku panduan teori desain Swiss, tipografi grid matematis, dan studi warna visual modern."
  },
  {
    id: 5,
    title: "Botanica: Rare Flora Anthology",
    category: "Art & Nature",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    specs: "Arsip ilustrasi botani klasik abad ke-19 yang direstorasi secara digital dalam cetakan 8 warna berpigmen tinggi."
  },
  {
    id: 6,
    title: "The Art of Thought & Solitude",
    category: "Philosophy",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&auto=format&fit=crop&q=80",
    specs: "Esai reflektif mengenai kreativitas di era digital. Format saku premium dengan sampul soft-touch matte."
  }
];

const CURATED_CATEGORIES = [
  { name: "Semua Genre", count: 184 },
  { name: "Desain & Arsitektur", count: 42 },
  { name: "Sastra & Puisi", count: 56 },
  { name: "Filosofi & Esai", count: 28 },
  { name: "Fotografi & Seni", count: 35 },
  { name: "Koleksi Terbatas", count: 23 },
];

const FEATURED_BOOKS = [
  {
    title: "Nordic Minimalist Living",
    author: "Elena Rostova",
    category: "Desain Interior",
    rating: 4.9,
    reviews: 128,
    price: "Rp 245.000",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=80",
    tag: "Editor's Pick"
  },
  {
    title: "Echoes of Modern Antiquity",
    author: "Julian Thorne",
    category: "Sejarah & Seni",
    rating: 4.8,
    reviews: 94,
    price: "Rp 320.000",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80",
    tag: "Bestseller"
  },
  {
    title: "The Typographic Grid",
    author: "Maximilien V.",
    category: "Teori Tipografi",
    rating: 5.0,
    reviews: 210,
    price: "Rp 280.000",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=500&auto=format&fit=crop&q=80",
    tag: "Edisi Khusus"
  },
  {
    title: "Solitude and Creation",
    author: "Aria Lindqvist",
    category: "Filosofi",
    rating: 4.9,
    reviews: 147,
    price: "Rp 195.000",
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&auto=format&fit=crop&q=80",
    tag: "Terbaru"
  },
];

export function App() {
  const [activeCategory, setActiveCategory] = useState("Semua Genre");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedBooks, setSavedBooks] = useState<number[]>([]);

  const toggleSaveBook = (index: number) => {
    setSavedBooks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <KineticGrid globalColor="book-archive" className="text-white selection:bg-amber-500 selection:text-black">
      {/* ─── PROFESSIONAL NAVBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#121214]/80 backdrop-blur-2xl transition-all">
        {/* Top Announcement Bar */}
        <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-white/[0.05] text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-medium text-amber-300">Pameran Buku Koleksi Khusus</span>
            <span className="text-white/40">• Diskon 15% untuk anggota kurasi sastra</span>
          </div>
          <div className="flex items-center gap-4 text-white/50">
            <span className="hover:text-white transition-colors cursor-pointer">Katalog PDF</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Tentang Kurasi</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Bantuan</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
              <Library className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                  LUMINA<span className="text-amber-400">ARCHIVE</span>
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20 tracking-wider">
                  GALLERY
                </span>
              </div>
              <p className="text-[11px] text-white/40 tracking-wider">Curated Books & Fine Editions</p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul buku, penulis, atau ISBN koleksi..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white/[0.04] border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.07] transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-white/70">
            <button onClick={() => scrollToSection("koleksi-3d")} className="hover:text-amber-400 transition-colors cursor-pointer">
              Koleksi 3D
            </button>
            <button onClick={() => scrollToSection("katalog")} className="hover:text-amber-400 transition-colors cursor-pointer">
              Edisi Terpilih
            </button>
            <button onClick={() => scrollToSection("kuratorial")} className="hover:text-amber-400 transition-colors cursor-pointer">
              Kuratorial
            </button>
            <button onClick={() => scrollToSection("keanggotaan")} className="hover:text-amber-400 transition-colors cursor-pointer">
              Keanggotaan
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection("katalog")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold shadow-lg shadow-amber-400/20 transition-all cursor-pointer hover:shadow-amber-400/30 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Jelajahi Arsip</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#141416]/95 backdrop-blur-2xl px-6 py-6 space-y-4">
            <div className="relative w-full mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Cari buku atau penulis..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none"
              />
            </div>
            <nav className="flex flex-col space-y-3 text-sm font-medium text-white/80">
              <button onClick={() => scrollToSection("koleksi-3d")} className="text-left py-2 hover:text-amber-400 transition-colors">
                Koleksi 3D Depth
              </button>
              <button onClick={() => scrollToSection("katalog")} className="text-left py-2 hover:text-amber-400 transition-colors">
                Edisi Pilihan Editor
              </button>
              <button onClick={() => scrollToSection("kuratorial")} className="text-left py-2 hover:text-amber-400 transition-colors">
                Catatan Kuratorial
              </button>
              <button onClick={() => scrollToSection("keanggotaan")} className="text-left py-2 hover:text-amber-400 transition-colors">
                Program Kolektor
              </button>
            </nav>
            <button
              onClick={() => scrollToSection("katalog")}
              className="w-full py-3 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" /> Buka Katalog Lengkap
            </button>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION DENGAN MARQUEE & KINETIC BACKGROUND ──────────────── */}
      <main className="flex-1">
        <AnimatedMarqueeHero
          className="bg-transparent text-white"
          tagline="✨ Galeri Buku & Eksplorasi Literatur Visual"
          title={
            <span className="text-white font-serif">
              Masterpieces of
              <br />
              <span className="text-amber-400 italic">Curated Literature</span>
            </span>
          }
          description="Ruang pamer virtual untuk karya literatur istimewa, monograf arsitektur, dan edisi buku bersampul indah dari penerbit independen terkemuka dunia."
          ctaText="Jelajahi Koleksi 3D"
          images={BOOK_HERO_COVERS}
          onCtaClick={() => scrollToSection("koleksi-3d")}
        />

        {/* ─── 3D PERSPECTIVE GALLERY (SESUAI REQUEST GAMBAR USER) ──────────── */}
        <section id="koleksi-3d" className="border-t border-white/[0.08] bg-black/40 backdrop-blur-md">
          <PerspectiveGallery
            title="HERITAGE BOOK"
            countBadge="18"
            subtitle="Koleksi buku edisi terbatas, cetakan eksklusif, dan monograf visual terpilih"
            badge="ISOMETRIC 3D GALLERY"
            items={BOOK_GALLERY_ITEMS}
          />
        </section>

        {/* ─── KATALOG BUKU PILIHAN EDITOR ───────────────────────────────────── */}
        <section id="katalog" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">
                Pilihan Kurator Bulan Ini
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-serif">
                Edisi Terpilih & Terlaris
              </h3>
              <p className="mt-3 text-white/60 text-sm max-w-xl">
                Buku-buku bernilai artistik tinggi dengan kualitas kertas bebas asam, jilid kokoh, dan tata letak tipografi standar galeri dunia.
              </p>
            </div>

            {/* Filter Pill Genre */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {CURATED_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.name
                      ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20 font-bold"
                      : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Grid Buku */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_BOOKS.map((book, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 shadow-xl hover:shadow-2xl hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Book Cover Container */}
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 bg-neutral-900 shadow-inner">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Tag Badge */}
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-amber-400 text-neutral-950 shadow-md">
                      {book.tag}
                    </span>

                    {/* Save Button */}
                    <button
                      onClick={() => toggleSaveBook(idx)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-colors ${
                        savedBooks.includes(idx)
                          ? "bg-amber-400 text-neutral-950 border-amber-400"
                          : "bg-black/40 text-white/80 border-white/10 hover:text-white hover:bg-black/60"
                      }`}
                      aria-label="Bookmark book"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    {/* Rating pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-white">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{book.rating}</span>
                      <span className="text-white/40">({book.reviews})</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/80 block mb-1">
                    {book.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 font-serif">
                    {book.title}
                  </h4>
                  <p className="text-xs text-white/50 mb-3">{book.author}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white">{book.price}</span>
                  <a
                    href={`https://wa.me/6281234567890?text=Halo%20Lumina%20Archive,%20saya%20tertarik%20dengan%20buku%20${encodeURIComponent(book.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Detail <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CATATAN KURATORIAL & NILAI GALERI ───────────────────────────────── */}
        <section id="kuratorial" className="py-24 px-4 sm:px-8 bg-black/50 border-y border-white/[0.08] backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-6">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white font-serif mb-3">Kurasi Literer Ketat</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Setiap judul yang dipamerkan melewati proses seleksi artistik, kedalaman pemikiran naskah, dan integritas visual sampul.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white font-serif mb-3">Material Cetak Arsip</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Buku dijilid dengan benang sutra, kertas bersertifikasi FSC bebas asam, dan sampul kain bernomor seri kolektor.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white font-serif mb-3">Jaminan Keaslian Edisi</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Bermitra langsung dengan penerbit independen global untuk memastikan keaslian cap sertifikat cetakan pertama.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NEWSLETTER / KEANGGOTAAN KOLEKTOR ──────────────────────────────── */}
        <section id="keanggotaan" className="py-24 px-4 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold mb-6">
            <Flame className="w-3.5 h-3.5" /> Jurnal Mingguan & Edisi Rahasia
          </div>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif mb-4">
            Bergabung Bersama Komunitas Kolektor
          </h3>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Dapatkan katalog kuratorial bulanan, undangan pra-rilis edisi bertanda tangan penulis, dan ulasan mendalam karya sastra visual.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan alamat email Anda..."
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Daftar Kurasi
            </button>
          </form>
        </section>
      </main>

      {/* ─── PROFESSIONAL HIGH-END FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] bg-[#0d0d0f]/90 backdrop-blur-2xl text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Kolom 1: Brand & Filosofi */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black font-black">
                  <Library className="w-5 h-5 text-neutral-950" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white font-serif">
                  LUMINA<span className="text-amber-400">ARCHIVE</span>
                </span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed max-w-sm">
                Galeri arsip buku dan eksplorasi tipografi kontemporer. Membuka pintu bagi penikmat literatur untuk menemukan karya yang merawat rasa, estetika ruang, dan pikiran abadi.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors" title="Website">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors" title="Komunitas">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors" title="Kontak Email">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Kolom 2: Eksplorasi Genre */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 font-mono">
                Eksplorasi
              </h5>
              <ul className="space-y-2.5 text-xs text-white/60">
                <li><a href="#katalog" className="hover:text-white transition-colors">Monograf Arsitektur</a></li>
                <li><a href="#katalog" className="hover:text-white transition-colors">Tipografi & Desain Grafis</a></li>
                <li><a href="#katalog" className="hover:text-white transition-colors">Sastra Kontemporer</a></li>
                <li><a href="#katalog" className="hover:text-white transition-colors">Fotografi & Jurnal Visual</a></li>
                <li><a href="#katalog" className="hover:text-white transition-colors">Koleksi Tanda Tangan Penulis</a></li>
              </ul>
            </div>

            {/* Kolom 3: Layanan & Informasi */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 font-mono">
                Layanan
              </h5>
              <ul className="space-y-2.5 text-xs text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Pemesanan Khusus Perpustakaan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Restorasi Sampul Hardcover</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Konsultasi Kurasi Rak Buku</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pengiriman Global Berasuransi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sertifikat Hak Koleksi</a></li>
              </ul>
            </div>

            {/* Kolom 4: Lokasi Galeri & Jam Buka */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 font-mono">
                Galeri Fisik
              </h5>
              <address className="not-italic text-xs text-white/60 space-y-2">
                <p className="text-white font-medium">Lumina Archive Library Pavilion</p>
                <p>Jl. Seni & Literatur No. 18, Menteng, Jakarta Pusat</p>
                <p className="pt-2 text-white/40">Selasa - Minggu: 10.00 - 21.00 WIB</p>
                <p className="text-amber-400/90 font-mono font-medium">+62 21 555-0819</p>
              </address>
            </div>
          </div>

          {/* Bottom Copyright & Badges */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2026 Lumina Archive Gallery. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-white transition-colors cursor-pointer">Kebijakan Privasi</span>
              <span className="hover:text-white transition-colors cursor-pointer">Syarat & Ketentuan</span>
              <span className="hover:text-white transition-colors cursor-pointer">Kode Etik Kurasi</span>
            </div>
          </div>
        </div>
      </footer>
    </KineticGrid>
  );
}

export default App;
