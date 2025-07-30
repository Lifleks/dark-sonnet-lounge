import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MessageCircle, UserMinus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  profiles: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface FriendsListProps {
  onStartChat: (friendId: string, friendName: string) => void;
}

export default function FriendsList({ onStartChat }: FriendsListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  const loadFriends = async () => {
    try {
      // Load accepted friends
      const { data: friendsData } = await supabase
        .from('friendships')
        .select('*')
        .or(`requester_id.eq.${user?.id},addressee_id.eq.${user?.id}`)
        .eq('status', 'accepted');

      if (friendsData) {
        // Get profile data for each friend
        const formattedFriends = await Promise.all(
          friendsData.map(async (friendship) => {
            const friendId = friendship.requester_id === user?.id 
              ? friendship.addressee_id 
              : friendship.requester_id;
              
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, display_name, avatar_url')
              .eq('user_id', friendId)
              .single();
              
            return {
              ...friendship,
              status: friendship.status as 'pending' | 'accepted' | 'rejected',
              profiles: profileData || { id: friendId, display_name: null, avatar_url: null }
            };
          })
        );
        setFriends(formattedFriends);
      }

      // Load pending requests
      const { data: pendingData } = await supabase
        .from('friendships')
        .select('*')
        .eq('addressee_id', user?.id)
        .eq('status', 'pending');

      if (pendingData) {
        // Get profile data for each pending request
        const formattedPending = await Promise.all(
          pendingData.map(async (request) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, display_name, avatar_url')
              .eq('user_id', request.requester_id)
              .single();
              
            return {
              ...request,
              status: request.status as 'pending' | 'accepted' | 'rejected',
              profiles: profileData || { id: request.requester_id, display_name: null, avatar_url: null }
            };
          })
        );
        setPendingRequests(formattedPending);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!searchEmail.trim()) return;

    try {
      // Find user by email
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, user_id, display_name')
        .ilike('display_name', `%${searchEmail}%`)
        .single();

      if (!profileData) {
        toast({
          title: "Пользователь не найден",
          description: "Проверьте правильность введенных данных",
          variant: "destructive"
        });
        return;
      }

      if (profileData.user_id === user?.id) {
        toast({
          title: "Ошибка",
          description: "Нельзя добавить себя в друзья",
          variant: "destructive"
        });
        return;
      }

      // Check if friendship already exists
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('id')
        .or(`and(requester_id.eq.${user?.id},addressee_id.eq.${profileData.user_id}),and(requester_id.eq.${profileData.user_id},addressee_id.eq.${user?.id})`)
        .single();

      if (existingFriendship) {
        toast({
          title: "Заявка уже существует",
          description: "Вы уже отправили заявку или уже являетесь друзьями",
          variant: "destructive"
        });
        return;
      }

      // Send friend request
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: user?.id,
          addressee_id: profileData.user_id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Заявка отправлена",
        description: `Заявка в друзья отправлена пользователю ${profileData.display_name}`,
      });
      setSearchEmail("");
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку в друзья",
        variant: "destructive"
      });
    }
  };

  const respondToRequest = async (requestId: string, response: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: response })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: response === 'accepted' ? "Заявка принята" : "Заявка отклонена",
        description: `Заявка в друзья ${response === 'accepted' ? 'принята' : 'отклонена'}`,
      });

      loadFriends();
    } catch (error) {
      console.error('Error responding to request:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось ответить на заявку",
        variant: "destructive"
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Друг удален",
        description: "Пользователь удален из списка друзей",
      });

      loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить друга",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Friend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Добавить друга
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Поиск по имени пользователя..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={sendFriendRequest} disabled={!searchEmail.trim()}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Входящие заявки ({pendingRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.profiles.avatar_url || ''} />
                      <AvatarFallback>
                        {request.profiles.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {request.profiles.display_name || 'Пользователь'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Хочет добавить вас в друзья
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => respondToRequest(request.id, 'accepted')}
                    >
                      Принять
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => respondToRequest(request.id, 'rejected')}
                    >
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle>Друзья ({friends.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              У вас пока нет друзей. Добавьте первого друга!
            </p>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={friend.profiles.avatar_url || ''} />
                      <AvatarFallback>
                        {friend.profiles.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {friend.profiles.display_name || 'Пользователь'}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        В сети
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => onStartChat(
                        friend.profiles.id, 
                        friend.profiles.display_name || 'Пользователь'
                      )}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeFriend(friend.id)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}