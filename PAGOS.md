# 💳 Cobrar el curso — cómo conectar el pago

Los botones **"Enroll now — $249"** ya están listos. Solo falta pegar **tu link de pago**.

## Dónde se pega (1 línea)
Abre `js/views-landing.js`, arriba del todo, y pon tu URL en `checkout`:

```js
const CFG = {
  whatsapp: '524434405815',
  waMsg: 'Hi André, I want to join the Zero to Payout course 🚀',
  checkout: 'PEGA_AQUÍ_TU_LINK_DE_PAGO',   // ← aquí
  ...
};
```

- Con link → los botones "Enroll now / Enroll — $249" llevan al **checkout**.
- Vacío → llevan a **WhatsApp** (así funciona ahora, para no perder ventas).
- El link secundario *"Questions? Chat on WhatsApp"* siempre va a tu WhatsApp.

Después de pegarlo: sube el cambio a GitHub (o dime y lo subo yo) y ya cobras.

---

## Qué proveedor usar (elige uno — todos te dan una URL)

Como el sitio es estático (GitHub Pages, sin servidor), lo correcto es un **link de pago alojado**. No necesitas programar nada más.

### 1) Stripe Payment Link — *recomendado (global, tarjetas, pro)*
1. Crea cuenta en https://stripe.com y verifica tu negocio.
2. **Products** → *Add product*: nombre "Zero to Payout", precio **$249 USD**, pago único.
3. **Payment Links** → *Create link* → elige ese producto → **Create**.
4. Copia la URL (`https://buy.stripe.com/...`) y pégala en `checkout`.
5. (Opcional) En el link activa "Collect customer email" para tener el correo del alumno.

Comisión ≈ 2.9% + $0.30. Tú manejas facturas/impuestos.

### 2) Lemon Squeezy o Gumroad — *lo más fácil para un curso*
Son *merchant of record*: **ellos cobran, dan recibo y manejan impuestos/IVA** del mundo. Ideal si vendes global sin liarte con fiscal.
1. Crea producto digital "Zero to Payout" a **$249**.
2. Copia el **checkout link** del producto y pégalo en `checkout`.
3. Entregan un email de compra automático (puedes adjuntar instrucciones de acceso).

### 3) MercadoPago — *México / LatAm (tarjeta, OXXO, SPEI)*
1. https://www.mercadopago.com.mx → **Cobrar** → *Link de pago*.
2. Monto (ej. $4,990 MXN), concepto "Curso De Cero a Payout".
3. Copia el link y pégalo en `checkout`.

### 4) Hotmart — *plataforma de cursos LatAm (con afiliados)*
Buena si quieres afiliados que vendan por ti. Creas el producto, te da un link de checkout → pégalo en `checkout`.

---

## Después del pago: cómo entregar el curso (MVP)
Por ahora, cuando alguien pague:
1. Te llega el aviso del proveedor (email).
2. Le mandas por correo/WhatsApp: el link de la app (**https://parfectapp.github.io/northpoint/** → "Get started") y la invitación a la comunidad.
3. El curso se ve dentro de la app (Academy).

Cuando tengas volumen, se puede automatizar (webhook del proveedor → acceso). Dímelo y lo armamos.

---

## Sugerencia
Empieza con **Stripe Payment Link** (si tu público paga con tarjeta / global) o **MercadoPago** (si es México con OXXO/SPEI). Ambos toman 5 minutos. Pega la URL, súbelo, y ya estás cobrando.
