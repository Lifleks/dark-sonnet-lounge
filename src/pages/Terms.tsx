import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад на главную
          </Button>
          <h1 className="text-4xl font-bold font-gothic text-gothic-highlight mb-4">
            Пользовательское соглашение
          </h1>
          <p className="text-muted-foreground">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">1. Принятие условий</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Используя музыкальную платформу EFTANASYA, вы соглашаетесь с настоящими 
                условиями использования. Если вы не согласны с любым из условий, 
                пожалуйста, не используйте наш сервис.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">2. Описание сервиса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EFTANASYA - это музыкальная платформа, предоставляющая доступ к 
                темной и готической музыке. Мы предлагаем:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Прослушивание музыки</li>
                <li>Создание плейлистов</li>
                <li>Персональные рекомендации</li>
                <li>Социальные функции</li>
                <li>Музыкальное сообщество</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">3. Аккаунт пользователя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Ответственность пользователя:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Предоставление точной информации при регистрации</li>
                <li>Поддержание безопасности аккаунта</li>
                <li>Немедленное уведомление о подозрительной активности</li>
                <li>Использование сервиса в соответствии с законом</li>
                <li>Соблюдение правил сообщества</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">4. Правила поведения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Запрещается:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Загрузка вредоносного содержимого</li>
                <li>Нарушение авторских прав</li>
                <li>Спам и нежелательная реклама</li>
                <li>Оскорбления и harassment</li>
                <li>Попытки взлома или нарушения безопасности</li>
                <li>Создание фальшивых аккаунтов</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">5. Авторские права</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Мы уважаем права интеллектуальной собственности. Весь контент 
                на платформе защищен авторским правом. Пользователи могут:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Слушать музыку для личного использования</li>
                <li>Создавать плейлисты</li>
                <li>Делиться ссылками на треки</li>
              </ul>
              <p className="mt-4">
                Запрещается скачивание, распространение или коммерческое 
                использование контента без разрешения.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">6. Ограничение ответственности</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EFTANASYA предоставляет сервис "как есть". Мы не несем 
                ответственности за:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Временные перерывы в работе сервиса</li>
                <li>Потерю данных</li>
                <li>Действия третьих лиц</li>
                <li>Несовместимость с вашими устройствами</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">7. Изменения в соглашении</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Мы оставляем за собой право изменять данное соглашение. 
                Пользователи будут уведомлены о существенных изменениях 
                за 30 дней до их вступления в силу.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">8. Контакты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                По вопросам, связанным с пользовательским соглашением:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> legal@eftanasya.com</p>
                <p><strong>Адрес:</strong> Россия, Москва</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}