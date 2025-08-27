-- Create RPC function to confirm user email
CREATE OR REPLACE FUNCTION confirm_user_email(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = now(), 
      updated_at = now()
  WHERE email = user_email 
    AND email_confirmed_at IS NULL;
END;
$$;