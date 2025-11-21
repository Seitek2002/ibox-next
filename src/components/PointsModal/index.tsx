import { FC, useEffect, useState } from 'react';

import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';


type Props = {
  isShow: boolean;
  max: number;
  initial?: number;
  onCancel: () => void;
  onConfirm: (value: number) => void;
  onConfirmOtp: (code: string) => void;
  skipOtp?: boolean;
};

const PointsModal: FC<Props> = ({
  isShow,
  max,
  initial = 0,
  onCancel,
  onConfirm,
  onConfirmOtp,
  skipOtp,
}) => {
  const colorTheme = useAppSelector((s) => s.yourFeature.venue?.colorTheme);
  const [value, setValue] = useState<number>(initial);
  const [step, setStep] = useState<'points' | 'otp'>('points');
  const [otp, setOtp] = useState<string>('');

  useEffect(() => {
    if (isShow) {
      setValue(initial);
      setStep('points');
      setOtp('');
    }
  }, [isShow, initial]);

  const handlePointsOk = () => {
    const v = Number.isFinite(value) ? value : 0;
    const clamped = Math.max(0, Math.min(Math.floor(v), Math.floor(max)));
    onConfirm(clamped);
    if (skipOtp) {
      onConfirmOtp('');
      return;
    }
    setStep('otp');
  };

  const handleOtpOk = () => {
    onConfirmOtp((otp || '').trim());
  };

  return (
    <>
      <div
        className={isShow ? 'overlay active' : 'overlay'}
        onClick={() => {
          vibrateClick();
          onCancel();
        }}
      />
      <div className={isShow ? 'points-modal active' : 'points-modal'}>
        <h3 className='title'>Сколько баллов хотите потратить?</h3>
        <div className='content'>
          {step === 'points' ? (
            <>
              <input
                type='number'
                min={0}
                max={Math.floor(max)}
                step={1}
                value={value}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  const v = Number.isFinite(num) ? num : 0;
                  const clamped = Math.max(
                    0,
                    Math.min(Math.floor(v), Math.floor(max))
                  );
                  setValue(clamped);
                }}
              />
              <div className='hint'>Доступно: {Math.floor(max)} б.</div>
            </>
          ) : (
            <>
              <input
                type='text'
                inputMode='numeric'
                placeholder='Код из SMS'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className='hint'>На ваш номер отправлен одноразовый код подтверждения.</div>
            </>
          )}
        </div>
        <div className='actions'>
          <button
            className='cancel'
            onClick={() => {
              vibrateClick();
              onCancel();
            }}
          >
            Отмена
          </button>
          <button
            className='ok'
            style={{ backgroundColor: colorTheme }}
            onClick={() => {
              vibrateClick();
              (step === 'points' ? handlePointsOk : handleOtpOk)();
            }}
          >
            Ок
          </button>
        </div>
      </div>
    </>
  );
};

export default PointsModal;
