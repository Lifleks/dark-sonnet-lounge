import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Music, Upload, ArrowLeft, Library, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  tracks: any;
  created_at: string;
}

interface LibraryTrack {
  id: string;
  video_id: string;
  title: string;
  artist: string;
  thumbnail_url: string;
  duration: string;
  created_at: string;
}

export default function Profile() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [library, setLibrary] = useState<LibraryTrack[]>([]);
  const [activeTab, setActiveTab] = useState<'playlists' | 'library'>('playlists');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: ''
  });
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPlaylists();
      fetchLibrary();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground font-gothic">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
      setFormData({
        display_name: data.display_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      });
    }
  };

  const fetchPlaylists = async () => {
    const { data } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setPlaylists(data);
    }
  };

  const fetchLibrary = async () => {
    const { data } = await supabase
      .from('user_library')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setLibrary(data);
    }
  };

  const removeFromLibrary = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Удалено из библиотеки",
        description: "Трек успешно удален."
      });
      
      fetchLibrary();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить трек",
        variant: "destructive"
      });
    }
  };

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          avatar_url: formData.avatar_url
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Профиль обновлен",
        description: "Ваши изменения сохранены успешно."
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive"
      });
    }
  };

  const createPlaylist = async () => {
    try {
      const { error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          name: newPlaylist.name,
          description: newPlaylist.description
        });

      if (error) throw error;

      toast({
        title: "Плейлист создан",
        description: "Новый плейлист успешно добавлен."
      });
      
      setIsCreatingPlaylist(false);
      setNewPlaylist({ name: '', description: '' });
      fetchPlaylists();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать плейлист",
        variant: "destructive"
      });
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Плейлист удален",
        description: "Плейлист успешно удален."
      });
      
      fetchPlaylists();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить плейлист",
        variant: "destructive"
      });
    }
  };

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 py-8 relative">
      {/* Back to Home Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-30 text-muted-foreground hover:text-gothic-highlight"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        На главную
      </Button>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Section */}
        <Card className="mb-8 bg-background/60 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-gothic text-2xl text-foreground">
                Личный кабинет
              </CardTitle>
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-gothic text-4xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Загрузить фото
                  </Button>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground font-gothic">Имя</label>
                      <Input
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                        placeholder="Введите ваше имя"
                        className="mt-1 bg-background/50 border-primary/20"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground font-gothic">Описание</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Расскажите о себе..."
                        className="mt-1 bg-background/50 border-primary/20 resize-none"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={saveProfile} className="bg-primary hover:bg-primary/90">
                        Сохранить
                      </Button>
                      <Button 
                        onClick={() => setIsEditing(false)} 
                        variant="outline"
                        className="border-primary/20"
                      >
                        Отменить
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-xl font-bold text-foreground font-gothic">{displayName}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    
                    {profile?.bio && (
                      <div>
                        <h4 className="font-medium text-foreground font-gothic mb-1">О себе</h4>
                        <p className="text-muted-foreground">{profile.bio}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Music Section with Tabs */}
        <Card className="bg-background/60 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="font-gothic text-xl text-foreground flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Моя музыка
                </CardTitle>
                
                {/* Tabs */}
                <div className="flex bg-background/30 rounded-lg p-1">
                  <Button
                    variant={activeTab === 'playlists' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('playlists')}
                    className="text-sm"
                  >
                    Плейлисты ({playlists.length})
                  </Button>
                  <Button
                    variant={activeTab === 'library' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('library')}
                    className="text-sm"
                  >
                    <Library className="w-4 h-4 mr-1" />
                    Библиотека ({library.length})
                  </Button>
                </div>
              </div>
              
              {activeTab === 'playlists' && (
                <Button 
                  onClick={() => setIsCreatingPlaylist(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать плейлист
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {activeTab === 'playlists' ? (
              <>
                {isCreatingPlaylist && (
                  <Card className="mb-6 bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <Input
                          placeholder="Название плейлиста"
                          value={newPlaylist.name}
                          onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
                          className="bg-background/50 border-primary/20"
                        />
                        <Textarea
                          placeholder="Описание плейлиста (необязательно)"
                          value={newPlaylist.description}
                          onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
                          className="bg-background/50 border-primary/20 resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={createPlaylist}
                            disabled={!newPlaylist.name.trim()}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Создать
                          </Button>
                          <Button 
                            onClick={() => setIsCreatingPlaylist(false)}
                            variant="outline"
                            className="border-primary/20"
                          >
                            Отменить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map((playlist) => (
                    <Card key={playlist.id} className="bg-background/40 border-primary/20 hover:bg-background/60 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-foreground font-gothic truncate">
                            {playlist.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePlaylist(playlist.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {playlist.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{Array.isArray(playlist.tracks) ? playlist.tracks.length : 0} треков</span>
                          <span>{new Date(playlist.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {playlists.length === 0 && !isCreatingPlaylist && (
                    <div className="col-span-full text-center py-12">
                      <Music className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-lg text-foreground font-gothic mb-2">
                        Пока нет плейлистов
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Создайте свой первый плейлист для хранения любимой музыки
                      </p>
                      <Button 
                        onClick={() => setIsCreatingPlaylist(true)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Создать плейлист
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Library Tab */
              <div className="space-y-4">
                {library.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {library.map((track) => (
                      <Card key={track.id} className="bg-background/40 border-primary/20 hover:bg-background/60 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={track.thumbnail_url || '/placeholder.svg'}
                              alt={track.title}
                              className="w-16 h-16 rounded object-cover"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground font-gothic truncate">
                                {track.title}
                              </h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {track.artist}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span>{track.duration}</span>
                                <span>Добавлен {new Date(track.created_at).toLocaleDateString('ru-RU')}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${track.video_id}`, '_blank')}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromLibrary(track.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-8 h-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Library className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg text-foreground font-gothic mb-2">
                      Библиотека пуста
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Добавляйте треки в библиотеку с помощью кнопки + в плеере
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}