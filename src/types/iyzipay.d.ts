declare module "iyzipay" {
  type Callback<T> = (err: Error | null, result: T) => void;

  export interface IyzicoResult {
    status?: string;
    errorCode?: string;
    errorMessage?: string;
    errorGroup?: string;
    locale?: string;
    systemTime?: number;
    conversationId?: string;
    token?: string;
    checkoutFormContent?: string;
    tokenExpireTime?: number;
    paymentPageUrl?: string;
    paymentStatus?: string;
    paymentId?: string;
    paidPrice?: number | string;
    price?: number | string;
    basketId?: string;
  }

  class Iyzipay {
    constructor(config?: { apiKey: string; secretKey: string; uri: string });
    checkoutFormInitialize: {
      create: (request: unknown, cb: Callback<IyzicoResult>) => void;
    };
    checkoutForm: {
      retrieve: (request: unknown, cb: Callback<IyzicoResult>) => void;
    };

    static LOCALE: { TR: string; EN: string };
    static CURRENCY: { TRY: string };
    static PAYMENT_GROUP: { PRODUCT: string };
    static BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string };
  }

  export default Iyzipay;
}
