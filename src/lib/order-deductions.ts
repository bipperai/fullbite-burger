export type DeductionConfig = {
  /** KDV oranı; fiyatlar KDV dahil kabul edilir (%10 → 10). */
  vatRate: number;
  /** iyzico komisyon oranı, brüt tutar üzerinden (%2,99 → 2.99). */
  iyzicoCommissionRate: number;
  /** iyzico sabit işlem ücreti (₺), ödenen sipariş başına. */
  iyzicoFixedFee: number;
  /** Ürün maliyeti oranı, brüt ciro üzerinden (%40 → 40). */
  costRate: number;
};

export type RevenueBreakdown = {
  gross: number;
  vat: number;
  iyzicoCommission: number;
  productCost: number;
  net: number;
  paidCount: number;
};

export const DEFAULT_DEDUCTION_CONFIG: DeductionConfig = {
  vatRate: 10,
  iyzicoCommissionRate: 2.99,
  iyzicoFixedFee: 0.25,
  costRate: 40,
};

export function getDeductionConfig(): DeductionConfig {
  return {
    vatRate: Number(process.env.ADMIN_VAT_RATE ?? DEFAULT_DEDUCTION_CONFIG.vatRate),
    iyzicoCommissionRate: Number(
      process.env.ADMIN_IYZICO_COMMISSION_RATE ??
        DEFAULT_DEDUCTION_CONFIG.iyzicoCommissionRate,
    ),
    iyzicoFixedFee: Number(
      process.env.ADMIN_IYZICO_FIXED_FEE ?? DEFAULT_DEDUCTION_CONFIG.iyzicoFixedFee,
    ),
    costRate: Number(process.env.ADMIN_COST_RATE ?? DEFAULT_DEDUCTION_CONFIG.costRate),
  };
}

/** KDV dahil brüt tutardan KDV payını ayırır. */
export function computeVatFromGross(gross: number, vatRate: number) {
  if (vatRate <= 0 || gross <= 0) return 0;
  return gross * (vatRate / (100 + vatRate));
}

export function computeRevenueBreakdown(
  gross: number,
  paidCount: number,
  config: DeductionConfig = DEFAULT_DEDUCTION_CONFIG,
): RevenueBreakdown {
  const vat = computeVatFromGross(gross, config.vatRate);
  const iyzicoCommission =
    gross * (config.iyzicoCommissionRate / 100) + paidCount * config.iyzicoFixedFee;
  const productCost = gross * (config.costRate / 100);
  const net = Math.max(0, gross - vat - iyzicoCommission - productCost);

  return {
    gross,
    vat,
    iyzicoCommission,
    productCost,
    net,
    paidCount,
  };
}
