// ================================================================
// SQL to run in Supabase Dashboard -> SQL Editor:
// ================================================================
// 1. Go to https://supabase.com/dashboard/project/wjlltswbgbtgyxceachw
// 2. Open "SQL Editor" (left sidebar)
// 3. Paste and run the SQL below:
//
// -- Tabel galeri (foto)
// CREATE TABLE IF NOT EXISTS public.galeri (
//   id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   created_at timestamptz DEFAULT now(),
//   title text NOT NULL,
//   description text DEFAULT '',
//   uploader text NOT NULL,
//   image_url text NOT NULL,
//   date text DEFAULT to_char(now(), 'YYYY-MM-DD')
// );
// ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
// DROP POLICY IF EXISTS anon_select ON public.galeri;
// DROP POLICY IF EXISTS anon_insert ON public.galeri;
// DROP POLICY IF EXISTS anon_delete ON public.galeri;
// CREATE POLICY anon_select ON public.galeri FOR SELECT USING (true);
// CREATE POLICY anon_insert ON public.galeri FOR INSERT WITH CHECK (true);
// CREATE POLICY anon_delete ON public.galeri FOR DELETE USING (true);
//
// -- Bucket storage untuk foto
// INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
// VALUES ('galeri', 'galeri', true, 5242880, '{"image/jpeg", "image/png", "image/webp", "image/gif"}')
// ON CONFLICT (id) DO NOTHING;
// DROP POLICY IF EXISTS anon_select ON storage.objects;
// DROP POLICY IF EXISTS anon_insert ON storage.objects;
// DROP POLICY IF EXISTS anon_delete ON storage.objects;
// CREATE POLICY anon_select ON storage.objects FOR SELECT USING (bucket_id = 'galeri');
// CREATE POLICY anon_insert ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'galeri');
// CREATE POLICY anon_delete ON storage.objects FOR DELETE USING (bucket_id = 'galeri');

console.log('Cannot auto-connect to Supabase database from this network.');
console.log('Please run the SQL above in the Supabase dashboard SQL Editor.');
console.log('Dashboard: https://supabase.com/dashboard/project/wjlltswbgbtgyxceachw');
