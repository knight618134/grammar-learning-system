# Cloud sync setup

The application remains usable in local-only mode when Supabase is not
configured. To enable accounts and cross-device history:

1. Create a Supabase project.
2. Open the SQL editor and run
   `supabase/migrations/202607020001_learning_cloud.sql`.
3. In Authentication, enable Email authentication and choose whether email
   confirmation is required.
4. Copy `.env.example` to `.env.local`.
5. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Restart the Next.js application.

Never put a service-role key or an AI provider key in a `NEXT_PUBLIC_`
environment variable.

## Data behavior

- Signed-out practice continues to use local browser storage.
- After sign-in, local history is merged with the cloud `study_state`.
- Every submitted set creates one `practice_sessions` record and one
  `attempt_answers` record per question.
- Row Level Security restricts study records to the signed-in user.
- AI-generated questions are stored as `draft` and cannot be read by learners
  until they are approved.

## Deployment

This repository is connected to Vercel through GitHub. In the Vercel project:

1. Open Settings -> Environment Variables.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `NEXT_PUBLIC_SITE_URL`.
3. Apply them to Production and Preview. Use the production Vercel/custom
   domain for `NEXT_PUBLIC_SITE_URL`.
4. Redeploy after adding or changing variables. Vercel environment changes do
   not modify an already-built deployment.

In Supabase Authentication -> URL Configuration:

1. Set Site URL to the production Vercel or custom domain.
2. Add `http://localhost:3000/**` for local development.
3. Add the Vercel preview wildcard for the account/team when preview login is
   required.

The app uses the active browser origin as the email confirmation destination,
so every origin used for signup must be in the Supabase redirect allow list.
