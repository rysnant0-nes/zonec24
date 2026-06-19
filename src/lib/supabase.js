import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjlltswbgbtgyxceachw.supabase.co';
const supabaseKey = 'sb_publishable_UdR7sEJWePAfAc8i-o2tCg_MvQx6TxV';

export const supabase = createClient(supabaseUrl, supabaseKey);
