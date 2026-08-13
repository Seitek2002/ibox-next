import { FC, useEffect, useMemo, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import PhoneField from 'components/PhoneField';
import { vibrateClick } from 'utils/haptics';
import { formatPhone, isPhoneComplete, toApiPhone } from 'utils/phone';
import { useAppSelector } from 'hooks/useAppSelector';

interface PhoneModalProps {
  open: boolean;
  defaultPhone?: string;
  onClose: () => void;
  onSubmit: (phone: string) => Promise<void> | void;
}

const PhoneModal: FC<PhoneModalProps> = ({ open, defaultPhone = '+996', onClose, onSubmit }) => {
  const colorTheme = useAppSelector((s) => s.yourFeature.venue?.colorTheme) || '#854C9D';
  const [phone, setPhone] = useState<string>(() => formatPhone(defaultPhone));
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setPhone(formatPhone(defaultPhone));
      setError('');
      setLoading(false);
      try {
        document.body.style.overflow = 'hidden';
      } catch {}
    } else {
      try {
        document.body.style.overflow = '';
      } catch {}
    }
  }, [open, defaultPhone]);

  const isValid = useMemo(() => isPhoneComplete(phone), [phone]);

  const handleSubmit = async () => {
    vibrateClick();
    if (!isValid) {
      setError('Введите 9 цифр номера после +996');
      return;
    }
    setError('');
    try {
      setLoading(true);
      await onSubmit(toApiPhone(phone));
      onClose();
    } catch {
      setError('Не удалось сохранить номер. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity z-[100] ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
          vibrateClick();
          onClose();
        }}
        aria-hidden
      />

      {/* Modal card */}
      <div
        className={`fixed left-1/2 top-1/2 z-[101] w-[92%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl transition-all ${
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-modal-title"
      >
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 id="phone-modal-title" className="text-lg sm:text-xl font-semibold text-gray-900">
            Баллы
          </h3>
          <button
            aria-label="Закрыть"
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-gray-700 mb-4">
            Для использования баллов нам нужен ваш номер телефона
          </p>
          <PhoneField
            id="bonus-phone"
            label="Номер телефона (КР)"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (error && isPhoneComplete(v)) setError('');
            }}
            onEnter={handleSubmit}
            error={error}
            colorTheme={colorTheme}
          />
        </div>

        <div className="p-5 sm:p-6 pt-0 flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => {
              vibrateClick();
              onClose();
            }}
          >
            Отменить
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colorTheme }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Сохранение</span>
            ) : (
              'Добавить'
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PhoneModal;
