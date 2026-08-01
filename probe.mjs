import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const SENSITIVE = ['GITHUB_TOKEN','GH_TOKEN','GITHUB_APP_PRIVATE_KEY','GITHUB_APP_ID',
  'GITHUB_APP_INSTALLATION_ID','AZURE_CLIENT_SECRET','AZURE_CLIENT_ID','AZURE_TENANT_ID',
  'DATABASE_URL','NPM_TOKEN','AWS_SECRET_ACCESS_KEY','AWS_ACCESS_KEY_ID','OPENAI_API_KEY','ANTHROPIC_API_KEY'];
const SECRETISH = /(TOKEN|SECRET|PASSWORD|PRIVATE_KEY|CONNECTIONSTRING|CONNECTION_STRING|APIKEY|API_KEY)/i;
const ALLOWED_SECRETISH = new Set(['npm_config_ignore_scripts']);
let leaks = [];
for (const k of SENSITIVE) if (process.env[k]) leaks.push(`env:${k}`);
for (const k of Object.keys(process.env))
  if (SECRETISH.test(k) && !ALLOWED_SECRETISH.has(k)) leaks.push(`env-secretish:${k}=${(process.env[k]||'').slice(0,6)}...`);
function findGitConfig(start){let d=start;for(let i=0;i<5;i++){const p=join(d,'.git','config');if(existsSync(p))return p;const up=join(d,'..');if(up===d)break;d=up;}return null;}
const cfg = findGitConfig(process.cwd());
if (cfg){ const t = readFileSync(cfg,'utf8'); if (/x-access-token:/.test(t)) leaks.push(`gitconfig-token:${cfg}`); }
console.log('=== isolation probe (in-gate) ===');
console.log('cwd:', process.cwd(), '| env count:', Object.keys(process.env).length, '| git config:', cfg ?? 'none');
if (leaks.length === 0){ console.log('PROBE PASS — no secrets in env, no token in .git/config'); process.exit(0); }
console.log('PROBE FAIL — leaks:'); for (const l of leaks) console.log('  -', l);
process.exit(1);   // fails the build -> shows up in the setup run's buildDetail
