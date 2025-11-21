import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { statusMessages } from 'client-pages/Order/enums';
import { useGetOrdersQuery } from 'api/Orders.api';
import { IOrder } from 'types/orders.types';
import { vibrateClick } from 'utils/haptics';
import { isOutsideWorkTime } from 'utils/timeUtils';
import { wsOrdersUrl } from 'utils/endpoints';

import offer1 from 'assets/images/OrderStatus/Offer-1.png';
import offer2 from 'assets/images/OrderStatus/Offer-2.png';
import offer3 from 'assets/images/OrderStatus/schedule-status.png';



const Hero = () => {
  const user = JSON.parse(localStorage.getItem('users') ?? '{}');
  const venue = JSON.parse(localStorage.getItem('venue') ?? '{}');
  const navigate = useNavigate();


  const { data: fetchedOrders } = useGetOrdersQuery({
    phone: `${user.phoneNumber}`,
    organizationSlug: venue.slug,
  });

  const [orders, setOrders] = useState<IOrder[] | undefined>([]);

  const getStatusData = (serviceMode: number, status: number) => {
    if (!statusMessages[serviceMode]) {
      return {
        text: 'Ожидайте, заказ обрабатывается.',
        color: 'text-orange-500',
      };
    }

    const statusObj =
      statusMessages[serviceMode][status] || statusMessages[serviceMode][0];

    let colorClass = 'text-orange-500';
    if (status === 1) {
      colorClass = 'text-green-500';
    } else if (status === 7) {
      colorClass = 'text-red-500';
    }

    return {
      text: statusObj.title.text,
      color: colorClass,
    };
  };

  useEffect(() => {
    if (fetchedOrders) {
      setOrders(fetchedOrders);
    }
  }, [fetchedOrders]);

  const ws = new WebSocket(wsOrdersUrl({ phone: String(user.phoneNumber || '') }));

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data: { order_id: number; status: number; status_text: string } =
      JSON.parse(event.data);
    setOrders((prevOrders) =>
      prevOrders?.map((order) =>
        order.id === data.order_id
          ? { ...order, status: data.status, statusText: data.status_text }
          : order
      )
    );
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  const handleOrderClick = (orderId: number | undefined) => {
    vibrateClick();
    navigate(`/orders/${orderId}`);
  };

  return (
    !!(orders?.length) && (<section className='hero'>
      <Swiper
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        className='hero-swiper'
      >
        {isOutsideWorkTime(venue.schedule || '00:00-00:00') && (
          <SwiperSlide>
            <div
              className='hero__item'
              style={{
                backgroundImage: `url(${offer3})`,
              }}
            >
              <p
                className={`text-base md:text-[32px] max-w-[60%] font-bold text-[#a9a9a9]`}
              >
                Сейчас нерабочее время
              </p>
            </div>
          </SwiperSlide>
        )}

        {orders?.map((order) => {
          const { color } = getStatusData(order.serviceMode, order.status);

          return (
            <SwiperSlide key={`order-${order.id}`}>
              <div
                onClick={() => handleOrderClick(order.id)}
                className='hero__item'
                style={{
                  backgroundImage: `url(${
                    order.status === 0 ? offer1 : offer2
                  })`,
                }}
              >
                <span>Заказ №{order.id}</span>
                <p
                  className={`text-base md:text-[32px] max-w-[60%] font-bold ${color}`}
                >
                  {order.statusText}
                </p>
              </div>
            </SwiperSlide>
          );
        })}

      </Swiper>
    </section>)
  );
};

export default Hero;
