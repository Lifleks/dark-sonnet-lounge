export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail?: string;
  duration?: string;
  url?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  url?: string;
}

class MusicService {
  private static instance: MusicService;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentTrack: Track | null = null;
  
  // Список открытых источников музыки для поиска
  private musicSources = [
    'https://archive.org/advancedsearch.php',
    'https://freemusicarchive.org/search',
    'https://soundcloud.com/search',
    'https://bandcamp.com/search'
  ];

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  // Поиск музыки по артисту и названию
  async searchMusic(query: string): Promise<SearchResult[]> {
    try {
      // Имитация поиска в открытых источниках
      const results = await this.simulateSearch(query);
      return results;
    } catch (error) {
      console.error('Error searching music:', error);
      return [];
    }
  }

  // Симуляция поиска (в реальном приложении здесь будет интеграция с API)
  private async simulateSearch(query: string): Promise<SearchResult[]> {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Фиктивные результаты для демонстрации
    const mockResults: SearchResult[] = [
      {
        id: `search_${Date.now()}_1`,
        title: `${query} - Remix Version`,
        artist: 'Unknown Artist',
        thumbnail: 'https://via.placeholder.com/120x120?text=Music',
        duration: '3:45',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Демо аудио
      },
      {
        id: `search_${Date.now()}_2`,
        title: `${query} - Live Version`,
        artist: 'Live Performance',
        thumbnail: 'https://via.placeholder.com/120x120?text=Live',
        duration: '4:12',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      },
      {
        id: `search_${Date.now()}_3`,
        title: `${query} - Acoustic`,
        artist: 'Acoustic Cover',
        thumbnail: 'https://via.placeholder.com/120x120?text=Acoustic',
        duration: '3:28',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      }
    ];

    return mockResults;
  }

  // Проигрывание трека
  async playTrack(track: Track): Promise<void> {
    try {
      // Остановить текущий трек если играет
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      // Создать новый аудио элемент
      if (track.url) {
        this.currentAudio = new Audio(track.url);
        this.currentTrack = track;
        
        // Настроить обработчики событий
        this.setupAudioEventListeners();
        
        // Начать воспроизведение
        await this.currentAudio.play();
        this.isPlaying = true;
      } else {
        throw new Error('Track URL not available');
      }
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  // Пауза/воспроизведение
  togglePlayback(): boolean {
    if (!this.currentAudio) return false;

    if (this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
    } else {
      this.currentAudio.play();
      this.isPlaying = true;
    }

    return this.isPlaying;
  }

  // Остановить воспроизведение
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  // Установить громкость (0-100)
  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume / 100));
    }
  }

  // Получить текущее время
  getCurrentTime(): number {
    return this.currentAudio?.currentTime || 0;
  }

  // Получить общую длительность
  getDuration(): number {
    return this.currentAudio?.duration || 0;
  }

  // Установить позицию воспроизведения
  setCurrentTime(time: number): void {
    if (this.currentAudio) {
      this.currentAudio.currentTime = time;
    }
  }

  // Получить текущий трек
  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  // Проверить статус воспроизведения
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Настроить обработчики событий аудио
  private setupAudioEventListeners(): void {
    if (!this.currentAudio) return;

    this.currentAudio.addEventListener('ended', () => {
      this.isPlaying = false;
      // Можно добавить логику для следующего трека
    });

    this.currentAudio.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    this.currentAudio.addEventListener('play', () => {
      this.isPlaying = true;
    });

    this.currentAudio.addEventListener('error', (error) => {
      console.error('Audio playback error:', error);
      this.isPlaying = false;
    });
  }

  // Очистить ресурсы
  cleanup(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.currentTrack = null;
  }
}

export const musicService = MusicService.getInstance();