# Deploy GitHub A to Vercel B

This repository deploys to a Vercel project owned by a different account using
the GitHub Actions workflow in `workflows/deploy-vercel.yml`. GitHub does not
need to be connected to Vercel B.

## One-time Vercel B setup

1. Sign in to **Vercel B** and create Project B. Do not import this GitHub
   repository into Vercel.
2. In Project B, set the root directory to the repository root and configure
   the required Production environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. In a local clone of this repository, authenticate with Vercel B and link
   the clone to Project B:

   ```bash
   npx vercel login
   npx vercel link
   ```

4. Copy the values created in `.vercel/project.json`:
   - `orgId` becomes `VERCEL_ORG_ID`
   - `projectId` becomes `VERCEL_PROJECT_ID`
5. Create a Vercel B access token with access to Project B in the Vercel
   account settings. This becomes `VERCEL_TOKEN`.

## GitHub A secrets

In GitHub A, open this repository's **Settings → Secrets and variables →
Actions** and add these repository secrets:

| Secret | Value |
| --- | --- |
| `VERCEL_TOKEN` | The Vercel B access token |
| `VERCEL_ORG_ID` | Vercel B team/account ID from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Project B ID from `.vercel/project.json` |

The `.vercel` directory is local deployment metadata and must not be committed.

## Deployment behavior

- Pushing to `main` deploys the production environment of Project B.
- Running **Actions → Deploy to Vercel → Run workflow** deploys manually.
- The workflow pulls Production variables from Vercel B, builds a prebuilt
  output, then deploys it with the Vercel B token.
