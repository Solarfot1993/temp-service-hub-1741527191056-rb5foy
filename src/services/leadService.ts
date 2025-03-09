import { supabase } from '../lib/supabase';
import { Lead } from '../types';

export const fetchDirectLeads = async (providerId: string) => {
  try {
    console.log("Fetching direct leads for provider:", providerId);
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        service_id,
        sender:sender_id (
          id,
          full_name,
          avatar_url
        ),
        service:service_id (
          title,
          category
        )
      `)
  }
}