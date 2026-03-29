# Guia: Como Rodar o Bot 100% Online (Nuvem)

Para que o seu bot de WhatsApp funcione sem precisar do seu computador ligado e sem terminal aberto, você precisa de um **servidor na nuvem**.

Abaixo estão as 3 melhores opções, da mais fácil para a mais profissional.

---

## 🟢 Opção 1: Railway.app (Recomendada - Mais Fácil)
O Railway é excelente porque detecta automaticamente o seu código no GitHub e instala tudo o que precisa.

### Passos:
1. **GitHub**: Suba sua pasta no GitHub (ignore a `node_modules` e o `.env`).
2. **Conectar**: No [Railway.app](https://railway.app), crie um novo projeto e selecione o seu repositório do GitHub.
3. **Variáveis de Ambiente**: Vá na aba **Variables** e adicione todas as chaves do seu arquivo `.env` (SHEET_ID, GROUP_IDS, etc).
4. **Persistência (IMPORTANTE)**: No Railway, vá em **Settings > Volumes** e adicione um volume montado no caminho `/.wwebjs_auth`. Isso garante que você não precise escanear o QR Code toda vez que o bot reiniciar.
5. **Configuração de Browser**: O Railway instala o Chrome automaticamente se detectar o `puppeteer` no projeto.

---

## 🔵 Opção 2: Render.com (Grátis com limitações)
O Render tem um plano grátis que é ótimo para testes, mas ele "dorme" se não houver acessos.

### Passos:
1. Suba o código no GitHub.
2. No [Render](https://render.com), crie um **Web Service**.
3. Em **Environment Variables**, adicione os dados do `.env`.
4. **Build Command**: `npm install`
5. **Start Command**: `node index.js`
6. **Docker (Necessário)**: Para o WhatsApp Web funcionar bem no Render, você geralmente precisa de um `Dockerfile` porque o ambiente padrão deles não tem o Google Chrome/Chromium instalado.

---

## 🟠 Opção 3: VPS (Mais Estável e Barata a longo prazo)
Comprar um servidor Linux (ex: Hostinger, Contabo, DigitalOcean) por cerca de R$ 20-30/mês.

### Passos:
1. Acesse o servidor via SSH.
2. Instale o Node.js e o Chromium:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm chromium-browser
   ```
3. Instale o `pm2` para o bot nunca parar:
   ```bash
   npm install -g pm2
   pm2 start index.js --name bot-whatsapp
   pm2 startup
   pm2 save
   ```
4. O bot rodará 24h por dia.

---

## 🚨 O que você precisa ajustar no código?

Seu código já tem uma **Dashboard Visual** (http://localhost:3000) que mostra o QR Code. Isso é perfeito! Quando você subir para a internet:

1. Você acessará o endereço da nuvem (ex: `seu-bot.up.railway.app`).
2. Verá o QR Code na página.
3. Escaneará pelo celular.
4. O bot ficará "Online" na nuvem.

### Recomendação Final
Comece pelo **Railway.app**. É o caminho mais rápido para você ver seu bot rodando hoje mesmo sem terminal aberto.
