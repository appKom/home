## Teknologistakk

Next.js for frontend og backend. Tailwind for styling, prisma for ORM, og Supabase for lagring av PostgreSQL.

## For å kjøre prosjektet

> **NOTE:** Du må opprette en `.env`-fil i roten av prosjektet ditt med følgende miljøvariabler:

```plaintext
AWS_SECRET_ACCESS_KEY=#aws secret access key
AWS_ACCESS_KEY_ID=#aws access key id

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_STORAGE_BUCKET=your-storage-bucket-name
VERCEL_DOMAIN=your-vercel-domain
```

Så kan du kjøre:

```bash
pnpm run dev

```

Åpne så [http://localhost:3000](http://localhost:3000) i nettleseren din for å se siden.

## Prisma

Dette prosjektet bruker Prisma som ORM. For å oppdatere databasen, kjør:

```bash
pnpm prisma migrate dev --name init
```

For å oppdatere schema, kjør:

```bash
pnpm prisma generate
```

For å se dataen i databasen, kjør:

```bash
pnpm prisma studio
```
