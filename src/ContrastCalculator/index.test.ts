import test from 'ava';

import { ContrastCalculator } from '../index';

test('contrast-theme calculator', async (t) => {
  const black = [0, 0, 0] as const;
  const white = [255, 255, 255] as const;

  const contrastBlack = ContrastCalculator.calculateContrast(...black);
  const contrastWhite = ContrastCalculator.calculateContrast(...white);

  t.deepEqual(contrastBlack, [21, 1]);
  t.deepEqual(contrastWhite, [1, 21]);
});

test('contrast-theme of image-data calculate dark theme', async (t) => {
  const black = [0, 0, 0];
  const white = [255, 255, 255];

  const size = {
    width: 2,
    height: 2,
  };

  const createImageData = (color: number[]) => {
    const data = new Uint8ClampedArray(size.height * size.width * 4);
    for (let i = 0, len = data.length; i < len; i += 4) {
      data.set(color, i);
    }
    const imageData = new ImageDataObj(data, 2, 2);
    return imageData;
  };

  const isDarkTheme = new ContrastCalculator(size).isDarkTheme(
    createImageData(black)
  );

  const isLightTheme = new ContrastCalculator(size).isDarkTheme(
    createImageData(white)
  );

  t.true(isDarkTheme);
  t.false(isLightTheme);
});

interface ImageData {
  readonly colorSpace: PredefinedColorSpace;

  readonly data: Uint8ClampedArray;

  readonly height: number;

  readonly width: number;
}

class ImageDataObj implements ImageData {
  colorSpace = {} as PredefinedColorSpace;

  constructor(
    public data: Uint8ClampedArray,
    public width: number,
    public height: number
  ) {}
}
