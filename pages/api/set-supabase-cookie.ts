import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

const SetSupabaseCookie = async (req: NextApiRequest, res: NextApiResponse) => {
	supabase.auth.api.setAuthCookie(req, res);
};

export default SetSupabaseCookie;
