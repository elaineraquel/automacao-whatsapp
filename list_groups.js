const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, '.wwebjs_auth')
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Escaneie o QR Code acima para listar seus grupos.');
});

client.on('ready', async () => {
  console.log('Cliente pronto! Buscando grupos...');
  const chats = await client.getChats();
  const groups = chats.filter(chat => chat.isGroup);
  
  console.log('\n========= SEUS GRUPOS DA WHATSAPP =========');
  groups.forEach(group => {
    console.log(`Nome: ${group.name}`);
    console.log(`ID: ${group.id._serialized}`);
    console.log('-------------------------------------------');
  });
  console.log('===========================================\n');
  
  console.log('Dica: Copie o ID do grupo que deseja usar e coloque no seu arquivo .env');
  process.exit(0);
});

client.initialize();
