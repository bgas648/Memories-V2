import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      let q = supabase.from('photos').select('*').order('created_at', { ascending: false });
      if (user_id) q = q.eq('user_id', user_id);
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { user_id, album_id, filename, url, thumb_url, type, size, width, height } = req.body;
      const { data, error } = await supabase
        .from('photos')
        .insert({
          user_id,
          album_id: album_id || null,
          filename,
          url,
          thumb_url: thumb_url || url,
          type: type || 'image',
          size: size || 0,
          width: width || null,
          height: height || null,
          is_favorite: false,
          is_deleted: false,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...patch } = req.body;
      if (patch.is_deleted === true) patch.deleted_at = new Date().toISOString();
      if (patch.is_deleted === false) patch.deleted_at = null;
      const { data, error } = await supabase
        .from('photos')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id, permanent } = req.body;
      if (permanent) {
        const { error } = await supabase.from('photos').delete().eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('photos')
          .update({ is_deleted: true, deleted_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
      }
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /photos error:', err);
    res.status(500).json({ error: err.message });
  }
}
