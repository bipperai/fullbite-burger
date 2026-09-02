import Iyzipay, { type IyzicoResult } from "iyzipay";
import type { Order } from "./orders";
import { toIyzicoPrice } from "./format";
import { getIyzicoCredentials, getPublicBaseUrl } from "./iyzico-config";

export { getIyzicoEnvStatus, isIyzicoConfigured } from "./iyzico-config";

async function client() {
  const creds = await getIyzicoCredentials();
  if (!creds?.apiKey || !creds?.secretKey) {
    throw new Error("iyzico anahtarları tanımlı değil.");
  }

  return new Iyzipay({
    apiKey: creds.apiKey,
    secretKey: creds.secretKey,
    uri: creds.baseUrl,
  });
}

function promisify<T>(
  fn: (request: unknown, cb: (err: Error | null, result: T) => void) => void,
  request: unknown,
) {
  return new Promise<T>((resolve, reject) => {
    fn(request, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function splitName(full: CustomerLike) {
  return { name: full.name, surname: full.surname };
}

type CustomerLike = Order["customer"];

export async function initializeCheckout(order: Order, ip: string) {
  const iyzipay = await client();
  const { name, surname } = splitName(order.customer);
  const address = `${order.customer.address}, ${order.customer.district}`;
  const basketItems = [
    ...order.items.map((item) => ({
      id: item.id,
      name: item.name,
      category1: "Burger",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: toIyzicoPrice(item.price * item.quantity),
    })),
    ...(order.deliveryFee > 0
      ? [
          {
            id: "delivery",
            name: "Teslimat",
            category1: "Servis",
            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
            price: toIyzicoPrice(order.deliveryFee),
          },
        ]
      : []),
  ];

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: order.id,
    price: toIyzicoPrice(order.total),
    paidPrice: toIyzicoPrice(order.total),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: order.id,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `${getPublicBaseUrl()}/api/iyzico/callback`,
    enabledInstallments: [1, 2, 3, 6],
    buyer: {
      id: order.id.slice(0, 11),
      name,
      surname,
      gsmNumber: order.customer.phone,
      email: order.customer.email,
      identityNumber: order.customer.identityNumber,
      lastLoginDate: "2024-01-01 12:00:00",
      registrationDate: "2024-01-01 12:00:00",
      registrationAddress: address,
      ip,
      city: order.customer.city,
      country: "Turkey",
      zipCode: "34000",
    },
    shippingAddress: {
      contactName: `${name} ${surname}`,
      city: order.customer.city,
      country: "Turkey",
      address,
      zipCode: "34000",
    },
    billingAddress: {
      contactName: `${name} ${surname}`,
      city: order.customer.city,
      country: "Turkey",
      address,
      zipCode: "34000",
    },
    basketItems,
  };

  return promisify<IyzicoResult>(
    iyzipay.checkoutFormInitialize.create.bind(iyzipay.checkoutFormInitialize),
    request,
  );
}

export async function retrieveCheckout(token: string, conversationId: string) {
  const iyzipay = await client();
  return promisify<IyzicoResult>(
    iyzipay.checkoutForm.retrieve.bind(iyzipay.checkoutForm),
    {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      token,
    },
  );
}
