-- Grant app role full access to schema objects created as a superuser.
-- Safe to re-run. Defaults to store_sikahomes; override with:
--   SET app.role = 'store_other'; before running, or edit the fallback below.

DO $$
DECLARE
  app_role text := nullif(current_setting('app.role', true), '');
BEGIN
  IF app_role IS NULL THEN
    app_role := 'store_sikahomes';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = app_role) THEN
    -- Local / CI: if connecting as the app role already, grant to current_user.
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = current_user AND rolname LIKE 'store_%') THEN
      app_role := current_user;
    ELSE
      RAISE NOTICE 'Role % does not exist — skipping grants (ok for local postgres superuser installs)', app_role;
      RETURN;
    END IF;
  END IF;

  BEGIN
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', current_database(), app_role);
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Could not GRANT CONNECT (need superuser); continuing with schema grants';
  END;

  EXECUTE format('GRANT USAGE, CREATE ON SCHEMA public TO %I', app_role);
  EXECUTE format('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO %I', app_role);
  EXECUTE format('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO %I', app_role);
  EXECUTE format('GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO %I', app_role);
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO %I', app_role);
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO %I', app_role);
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO %I', app_role);

  RAISE NOTICE 'Granted public schema privileges to %', app_role;
END $$;
