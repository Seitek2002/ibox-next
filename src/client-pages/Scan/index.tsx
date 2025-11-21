import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { vibrateClick } from 'utils/haptics';
import Header from 'src/components/Header/SupHeader';

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

const Scan: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const requestCameraPermission = useCallback(async () => {
    localStorage.setItem('cartItems', JSON.stringify([]));
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );

      if (videoDevices.length === 0) throw new Error('No camera found');

      const selectedCamera =
        videoDevices.find((device) => !device.label.includes('OBS')) ||
        videoDevices[0];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera.deviceId
            ? { exact: selectedCamera.deviceId }
            : undefined,
        },
      });

      stream.getTracks().forEach((track) => track.stop()); // Освобождаем камеру
      setError(null);
    } catch (err) {
      setError((err as Error).name);
    }
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
      if ((err as Error).name !== error) {
        setError((err as Error).name);
        requestCameraPermission();
      }
    },
    [requestCameraPermission, error]
  );

  useEffect(() => {
    requestCameraPermission();
    localStorage.setItem('cartItems', [].toString());
  }, [requestCameraPermission]);

  useEffect(() => {
    localStorage.setItem('cartItems', [].toString());
  }, []);

  return (
    <div className='relative font-inter bg-[#F1F2F3] px-[16px] pt-[12px] lg:max-w-[1140px] lg:mx-auto'>
      <Header searchText='' setSearchText={() => {}} />
      <div className='h-[89dvh] mt-[20px] flex flex-col items-center justify-center bg-white'>
        <div className='w-[80%] flex items-center justify-center md:w-[30%]'>
          {error ? (
            <div className='text-center'>
              <p className='text-red-500'>
                Дайте разрешение на использование камеры
              </p>
              <button
                onClick={() => {
                  vibrateClick();
                  window.location.reload();
                }}
                className='mt-2 bg-blue-500 text-white p-2 rounded-md'
              >
                Повторить запрос
              </button>
            </div>
          ) : (
            <div className='w-full'>
              <p className='text-center text-xl mb-3'>
                Наведите на QR код стола
              </p>
              <Scanner onScan={handleScan} onError={handleError} />
            </div>
          )}
        </div>
        <button
          className='py-[15px] px-[30px] bg-[#854C9D] text-white rounded-[12px] mt-[30px]'
          onClick={() => {
            vibrateClick();
            navigate('https://ishop.kg/admin/login/');
          }}
        >
          Вход для заведения
        </button>
      </div>
    </div>
  );
};

export default Scan;
