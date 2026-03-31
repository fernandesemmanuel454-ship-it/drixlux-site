const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // CORS
    const allowedOrigins = ['https://drixlux.lu', 'https://www.drixlux.lu'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
          // ── Validation défensive : body absent ou malformé ──
      if (!req.body || typeof req.body !== 'object') {
              return res.status(400).json({ error: 'Corps de requête manquant ou invalide' });
      }

      const { items, customer } = req.body;

      // ── Validation items : doit être un tableau non vide ──
      if (!Array.isArray(items) || items.length === 0) {
              return res.status(400).json({ error: 'Le panier (items) est vide ou invalide' });
      }

      // ── Validation + coercion de chaque item ──
      // On coerce price/qty en nombres au lieu de rejeter (tolère "30.90" string)
      for (let i = 0; i < items.length; i++) {
              const it = items[i];
              if (!it || !it.name) {
                        return res.status(400).json({ error: `Item ${i} invalide : name requis` });
              }
              it.price = Number(it.price);
              it.qty = Math.floor(Number(it.qty));
              if (isNaN(it.price) || it.price <= 0) {
                        return res.status(400).json({ error: `Item ${i} (${it.name}) : price invalide` });
              }
              if (isNaN(it.qty) || it.qty < 1) {
                        return res.status(400).json({ error: `Item ${i} (${it.name}) : qty invalide` });
              }
      }

      // ── Validation customer : seuls name, phone, address sont bloquants ──
      if (!customer || typeof customer !== 'object') {
              return res.status(400).json({ error: 'Informations client (customer) manquantes' });
      }
          if (!customer.name || !customer.phone || !customer.address) {
                  return res.status(400).json({ error: 'Champs obligatoires manquants : name, phone, address' });
          }

      // ── Zone / fee : coercion avec fallbacks (ne bloque jamais le paiement) ──
      const zone = req.body.zone || '1';
          const fee = Number(req.body.fee) || 0;

      // Construire les line_items Stripe
      const line_items = items.map(item => ({
              price_data: {
                        currency: 'eur',
                        product_data: {
                                    name: String(item.name),
                                    description: item.vol ? String(item.vol) : '',
                        },
                        unit_amount: Math.round(item.price * 100),
              },
              quantity: item.qty,
      }));

      // Frais de livraison
      if (fee > 0) {
              line_items.push({
                        price_data: {
                                    currency: 'eur',
                                    product_data: { name: `Livraison Zone ${zone}` },
                                    unit_amount: Math.round(fee * 100),
                        },
                        quantity: 1,
              });
      }

      // Créer la session Checkout Stripe
      const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              mode: 'payment',
              line_items,
              customer_email: customer.email || undefined,
              metadata: {
                        customer_name: customer.name,
                        customer_phone: customer.phone,
                        customer_address: customer.address,
                        customer_email: customer.email || '',
                        customer_note: customer.note || '',
                        zone: zone,
                        order_summary: items.map(i => `${i.name} x${i.qty}`).join(', '),
              },
              success_url: 'https://drixlux.lu?order=success',
              cancel_url: 'https://drixlux.lu?order=cancelled',
      });

      return res.status(200).json({ url: session.url, session_id: session.id });

    } catch (err) {
          console.error('Stripe error:', err.message);
          return res.status(500).json({ error: 'Erreur de paiement : ' + err.message });
    }
};
