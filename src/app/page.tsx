"use client";

import {
  ArrowRight,
  Sparkles,
  Clock,
  Package,
  Warehouse,
  Percent,
  Megaphone,
  Zap,
  Brain,
  Users,
  BarChart3,
  Link2,
  Award,
  TrendingUp,
  Target,
  Shield,
  Phone,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useState, FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

// Base brand color used across gradients and accents
const BRAND = {
  base: "#854C9D",
  baseDark: "#6f3f90",
  baseDarker: "#4a2b63",
  light100: "#F4ECF8",
  light200: "#EDE3F5",
};

const features: Array<{ icon: LucideIcon; title: string; description: string; highlight?: boolean }> = [
  {
    icon: Clock,
    title: "Продажи 24/7",
    description:
      "Ваш магазин работает круглосуточно без выходных, принимая заказы в любое время",
  },
  {
    icon: Package,
    title: "Точный товарный учёт",
    description:
      "Полный контроль над движением товаров с автоматическим обновлением остатков",
  },
  {
    icon: Warehouse,
    title: "Умное управление складом",
    description:
      "Автоматизированная система контроля остатков и уведомлений о необходимости пополнения",
  },
  {
    icon: Percent,
    title: "Скидки и бонусы",
    description:
      "Гибкая система скидок, промокодов и программа лояльности для ваших клиентов",
  },
  {
    icon: Megaphone,
    title: "Автоматизация маркетинга",
    description: "Умные рассылки, напоминания, акции и бонусная программа",
  },
  { icon: Zap, title: "Ускорение процессов", description: "Автоматическая обработка заказов, формирование документов и отчетов" },
  {
    icon: Brain,
    title: "Встроенные AI-инструменты",
    description:
      "Искусственный интеллект для улучшения фото, разнавания накладных, общения с клиентами и т.д.",
    highlight: true,
  },
  {
    icon: Users,
    title: "Запоминание покупателей",
    description:
      "Система профилей клиентов с историей покупок и персональными предпочтениями",
  },
  {
    icon: BarChart3,
    title: "Сбор данных и аналитика",
    description:
      "Подробная статистика продаж, поведения клиентов и эффективности маркетинга",
  },
  { icon: Link2, title: "Интеграции", description: "Подключение CRM, складских систем, логистики, платежных шлюзов и мессенджеров" },
  { icon: Award, title: "Укрепление бренда", description: "Полная кастомизация дизайна магазина под ваш фирменный стиль" },
];

export default function Page() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Layout-only: mock submit success
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setPhone("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Произошла ошибка. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <img src="/assets/icons/header-logo.svg" alt="iShop" className="h-8 sm:h-10" />
              <span className="text-xl sm:text-2xl font-bold" style={{ color: BRAND.base }}>
                iShop.kg
              </span>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <a
                href="#contact"
                className="hidden sm:inline-block px-4 py-2 font-medium transition-colors"
                style={{ color: BRAND.base }}
              >
                Связаться
              </a>
              <a
                href="https://ishop.kg/Exponenta"
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: BRAND.base }}
              >
                Демо
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark}, ${BRAND.baseDarker})`,
          }}
        />

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4" style={{ color: "#FDE68A" }} />
              <span className="text-white text-sm font-medium">Платформа нового поколения</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Ваш брендированный интернет-магазин за 1 день
              <span
                className="block mt-2 pb-2 bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right, #FDE68A, #F9A8D4)" }}
              >
                с iShop.kg
              </span>
            </h1>

            <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: "#E7DFF0" }}>
              Мы умеем общаться с клиентами, принимать заказы и обрабатывать, разбивать накладные и автозаполнение, следить за работой продавцов
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-white font-semibold rounded-lg transition-all hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2"
                style={{ color: BRAND.base }}
              >
                <span>Начать бесплатно</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Узнать больше
              </a>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm" style={{ color: "#D9CDE7" }}>Продажи</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">AI</div>
                <div className="text-sm" style={{ color: "#D9CDE7" }}>Инструменты</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">∞</div>
                <div className="text-sm" style={{ color: "#D9CDE7" }}>Интеграции</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Всё необходимое для успешных продаж
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              11 мощных инструментов для роста вашего бизнеса в одной платформе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group relative p-6 sm:p-8 bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    feature.highlight ? "ring-2" : "shadow-md hover:shadow-gray-100"
                  }`}
                  style={feature.highlight ? { boxShadow: `0 0 0 2px ${BRAND.base}` } : undefined}
                >
                  {feature.highlight && (
                    <div
                      className="absolute -top-3 -right-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                      style={{ backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})` }}
                    >
                      NEW
                    </div>
                  )}

                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-4 sm:mb-6 transition-all duration-300`}
                    style={{ backgroundColor: feature.highlight ? BRAND.base : `${BRAND.light100}` }}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: feature.highlight ? "#fff" : BRAND.base }} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Features (3 sections) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 sm:space-y-32">
            {/* AI */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 sm:mb-6" style={{ backgroundColor: BRAND.light100 }}>
                  <Brain className="w-4 h-4" style={{ color: BRAND.base }} />
                  <span className="text-sm font-medium" style={{ color: BRAND.baseDark }}>AI-технологии</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Встроенные AI-инструменты</h3>
                <p className="text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Используйте мощь искусственного интеллекта для улучшения визуального контента, работы с документами и общения с клиентами. ИИ помогает автоматически обрабатывать фото товаров, распознавать накладные и ускорять ответы на запросы покупателей
                </p>
                <ul className="space-y-4">
                  {[
                    "Улучшение фото товаров (автообработка, выравнивание фона, повышение качества)",
                    "Распознавание накладных и документов с автозаполнением данных",
                    "Умные ответы на вопросы клиентов в чате и мессенджерах",
                    "Автоматическая генерация текстов: описания товаров и типовые ответы",
                  ].map((txt, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: BRAND.light100 }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND.base }} />
                      </div>
                      <span className="text-gray-700">{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl transform rotate-3" style={{ backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})` }} />
                  <div className="relative rounded-3xl p-8 sm:p-12 text-white" style={{ backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})` }}>
                    <Brain className="w-16 h-16 sm:w-20 sm:h-20 mb-6 opacity-90" />
                    <div className="text-5xl sm:text-6xl font-bold mb-2">95%</div>
                    <div className="text-lg" style={{ color: "#E7DFF0" }}>точность прогнозов</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl transform -rotate-3" style={{ backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})` }} />
                  <div className="relative bg-white border-2 rounded-3xl p-8 sm:p-12" style={{ borderColor: BRAND.light200 }}>
                    <TrendingUp className="w-16 h-16 sm:w-20 sm:h-20 mb-6" style={{ color: BRAND.base }} />
                    <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">3x</div>
                    <div className="text-lg text-gray-600">рост конверсии</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 sm:mb-6" style={{ backgroundColor: BRAND.light100 }}>
                  <Target className="w-4 h-4" style={{ color: BRAND.base }} />
                  <span className="text-sm font-medium" style={{ color: BRAND.baseDark }}>Аналитика</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Сбор данных и глубокая аналитика</h3>
                <p className="text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Получайте полное представление о вашем бизнесе. Отслеживайте ключевые метрики в
                  реальном времени, анализируйте поведение клиентов и принимайте решения на основе
                  данных.
                </p>
                <ul className="space-y-4">
                  {[
                    "Дашборды с ключевыми метриками в реальном времени",
                    "Анализ пути покупателя и точек выхода",
                    "Когортный анализ и сегментация аудитории",
                    "Автоматические отчеты и экспорт данных",
                  ].map((txt, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: BRAND.light100 }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND.base }} />
                      </div>
                      <span className="text-gray-700">{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Integrations */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 sm:mb-6" style={{ backgroundColor: BRAND.light100 }}>
                  <Shield className="w-4 h-4" style={{ color: BRAND.base }} />
                  <span className="text-sm font-medium" style={{ color: BRAND.baseDark }}>Интеграции</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Полная экосистема интеграций</h3>
                <p className="text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Подключите все необходимые сервисы и инструменты. CRM-системы, складской учет,
                  логистические партнеры, платежные системы, мессенджеры и маркетинговые сервисы
                  работают вместе в единой экосистеме.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["CRM системы", "1C, Bitrix24, AmoCRM"],
                    ["Платежи", "QR платежи, Все банки КР"],
                    ["Логистика", "Яндекс GO, Glovo"],
                    ["Мессенджеры", "WhatsApp, Telegram, Instagram DM"],
                  ].map(([title, text], i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <div className="font-semibold text-gray-900 mb-1">{title}</div>
                      <div className="text-sm text-gray-600">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl transform rotate-3" style={{ backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})` }} />
                  <div className="relative rounded-3xl p-8 sm:p-12 text-white" style={{ backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark})` }}>
                    <Shield className="w-16 h-16 sm:w-20 sm:h-20 mb-6 opacity-90" />
                    <div className="text-5xl sm:text-6xl font-bold mb-2">50+</div>
                    <div className="text-lg" style={{ color: "#E7DFF0" }}>готовых интеграций</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 sm:py-24 relative overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom right, ${BRAND.base}, ${BRAND.baseDark}, ${BRAND.baseDarker})` }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Начните зарабатывать больше уже сегодня
              </h2>
              <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: "#E7DFF0" }}>
                Оставьте заявку, и наш специалист свяжется с вами для демонстрации платформы
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
              {success ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Спасибо за заявку!
                  </h3>
                  <p className="text-lg text-gray-600">Мы свяжемся с вами в ближайшее время</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                      Телефон *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none transition-colors focus:border-gray-400"
                        placeholder="+996 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    style={{ backgroundImage: `linear-gradient(to right, ${BRAND.base}, ${BRAND.baseDark})` }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Отправка...</span>
                      </>
                    ) : (
                      <span>Получить свой интернет-магазин</span>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND.base }}>
                Ishop.kg
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Платформа для создания брендированных интернет-магазинов с AI-инструментами и полной
                автоматизацией.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" style={{ color: BRAND.base }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span className="text-gray-300">г. Бишкек, Кыргызстан</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" style={{ color: BRAND.base }} />
                  <a href="tel:+996774500600" className="text-gray-300 hover:opacity-80 transition-colors">
                    +996 774 500 600
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" style={{ color: BRAND.base }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"></path><path d="M22 6l-10 7L2 6"></path></svg>
                  <a href="mailto:info@ishop.kg" className="text-gray-300 hover:opacity-80 transition-colors">
                    info@ishop.kg
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Платформа</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#features" className="hover:opacity-80 transition-colors">Возможности</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">Цены</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">Интеграции</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:opacity-80 transition-colors">О нас</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">Блог</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">Карьера</a></li>
                <li><a href="#contact" className="hover:opacity-80 transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ishop.kg. Все права защищены.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:opacity-80 transition-colors">Политика конфиденциальности</Link>
              <a href="#" className="hover:opacity-80 transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
