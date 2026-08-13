import { FC } from 'react';
import Image from 'next/image';

interface IProps {
  logo?: string | null;
  name?: string;
  colorTheme?: string;
  size?: number;
}

/**
 * Круглый логотип заведения. Картинка заполняет круг целиком (раньше высота
 * тянулась до 44px, а ширина оставалась 32px — логотип уезжал влево и обрезался),
 * а если логотипа нет — показываем первую букву названия вместо битой картинки.
 */
const VenueLogo: FC<IProps> = ({ logo, name, colorTheme, size = 44 }) => {
  const src = typeof logo === 'string' && logo.trim() ? logo.trim() : null;
  const initial = (name ?? '').trim().charAt(0).toUpperCase();

  return (
    <div className='logo' style={{ width: size, height: size }}>
      {src ? (
        <Image
          src={src}
          alt={name ?? ''}
          width={size}
          height={size}
          unoptimized
        />
      ) : (
        <span
          className='logo__initial'
          style={{ backgroundColor: colorTheme || '#C7C9CC' }}
        >
          {initial}
        </span>
      )}
    </div>
  );
};

export default VenueLogo;
