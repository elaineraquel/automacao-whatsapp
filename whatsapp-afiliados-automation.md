# 🚀 SKILL: Automação de Links de Afiliados para WhatsApp via Make.com

## 📌 O QUE VOCÊ VAI CONSEGUIR FAZER

Enviar automaticamente 6-8 ofertas por dia do Google Sheets para grupos do WhatsApp, com imagem e mensagem personalizada, tudo no piloto automático.

---

## 🎯 POR QUE USAR O MAKE.COM?

✅ **Interface visual** - arrastar e soltar, sem código  
✅ **1.000 operações grátis/mês** - suficiente para 300+ envios  
✅ **Integração nativa com Google Sheets**  
✅ **Webhooks para WhatsApp**  
✅ **Agendamento automático**  

**Para 6-8 msgs/dia = ~240 msgs/mês = TOTALMENTE GRATUITO!**

---

## 📋 FERRAMENTAS NECESSÁRIAS (TODAS GRATUITAS)

1. ✅ Google Sheets (você já tem)
2. ✅ Make.com (conta grátis)
3. ✅ Evolution API (WhatsApp - grátis)
4. ✅ Google Drive ou Imgur (para imagens - grátis)

---

# 🔧 PARTE 1: PREPARAÇÃO INICIAL

## PASSO 1: Criar Planilha Google Sheets Estruturada

### 1.1 - Acesse Google Sheets e crie nova planilha

Nomeie como: **"Ofertas Afiliados"**

### 1.2 - Monte essa estrutura EXATA:

```
| A         | B              | C           | D            | E      | F       | G          | H           |
|-----------|----------------|-------------|--------------|--------|---------|------------|-------------|
| Produto   | Link_Afiliado  | Descrição   | URL_Imagem   | Preço  | Status  | Data_Envio | Hora_Enviar |
| Fone JBL  | https://amzn..| Fone top... | https://...  | R$ 89  | PRONTO  |            | 09:00       |
| Mouse RGB | https://amzn..| Mouse gamer | https://...  | R$ 45  | PRONTO  |            | 11:00       |
```

### 1.3 - Regras importantes da planilha:

**Coluna F (Status)** - Possíveis valores:
- `PRONTO` = Pronto para enviar
- `ENVIADO` = Já foi enviado
- `PAUSADO` = Não enviar ainda

**Coluna H (Hora_Enviar)** - Formato: `09:00`, `14:30`, etc.
- Distribua em horários diferentes ao longo do dia
- Exemplo: 09:00, 11:00, 14:00, 16:00, 18:00, 20:00

**Coluna D (URL_Imagem)** - Deve ser link público:
- Google Drive: Clique direito > Compartilhar > Qualquer pessoa com o link
- Imgur: Faça upload > Copie o link direto
- Formato final: `https://i.imgur.com/ABC123.jpg`

### 1.4 - Preencha pelo menos 10 produtos de exemplo

---

## PASSO 2: Configurar Evolution API (WhatsApp)

### Opção A: Usar Railway.app (RECOMENDADO - Mais Fácil)

#### 2.1 - Criar conta no Railway
1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub (gratuito)

#### 2.2 - Deploy da Evolution API
1. Clique em **"Deploy from Template"**
2. Busque por: **"Evolution API"**
3. OU use este link direto: https://github.com/EvolutionAPI/evolution-api
4. Clique em **"Deploy Now"**

#### 2.3 - Configurar variáveis (Railway vai pedir):
```
AUTHENTICATION_API_KEY = crie uma senha forte (ex: MinhaKey123!)
SERVER_URL = (Railway vai gerar automaticamente)
```

#### 2.4 - Aguarde o deploy (2-3 minutos)
- Railway vai gerar uma URL tipo: `https://evolution-api-production-abc123.up.railway.app`
- **COPIE ESSA URL!** Você vai precisar

#### 2.5 - Conectar seu WhatsApp
1. Acesse a URL gerada + `/manager`
   - Exemplo: `https://evolution-api-production-abc123.up.railway.app/manager`
2. Clique em **"Create Instance"**
3. Nomeie como: `afiliados`
4. Clique em **"Connect"**
5. **ESCANEIE O QR CODE** com seu WhatsApp
6. Status vai mudar para: ✅ Connected

#### 2.6 - Pegar credenciais importantes
- **Instance Name**: `afiliados`
- **API URL**: A URL do Railway
- **API Key**: A senha que você criou no passo 2.3

---

### Opção B: Rodar no seu PC (Alternativa)

```bash
# 1. Instalar Node.js (https://nodejs.org)
# 2. Clonar repositório
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# 3. Instalar dependências
npm install

# 4. Configurar (criar arquivo .env)
AUTHENTICATION_API_KEY=MinhaKey123!
SERVER_URL=http://localhost:8080

# 5. Iniciar
npm run start:prod

# 6. Acessar: http://localhost:8080/manager
```

⚠️ **Desvantagem**: Seu PC precisa ficar ligado 24/7

---

## PASSO 3: Pegar IDs dos Grupos WhatsApp

### 3.1 - Método Manual (Mais Fácil)

1. Acesse o Manager da Evolution API
2. Vá em **"Get Groups"** ou **"Fetch Groups"**
3. Você verá lista de todos os grupos
4. Copie o **ID** (formato: `120363XXXXX@g.us`)

**Exemplo:**
```
Grupo: Ofertas do Dia
ID: 120363025410425452@g.us

Grupo: Descontos Imperdíveis  
ID: 120363189674521365@g.us
```

### 3.2 - Criar uma nota com seus IDs:

```
GRUPO 1: 120363025410425452@g.us
GRUPO 2: 120363189674521365@g.us
GRUPO 3: 120363189674521365@g.us
```

---

## PASSO 4: Hospedar Imagens (Escolha 1 opção)

### Opção A: Google Drive (Recomendado)

1. Faça upload das imagens no Drive
2. Clique direito > **Compartilhar**
3. Altere para: **"Qualquer pessoa com o link"**
4. Copie o link (formato: `https://drive.google.com/file/d/ABC123/view`)
5. **TRANSFORME** para link direto:
   - De: `https://drive.google.com/file/d/ABC123XYZ/view`
   - Para: `https://drive.google.com/uc?export=view&id=ABC123XYZ`

### Opção B: Imgur (Mais Simples)

1. Acesse: https://imgur.com
2. Clique em **"New Post"**
3. Faça upload da imagem
4. Clique direito na imagem > **"Copy Image Address"**
5. Cole na planilha: `https://i.imgur.com/ABC123.jpg`

---

# 🎨 PARTE 2: CONFIGURAR MAKE.COM

## PASSO 5: Criar Conta no Make.com

1. Acesse: https://www.make.com
2. Clique em **"Get Started Free"**
3. Cadastre-se com email
4. **Plano Free**: 1.000 operações/mês (PERFEITO para você!)

---

## PASSO 6: Criar Seu Primeiro Cenário (Automação)

### 6.1 - Criar novo cenário
1. No painel do Make, clique em **"Scenarios"** (menu esquerda)
2. Clique em **"Create a new scenario"**
3. Nomeie: **"Envio Automático Afiliados"**

### 6.2 - Estrutura que vamos montar:

```
[Google Sheets] → [Filtro] → [Iterator] → [WhatsApp Webhook] → [Atualizar Sheets]
```

---

## PASSO 7: Módulo 1 - Buscar Ofertas do Google Sheets

### 7.1 - Adicionar módulo Google Sheets
1. Clique no **"+"** grande no centro
2. Busque: **"Google Sheets"**
3. Selecione: **"Search Rows"**

### 7.2 - Conectar sua conta Google
1. Clique em **"Add"** ao lado de "Connection"
2. Faça login com sua conta Google
3. Autorize o Make.com

### 7.3 - Configurar busca:
- **Spreadsheet**: Selecione "Ofertas Afiliados"
- **Sheet**: Selecione "Sheet1" (ou nome da aba)
- **Filter**: Configurar filtro avançado

### 7.4 - Configurar o filtro para pegar apenas ofertas certas:

Clique em **"Show advanced settings"**

**Filtro 1 - Status PRONTO:**
```
Column: Status (F)
Operator: Equal to
Value: PRONTO
```

**Filtro 2 - Hora atual (enviar só no horário certo):**
```
Column: Hora_Enviar (H)
Operator: Equal to
Value: {{formatDate(now; "HH:mm")}}
```

Isso vai buscar apenas linhas que:
- Status = PRONTO
- Hora_Enviar = hora atual (ex: se são 09:00, pega só as de 09:00)

### 7.5 - Outras configurações:
- **Maximum number of returned rows**: 10
- **Returns**: All matching rows

**Clique em OK**

---

## PASSO 8: Módulo 2 - Filtro (Garantir que tem dados)

### 8.1 - Adicionar módulo Filter
1. Clique no **"+"** após Google Sheets
2. Busque: **"Flow Control"**
3. Selecione: **"Filter"**

### 8.2 - Configurar condição:
```
Label: Verificar se tem ofertas
Condition:
  - Total number of bundles (do módulo anterior) > 0
```

Isso evita erros quando não há ofertas para enviar.

---

## PASSO 9: Módulo 3 - Iterator (Processar cada oferta)

### 9.1 - Adicionar Iterator
1. Clique no **"+"**
2. Busque: **"Iterator"**
3. Selecione: **"Iterator"**

### 9.2 - Configurar:
```
Array: Selecione o output do Google Sheets (vai aparecer como lista)
```

Isso vai processar cada linha da planilha uma por vez.

---

## PASSO 10: Módulo 4 - Enviar para WhatsApp (HTTP Webhook)

### 10.1 - Adicionar módulo HTTP
1. Clique no **"+"**
2. Busque: **"HTTP"**
3. Selecione: **"Make a request"**

### 10.2 - Configurar requisição:

**URL:**
```
https://SUA_URL_EVOLUTION_API/message/sendMedia/afiliados
```
Substitua `SUA_URL_EVOLUTION_API` pela URL do Railway (passo 2.4)

**Method:** POST

**Headers:**
```
Content-Type: application/json
apikey: MinhaKey123!
```
(Use a API Key que você criou no passo 2.3)

**Body type:** Raw

**Request content (JSON):**
```json
{
  "number": "120363025410425452@g.us",
  "options": {
    "delay": 1200,
    "presence": "composing"
  },
  "mediaMessage": {
    "mediatype": "image",
    "media": "{{URL_Imagem}}",
    "caption": "🔥 *{{Produto}}* 🔥\n\n{{Descrição}}\n\n💰 *{{Preço}}*\n\n🛒 {{Link_Afiliado}}\n\n⏰ Oferta por tempo limitado!"
  }
}
```

### 10.3 - Mapear campos dinâmicos:

Clique nos campos entre `{{}}` e selecione do Iterator:
- `{{Produto}}` → Selecione coluna "Produto" (A)
- `{{Descrição}}` → Selecione coluna "Descrição" (C)
- `{{URL_Imagem}}` → Selecione coluna "URL_Imagem" (D)
- `{{Preço}}` → Selecione coluna "Preço" (E)
- `{{Link_Afiliado}}` → Selecione coluna "Link_Afiliado" (B)

### 10.4 - Para enviar em MÚLTIPLOS GRUPOS:

**Opção 1 - Criar módulo separado para cada grupo:**
- Duplique o módulo HTTP (Ctrl+C, Ctrl+V)
- Altere apenas o "number" para o ID do próximo grupo
- Adicione delay entre eles (veja passo 11)

**Opção 2 - Usar array de grupos (avançado):**
```json
"number": "{{if(1.Grupo = 1; "ID_GRUPO_1"; if(1.Grupo = 2; "ID_GRUPO_2"; "ID_GRUPO_3"))}}"
```

---

## PASSO 11: Módulo 5 - Sleep (Evitar Ban)

### 11.1 - Adicionar Sleep entre grupos
1. Clique no **"+"** após cada HTTP
2. Busque: **"Tools"**
3. Selecione: **"Sleep"**

### 11.2 - Configurar:
```
Delay: 3
```
(3 segundos de pausa entre mensagens)

⚠️ **IMPORTANTE**: Adicione Sleep entre CADA envio para CADA grupo diferente!

---

## PASSO 12: Módulo 6 - Atualizar Status no Sheets

### 12.1 - Adicionar módulo Google Sheets
1. Clique no **"+"** no final
2. Busque: **"Google Sheets"**
3. Selecione: **"Update a Row"**

### 12.2 - Configurar:
- **Spreadsheet**: Ofertas Afiliados
- **Sheet**: Sheet1
- **Row number**: `{{Row number}}` (do Iterator)
- **Values to update**:
  - **Status (F)**: `ENVIADO`
  - **Data_Envio (G)**: `{{formatDate(now; "DD/MM/YYYY HH:mm")}}`

Isso marca a oferta como enviada automaticamente!

---

## PASSO 13: Agendar Automação

### 13.1 - Configurar Schedule (Relógio)
1. Clique no **relógio** no primeiro módulo
2. Selecione: **"Schedule setting"**

### 13.2 - Escolher frequência:

**Opção A - Verificar a cada hora:**
```
Run scenario: Every hour
Start: 08:00
End: 21:00
```
Vai verificar de hora em hora se tem algo para enviar.

**Opção B - Horários específicos:**
```
Run scenario: At regular intervals
Interval: Custom
Times: 09:00, 11:00, 14:00, 16:00, 18:00, 20:00
```
Só roda nos horários que você definiu.

### 13.3 - Ativar o cenário:
- Toggle **ON** no canto superior direito
- Status muda para: ✅ **Active**

---

# 🎯 PARTE 3: TEMPLATES E OTIMIZAÇÕES

## PASSO 14: Modelos de Mensagem Profissionais

### Modelo 1 - Minimalista
```
✨ {{Produto}}

{{Descrição}}

💰 {{Preço}}

👉 {{Link_Afiliado}}
```

### Modelo 2 - Com Urgência
```
🚨 OFERTA RELÂMPAGO 🚨

{{Produto}}

{{Descrição}}

💵 De: R$ XXX
💰 Por: {{Preço}}

🔗 {{Link_Afiliado}}

⏰ Só hoje! Corre!
```

### Modelo 3 - Storytelling
```
🎁 Encontrei ISSO para você!

{{Produto}} 

{{Descrição}}

Já vi gente pagando MUITO mais caro...

💰 Aqui tá saindo por: {{Preço}}

🛒 Pega logo: {{Link_Afiliado}}

Amanhã pode não estar mais nesse preço! ⚡
```

### Modelo 4 - Com Emoji Box
```
╔══════════════════╗
   🔥 DESTAQUE DO DIA
╚══════════════════╝

{{Produto}}

📝 {{Descrição}}

💰 *{{Preço}}*

🎯 {{Link_Afiliado}}

✅ Entrega rápida
✅ Frete grátis*
```

---

## PASSO 15: Estratégia de Horários (6-8 msgs/dia)

### Distribuição Inteligente:

**Segunda a Sexta:**
```
09:00 - Oferta matinal (produtos para trabalho)
11:00 - Pausa para café (lanches, utensílios)
14:00 - Pós-almoço (eletrônicos)
16:00 - Meio da tarde (casa e decoração)
18:00 - Saída do trabalho (moda, acessórios)
20:00 - Noite (entretenimento, lazer)
```

**Finais de Semana:**
```
10:00 - Manhã tranquila
14:00 - Tarde de descanso
17:00 - Fim de tarde
20:00 - Noite de sábado/domingo
```

### Na planilha:
```
| Produto      | ... | Hora_Enviar |
|--------------|-----|-------------|
| Mouse Gamer  | ... | 09:00       |
| Fone Bluetooth| .. | 11:00       |
| Livro Python | ... | 14:00       |
```

---

## PASSO 16: Sistema de Rotação de Grupos

### Evitar Spam - Enviar para grupos diferentes:

**Adicione coluna "Grupo_Alvo" na planilha:**

```
| Produto | Link | Descrição | URL_Imagem | Preço | Status | Data_Envio | Hora | Grupo_Alvo |
|---------|------|-----------|------------|-------|--------|------------|------|------------|
| Mouse   | ...  | ...       | ...        | R$ 45 | PRONTO |            | 09:00| 1          |
| Teclado | ...  | ...       | ...        | R$ 89 | PRONTO |            | 11:00| 2          |
```

**No Make.com - Módulo HTTP:**

Altere o campo "number":
```json
"number": "{{if(Grupo_Alvo = 1; "ID_GRUPO_1"; if(Grupo_Alvo = 2; "ID_GRUPO_2"; "ID_GRUPO_3"))}}"
```

Assim cada oferta vai para um grupo diferente, sem sobrecarregar!

---

## PASSO 17: Rastreamento e Analytics

### Adicionar colunas de controle:

```
| ... | Status | Data_Envio | Hora_Envio | Grupos_Enviados | Cliques_Estimados |
|-----|--------|------------|------------|-----------------|-------------------|
| ... | ENVIADO| 28/03/2026 | 09:15      | Grupo1,Grupo2   | 12                |
```

### No Make - Adicionar módulo Google Sheets (Update):
```
Grupos_Enviados: "Grupo1,Grupo2,Grupo3"
Hora_Envio: {{formatDate(now; "HH:mm")}}
```

---

## PASSO 18: Tratamento de Erros

### 18.1 - Adicionar Error Handler

1. Clique com botão direito no módulo HTTP
2. Selecione: **"Add error handler"**
3. Escolha: **"Ignore"** ou **"Rollback"**

### 18.2 - Criar rota alternativa:

```
[HTTP] → (erro) → [Google Sheets: Update]
                   ↓
                   Status: "ERRO"
                   Observação: "Falha no envio"
```

### 18.3 - Notificação de erro (opcional):

Adicione módulo:
- **Email** → "Send me an Email"
- Assunto: "Erro no envio de afiliados"
- Corpo: "Oferta {{Produto}} falhou. Verifique!"

---

# 📊 PARTE 4: MONITORAMENTO E OTIMIZAÇÃO

## PASSO 19: Dashboard de Controle

### Criar aba "Dashboard" no Sheets:

```
=== ESTATÍSTICAS ===
Total de Ofertas: =COUNTA(Sheet1!A:A)-1
Enviadas Hoje: =COUNTIFS(Sheet1!F:F;"ENVIADO";Sheet1!G:G;">="&TODAY())
Prontas para Enviar: =COUNTIF(Sheet1!F:F;"PRONTO")
Taxa de Sucesso: =ENVIADAS/TOTAL*100

=== PRÓXIMOS ENVIOS ===
(Use fórmula FILTER para mostrar próximas ofertas)
```

---

## PASSO 20: Checklist Final - Testar Tudo!

### ✅ Checklist pré-ativação:

- [ ] Planilha preenchida com 10+ ofertas
- [ ] Coluna Status = "PRONTO" nas ofertas ativas
- [ ] Coluna Hora_Enviar preenchida (formato HH:mm)
- [ ] URLs de imagem funcionando (testar no navegador)
- [ ] Evolution API conectada (status: Connected)
- [ ] IDs dos grupos corretos
- [ ] Make.com cenário criado e configurado
- [ ] Teste manual executado (Run once)
- [ ] Schedule ativado
- [ ] Cenário ligado (toggle ON)

### 🧪 Teste manual:

1. No Make, clique em **"Run once"**
2. Verifique nos grupos se chegou a mensagem
3. Confira se Status mudou para "ENVIADO" na planilha
4. Se deu tudo certo: **ATIVE o cenário!**

---

# 🚀 PARTE 5: INDO ALÉM

## PASSO 21: Variações Avançadas

### A) Rodízio de Mensagens (Não parecer robô)

Adicione coluna "Tipo_Mensagem" na planilha:
```
Tipo_Mensagem: 1, 2, 3, 4
```

No Make - Campo caption do HTTP:
```json
"caption": "{{if(Tipo_Mensagem = 1; "Template 1"; if(Tipo_Mensagem = 2; "Template 2"; "Template 3"))}}"
```

### B) Enviar apenas dias úteis

No Schedule do Make:
```
Advanced scheduling
Days: Monday, Tuesday, Wednesday, Thursday, Friday
```

### C) Limite de msgs por grupo/dia

Adicione módulo "Data Store" no Make:
- Armazene contador de mensagens
- Se > 3 mensagens no mesmo grupo hoje → pular

---

## PASSO 22: Troubleshooting (Resolver Problemas)

### ❌ Problema: "Mensagem não chega no grupo"

**Soluções:**
1. Verifique se o ID do grupo está correto (deve ter @g.us no final)
2. Confirme que você é admin do grupo
3. Teste enviar manualmente pela Evolution API Manager
4. Verifique se a Evolution API está online (acesse /manager)

### ❌ Problema: "Imagem não aparece"

**Soluções:**
1. Teste a URL da imagem no navegador (deve abrir a imagem diretamente)
2. Se for Google Drive, use formato: `https://drive.google.com/uc?export=view&id=ID_AQUI`
3. Prefira Imgur para links mais confiáveis
4. Tamanho máximo: 5MB

### ❌ Problema: "Status não atualiza no Sheets"

**Soluções:**
1. Verifique se o módulo "Update Row" está configurado
2. Confirme que o "Row number" está mapeado corretamente
3. Teste manualmente o módulo Update isolado

### ❌ Problema: "Make.com diz 'Out of operations'"

**Solução:**
- Você excedeu 1.000 ops/mês
- Reduza a frequência do schedule
- Ou upgrade para plano pago (não recomendado para teste)

---

## PASSO 23: Manutenção Semanal

### Segunda-feira:
- [ ] Adicionar 10-15 novas ofertas na planilha
- [ ] Definir horários diferentes para cada uma
- [ ] Marcar ofertas antigas como "PAUSADO"

### Quarta-feira:
- [ ] Revisar dashboard - quantas foram enviadas?
- [ ] Verificar se Evolution API está online
- [ ] Ajustar horários se necessário

### Sexta-feira:
- [ ] Preparar ofertas para fim de semana
- [ ] Verificar histórico de execuções no Make
- [ ] Limpar ofertas muito antigas (>30 dias)

---

# 🎓 RESUMO EXECUTIVO

## ⚡ Quick Start (Resumão):

1. **Planilha Google Sheets** → Estrutura com colunas: Produto, Link, Descrição, URL_Imagem, Preço, Status, Data_Envio, Hora_Enviar
2. **Evolution API** no Railway → Deploy, conectar WhatsApp, pegar API key e IDs dos grupos
3. **Make.com** → Criar cenário com módulos: Google Sheets (buscar) → Iterator → HTTP (WhatsApp) → Google Sheets (atualizar)
4. **Agendar** → Schedule para rodar de hora em hora (08h-21h)
5. **Testar** → Run once, verificar, ativar!

## 💰 Custos:

- Google Sheets: **GRÁTIS**
- Evolution API (Railway): **GRÁTIS** (até 500h/mês)
- Make.com: **GRÁTIS** (1.000 ops/mês)
- Imgur: **GRÁTIS**

**Total: R$ 0,00/mês** ✅

## 📈 Escalabilidade:

- 6-8 msgs/dia = ~240/mês = **180 operações** no Make
- Sobram 820 operações para testes e ajustes
- Quando crescer: Railway continua grátis, Make upgrade por $9/mês

---

# 🆘 SUPORTE

## Precisa de ajuda?

**Comunidades:**
- Make.com: https://community.make.com
- Evolution API: https://github.com/EvolutionAPI/evolution-api/discussions

**Documentação:**
- Make.com: https://www.make.com/en/help/tools
- Evolution API: https://doc.evolution-api.com

---

# ✅ CHECKLIST FINAL DE SUCESSO

- [ ] Planilha criada e preenchida
- [ ] Evolution API rodando e conectada
- [ ] IDs dos grupos coletados
- [ ] Imagens hospedadas (URLs públicas)
- [ ] Make.com configurado
- [ ] Teste manual bem-sucedido
- [ ] Schedule ativado
- [ ] Primeira mensagem enviada com sucesso! 🎉

---

**Criado por: Claude (Anthropic)**  
**Data: Março 2026**  
**Versão: 1.0 - Automação de Afiliados para WhatsApp**

---

## 🎯 PRÓXIMOS PASSOS APÓS DOMINAR:

1. **A/B Testing**: Testar diferentes modelos de mensagem
2. **Segmentação**: Grupos diferentes recebem ofertas diferentes
3. **Retargeting**: Re-enviar ofertas que tiveram boa conversão
4. **Analytics**: Integrar com bit.ly para rastrear cliques nos links
5. **Multi-canal**: Expandir para Telegram, Discord, Email

**BOA SORTE! 🚀**
