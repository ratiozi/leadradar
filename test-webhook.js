const https = require('https');

const webhookUrl = 'https://nskstroy.bitrix24.ru/rest/4321/0xawnyavofz5jl4r/';
const method = 'crm.lead.list';

const url = new URL(webhookUrl);
const path = url.pathname + method;

console.log('Testing:', webhookUrl + method);
console.log('Path:', path);

const data = JSON.stringify({});

const options = {
  hostname: url.hostname,
  port: 443,
  path: path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body.substring(0, 200));
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
