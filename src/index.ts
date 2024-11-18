export function calculateContrast(
  r: number,
  g: number,
  b: number
): [number, number] {
  const rLinear = r / 255;
  const gLinear = g / 255;
  const bLinear = b / 255;

  const rCorrected =
    rLinear <= 0.03928
      ? rLinear / 12.92
      : Math.pow((rLinear + 0.055) / 1.055, 2.4);
  const gCorrected =
    gLinear <= 0.03928
      ? gLinear / 12.92
      : Math.pow((gLinear + 0.055) / 1.055, 2.4);
  const bCorrected =
    bLinear <= 0.03928
      ? bLinear / 12.92
      : Math.pow((bLinear + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * rCorrected + 0.7152 * gCorrected + 0.0722 * bCorrected;

  const contrastWithBlack = (luminance + 0.05) / 0.05;
  const contrastWithWhite = 1.05 / (luminance + 0.05);

  return [
    parseFloat(contrastWithWhite.toFixed(2)),
    parseFloat(contrastWithBlack.toFixed(2)),
  ];
}
