import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star, TrendingUp } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";

interface RecommendedTrack {
  id: string;
  video_id: string;
  title: string;
  artist: string;
  thumbnail_url: string;
  reason: string;
}

export default function TrackRecommendations() {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Пока создаем рекомендации на основе популярных треков
      const popularTracks: RecommendedTrack[] = [
        {
          id: "1",
          video_id: "jfKfPfyJRdk",
          title: "lofi hip hop radio - beats to relax/study to",
          artist: "Lofi Girl",
          thumbnail_url: "https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg",
          reason: "Популярно в темной музыке"
        },
        {
          id: "2",
          video_id: "4xDzrJKXOOY", 
          title: "The Abyss - Dark Ambient",
          artist: "Cryo Chamber",
          thumbnail_url: "https://i.ytimg.com/vi/4xDzrJKXOOY/maxresdefault.jpg",
          reason: "Темный эмбиент"
        },
        {
          id: "3",
          video_id: "5qap5aO4i9A",
          title: "Dark Synthwave Mix",
          artist: "Various Artists", 
          thumbnail_url: "https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg",
          reason: "Синтвейв классика"
        },
        {
          id: "4",
          video_id: "WiST_wKlFDY",
          title: "Blade Runner Blues",
          artist: "Vangelis",
          thumbnail_url: "https://i.ytimg.com/vi/WiST_wKlFDY/maxresdefault.jpg",
          reason: "Киберпанк атмосфера"
        },
        {
          id: "5",
          video_id: "hFcLyDb6niA",
          title: "Carpenter Brut - Turbo Killer",
          artist: "Carpenter Brut",
          thumbnail_url: "https://i.ytimg.com/vi/hFcLyDb6niA/maxresdefault.jpg",
          reason: "Энергичный дарквейв"
        },
        {
          id: "6",
          video_id: "oe7fy5Q-5-s",
          title: "Dark Gothic Music",
          artist: "Adrian von Ziegler",
          thumbnail_url: "https://i.ytimg.com/vi/oe7fy5Q-5-s/maxresdefault.jpg",
          reason: "Готическая атмосфера"
        }
      ];

      // Если пользователь авторизован, можем показать персонализированные рекомендации
      if (user) {
        // Здесь можно добавить логику на основе истории прослушивания
        const { data: userHistory } = await supabase
          .from('listening_history')
          .select('video_id, title, artist')
          .eq('user_id', user.id)
          .limit(5);

        if (userHistory && userHistory.length > 0) {
          // Добавляем причину на основе истории
          popularTracks[0].reason = "На основе вашей истории";
          popularTracks[1].reason = "Похоже на ваши предпочтения";
        }
      }

      setRecommendations(popularTracks);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: RecommendedTrack) => {
    playTrack({
      videoId: track.video_id,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail_url
    });
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gothic-highlight">
            <Star className="w-5 h-5" />
            Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Загрузка рекомендаций...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gothic-highlight mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8" />
            Рекомендации для вас
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Откройте новые треки в глубинах темной музыки
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((track) => (
            <Card 
              key={track.id}
              className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={track.thumbnail_url}
                    alt={track.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={() => handlePlayTrack(track)}
                      className="bg-primary/90 hover:bg-primary"
                    >
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-lg truncate">{track.title}</h3>
                  <p className="text-muted-foreground truncate">{track.artist}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">{track.reason}</span>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => handlePlayTrack(track)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Воспроизвести
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}