import test from 'ava';

import { calculateContrast } from './index';

test('contrast-theme', async (t) => {
  const black = [0, 0, 0] as const;
  const white = [255, 255, 255] as const;

  const contrastBlack = calculateContrast(...black);
  const contrastWhite = calculateContrast(...white);

  t.deepEqual(contrastBlack, [21, 1]);
  t.deepEqual(contrastWhite, [1, 21]);
});
