import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import YouTube from "react-youtube";
import MusicSearch from "./MusicSearch";

interface Track {
  videoId: string;
  title: string;
  artist: string;
  thumbnail?: string;
}

interface SearchResult {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  
  const playerRef = useRef<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Дефолтные треки для случайного воспроизведения
  const defaultTracks: Track[] = [
    {
      videoId: "jfKfPfyJRdk", // lofi hip hop radio
      title: "lofi hip hop radio - beats to relax/study to",
      artist: "Lofi Girl"
    },
    {
      videoId: "4xDzrJKXOOY", // dark ambient
      title: "Dark Ambient Music - The Abyss",
      artist: "Cryo Chamber"
    },
    {
      videoId: "5qap5aO4i9A", // dark synthwave
      title: "Dark Synthwave Mix",
      artist: "Various Artists"
    }
  ];

  useEffect(() => {
    const updateTime = () => {
      if (playerRef.current && playerReady) {
        const currentSeconds = playerRef.current.getCurrentTime();
        const totalSeconds = playerRef.current.getDuration();
        setCurrentTime(currentSeconds);
        setDuration(totalSeconds || 0);
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [playerReady]);

  useEffect(() => {
    if (currentTrack && user) {
      checkIfInLibrary();
    }
  }, [currentTrack, user]);

  const checkIfInLibrary = async () => {
    if (!currentTrack || !user) return;

    const { data } = await supabase
      .from('user_library')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', currentTrack.videoId)
      .maybeSingle();

    setIsInLibrary(!!data);
  };

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    setPlayerReady(true);
    playerRef.current.setVolume(volume[0]);
  };

  const onPlayerStateChange = (event: any) => {
    const playerState = event.data;
    // 1 = playing, 2 = paused, 0 = ended
    setIsPlaying(playerState === 1);
    
    if (playerState === 0) { // ended
      playRandomTrack();
    }
  };

  const playRandomTrack = () => {
    const randomTrack = defaultTracks[Math.floor(Math.random() * defaultTracks.length)];
    setCurrentTrack(randomTrack);
  };

  const togglePlay = () => {
    if (!currentTrack) {
      playRandomTrack();
      return;
    }

    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(value[0]);
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (playerRef.current) {
      playerRef.current.setVolume(value[0]);
      setVolume(value);
      setIsMuted(value[0] === 0);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.setVolume(volume[0]);
        setIsMuted(false);
      } else {
        playerRef.current.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const nextTrack = () => {
    playRandomTrack();
  };

  const prevTrack = () => {
    playRandomTrack();
  };

  const handleTrackSelect = (searchResult: SearchResult) => {
    const track: Track = {
      videoId: searchResult.videoId,
      title: searchResult.title,
      artist: searchResult.artist,
      thumbnail: searchResult.thumbnail
    };
    setCurrentTrack(track);
  };

  const addToLibrary = async () => {
    if (!currentTrack || !user) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_library')
        .insert({
          user_id: user.id,
          video_id: currentTrack.videoId,
          title: currentTrack.title,
          artist: currentTrack.artist,
          thumbnail_url: currentTrack.thumbnail || '',
          duration: formatTime(duration)
        });

      if (error) throw error;

      setIsInLibrary(true);
      toast({
        title: "Добавлено в библиотеку",
        description: currentTrack.title
      });
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Трек уже в библиотеке",
          description: currentTrack.title
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось добавить в библиотеку",
          variant: "destructive"
        });
      }
    }
  };

  const removeFromLibrary = async () => {
    if (!currentTrack || !user) return;

    try {
      const { error } = await supabase
        .from('user_library')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', currentTrack.videoId);

      if (error) throw error;

      setIsInLibrary(false);
      toast({
        title: "Удалено из библиотеки",
        description: currentTrack.title
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить из библиотеки",
        variant: "destructive"
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Поиск музыки */}
      <MusicSearch onTrackSelect={handleTrackSelect} />

      <Card className="bg-gradient-highlight border-gothic-accent shadow-gothic p-6">
        {/* Скрытый YouTube плеер */}
        {currentTrack && (
          <div style={{ display: 'none' }}>
            <YouTube
              videoId={currentTrack.videoId}
              opts={opts}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange}
            />
          </div>
        )}

        {/* Track Info */}
        <div className="text-center mb-6">
          {currentTrack ? (
            <>
              <h3 className="text-lg font-semibold text-gothic-highlight mb-1">
                {currentTrack.title.slice(0, 40)}
                {currentTrack.title.length > 40 && "..."}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentTrack.artist}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gothic-highlight mb-1">
                Погружение в бездну
              </h3>
              <p className="text-sm text-muted-foreground">
                Нажмите воспроизведение для случайного трека
              </p>
            </>
          )}
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
            <span>{formatTime(duration)}</span>
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

        {/* Library Controls */}
        {user && currentTrack && (
          <div className="flex justify-center gap-2 mb-4">
            <Button
              variant={isInLibrary ? "destructive" : "gothic"}
              size="sm"
              onClick={isInLibrary ? removeFromLibrary : addToLibrary}
              className="w-10 h-10 p-0"
            >
              {isInLibrary ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

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

        {/* Status */}
        <div className="mt-6 pt-4 border-t border-gothic-accent">
          <p className="text-xs text-muted-foreground text-center">
            {currentTrack ? "Воспроизводится" : "Готов к погружению"}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MusicPlayer;