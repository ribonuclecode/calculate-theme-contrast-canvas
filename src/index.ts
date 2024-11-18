type Size = {
  width: number;
  height: number;
};

type Options = {
  m?: number;
};

export class ContrastCalculator {
  private _size: Size;

  public constructor({ width, height }: Size) {
    this._size = { width, height };
  }

  public isDarkTheme(imageData: ImageData, options?: Options): boolean {
    const { width, height } = this._size;
    const { m = 6 } = options ?? {};

    const data = imageData.data;
    let brigtness = 0,
      darkness = 0;

    for (let i = 0, factor = 4 ** m, len = data.length; i < len; i += factor) {
      const [r, g, b] = data.slice(i, i + 3);
      const contrast = calculateContrast(r, g, b);
      brigtness += contrast[0];
      darkness += contrast[1];
    }

    const f_n = 1 / (width * height);
    const dl_diff = brigtness * f_n;
    const dw_diff = darkness * f_n;

    const isDark = dl_diff > dw_diff;

    return isDark;
  }

  public static calculateContrast(r: number, g: number, b: number) {
    return calculateContrast(r, g, b);
  }
}

type ContrastWhite = number & { __contrast_white: never };
type ContrastBlack = number & { __contrast_black: never };

function calculateContrast(
  r: number,
  g: number,
  b: number
): [ContrastWhite, ContrastBlack] {
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
    parseFloat(contrastWithWhite.toFixed(2)) as ContrastWhite,
    parseFloat(contrastWithBlack.toFixed(2)) as ContrastBlack,
  ];
}
