import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Play, Waves, Users } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Track {
  videoId: string;
  title: string;
  artist: string;
  thumbnail?: string;
}

interface UserPreference {
  preferred_artists: string[];
}

const MyWave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferredArtists, setPreferredArtists] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadUserWave();
  }, [user]);

  const loadUserWave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Получаем предпочтения пользователя
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('preferred_artists')
        .eq('user_id', user.id)
        .eq('is_configured', true)
        .maybeSingle();

      if (!preferences) {
        setLoading(false);
        return;
      }

      const artists = preferences.preferred_artists as string[];
      setPreferredArtists(artists);

      // Получаем треки предпочитаемых артистов из истории и библиотеки
      const artistConditions = artists.map(artist => `artist.ilike.%${artist}%`).join(',');
      
      // Получаем треки из истории прослушиваний
      const { data: historyTracks } = await supabase
        .from('listening_history')
        .select('*')
        .or(artistConditions)
        .order('played_at', { ascending: false })
        .limit(50);

      // Получаем треки из библиотеки
      const { data: libraryTracks } = await supabase
        .from('user_library')
        .select('*')
        .or(artistConditions)
        .order('created_at', { ascending: false })
        .limit(50);

      // Объединяем и убираем дубликаты
      const allTracks = [
        ...(historyTracks || []).map(track => ({
          videoId: track.video_id,
          title: track.title,
          artist: track.artist || '',
          thumbnail: track.thumbnail_url || undefined
        })),
        ...(libraryTracks || []).map(track => ({
          videoId: track.video_id,
          title: track.title,
          artist: track.artist || '',
          thumbnail: track.thumbnail_url || undefined
        }))
      ];

      // Убираем дубликаты по videoId и перемешиваем
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.videoId === track.videoId)
      );

      // Перемешиваем треки для разнообразия
      const shuffledTracks = uniqueTracks.sort(() => Math.random() - 0.5).slice(0, 30);
      
      setRecommendations(shuffledTracks);
    } catch (error) {
      console.error('Error loading user wave:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: Track) => {
    playTrack({
      videoId: track.videoId,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-gothic p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к профилю
          </Button>
          <div className="flex items-center gap-3">
            <Waves className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Моя волна</h1>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <CardTitle>Загрузка персональных рекомендаций...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <Skeleton className="w-12 h-12 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : preferredArtists.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Рекомендации не настроены</h3>
              <p className="text-muted-foreground mb-6">
                Настройте ваши музыкальные предпочтения в профиле, чтобы получить персональные рекомендации
              </p>
              <Button onClick={() => navigate('/profile')}>
                Перейти к настройкам
              </Button>
            </CardContent>
          </Card>
        ) : recommendations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Недостаточно данных</h3>
              <p className="text-muted-foreground mb-6">
                Слушайте больше музыки ваших любимых артистов, чтобы мы могли составить персональные рекомендации
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="text-sm text-muted-foreground">Ваши предпочтения:</span>
                {preferredArtists.map((artist, index) => (
                  <Badge key={index} variant="secondary">
                    {artist}
                  </Badge>
                ))}
              </div>
              <Button onClick={() => navigate('/gallery')}>
                Исследовать музыку
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Информация о предпочтениях */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ваши предпочтения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {preferredArtists.map((artist, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {artist}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  На основе этих предпочтений мы составили для вас {recommendations.length} рекомендаций
                </p>
              </CardContent>
            </Card>

            {/* Рекомендации */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="w-5 h-5" />
                  Персональные рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recommendations.map((track, index) => (
                    <Card key={`${track.videoId}-wave-${index}`} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {track.thumbnail ? (
                            <img 
                              src={track.thumbnail} 
                              alt={track.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                              <Music className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{track.title}</h3>
                            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePlayTrack(track)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default MyWave;