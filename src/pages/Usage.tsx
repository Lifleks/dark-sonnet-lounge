import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Usage() {
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
            Условия использования
          </h1>
          <p className="text-muted-foreground">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">1. Общие положения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Настоящие Условия использования регулируют порядок использования 
                музыкальной платформы EFTANASYA. Использование сервиса означает 
                полное согласие с данными условиями.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">2. Условия доступа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Для использования сервиса необходимо:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Достичь возраста 13 лет</li>
                <li>Иметь действующий email-адрес</li>
                <li>Согласиться с условиями использования</li>
                <li>Иметь стабильное интернет-соединение</li>
                <li>Использовать совместимое устройство</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">3. Лицензия на использование</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EFTANASYA предоставляет вам ограниченную, неисключительную, 
                непередаваемую лицензию на использование сервиса для личных, 
                некоммерческих целей.
              </p>
              <h4 className="font-semibold mt-4">Разрешенное использование:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Прослушивание музыки</li>
                <li>Создание личных плейлистов</li>
                <li>Обмен ссылками на треки</li>
                <li>Участие в сообществе</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">4. Ограничения использования</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Запрещается:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Коммерческое использование контента</li>
                <li>Скачивание музыки без разрешения</li>
                <li>Реверс-инжиниринг платформы</li>
                <li>Автоматизированный доступ (боты)</li>
                <li>Обход технических ограничений</li>
                <li>Перепродажа доступа к сервису</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">5. Качество сервиса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Мы стремимся обеспечить высокое качество сервиса, но не можем 
                гарантировать:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>100% времени бесперебойной работы</li>
                <li>Отсутствие технических сбоев</li>
                <li>Совместимость со всеми устройствами</li>
                <li>Постоянную доступность контента</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">6. Модификации сервиса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                EFTANASYA оставляет за собой право:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Изменять функциональность платформы</li>
                <li>Добавлять или удалять контент</li>
                <li>Обновлять условия использования</li>
                <li>Приостанавливать работу для обслуживания</li>
                <li>Прекращать предоставление сервиса</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">7. Прекращение использования</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Вы можете прекратить использование сервиса в любое время. 
                Мы можем заблокировать ваш аккаунт в случае нарушения условий.
              </p>
              <h4 className="font-semibold mt-4">Основания для блокировки:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Нарушение условий использования</li>
                <li>Подозрительная активность</li>
                <li>Жалобы других пользователей</li>
                <li>Попытки взлома системы</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-gothic-highlight">8. Техническая поддержка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                По вопросам использования сервиса обращайтесь в техническую поддержку:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> support@eftanasya.com</p>
                <p><strong>Время работы:</strong> Пн-Пт, 9:00-18:00 (МСК)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}