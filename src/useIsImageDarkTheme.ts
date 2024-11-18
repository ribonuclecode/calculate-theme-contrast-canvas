import { useCallback, useEffect, useRef, useState } from 'react';

import { ContrastCalculator } from './ContrastCalculator';

type Return = {
  imageData: ImageData;
  width: number;
  height: number;
};

export function useIsImageDarkTheme() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const calculateConstrast = useRef<(() => void) | null>(null);
  const [isOnLoadCalled, setIsOnLoadCalled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const setOnLoadImage = useCallback((onLoadImage: () => Return) => {
    calculateConstrast.current = async () => {
      const { width, height, imageData } = onLoadImage();
      const constrastCalculator = new ContrastCalculator({ width, height });
      const isDark = constrastCalculator.isDarkTheme(imageData);
      setIsDark(isDark);
    };
    setIsOnLoadCalled((prev) => !prev);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && calculateConstrast.current) {
          calculateConstrast.current();
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [isOnLoadCalled]);

  return { imageRef, setOnLoadImage, isDark };
}
