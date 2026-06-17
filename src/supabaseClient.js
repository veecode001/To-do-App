import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nswwbtxqsfknqvcucgwp.supabase.co';
const supabaseKey = 'sb_publishable_5QtV-OBXJFQA_DT1N_2DNw__c4ZoHso';

export const supabase = createClient(supabaseUrl, supabaseKey);