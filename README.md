# Drix Lux — Premium Alcohol Delivery Service

## Overview

Drix Lux is a premium alcohol delivery service operating in Luxembourg. This project is a modern web application built with clean HTML5, vanilla JavaScript, and serverless architecture for fast, reliable delivery management and e-commerce functionality.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Hosting**: Vercel (serverless deployment)
- **Payments**: Stripe (secure payment processing)
- **Mapping**: Leaflet (delivery zone visualization)
- **Email**: Nodemailer (order confirmations)
- **Fonts**: Google Fonts (Cormorant Garamond, DM Sans)

## Project Structure

```
drixlux-site/
├── index.html                 # Main homepage and application shell
├── pages/
│   ├── mentions-legales.html  # Legal notices (company info, hosting, IP)
│   ├── cgv.html               # Terms and conditions of sale
│   └── confidentialite.html   # Privacy policy (RGPD-compliant)
├── css/
│   └── style.css              # Global styles
├── js/
│   └── app.js                 # Application logic (age gate, cart, checkout)
├── api/
│   ├── create-payment-intent.js
│   ├── webhook.js
│   └── email.js
├── img/
│   └── [product images, icons]
├── admin.html                 # Admin dashboard
├── vercel.json                # Vercel deployment configuration
├── package.json               # NPM dependencies and scripts
├── .gitignore                 # Git exclusions
└── README.md                  # This file
```

## Key Features

- **Age Gate**: Browser-based age verification (18+) with persistent check
- **Interactive Map**: Leaflet-based delivery zone visualization
- **Shopping Cart**: Client-side cart management with localStorage persistence
- **Secure Payments**: Stripe integration for safe payment processing
- **Responsive Design**: Mobile-first design with adaptive layouts
- **Legal Compliance**: RGPD-compliant privacy policy, terms of service, legal notices
- **Admin Dashboard**: Order management and inventory control

## Deployment

### Prerequisites

- Node.js 16+ and npm
- Vercel CLI
- Environment variables configured

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts the Vercel development server with local API emulation.

### Production Deployment

```bash
npm run deploy
```

Or push to your connected Git repository for automatic deployments.

## Environment Variables

Required environment variables (create `.env.local`):

```
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NODEMAILER_SERVICE=your_email_service
NODEMAILER_USER=your_email@example.com
NODEMAILER_PASS=your_app_password
```

## Legal Compliance

- **Age Verification**: Enforced via JavaScript age gate (18+ required)
- **Payment Security**: Stripe PCI-DSS Level 1 certified
- **Data Protection**: RGPD-compliant privacy policy
- **Terms of Service**: Comprehensive terms covering delivery, refunds, and liability
- **Legal Notices**: Complete company information and intellectual property statements

## File-Specific Details

### index.html
- Complete HTML5 document with semantic structure
- Includes all external dependencies (fonts, libraries, scripts)
- Contains full application UI (age gate, navigation, product catalog, cart, checkout)
- Links to external CSS (style.css) and deferred JavaScript (app.js)

### Legal Pages (pages/)
- Consistent styling with main site using shared CSS variables
- Sticky navigation with back link to homepage
- Professional typography using Cormorant Garamond and DM Sans fonts
- Responsive layout with max-width container

### API Routes (api/)
- Stripe payment intent creation
- Webhook handling for payment confirmations
- Email notifications for orders

## Support

For issues or inquiries:
- Phone: +352 661 47 41 30
- Email: contact@drixlux.lu
- WhatsApp: https://wa.me/352661474130

## License

All content is proprietary to Drix Lux. Unauthorized reproduction or redistribution is prohibited.

---

**Last Updated**: March 2026
