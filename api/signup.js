export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName, phone, platform } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          SMS: phone || '',
          PLATFORM: platform || ''
        },
        listIds: [3],
        updateEnabled: true
      })
    });

    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return res.status(200).json({ success: true });
    } else {
      const err = await brevoRes.json();
      return res.status(400).json({ error: err.message || 'Brevo error' });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
