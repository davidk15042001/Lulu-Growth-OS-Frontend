import QRCode from 'qrcode';

/** Render an Airwallex payment payload as a crisp, scanner-safe QR image. */
export async function createPaymentQrDataUrl(payload: string) {
  const svg = await QRCode.toString(payload, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 4,
    color: { dark: '#111827', light: '#ffffff' },
  });
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
