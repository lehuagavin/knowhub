import { useState, useEffect, useCallback, useRef } from 'react';

export interface Slide {
  src: string;
  alt?: string;
  caption?: string;
}

interface PresentationCarouselProps {
  slides: Slide[];
  title?: string;
  autoPlayInterval?: number;
}

export default function PresentationCarousel({
  slides,
  title,
  autoPlayInterval = 5000,
}: PresentationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const totalSlides = slides.length;

  // Navigation
  const goTo = useCallback(
    (index: number) => {
      if (index < 0) setCurrentIndex(totalSlides - 1);
      else if (index >= totalSlides) setCurrentIndex(0);
      else setCurrentIndex(index);
    },
    [totalSlides]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, goNext, autoPlayInterval]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle when this component or fullscreen is active
      if (!isFullscreen && !containerRef.current?.contains(document.activeElement)) {
        return;
      }
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((p) => !p);
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            exitFullscreen();
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goNext, goPrev]);

  // Fullscreen API
  const enterFullscreen = useCallback(async () => {
    try {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } catch {
      // Fullscreen not supported
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) exitFullscreen();
    else enterFullscreen();
  }, [enterFullscreen, exitFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Preload adjacent images
  useEffect(() => {
    const preloadIndexes = [
      currentIndex,
      (currentIndex + 1) % totalSlides,
      (currentIndex - 1 + totalSlides) % totalSlides,
    ];
    preloadIndexes.forEach((i) => {
      const img = new Image();
      img.src = slides[i].src;
    });
  }, [currentIndex, slides, totalSlides]);

  const handleImageLoad = (index: number) => {
    setIsLoaded((prev) => ({ ...prev, [index]: true }));
  };

  // Get base URL for image paths
  const getImageSrc = (src: string) => {
    // If the src already starts with http, use as-is
    if (src.startsWith('http')) return src;
    // For relative paths, prepend base URL
    const base = (import.meta as any).env?.BASE_URL || '/knowhub';
    if (src.startsWith('/')) {
      return `${base.replace(/\/$/, '')}${src}`;
    }
    return `${base}${src}`;
  };

  return (
    <div
      ref={containerRef}
      className="presentation-carousel"
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: isFullscreen ? '100%' : '960px',
        margin: '0 auto',
        backgroundColor: isFullscreen ? '#000' : 'var(--surface, #f5f5f5)',
        borderRadius: isFullscreen ? 0 : '12px',
        overflow: 'hidden',
        outline: 'none',
        height: isFullscreen ? '100vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      {title && !isFullscreen && (
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color, #e5e5e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--text-primary, #1d1d1f)',
            }}
          >
            {title}
          </h3>
          <span
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary, #86868b)',
            }}
          >
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>
      )}

      {/* Slide Area */}
      <div
        style={{
          position: 'relative',
          flex: isFullscreen ? 1 : 'none',
          aspectRatio: isFullscreen ? undefined : '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isFullscreen ? '#000' : 'var(--surface, #f5f5f5)',
          overflow: 'hidden',
        }}
      >
        {/* Current Slide Image */}
        {!isLoaded[currentIndex] && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary, #86868b)',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                animation: 'spin 1s linear infinite',
              }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
        )}
        <img
          src={getImageSrc(slides[currentIndex].src)}
          alt={slides[currentIndex].alt || `Slide ${currentIndex + 1}`}
          onLoad={() => handleImageLoad(currentIndex)}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            opacity: isLoaded[currentIndex] ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          draggable={false}
        />

        {/* Left Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="上一页"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'background-color 0.2s, opacity 0.2s',
            opacity: 0.7,
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.7)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = '0.7';
            (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.5)';
          }}
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="下一页"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'background-color 0.2s, opacity 0.2s',
            opacity: 0.7,
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.7)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = '0.7';
            (e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.5)';
          }}
        >
          ›
        </button>

        {/* Fullscreen slide counter overlay */}
        {isFullscreen && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
            }}
          >
            {currentIndex + 1} / {totalSlides}
          </div>
        )}
      </div>

      {/* Caption */}
      {slides[currentIndex].caption && (
        <div
          style={{
            padding: isFullscreen ? '12px 20px' : '10px 20px',
            textAlign: 'center',
            fontSize: '0.9375rem',
            color: isFullscreen ? '#ccc' : 'var(--text-secondary, #86868b)',
            backgroundColor: isFullscreen ? 'rgba(0,0,0,0.8)' : 'transparent',
          }}
        >
          {slides[currentIndex].caption}
        </div>
      )}

      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: isFullscreen ? '12px 20px 20px' : '12px 20px 16px',
          backgroundColor: isFullscreen ? 'rgba(0,0,0,0.8)' : 'transparent',
        }}
      >
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? '暂停' : '播放'}
          title={isPlaying ? '暂停 (Space)' : '播放 (Space)'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: isFullscreen
              ? '1.5px solid rgba(255,255,255,0.3)'
              : '1.5px solid var(--border-color, #d2d2d7)',
            backgroundColor: 'transparent',
            color: isFullscreen ? '#fff' : 'var(--text-primary, #1d1d1f)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress Dots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '400px',
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`跳转到第 ${i + 1} 页`}
              style={{
                width: i === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor:
                  i === currentIndex
                    ? isFullscreen
                      ? '#fff'
                      : 'var(--primary, #0071e3)'
                    : isFullscreen
                      ? 'rgba(255,255,255,0.3)'
                      : 'var(--border-color, #d2d2d7)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? '退出全屏' : '全屏'}
          title={isFullscreen ? '退出全屏 (Esc)' : '全屏 (F)'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: isFullscreen
              ? '1.5px solid rgba(255,255,255,0.3)'
              : '1.5px solid var(--border-color, #d2d2d7)',
            backgroundColor: 'transparent',
            color: isFullscreen ? '#fff' : 'var(--text-primary, #1d1d1f)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          {isFullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
            </svg>
          )}
        </button>
      </div>

      {/* Thumbnail Strip */}
      {!isFullscreen && totalSlides > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '0 20px 16px',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`跳转到第 ${i + 1} 页`}
              style={{
                flexShrink: 0,
                width: '72px',
                height: '40px',
                borderRadius: '6px',
                overflow: 'hidden',
                border:
                  i === currentIndex
                    ? '2px solid var(--primary, #0071e3)'
                    : '2px solid transparent',
                cursor: 'pointer',
                padding: 0,
                opacity: i === currentIndex ? 1 : 0.6,
                transition: 'all 0.2s',
                backgroundColor: 'var(--border-color, #d2d2d7)',
              }}
            >
              <img
                src={getImageSrc(slide.src)}
                alt={`缩略图 ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* Keyboard hints */}
      {!isFullscreen && (
        <div
          style={{
            padding: '0 20px 12px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary, #86868b)',
            opacity: 0.7,
          }}
        >
          <span>← → 翻页</span>
          <span>Space 播放/暂停</span>
          <span>F 全屏</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .presentation-carousel:focus {
          box-shadow: 0 0 0 2px var(--primary, #0071e3);
        }
        .presentation-carousel:fullscreen {
          display: flex !important;
          flex-direction: column !important;
        }
      `}</style>
    </div>
  );
}
