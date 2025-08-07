import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Calendar, ArrowLeft } from "lucide-react";
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

export default function RecentTracksPage() {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const navigate = useNavigate();
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      loadRecentTracks();
    }
  }, [user, selectedDate]);

  const loadRecentTracks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data } = await supabase
        .from('listening_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('played_at', startOfDay.toISOString())
        .lte('played_at', endOfDay.toISOString())
        .order('played_at', { ascending: false });

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
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-gothic pb-24 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          
          <h1 className="text-3xl font-bold text-gothic-highlight mb-4 animate-fade-in">
            Недавние треки
          </h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Выберите дату:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gothic-accent rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-gothic-glow transition-all duration-300"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gothic-highlight">
              <Calendar className="w-5 h-5" />
              Треки за {new Date(selectedDate).toLocaleDateString('ru-RU')} ({recentTracks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-gothic-glow border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            ) : recentTracks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                На эту дату треков не найдено
              </p>
            ) : (
              <div className="space-y-3">
                {recentTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {track.thumbnail_url && (
                      <img
                        src={track.thumbnail_url}
                        alt={track.title}
                        className="w-16 h-16 rounded object-cover transition-transform duration-300 hover:scale-110"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-lg truncate">
                        {track.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artist || 'Unknown Artist'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(track.played_at).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={() => handlePlayTrack(track)}
                      className="shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-glow"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}