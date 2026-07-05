import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      let q = supabase.from('albums').select('*').order('created_at', { ascending: false });
      if (user_id) q = q.eq('user_id', user_id);
      const { data: albums, error } = await q;
      if (error) throw error;

      // attach photo counts + cover
      const withCounts = await Promise.all(
        (albums || []).map(async (a) => {
          const { data: photos } = await supabase
            .from('photos')
            .select('url')
            .eq('album_id', a.id)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(1);
          const { count } = await supabase
            .from('photos')
            .select('id', { count: 'exact', head: true })
            .eq('album_id', a.id)
            .eq('is_deleted', false);
          return {
            ...a,
            cover_url: a.cover_url || (photos && photos[0] ? photos[0].url : null),
            photo_count: count || 0,
          };
        }),
      );
      return res.status(200).json(withCounts);
    }

    if (req.method === 'POST') {
      const { user_id, name } = req.body;
      const { data, error } = await supabase
        .from('albums')
        .insert({ user_id, name })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ ...data, photo_count: 0 });
    }

    if (req.method === 'PUT') {
      const { id, ...patch } = req.body;
      const { data, error } = await supabase
        .from('albums')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      // detach photos from album (do not delete the photos)
      await supabase.from('photos').update({ album_id: null }).eq('album_id', id);
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /albums error:', err);
    res.status(500).json({ error: err.message });
  }
}
