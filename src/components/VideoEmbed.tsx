import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/** Parse YouTube watch/share/embed URLs → video id. */
export function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const u = new URL(withProtocol);

    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id || null;
    }

    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com' || u.hostname === 'm.youtube.com') {
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/')[2] || null;
      }
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/')[2] || null;
      }
      const v = u.searchParams.get('v');
      if (v) return v;
    }
  } catch {
    return null;
  }

  return null;
}

type VideoEmbedProps = {
  /** YouTube URL (youtu.be, watch?v=, …) or direct file URL (.mp4, etc.). */
  videoUrl: string;
  /** Optional poster for direct-file playback (ignored for YouTube). */
  posterUrl?: string;
  title?: string;
  className?: string;
  /**
   * Autoplay (direct: muted+loop+playsInline, no controls — required by browsers).
   * YouTube: autoplay=1&mute=1&controls=0 on the embed URL.
   */
  autoPlay?: boolean;
  /** Overlay mute/unmute control (direct-file playback only). */
  showMuteButton?: boolean;
};

export default function VideoEmbed({
  videoUrl,
  posterUrl,
  title = 'Video',
  className = '',
  autoPlay = false,
  showMuteButton = false,
}: VideoEmbedProps) {
  const trimmed = videoUrl.trim();
  if (!trimmed) {
    return (
      <div
        className={`flex aspect-video items-center justify-center rounded-lg bg-slate-900/80 text-sm text-slate-300 ${className}`}
        role="note"
      >
        Missing video URL
      </div>
    );
  }

  const ytId = getYouTubeVideoId(trimmed);

  if (ytId) {
    const params = new URLSearchParams({
      rel: '0',
      ...(autoPlay
        ? {
            autoplay: '1',
            mute: '1',
            controls: '0',
            playsinline: '1',
            modestbranding: '1',
          }
        : {}),
    });
    const src = `https://www.youtube.com/embed/${encodeURIComponent(ytId)}?${params.toString()}`;
    return (
      <div className={`aspect-video w-full overflow-hidden rounded-lg bg-black ${className}`}>
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <DirectFileVideo
      src={trimmed}
      posterUrl={posterUrl}
      autoPlay={autoPlay}
      showMuteButton={showMuteButton}
      className={className}
    />
  );
}

function DirectFileVideo({
  src,
  posterUrl,
  autoPlay,
  showMuteButton,
  className,
}: {
  src: string;
  posterUrl?: string;
  autoPlay: boolean;
  showMuteButton: boolean;
  className: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-lg bg-black ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl}
        playsInline
        preload={autoPlay ? 'auto' : 'metadata'}
        muted={muted}
        loop={autoPlay}
        autoPlay={autoPlay}
        controls={!autoPlay && !showMuteButton}
        disablePictureInPicture={autoPlay}
        controlsList={autoPlay ? 'nodownload nofullscreen noremoteplayback' : undefined}
        className="h-full w-full object-cover"
      >
        Your browser does not support the video tag.
      </video>

      {showMuteButton && (
        <button
          type="button"
          onClick={() => setMuted((prev) => !prev)}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!muted}
          className="absolute bottom-3 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
        </button>
      )}
    </div>
  );
}
