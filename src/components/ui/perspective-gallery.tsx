"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  specs?: string;
}

interface PerspectiveGalleryProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  countBadge?: string | number;
  items: GalleryItem[];
  className?: string;
}

export const PerspectiveGallery: React.FC<PerspectiveGalleryProps> = ({
  title = "PORTFOLIO HASIL CETAK",
  subtitle = "Koleksi Sample Fotocopy & Percetakan Digital",
  badge = "SHOWCASE EKSKLUSIF",
  countBadge,
  items,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalItem, setModalItem] = useState<GalleryItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const total = items.length;
  const count = countBadge ?? total;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Drag handling
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 40;
    if (info.offset.x < -threshold) {
      nextSlide();
    } else if (info.offset.x > threshold) {
      prevSlide();
    }
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <section className={cn("relative w-full py-20 px-4 sm:px-8 overflow-hidden select-none", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section mirip referensi: Typo besar bold dengan angka superscript */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              {badge}
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-[1.05] font-serif">
              {title}{" "}
              <span className="text-xl sm:text-3xl text-amber-400 align-super font-bold ml-1 font-sans">
                ({count})
              </span>
            </h2>
            {subtitle && (
              <p className="text-white/60 mt-3 text-sm sm:text-base max-w-xl">
                {subtitle} — Geser kartu atau klik gambar untuk melihat detail naskah, penjilidan & material kertas.
              </p>
            )}
          </div>

          {/* Navigasi Tombol Geser */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous image"
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next image"
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 3D Depth Isometric Stack View */}
        <div className="relative w-full h-[460px] sm:h-[540px] flex items-center justify-center md:justify-end pr-0 md:pr-12 perspective-[1200px]">
          {/* Active Card Info Panel (Di sebelah kiri desktop mirip gambar layout) */}
          <div className="hidden lg:block absolute left-4 bottom-8 max-w-md z-20 bg-black/70 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {items[activeIndex]?.category}
            </span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-2 font-serif">
              {items[activeIndex]?.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {items[activeIndex]?.specs || "Kualitas kurasi literer dengan hasil penjilidan presisi dan kertas arsip bersertifikasi."}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setModalItem(items[activeIndex])}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 transition-all cursor-pointer shadow-lg shadow-amber-400/20 active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Perbesar Detail
              </button>
              <span className="text-xs text-white/40 font-mono">
                {activeIndex + 1} / {total}
              </span>
            </div>
          </div>

          {/* Stack of Cards */}
          <div className="relative w-[270px] sm:w-[320px] md:w-[340px] h-[380px] sm:h-[460px]">
            {items.map((item, index) => {
              // Hitung offset relatif terhadap activeIndex
              const offset = (index - activeIndex + total) % total;
              
              // Hanya tampilkan 5 layer ke belakang untuk performa & estetika
              if (offset > 5 && offset < total - 1) return null;

              // Nilai transformasi 3D isometric stack
              const xOffset = offset * 48; // Bergeser ke kanan
              const yOffset = -offset * 24; // Bergeser naik ke atas
              const zOffset = -offset * 85; // Kedalaman 3D ke belakang
              const rotateY = -12; // Sudut miring isometric
              const rotateZ = 2; // Sedikit rotasi artistik
              const scale = Math.max(0.7, 1 - offset * 0.05);
              const opacity = offset === 0 ? 1 : Math.max(0.3, 0.95 - offset * 0.15);
              const zIndex = total - offset;

              const isFront = offset === 0;

              return (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing will-change-transform"
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    x: xOffset,
                    y: yOffset,
                    z: zOffset,
                    rotateY,
                    rotateZ,
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (isDragging) return;
                    if (isFront) {
                      setModalItem(item);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-card group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Tag & Title on Card */}
                    <div className="absolute bottom-0 inset-x-0 p-5 pointer-events-none">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                        {item.category}
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-white line-clamp-1 font-serif">
                        {item.title}
                      </h4>
                    </div>

                    {/* Quick zoom icon on hover */}
                    {isFront && (
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-amber-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                        <Eye className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Indikator Slider & Drag Hint */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all cursor-pointer",
                  i === activeIndex
                    ? "w-8 bg-amber-400"
                    : "w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
          <span className="text-xs tracking-widest uppercase font-mono text-white/40 flex items-center gap-2">
            ← Geser kartu atau gunakan tombol panah →
          </span>
        </div>
      </div>

      {/* Lightbox Modal ketika gambar diklik */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
            onClick={() => setModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#1c1c1f] border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setModalItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-72 md:h-[420px] overflow-hidden bg-black">
                  <img
                    src={modalItem.image}
                    alt={modalItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                      {modalItem.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-3 font-serif">
                      {modalItem.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed mb-4">
                      {modalItem.specs || "Koleksi buku istimewa dengan kertas arsip bersertifikasi bebas asam dan penjilidan standar perpustakaan dunia."}
                    </p>
                    <ul className="text-xs text-white/60 space-y-2 border-t border-white/10 pt-4">
                      <li>• Kertas pilihan kualitas arsip (Munken Pure / Cotton Paper)</li>
                      <li>• Jilid benang sutra tahan puluhan tahun</li>
                      <li>• Edisi kurasi resmi nomor registrasi arsip</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/40 font-mono">Sample Koleksi #{modalItem.id}</span>
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20Lumina%20Archive,%20saya%20tertarik%20dengan%20koleksi%20buku%20${encodeURIComponent(modalItem.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-400/20 active:scale-95"
                    >
                      Reservasi Koleksi Ini
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PerspectiveGallery;
