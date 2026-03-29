const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuration
const SHEET_ID = process.env.SHEET_ID;
const GROUP_IDS_ENV = process.env.GROUP_IDS ? process.env.GROUP_IDS.split(',') : [];
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL_MINUTE) || 1;
const SAFE_DELAY_MIN = parseInt(process.env.SAFE_DELAY_MIN) || 3000;
const SAFE_DELAY_MAX = parseInt(process.env.SAFE_DELAY_MAX) || 7000;

// Status state
let status = {
  connected: false,
  qr: null,
  lastCheck: null,
  lastSent: [],
  logs: []
};

function addLog(msg) {
  const time = new Date().toLocaleString('pt-BR');
  const log = `[${time}] ${msg}`;
  console.log(log);
  status.logs.unshift(log);
  if (status.logs.length > 50) status.logs.pop();
}

// WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, '.wwebjs_auth')
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

client.on('qr', (qr) => {
  status.qr = qr;
  status.connected = false;
  qrcode.generate(qr, { small: true });
  addLog('QR Code gerado. Disponível no terminal e no Dashboard (http://localhost:3000).');
});

client.on('ready', () => {
  status.connected = true;
  status.qr = null;
  addLog('WhatsApp conectado com sucesso!');
  startAutomation();
});

client.on('authenticated', () => addLog('Autenticado com sucesso.'));
client.on('auth_failure', (msg) => addLog(`Falha na autenticação: ${msg}`));
client.on('disconnected', (reason) => {
  status.connected = false;
  addLog(`WhatsApp desconectado: ${reason}`);
});

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(Math.floor(Math.random() * (SAFE_DELAY_MAX - SAFE_DELAY_MIN + 1) + SAFE_DELAY_MIN));

async function getSheetData() {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
    const response = await axios.get(csvUrl);
    const results = Papa.parse(response.data, { header: true, skipEmptyLines: true });
    return results.data;
  } catch (error) {
    addLog(`Erro ao buscar dados da planilha: ${error.message}`);
    return [];
  }
}

async function sendOffer(offer) {
  const titulo = offer.titulo || offer.Produto || 'Sem título';
  const legenda = offer.legenda || offer.Descrição || '';
  const link = offer.link || offer.Link_Afiliado || '';
  const midia_url = offer.midia_url || offer.URL_Imagem || '';
  const preco = offer.preco || offer.Preço || 'Consulte o link';
  
  if (!titulo || !link) return;

  addLog(`Processando envio: ${titulo}`);

  const messageText = `🔥 *${titulo}* 🔥\n\n${legenda}\n\n💰 *Preço: ${preco}*\n\n🛒 ${link}\n\n⏰ Oferta por tempo limitado!`;

  try {
    let media = null;
    if (midia_url && midia_url.startsWith('http')) {
      const response = await axios.get(midia_url, { responseType: 'arraybuffer' });
      media = new MessageMedia(response.headers['content-type'], Buffer.from(response.data, 'binary').toString('base64'), 'imagem.jpg');
    }

    for (const groupId of GROUP_IDS_ENV) {
      if (!groupId.trim()) continue;
      
      const chat = await client.getChatById(groupId.trim());
      await chat.sendStateTyping();
      await delay(2000);
      
      if (media) {
        await client.sendMessage(groupId.trim(), media, { caption: messageText });
      } else {
        await client.sendMessage(groupId.trim(), messageText);
      }
      addLog(`✅ Enviado para ${groupId.trim()}`);
      await randomDelay();
    }
    
    status.lastSent.unshift({ titulo, time: new Date().toLocaleTimeString('pt-BR') });
    if (status.lastSent.length > 10) status.lastSent.pop();

  } catch (error) {
    addLog(`❌ Erro no envio de ${titulo}: ${error.message}`);
  }
}

function startAutomation() {
  addLog(`Loop de automação ativado (Intervalo: ${CHECK_INTERVAL} min).`);
  cron.schedule(`*/${CHECK_INTERVAL} * * * *`, async () => {
    status.lastCheck = new Date().toLocaleString('pt-BR');
    const data = await getSheetData();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const toSend = data.filter(r => {
      const isTime = (r.Hora_Enviar || r.Hora) === timeStr;
      const isReady = (r.Status === 'PRONTO' || r.Status === '');
      return isTime && isReady;
    });

    for (const offer of toSend) await sendOffer(offer);
  });
}

// Dashboard
app.get('/trigger-all', async (req, res) => {
  addLog('Trigger manual acionado.');
  const data = await getSheetData();
  const toSend = data.filter(r => r.Status === 'PRONTO' || !r.Status);
  for (const offer of toSend) await sendOffer(offer);
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Zap Afiliados</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto; background: #f0f2f5; padding: 40px; color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          .card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 25px; }
          h1 { color: #25d366; }
          .status { display: inline-block; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
          .online { background: #e7f8ef; color: #25d366; }
          .offline { background: #feebeb; color: #ef4444; }
          .btn { background: #25d366; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; }
          .btn:hover { background: #128c7e; }
          .log-area { background: #2d3436; color: #dfe6e9; padding: 15px; border-radius: 8px; height: 300px; overflow-y: auto; font-family: monospace; font-size: 13px; line-height: 1.6; }
          .offer-item { border-bottom: 1px solid #eee; padding: 10px 0; list-style: none; }
          .qr-img { border: 1px solid #ddd; padding: 10px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Zap Afiliados</h1>
          
          <div class="card">
            <h2>Conexão: <span class="status ${status.connected ? 'online' : 'offline'}">${status.connected ? 'CONECTADO' : 'DESCONECTADO'}</span></h2>
            <p>Última verificação: ${status.lastCheck || 'Aguardando...'}</p>
            ${!status.connected && status.qr ? `
              <div style="text-align:center">
                <p>Escaneie este QR Code no seu WhatsApp:</p>
                <img class="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(status.qr)}&size=250x250">
              </div>
            ` : ''}
          </div>

          <div class="card">
            <h2>Controle Manual</h2>
            <p>Enviar todos os itens com Status "PRONTO" agora mesmo:</p>
            <a href="/trigger-all" class="btn">🚀 Enviar Tudo Agora</a>
          </div>

          <div class="card">
            <h2>Histórico de Envio</h2>
            <ul>
              ${status.lastSent.map(s => `<li class="offer-item">✅ <b>[${s.time}]</b> ${s.titulo}</li>`).join('')}
              ${status.lastSent.length === 0 ? '<li>Nenhum envio registrado.</li>' : ''}
            </ul>
          </div>

          <div class="card">
            <h2>Logs de Atividade</h2>
            <div class="log-area">
              ${status.logs.map(l => `<div>${l}</div>`).join('')}
            </div>
          </div>
        </div>
        <script>setTimeout(() => { if (!window.location.search.includes('no-refresh')) location.reload(); }, 5000);</script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  addLog(`Servidor rodando em http://localhost:${port}`);
  client.initialize();
});
