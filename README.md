# Storefront (Next.js)

E-commerce storefront with admin, payments, and notifications. Configure branding and contact details via environment variables and the CMS.

## Setup

1. Copy `.env.example` to `.env.local` and fill in all values.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev` (default port `3001`)

## Branding (env)

Set at minimum:

- `NEXT_PUBLIC_APP_URL` — canonical site URL  
- `NEXT_PUBLIC_SITE_NAME` — store name  
- `NEXT_PUBLIC_SITE_TAGLINE` — short tagline  
- `NEXT_PUBLIC_CONTACT_EMAIL` — public contact email  
- `NEXT_PUBLIC_CONTACT_PHONE` — display phone (optional)  
- `NEXT_PUBLIC_CONTACT_PHONE_TEL` — E.164-style for `tel:` if different from display (optional)  
- `NEXT_PUBLIC_CONTACT_WHATSAPP` — WhatsApp digits (optional)  
- `NEXT_PUBLIC_CONTACT_ADDRESS` — business address (optional)  
- `NEXT_PUBLIC_SMS_SENDER_ID` — SMS sender ID (e.g. registered with your SMS provider)  
- `NEXT_PUBLIC_SKU_PREFIX` — auto-SKU prefix for new products  

Admin email and Resend: `ADMIN_EMAIL`, `EMAIL_FROM`, `RESEND_API_KEY`.

## Stack

Next.js, Supabase, Tailwind CSS. See `package.json` for scripts.

## License

Replace this section with your own license terms when you publish the project.
