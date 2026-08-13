import { useEffect, useState } from 'react';

import productPlaceholder from '@/assets/images/product-placeholder.svg';

export const PRODUCT_PLACEHOLDER = productPlaceholder as unknown as string;

const safeSrc = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;

/**
 * Отдаёт готовые пропсы для next/image по фото товара: если фото нет или оно
 * не загрузилось, подставляется заглушка (иначе на месте картинки навсегда
 * оставался пульсирующий скелетон).
 *
 * Источники перечисляются по приоритету: useProductImage(small, photo, large).
 */
export function useProductImage(...sources: (string | null | undefined)[]) {
  const initialSrc =
    sources.map(safeSrc).find(Boolean) ?? PRODUCT_PLACEHOLDER;

  const [src, setSrc] = useState(initialSrc);
  const [isLoaded, setIsLoaded] = useState(initialSrc === PRODUCT_PLACEHOLDER);

  useEffect(() => {
    setSrc(initialSrc);
    setIsLoaded(initialSrc === PRODUCT_PLACEHOLDER);
  }, [initialSrc]);

  return {
    isLoaded,
    imageProps: {
      src,
      // Внешние картинки не прогоняем через оптимизатор Next.
      unoptimized: /^https?:\/\//.test(String(src)),
      onLoad: () => setIsLoaded(true),
      onError: () => {
        if (src !== PRODUCT_PLACEHOLDER) setSrc(PRODUCT_PLACEHOLDER);
        setIsLoaded(true);
      },
    },
  };
}
