import supabase from './db-client.js';

export const config = {
  api: {
    bodyParser: { sizeLimit: '50mb' },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { user_id, fileName, fileBase64, contentType } = req.body;
    if (!fileBase64 || !fileName) return res.status(400).json({ error: 'Missing file' });

    const ext = fileName.split('.').pop() || 'bin';
    const path = `${user_id || 'anon'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(fileBase64, 'base64');

    const { error } = await supabase.storage.from('media').upload(path, buffer, {
      contentType: contentType || 'application/octet-stream',
      upsert: false,
    });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
    return res.status(200).json({ url: urlData.publicUrl, path });
  } catch (err) {
    console.error('API /upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
