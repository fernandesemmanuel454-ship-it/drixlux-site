module.exports = async (req, res) => {
  const allowedOrigins = ['https://drixlux.lu', 'https://www.drixlux.lu'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const EC_ID = process.env.EC_ID;
  const EC_TOKEN = process.env.EDGE_CONFIG?.split('token=')[1];
  const STOCK_KEY = 'drixlux-stock';

  if (req.method === 'GET') {
    try {
      const resp = await fetch(
        `https://edge-config.vercel.com/${EC_ID}/item/${STOCK_KEY}?token=${EC_TOKEN}`
      );
      if (!resp.ok) throw new Error('Edge Config read failed');
      const stock = await resp.json();
      return res.status(200).json(stock);
    } catch (err) {
      return res.status(500).json({ error: 'Erreur lecture stock' });
    }
  }

  if (req.method === 'POST') {
    const { password, stock } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    if (!stock || typeof stock !== 'object') {
      return res.status(400).json({ error: 'Données stock invalides' });
    }
    try {
      // Récupérer le stock actuel depuis Edge Config
      const currentResp = await fetch(
        `https://edge-config.vercel.com/${EC_ID}/item/${STOCK_KEY}?token=${EC_TOKEN}`
      );
      const currentStock = currentResp.ok ? await currentResp.json() : {};

      // Fusionner avec les nouvelles valeurs
      const updatedStock = {
        ...(currentStock || {}),
        ...stock
      };

      const resp = await fetch(
        `https://api.vercel.com/v1/edge-config/${EC_ID}/items?teamId=fernandesemmanuel454-4322s-projects`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{ operation: 'upsert', key: STOCK_KEY, value: updatedStock }],
          }),
        }
      );
      if (!resp.ok) throw new Error(await resp.text());
      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return res.status(500).json({ error: 'Erreur mise à jour stock' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
