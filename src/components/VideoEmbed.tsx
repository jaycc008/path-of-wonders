import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

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
  /**
   * Poster + centered play button; playback starts inline on tap with sound (user gesture).
   * Ignores autoPlay and showMuteButton.
   */
  clickToPlay?: boolean;
};

export default function VideoEmbed({
  videoUrl,
  posterUrl,
  title = 'Video',
  className = '',
  autoPlay = false,
  showMuteButton = false,
  clickToPlay = false,
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
      ...(autoPlay && !clickToPlay
        ? {
            autoplay: '1',
            mute: '1',
            controls: '0',
            playsinline: '1',
            modestbranding: '1',
          }
        : {
            playsinline: '1',
            modestbranding: '1',
          }),
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

  if (clickToPlay) {
    return (
      <ClickToPlayVideo
        src={trimmed}
        posterUrl={posterUrl}
        title={title}
        className={className}
      />
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

function ClickToPlayVideo({
  src,
  posterUrl,
  title,
  className,
}: {
  src: string;
  posterUrl?: string;
  title: string;
  className: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasStarted) return;
    video.muted = muted;
  }, [muted, hasStarted]);

  const handleStart = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    video.muted = false;
    setMuted(false);

    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = muted;
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
  }, [muted]);

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-lg bg-black ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl}
        playsInline
        preload="metadata"
        controls={false}
        muted={muted}
        className={[
          'h-full w-full object-cover',
          !hasStarted ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
        aria-label={title}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        Your browser does not support the video tag.
      </video>

      {!hasStarted && (
        <>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              aria-hidden
            />
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30"
            aria-hidden
          />
          <button
            type="button"
            onClick={handleStart}
            aria-label="Play video"
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <span className="flex h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-white/90 bg-white text-slate-900 shadow-[0_8px_40px_rgba(0,0,0,0.45)] transition-transform active:scale-95">
              <Play className="ml-1 h-9 w-9 sm:h-10 sm:w-10 fill-current" aria-hidden />
            </span>
          </button>
        </>
      )}

      {hasStarted && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-gradient-to-t from-black/55 to-transparent" aria-hidden />
      )}

      {hasStarted && (
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/65 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" aria-hidden />
            ) : (
              <Play className="ml-0.5 h-5 w-5" aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            aria-pressed={!muted}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/65 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      )}
    </div>
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
