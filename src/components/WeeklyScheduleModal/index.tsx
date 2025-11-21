import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { IWorkSchedule } from 'types/venues.types';
import { useAppSelector } from 'hooks/useAppSelector';
import { vibrateClick } from 'utils/haptics';


// Local minimal formatter similar to web-menu's formatSchedule
function formatSchedule(range: string): string {
  const trimmed = (range || '').trim();
  if (!trimmed) return 'не указан';
  if (trimmed === '00:00-00:00') return 'Круглосуточно';
  return trimmed;
}

type Props = {
  isShow: boolean;
  onClose: () => void;
  schedules?: IWorkSchedule[] | null;
  fallbackSchedule?: string;
};

const DAY_ORDER: { dow: 1 | 2 | 3 | 4 | 5 | 6 | 7; label: string }[] = [
  { dow: 1, label: 'Пн' },
  { dow: 2, label: 'Вт' },
  { dow: 3, label: 'Ср' },
  { dow: 4, label: 'Чт' },
  { dow: 5, label: 'Пт' },
  { dow: 6, label: 'Сб' },
  { dow: 7, label: 'Вс' },
];

function scheduleItemToText(s: IWorkSchedule | undefined, fallback?: string): string {
  if (!s) {
    if (fallback) return formatSchedule(fallback);
    return 'не указан';
  }
  // ishop IWorkSchedule не содержит is24h — покроем только выходной и явные интервалы
  if (s.isDayOff) return '—';
  if (s.workStart && s.workEnd) return formatSchedule(`${s.workStart}-${s.workEnd}`);
  return 'не указан';
}

const WeeklyScheduleModal: FC<Props> = ({ isShow, onClose, schedules, fallbackSchedule }) => {
  const colorTheme =
    useAppSelector((state) => state.yourFeature.venue?.colorTheme) || '#875AFF';
  const { t } = useTranslation();

  const weekly = useMemo(() => {
    const arr: { label: string; time: string }[] = [];
    const mapByDow: Record<number, IWorkSchedule> = {};
    if (Array.isArray(schedules)) {
      for (const it of schedules) {
        if (it && typeof it.dayOfWeek === 'number') {
          mapByDow[it.dayOfWeek] = it;
        }
      }
    }
    for (const d of DAY_ORDER) {
      arr.push({
        label: d.label,
        time: scheduleItemToText(mapByDow[d.dow], fallbackSchedule),
      });
    }
    return arr;
  }, [schedules, fallbackSchedule]);

  return (
    <>
      <div
        className={isShow ? 'overlay active' : 'overlay'}
        onClick={() => {
          vibrateClick();
          onClose();
        }}
      />
      <div className={isShow ? 'weekly-modal active' : 'weekly-modal'}>
        <h3 className='title'>
          {t('closed.scheduleTitle', { defaultValue: 'График работы' })}
        </h3>

        <div className='list'>
          {weekly.map((row, idx) => (
            <div className='row' key={idx}>
              <span className='day'>{row.label}</span>
              <span className='time'>{row.time.replace('-', ' - ')}</span>
            </div>
          ))}
        </div>

        <button
          style={{ backgroundColor: colorTheme }}
          className='action'
          onClick={() => {
            vibrateClick();
            onClose();
          }}
        >
          {t('closed.ok', { defaultValue: 'Ок' })}
        </button>
      </div>
    </>
  );
};

export default WeeklyScheduleModal;
