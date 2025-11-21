import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { vibrateClick } from 'utils/haptics';

import notFoundImg from 'assets/images/not-found-products.png';


const NotFound: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notFoundSrc =
    typeof notFoundImg === 'string'
      ? notFoundImg
      : (notFoundImg as unknown as { src?: string })?.src || '/assets/images/not-found-products.png';

  return (
    <section className='not-found'>
      <div className='not-found__card'>
        <div className='not-found__image'>
          <img src={notFoundSrc} alt='404' />
        </div>
        <h1 className='not-found__title'>404</h1>
        <p className='not-found__subtitle'>Страница не найдена</p>
        <p className='not-found__desc'>
          Запрошенная страница не существует или недоступна. Проверьте ссылку или вернитесь на главную страницу.
        </p>
        <button
          type='button'
          className='not-found__button'
          onClick={() => {
            vibrateClick();
            navigate('/');
          }}
        >
          {t('main') || 'На главную'}
        </button>
      </div>
    </section>
  );
};

export default NotFound;
