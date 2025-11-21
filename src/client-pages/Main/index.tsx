import { Link } from 'react-router-dom';

const logoIcon = '/assets/icons/header-logo.svg';

import { Clock, Mail, MapPin, Phone, Plus, Star } from 'lucide-react';

const Main = () => {
  return (
    <div className='bg-white min-h-screen'>
      <header className='bg-white shadow-sm border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 flex gap-[10px]'>
                <img className='h-8 w-8' src={logoIcon} alt='iMenu Logo' />
                <h1 className='text-2xl font-bold text-[#854C9D]'>ishop.kg</h1>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='hidden lg:flex items-center space-x-2 text-gray-600'>
                <Phone className='h-5 w-5 text-[#854C9D]' />
                <a
                  href='tel:+996706204501'
                  className='text-sm hover:text-[#854C9D] transition-colors'
                >
                  +996 706 204 501
                </a>
              </div>
              <Link
                className='bg-[#854C9D] hover:bg-[#6f3f90] text-white py-2 px-4 rounded'
                to={'/Exponenta'}
              >
                Демо
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className='bg-gradient-to-br from-[#F4ECF8] to-[#EDE3F5] py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
              Найдите лучшие
              <span className='text-[#854C9D] block'>заведения Кыргызстана</span>
            </h1>
            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
              Откройте для себя рестораны, кафе и другие заведения с подробными
              меню, отзывами и актуальной информацией
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'>
              <div className='flex items-center space-x-2 text-gray-600'>
                <MapPin className='h-5 w-5 text-[#854C9D]' />
                <span>По всему Кыргызстану</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-600'>
                <Clock className='h-5 w-5 text-[#854C9D]' />
                <span>Актуальные часы работы</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-600'>
                <Star className='h-5 w-5 text-[#854C9D]' />
                <span>Честные отзывы</span>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='text-3xl font-bold text-[#854C9D] mb-2'>500+</div>
                <div className='text-gray-600'>Заведений</div>
              </div>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='text-3xl font-bold text-[#854C9D] mb-2'>10K+</div>
                <div className='text-gray-600'>Отзывов</div>
              </div>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='text-3xl font-bold text-[#854C9D] mb-2'>50K+</div>
                <div className='text-gray-600'>Пользователей</div>
              </div>
            </div>
            <div className='text-center mt-10'>
              <a
                href='https://wa.me/996706204501'
                target='_blank'
                rel='noopener'
                className='inline-block mt-4 bg-[#854C9D] text-white px-8 py-3 rounded-lg hover:bg-[#6f3f90] transition-colors font-medium text-lg'
              >
                Добавить заведение бесплатно
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id='add-business-section' className='py-16 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-gradient-to-r from-[#F4ECF8] to-[#EDE3F5] rounded-2xl'>
            <div
              className='w-full px-8 py-6 flex items-center hover:bg-[#F3EAF9] transition-colors'
              style={{ justifyContent: 'flex-start' }}
            >
              <div className='flex items-center space-x-4'>
                <div className='bg-[#854C9D] p-3 rounded-full flex items-center justify-center'>
                  <a
                    href='https://wa.me/996706204501'
                    target='_blank'
                    rel='noopener'
                  >
                    <Plus className='h-6 w-6 text-white' />
                  </a>
                </div>
                <div className='text-left'>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    Добавить свое заведение
                  </h3>
                </div>
              </div>
            </div>
            <div id='add-business-content' className='opacity-100'>
              <div className='px-8 pb-8'>
                <div className='border-t border-gray-200 pt-8'>
                  <div className='mb-12'>
                    <h4 className='text-2xl font-bold text-center text-gray-900 mb-8'>
                      Решение
                    </h4>
                    <div className='overflow-x-auto'>
                      <table className='min-w-full bg-white rounded-xl shadow text-left'>
                        <thead>
                          <tr>
                            <th className='py-3 px-2 text-base font-semibold text-gray-700 border-b'>
                              Боль
                            </th>
                            <th className='py-3 px-2 text-base font-semibold text-gray-700 border-b'>
                              Как решаем
                            </th>
                            <th className='py-3 px-2 text-base font-semibold text-gray-700 border-b'>
                              Эффект за 1 год
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='bg-gray-50'>
                            <td className='py-2 px-2 border-b'>
                              Долгое ожидание
                            </td>
                            <td className='py-2 px-2 border-b'>
                              QR-меню «на стол»
                            </td>
                            <td className='py-2 px-2 border-b text-[#854C9D] font-semibold'>
                              +40%{' '}
                              <span className='font-normal text-gray-700'>
                                к скорости обслуживания стола
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 px-2 border-b'>
                              Нет{' '}
                              <span className='underline text-[#854C9D]'>
                                предзаказа
                              </span>
                            </td>
                            <td className='py-2 px-2 border-b'>
                              QR-меню «на вынос»
                            </td>
                            <td className='py-2 px-2 border-b text-[#854C9D] font-semibold'>
                              +25%{' '}
                              <span className='font-normal text-gray-700'>
                                заказов «to-go»
                              </span>
                            </td>
                          </tr>
                          <tr className='bg-gray-50'>
                            <td className='py-2 px-2 border-b'>
                              Комиссия платформ до 25%
                            </td>
                            <td className='py-2 px-2 border-b'>
                              Комиссия 1,5%
                            </td>
                            <td className='py-2 px-2 border-b text-[#854C9D] font-semibold'>
                              до 18%{' '}
                              <span className='font-normal text-gray-700'>
                                экономии на обороте
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 px-2 border-b'>
                              Сложная оплата
                            </td>
                            <td className='py-2 px-2 border-b'>
                              QR-эквайринг всех банков КР
                            </td>
                            <td className='py-2 px-2 border-b text-[#854C9D] font-semibold'>
                              +12%{' '}
                              <span className='font-normal text-gray-700'>
                                среднего чека
                              </span>
                            </td>
                          </tr>
                          <tr className='bg-gray-50'>
                            <td className='py-2 px-2 border-b'>
                              Потерянные клиенты
                            </td>
                            <td className='py-2 px-2 border-b'>
                              Сбор клиентов по номеру телефона
                            </td>
                            <td className='py-2 px-2 border-b text-[#854C9D] font-semibold'>
                              Рост{' '}
                              <span className='font-normal text-gray-700'>
                                лояльной базы
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className='py-2 px-2 border-b'>
                              Отсутствие коммуникации
                            </td>
                            <td className='py-2 px-2 border-b'>
                              Уведомления в Telegram
                            </td>
                            <td className='py-2 px-2 border-b text-[#854C9D] font-semibold'>
                              Рост{' '}
                              <span className='font-normal text-gray-700'>
                                повторных продаж
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h4 className='text-2xl font-bold text-center text-gray-900 mb-8'>
                      Функции iMenu
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                      <div>
                        <div className='flex items-center mb-2'>
                          <span className='flex items-center justify-center bg-pink-600 text-white font-bold rounded-full w-10 h-10 mr-3 text-lg'>
                            1
                          </span>
                          <span className='text-lg font-semibold'>
                            QR-меню «на вынос»
                          </span>
                        </div>
                        <ul className='list-disc list-inside text-gray-700 mb-6 ml-12'>
                          <li>QR на стойке/витрине</li>
                          <li>Заказ без очереди, оплачивает сразу онлайн</li>
                          <li>Снижение «очереди» у кассы в часы пик</li>
                        </ul>
                        <div className='flex items-center mb-2'>
                          <span className='flex items-center justify-center bg-pink-600 text-white font-bold rounded-full w-10 h-10 mr-3 text-lg'>
                            2
                          </span>
                          <span className='text-lg font-semibold'>
                            Онлайн-меню по ссылке
                          </span>
                        </div>
                        <ul className='list-disc list-inside text-gray-700 mb-6 ml-12'>
                          <li>
                            Размещается в{' '}
                            <span className='underline text-blue-600'>
                              Instagram
                            </span>
                            , сайте, мессенджерах.
                          </li>
                          <li>Доставка или самовывоз в 1 клик</li>
                          <li>
                            Заказ «на диване» вместо{' '}
                            <span className='underline text-[#854C9D]'>
                              Glovных
                            </span>{' '}
                            конкурентов.
                          </li>
                        </ul>
                        <div className='flex items-center mb-2'>
                          <span className='flex items-center justify-center bg-pink-600 text-white font-bold rounded-full w-10 h-10 mr-3 text-lg'>
                            3
                          </span>
                          <span className='text-lg font-semibold'>
                            Киоск самообслуживания
                          </span>
                        </div>
                        <ul className='list-disc list-inside text-gray-700 mb-6 ml-12'>
                          <li>Сенсорный терминал в зале как в KFC.</li>
                          <li>
                            Клиенты формируют заказ сами, касса не создаёт
                            пробку
                          </li>
                          <li>
                            Средний чек{' '}
                            <span className='text-green-600 font-bold'>↑</span>{' '}
                            за счёт автоматических рекомендаций
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className='flex items-center mb-2'>
                          <span className='flex items-center justify-center bg-pink-600 text-white font-bold rounded-full w-10 h-10 mr-3 text-lg'>
                            4
                          </span>
                          <span className='text-lg font-semibold'>
                            ИИ-оператор
                          </span>
                        </div>
                        <ul className='list-disc list-inside text-gray-700 mb-6 ml-12'>
                          <li>24/7 WhatsApp, Telegram, Instagram</li>
                          <li>Принимает заказ и оплату</li>
                          <li>Заказ сразу уходит на кухню и печатает чек</li>
                          <li>
                            Интеграция с кассовым ПО (
                            <span className='underline text-blue-600'>
                              Poster и др
                            </span>
                            )
                          </li>
                          <li>QR + NFC наклейки опционально</li>
                        </ul>
                        <div className='flex items-center mb-2'>
                          <span className='flex items-center justify-center bg-pink-600 text-white font-bold rounded-full w-10 h-10 mr-3 text-lg'>
                            5
                          </span>
                          <span className='text-lg font-semibold'>
                            Администраторская панель
                          </span>
                        </div>
                        <ul className='list-disc list-inside text-gray-700 mb-6 ml-12'>
                          <li>Настраиваемая программа лояльности</li>
                          <li>Учет всех заказов и отчетность</li>
                          <li>Статусы заказов в реальном времени</li>
                          <li>Управление меню, ценами, акциями</li>
                          <li>
                            CRM: база гостей, отчёты по продажам,{' '}
                            <span className='underline text-blue-600'>
                              ретаргетинг
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-center justify-center pb-[20px]'>
                <a
                  href='https://wa.me/996706204501'
                  target='_blank'
                  rel='noopener'
                  className='inline-block mt-4 bg-[#854C9D] text-white px-8 py-3 rounded-lg hover:bg-[#6f3f90] transition-colors font-medium text-lg'
                >
                  Добавить заведение бесплатно
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-16 bg-gradient-to-br from-[#EDE3F5] to-[#F4ECF8]'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-10'>
            Преимущества iMenu
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white rounded-xl shadow-sm text-center'>
              <thead>
                <tr>
                  <th className='py-4 px-2 text-lg font-semibold text-gray-700 border-b'>
                    Параметр
                  </th>
              <th className='py-4 px-2 text-lg font-semibold text-[#854C9D] border-b'>
                iMenu
              </th>
                  <th className='py-4 px-2 text-lg font-semibold text-gray-500 border-b'>
                    Конкуренты
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='py-3 px-2 border-b'>Стоимость подключения</td>
                  <td className='py-3 px-2 border-b font-bold text-green-600'>
                    0 сом
                  </td>
                  <td className='py-3 px-2 border-b text-gray-700'>
                    10 000+ сом
                  </td>
                </tr>
                <tr>
                  <td className='py-3 px-2 border-b'>Комиссия</td>
                  <td className='py-3 px-2 border-b font-bold text-green-600'>
                    1,5%
                  </td>
                  <td className='py-3 px-2 border-b text-gray-700'>20–30%</td>
                </tr>
                <tr>
                  <td className='py-3 px-2 border-b'>Срок запуска</td>
                  <td className='py-3 px-2 border-b font-bold text-green-600'>
                    3 дня
                  </td>
                  <td className='py-3 px-2 border-b text-gray-700'>
                    7–10 дней
                  </td>
                </tr>
                <tr>
                  <td className='py-3 px-2 border-b'>ИИ чат-оператор</td>
                  <td className='py-3 px-2 border-b font-bold text-green-600'>
                    Да
                  </td>
                  <td className='py-3 px-2 border-b text-gray-700'>—</td>
                </tr>
                <tr>
                  <td className='py-3 px-2 border-b'>Уведомления Telegram</td>
                  <td className='py-3 px-2 border-b font-bold text-green-600'>
                    Да
                  </td>
                  <td className='py-3 px-2 border-b text-gray-700'>—</td>
                </tr>
                <tr>
                  <td className='py-3 px-2 border-b'>
                    Владение клиентской базой
                  </td>
                  <td className='py-3 px-2 border-b font-bold text-green-600'>
                    Остается у Вас
                  </td>
                  <td className='py-3 px-2 border-b text-gray-700'>
                    Принадлежит агрегатору
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className='bg-gray-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='col-span-1 md:col-span-2'>
              <h3 className='text-2xl font-bold text-[#854C9D] mb-4'>Ishop.kg</h3>
              <p className='text-gray-300 mb-6 max-w-md'>
                Ваш надежный гид по лучшим заведениям Кыргызстана. Находите
                рестораны, кафе и другие места с подробными меню и честными
                отзывами.
              </p>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <MapPin className='h-4 w-4 text-[#854C9D]' />
                  <span className='text-gray-300'>г. Бишкек, Кыргызстан</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Phone className='h-4 w-4 text-[#854C9D]' />
                  <a
                    href='tel:+996706204501'
                    className='text-gray-300 hover:text-[#854C9D] transition-colors'
                  >
                    +996 706 204 501
                  </a>
                </div>
                <div className='flex items-center space-x-2'>
                  <Mail className='h-4 w-4 text-[#854C9D]' />
                  <a
                    href='mailto:adamtechkg@gmail.com'
                    className='text-gray-300 hover:text-[#854C9D] transition-colors'
                  >
                    adamtechkg@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Категории</h4>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#'
                    className='text-gray-300 hover:text-[#854C9D] transition-colors'
                  >
                    Рестораны
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-300 hover:text-[#854C9D] transition-colors'
                  >
                    Кафе
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-300 hover:text-[#854C9D] transition-colors'
                  >
                    Фастфуд
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-300 hover:text-[#854C9D] transition-colors'
                  >
                    Кофейни
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-300 hover:text-[#854C9D] transition-colors'
                  >
                    Бары
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center'>
            <div className='text-gray-400 text-sm mb-4 md:mb-0'>
              © 2024 ishop.kg. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Main;
