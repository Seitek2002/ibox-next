import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from 'components/Header';

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { maxTouchPoints?: number };
  return /iPad|iPhone|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && ((nav.maxTouchPoints ?? 0) > 1));
};

const isSecure = (): boolean => {
  if (typeof window === 'undefined') return false;
  // iOS Safari requires https, localhost is allowed
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

const Scan: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [constraints, setConstraints] = useState<MediaTrackConstraints | undefined>({ facingMode: { ideal: 'environment' } });
  const navigate = useNavigate();

  const iosNotice = useMemo(() => {
    if (!isIOS()) return null;
    if (!isSecure()) {
      return 'Для iPhone откройте страницу по HTTPS (или с localhost). Safari блокирует камеру на незащищённых соединениях.';
    }
    return null;
  }, []);

  const handleScan = useCallback(
    (data: IDetectedBarcode[]) => {
      if (!data.length) return;
      const route = data[0].rawValue.split('/').slice(3).join('/');
      console.log(route.split('/').filter((item) => item));
      localStorage.setItem('currentUrl', route);
      navigate(`/${route}`);
    },
    [navigate]
  );

  const handleError = useCallback(
    (err: unknown) => {
      const name = (err as Error)?.name || 'CameraError';
      const message = (err as Error)?.message || '';
      // Log once
      if (name !== error) {
        setError(name);
        // Fallback strategy for iOS and general browsers:
        // 1) If Overconstrained/NotFound => try user (front) camera
        // 2) If NotAllowed => keep constraints and show CTA to enable permissions
        // 3) As last resort, remove constraints to let browser pick defaults
        if (name === 'OverconstrainedError' || name === 'NotFoundError') {
          setConstraints({ facingMode: { ideal: 'user' } });
        } else if (name === 'NotReadableError' || name === 'AbortError') {
          // transient issues, try loosening constraints
          setConstraints(undefined);
        } else if (name === 'SecurityError') {
          // likely insecure context
          setConstraints(undefined);
        } else if (message?.includes('not allowed')) {
          // keep constraints; user has to grant permissions
        } else {
          // generic fallback
          setConstraints(undefined);
        }
      }
    },
    [error]
  );

  useEffect(() => {
    // Original component was clearing cartItems on mount; preserve behavior
    // but avoid rewriting with JSON string vs [].toString inconsistency
    localStorage.setItem('cartItems', JSON.stringify([]));
  }, []);

  return (
    <>
      <Header searchText='' setSearchText={() => {}} />
      <div className='h-[89dvh] mt-[20px] flex flex-col items-center justify-center bg-white'>
        <div className='w-[80%] flex flex-col items-center justify-center md:w-[30%] gap-3'>
          {iosNotice && (
            <div className='w-full text-sm text-amber-700 bg-amber-100 border border-amber-200 p-2 rounded'>
              {iosNotice}
            </div>
          )}

          {error && (
            <div className='w-full text-center'>
              <p className='text-red-500'>Не удалось открыть камеру: {error}</p>
              <p className='text-gray-600 text-sm mt-1'>
                - Разрешите доступ к камере в настройках браузера
                <br />
                - Закройте другие приложения, использующие камеру
                <br />
                - Для iPhone используйте Safari и HTTPS
              </p>
              <button
                onClick={() => {
                  // reset error and try again with environment first
                  setError(null);
                  setConstraints({ facingMode: { ideal: 'environment' } });
                }}
                className='mt-2 bg-blue-500 text-white p-2 rounded-md'
              >
                Повторить
              </button>
            </div>
          )}

          <div className='w-full'>
            <p className='text-center text-xl mb-3'>Наведите на QR код устройства</p>
            {/* Always mount Scanner so iOS Safari can prompt permissions */}
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={constraints}
            />
          </div>
        </div>

        <a
          href='https://ibox.kg/admin/login/?next=/admin/'
          className='py-[15px] px-[30px] bg-[#875AFF] text-white rounded-[12px] mt-[30px]'
        >
          Вход для заведения
        </a>
      </div>
    </>
  );
};

export default Scan;
