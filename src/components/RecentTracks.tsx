import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router-dom";

interface RecentTrack {
  id: string;
  video_id: string;
  title: string;
  artist: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  played_at: string;
}

export default function RecentTracks() {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const navigate = useNavigate();
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecentTracks();
    }
  }, [user]);

  const loadRecentTracks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await supabase
        .from('listening_history')
        .select('*')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(isExpanded ? 50 : 5);

      if (data) {
        setRecentTracks(data);
      }
    } catch (error) {
      console.error('Error loading recent tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: RecentTrack) => {
    playTrack({
      id: track.video_id,
      title: track.title,
      artist: track.artist || 'Unknown Artist',
      thumbnail: track.thumbnail_url || ''
    });
  };

  if (!user) {
    return (
      <Card className="bg-card/50 backdrop-blur border-primary/20 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gothic-highlight">
            <Clock className="w-5 h-5" />
            Недавние треки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Войдите в систему, чтобы видеть недавние треки
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-primary/20 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gothic-highlight">
            <Clock className="w-5 h-5" />
            Недавние треки
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-center text-muted-foreground">Загрузка...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20 transition-all duration-500 ease-in-out h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gothic-highlight">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Недавние треки ({recentTracks.length})
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 p-0 animate-pulse"
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={`flex-1 transition-all duration-500 ease-in-out ${
        isExpanded ? 'overflow-y-auto' : 'overflow-hidden'
      }`}>
        {recentTracks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Пока нет недавних треков
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {recentTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {track.thumbnail_url && (
                    <img
                      src={track.thumbnail_url}
                      alt={track.title}
                      className="w-12 h-12 rounded object-cover transition-transform duration-300 hover:scale-110"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist || 'Unknown Artist'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(track.played_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePlayTrack(track)}
                    className="shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-glow"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {!isExpanded && recentTracks.length >= 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/recent-tracks')}
                  className="transition-all duration-300 hover:scale-105 hover:shadow-glow"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Все недавние треки
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}