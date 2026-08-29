# FullBite Burger

Smash burger restoran sitesi: menü, sepet, sipariş ve **iyzico Checkout Form** ödemesi.

## Çalıştırma

```bash
cp .env.example .env.local
npm install
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

## iyzico

1. [iyzico sandbox paneli](https://sandbox-merchant.iyzipay.com/) üzerinden API Key ve Secret Key alın.
2. `.env.local` dosyasına yazın:

```
IYZI_API_KEY=sandbox-...
IYZI_SECRET_KEY=sandbox-...
IYZI_BASE_URL=https://sandbox-api.iyzipay.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Canlıya alınca `IYZI_BASE_URL=https://api.iyzipay.com` ve gerçek domain’i `NEXT_PUBLIC_BASE_URL` olarak verin. Callback adresi: `/api/iyzico/callback`.

Sandbox test kartı (iyzico dokümantasyonu): `5528790000000008`, son kullanma `12/30`, CVC `123`.
