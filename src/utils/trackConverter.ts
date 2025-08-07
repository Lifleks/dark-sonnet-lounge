import { Track } from "@/services/musicService";

// Утилита для преобразования старых треков с videoId в новый формат
export const convertLegacyTrack = (legacyTrack: any): Track => {
  return {
    id: legacyTrack.videoId || legacyTrack.video_id || legacyTrack.id || `track_${Date.now()}`,
    title: legacyTrack.title,
    artist: legacyTrack.artist,
    thumbnail: legacyTrack.thumbnail || legacyTrack.thumbnail_url,
    duration: legacyTrack.duration,
    url: legacyTrack.url || undefined // URL будет добавлен при поиске
  };
};