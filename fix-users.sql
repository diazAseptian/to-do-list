-- Update existing users to set email as confirmed
UPDATE auth.users 
SET email_confirmed_at = now(), 
    updated_at = now()
WHERE email_confirmed_at IS NULL;