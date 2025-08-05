import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, MessageCircle, Book, Bug, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь была бы отправка на сервер
    toast({
      title: "Сообщение отправлено",
      description: "Мы свяжемся с вами в ближайшее время."
    });
    setFormData({ email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 py-12">
      <div className="max-w-6xl mx-auto px-6">
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
            Техническая поддержка
          </h1>
          <p className="text-muted-foreground">
            Мы готовы помочь вам с любыми вопросами по использованию EFTANASYA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Контактная форма */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-gothic-highlight flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Написать в поддержку
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Тема</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Кратко опишите проблему"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Сообщение</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Подробно опишите вашу проблему или вопрос"
                      rows={6}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Информация о поддержке */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-gothic-highlight">Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email поддержки</p>
                    <p className="text-sm text-muted-foreground">support@eftanasya.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Время ответа</p>
                    <p className="text-sm text-muted-foreground">Обычно в течение 24 часов</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Часы работы</p>
                    <p className="text-sm text-muted-foreground">Пн-Пт, 9:00-18:00 (МСК)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-gothic-highlight">Часто задаваемые вопросы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Как создать плейлист?</h4>
                    <p className="text-sm text-muted-foreground">
                      Перейдите в профиль и нажмите "Создать плейлист". 
                      Добавляйте треки из своей библиотеки.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Как настроить рекомендации?</h4>
                    <p className="text-sm text-muted-foreground">
                      Перейдите в "Моя волна" и выберите предпочитаемых исполнителей. 
                      Система будет подбирать музыку на основе ваших предпочтений.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Проблемы с воспроизведением?</h4>
                    <p className="text-sm text-muted-foreground">
                      Проверьте интернет-соединение и попробуйте обновить страницу. 
                      Если проблема сохраняется, напишите нам.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-gothic-highlight flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Сообщить об ошибке
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Если вы обнаружили ошибку, пожалуйста, включите в сообщение:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  <li>Описание проблемы</li>
                  <li>Шаги для воспроизведения</li>
                  <li>Ваш браузер и операционную систему</li>
                  <li>Скриншот (если возможно)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}