# SGE DataHub VPS-Only Workflow

The `sge-datahub` backend should be treated as a VPS and GitHub project, not a duplicate Mac checkout.

- GitHub source: `https://github.com/Anheuserly/sge-datahub.git`
- VPS app checkout: `C:\sge-datahub\app-git`
- VPS service: `SGEDatahubAPI`
- VPS environment file: `C:\sge-datahub\sge-datahub.env`

Do not put database URLs, passwords, API secrets, or VPS credentials into Flutter, frontend JavaScript, GitHub, or client-side environment variables.

Useful VPS commands after SSH:

```powershell
Set-Location C:\sge-datahub\app-git
git status
git pull origin main
npm ci
npm run build
Restart-Service SGEDatahubAPI
```

Pushing from the VPS requires GitHub write authentication to be configured on the VPS, such as a GitHub SSH key or a scoped token.

VPS deploy key public key:

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDkhlcez2t4eHv3V88FavfdsfVXvWF8AVsXNtFt9sPKo sge-datahub-vps-deploy
```

Add it in GitHub:

`Anheuserly/sge-datahub` -> `Settings` -> `Deploy keys` -> `Add deploy key` -> enable `Allow write access`.

After that, this should work on the VPS:

```powershell
Set-Location C:\sge-datahub\app-git
git pull origin main
git push origin main
```
