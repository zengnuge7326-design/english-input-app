import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jwgkjorcoqbjudycxhti.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable__rknQ3i5S5H0zwzIt8ipfQ_6dg3wrAS'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
