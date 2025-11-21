import { FC, useEffect, useMemo, useState } from 'react';
import { X, Phone, Loader2 } from 'lucide-react';
import { vibrateClick } from 'utils/haptics';
import { useAppSelector } from 'hooks/useAppSelector';

interface PhoneModalProps {
  open: boolean;
  defaultPhone?: string;
  onClose: () => void;
  onSubmit: (phone: string) => Promise<void> | void;
}

const normalizePhoneDigits = (v: string): string => (v || '').replace(/\D/g, '');

const PhoneModal: FC<PhoneModalProps> = ({ open, defaultPhone = '+996', onClose, onSubmit }) => {
  const colorTheme = useAppSelector((s) => s.yourFeature.venue?.colorTheme) || '#854C9D';
  const [phone, setPhone] = useState<string>(defaultPhone || '+996');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setPhone(defaultPhone || '+996');
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

  const isValid = useMemo(() => {
    const digits = normalizePhoneDigits(phone);
    // Kyrgyzstan: country code 996 + 9 digits => 12 digits total
    return digits.length >= 12;
  }, [phone]);

  const handleSubmit = async () => {
    vibrateClick();
    if (!isValid) {
      setError('Номер должен содержать минимум 12 цифр');
      return;
    }
    setError('');
    try {
      setLoading(true);
      await onSubmit(phone.trim());
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
          <label htmlFor="bonus-phone" className="block text-sm font-medium text-gray-700 mb-2">
            Номер телефона (КР)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="bonus-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996 XXX XXX XXX"
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-gray-400 text-[16px]"
            />
          </div>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
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
