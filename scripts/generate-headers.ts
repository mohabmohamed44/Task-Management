import { writeFileSync } from 'fs';
import { resolve } from 'path';

const apiUrl = process.env.VITE_API_URL || '';
const domain = apiUrl ? new URL(apiUrl).origin : '';

const headersContent = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';

/index.html
  Cache-Control: public, max-age=0, must-revalidate
`;

writeFileSync(resolve(process.cwd(), 'dist/_headers'), headersContent);
console.log('Generated _headers file with API:', domain);
