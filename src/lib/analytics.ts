type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

export const googleAdsConversionId =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID?.trim() ||
  "AW-18175424255";
export const googleAdsSubscribeConversionLabel =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_SUBSCRIBE_CONVERSION_LABEL?.trim() ||
  "vi8WCLaN2LAcEP_t29pD";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );

  window.gtag("event", eventName, cleanParams);
}

export function trackGoogleAdsSubscribeConversion({
  transactionId,
  value = 1,
  currency = "USD",
}: {
  transactionId?: string | null;
  value?: number;
  currency?: string;
} = {}) {
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    !googleAdsConversionId ||
    !googleAdsSubscribeConversionLabel
  ) {
    return false;
  }

  window.gtag("event", "conversion", {
    send_to: `${googleAdsConversionId}/${googleAdsSubscribeConversionLabel}`,
    value,
    currency,
    transaction_id: transactionId || undefined,
  });

  return true;
}
