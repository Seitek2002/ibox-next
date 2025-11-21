const cancel = '/assets/icons/Order/cancel.svg';
const check = '/assets/icons/Order/check.svg';
const clock = '/assets/icons/Order/clock.svg';
const guy = '/assets/icons/Order/guy.svg';
const pending = '/assets/icons/Order/pending.svg';

interface StatusMessages {
  [key: number]: {
    [key: number]: {
      icon: string;
      title: {
        text: string;
        icon: string;
      };
    };
  };
}

export const statusMessages: StatusMessages = {
  1: {
    0: {
      icon: pending,
      title: {
        text: 'orderStatus.accepted',
        icon: clock,
      },
    },
    1: {
      icon: guy,
      title: {
        text: 'orderStatus.waiting',
        icon: check,
      },
    },
    7: {
      icon: cancel,
      title: {
        text: 'orderStatus.cancelled',
        icon: '',
      },
    },
  },
  2: {
    0: {
      icon: pending,
      title: {
        text: 'orderStatus.processing',
        icon: clock,
      },
    },
    1: {
      icon: guy,
      title: {
        text: 'orderStatus.waiting',
        icon: check,
      },
    },
    7: {
      icon: cancel,
      title: {
        text: 'orderStatus.cancelled',
        icon: '',
      },
    },
  },
  3: {
    0: {
      icon: pending,
      title: {
        text: 'orderStatus.processing',
        icon: clock,
      },
    },
    1: {
      icon: guy,
      title: {
        text: 'orderStatus.delivery',
        icon: check,
      },
    },
    7: {
      icon: cancel,
      title: {
        text: 'orderStatus.cancelled',
        icon: '',
      },
    },
  },
};

// serviceMode === 1 (На месте) | 2 (На вынос) | 3 (Доставка)
// status === 0 (Ожидание) | 1 (Принят) | 7 (Отменен)
