// Credentials come from .env (see .env.example), loaded in playwright.config.ts.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env (see .env.example).`);
  }
  return value;
}

export const validUser = {
  email: requireEnv('TM_EMAIL'),
  password: requireEnv('TM_PASSWORD'),
  name: 'Demo User',
};
