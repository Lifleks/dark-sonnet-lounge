import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Play, ArrowLeft, Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlayer } from "@/contexts/PlayerContext";
import { Skeleton } from "@/components/ui/skeleton";

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

interface SearchResult {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // YouTube API key
  const YOUTUBE_API_KEY = "AIzaSyB_t3uhf9i8Mdx7lFPTPmkV7sesONyu9y4";

  const searchYouTube = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(
          searchQuery
        )}&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.items) {
        const searchResults: SearchResult[] = data.items.map((item: YouTubeVideo) => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.default.url
        }));
        
        setResults(searchResults);
      }
    } catch (error) {
      console.error("Error searching YouTube:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      searchYouTube(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      searchYouTube(query);
    }
  };

  const handlePlayTrack = (track: SearchResult) => {
    playTrack({
      videoId: track.videoId,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail
    });
  };

  return (
    <div className="min-h-screen bg-background font-gothic p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Button>
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Результаты поиска</h1>
          </div>
        </div>

        {/* Поисковая строка */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск музыки..."
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!query.trim()}>
                Найти
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Результаты поиска */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Поиск треков...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <Skeleton className="w-16 h-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>
                Найдено {results.length} результатов для "{searchParams.get('q')}"
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((track) => (
                  <Card key={track.videoId} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-full h-32 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate mb-1">
                            {track.title.slice(0, 60)}
                            {track.title.length > 60 && "..."}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate mb-3">
                            {track.artist}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handlePlayTrack(track)}
                            className="w-full"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Воспроизвести
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : query && !isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">
                По запросу "{query}" не найдено ни одного трека
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default SearchResults;