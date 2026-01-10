'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Photos from /public/photos directory
const photos = [
  { src: '/photos/mariage.jpg', caption: 'Le jour J', rotation: -3 },
  { src: '/photos/20150222_152405.jpg', caption: 'Souvenirs en famille', rotation: 2 },
  { src: '/photos/20220402_125213.jpg', caption: 'Moments de joie', rotation: -2 },
  { src: '/photos/IMG_0583.jpg', caption: 'Tous ensemble', rotation: 4 },
  { src: '/photos/IMG_1312.jpg', caption: 'La complicité', rotation: -4 },
  { src: '/photos/IMG_1767.JPG', caption: 'Instant magique', rotation: 2 },
  { src: '/photos/PXL_20230330_161354908.jpg', caption: 'Entre amis', rotation: -3 },
  { src: '/photos/PXL_20230604_130602424.MP.jpg', caption: 'Fête en famille', rotation: 3 },
  { src: '/photos/PXL_20231026_205931762.jpg', caption: 'Sourires partagés', rotation: -2 },
  { src: '/photos/PXL_20240822_115356056.jpg', caption: 'L\'été dernier', rotation: 4 },
  { src: '/photos/PXL_20240823_090657876.jpg', caption: 'Bonheur simple', rotation: -4 },
  { src: '/photos/PXL_20250809_150947063.jpg', caption: 'Préparatifs', rotation: 2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const photoVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function PhotoboothGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <>
      <motion.section
        className="py-16 md:py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="title-massive text-pearl mb-4">
              Photobooth
            </h2>
            <p className="font-serif text-xl md:text-2xl text-pearl-muted max-w-lg mx-auto">
              Des moments précieux capturés au fil des années
            </p>
          </motion.div>

          {/* Photo Grid - Scattered Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                variants={photoVariants}
                className={`
                  relative group cursor-pointer
                  ${index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                `}
                style={{
                  '--rotation': `${photo.rotation}deg`,
                } as React.CSSProperties}
                onClick={() => openLightbox(index)}
              >
                {/* Photo Frame with Levitation Effect */}
                <div
                  className="photo-frame p-2 md:p-3 h-full"
                  style={{ transform: `rotate(${photo.rotation}deg)` }}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-void-lighter)]">
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Caption */}
                  <div className="pt-2 md:pt-3 pb-1">
                    <p className="font-serif text-sm md:text-base text-[var(--color-void)] text-center italic">
                      {photo.caption}
                    </p>
                  </div>
                </div>

                {/* Decorative Corner Fold */}
                <div
                  className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, transparent 50%, var(--color-gold) 50%)',
                    borderTopRightRadius: '4px',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/95 backdrop-blur-lg"
              onClick={closeLightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 p-2 text-pearl/60 hover:text-pearl transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 md:left-8 z-10 p-3 glass-card text-pearl/60 hover:text-pearl transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 md:right-8 z-10 p-3 glass-card text-pearl/60 hover:text-pearl transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.div
              className="relative max-w-4xl max-h-[80vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <div className="relative aspect-[4/3] bg-[var(--color-void-lighter)] rounded-lg overflow-hidden">
                <Image
                  src={photos[selectedIndex].src}
                  alt={photos[selectedIndex].caption}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Caption */}
              <motion.p
                className="text-center mt-4 font-serif text-xl text-pearl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {photos[selectedIndex].caption}
              </motion.p>

              {/* Counter */}
              <p className="text-center mt-2 text-pearl-muted text-sm">
                {selectedIndex + 1} / {photos.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
