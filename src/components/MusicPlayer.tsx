import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks = [
    {
      title: "Void Whispers",
      artist: "Eftanasya",
      duration: "4:32"
    },
    {
      title: "Digital Shadows",
      artist: "Eftanasya",
      duration: "3:45"
    },
    {
      title: "Gothic Dreams",
      artist: "Eftanasya",
      duration: "5:12"
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value[0] / 100;
    setVolume(value);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume[0] / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-highlight border-gothic-accent shadow-gothic p-6">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none">
        {/* В реальном проекте здесь были бы ссылки на аудиофайлы */}
      </audio>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gothic-highlight mb-1">
          {tracks[currentTrack].title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {tracks[currentTrack].artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleProgressChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{tracks[currentTrack].duration}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="gothic"
          size="sm"
          onClick={prevTrack}
          className="w-10 h-10 p-0"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          variant="hero"
          size="lg"
          onClick={togglePlay}
          className="w-14 h-14 p-0 rounded-full"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>

        <Button
          variant="gothic"
          size="sm"
          onClick={nextTrack}
          className="w-10 h-10 p-0"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="w-8 h-8 p-0"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-gothic-glow" />
          )}
        </Button>
        <Slider
          value={isMuted ? [0] : volume}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
      </div>

      {/* Track List Preview */}
      <div className="mt-6 pt-4 border-t border-gothic-accent">
        <p className="text-xs text-muted-foreground text-center">
          {tracks.length} треков в плейлисте "Погружение"
        </p>
      </div>
    </Card>
  );
};

export default MusicPlayer;