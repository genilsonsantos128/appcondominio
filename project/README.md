# Sistema de Gerenciamento de Condomínio

Um sistema completo para gerenciamento de condomínios com integração de pagamentos reais via Mercado Pago.

## 🚀 Funcionalidades

### Para Moradores
- ✅ Cadastro e login seguro
- ✅ Visualização de avisos
- ✅ Envio de reclamações anônimas
- ✅ **Pagamento real de boletos via PIX, Boleto e Cartão**
- ✅ Histórico de pagamentos

### Para Administradores
- ✅ Dashboard administrativo
- ✅ Gerenciamento de avisos
- ✅ Criação de boletos
- ✅ Visualização de reclamações
- ✅ **Integração com Mercado Pago para pagamentos reais**

## 💳 Integração de Pagamentos

O sistema utiliza a API do **Mercado Pago** para gerar pagamentos reais:

- **PIX**: Pagamento instantâneo com QR Code
- **Boleto Bancário**: Boleto tradicional para pagamento em bancos
- **Cartão de Crédito**: Pagamento online com parcelamento

## ⚙️ Configuração

### 1. Criar conta no Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta de desenvolvedor
3. Obtenha suas credenciais:
   - **Access Token** (para backend)
   - **Public Key** (para frontend)

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
# Mercado Pago Configuration
VITE_MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui
VITE_MERCADO_PAGO_PUBLIC_KEY=sua_public_key_aqui

# Environment
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Executar o projeto

```bash
npm run dev
```

## 🔧 Como Funciona a Integração

### Fluxo de Pagamento

1. **Morador clica em "Pagar"** no boleto
2. **Modal de pagamento** abre com opções (PIX, Boleto, Cartão)
3. **Sistema chama API do Mercado Pago** para criar o pagamento
4. **Morador recebe**:
   - **PIX**: Código para copiar e colar no app do banco
   - **Boleto**: Link para baixar o boleto
   - **Cartão**: Redirecionamento para página de pagamento

### Estrutura do Código

```
src/
├── services/
│   └── paymentService.ts     # Integração com Mercado Pago
├── components/
│   └── Payment/
│       └── PaymentModal.tsx  # Modal de pagamento
└── ...
```

## 📱 Funcionalidades de Pagamento

### PIX
- Geração de código PIX instantâneo
- QR Code para pagamento
- Expiração automática na data de vencimento

### Boleto Bancário
- Geração de boleto tradicional
- Pagamento em qualquer banco
- Código de barras válido

### Cartão de Crédito
- Pagamento online seguro
- Parcelamento disponível
- Redirecionamento para checkout do Mercado Pago

## 🔒 Segurança

- Todas as transações são processadas pelo Mercado Pago
- Dados sensíveis não são armazenados localmente
- Tokens de acesso seguros
- Validação de pagamentos via webhook (recomendado para produção)

## 🚀 Deploy em Produção

### Variáveis de Ambiente de Produção

```env
VITE_MERCADO_PAGO_ACCESS_TOKEN=prod_access_token
VITE_MERCADO_PAGO_PUBLIC_KEY=prod_public_key
VITE_APP_ENV=production
VITE_API_URL=https://sua-api.com
```

### Webhooks (Recomendado)

Para produção, configure webhooks para receber notificações de pagamento:

```javascript
// Endpoint para receber notificações
POST /webhooks/mercadopago
```

## 📞 Suporte

Para dúvidas sobre a integração do Mercado Pago:
- [Documentação Oficial](https://www.mercadopago.com.br/developers/pt/docs)
- [SDKs e Bibliotecas](https://www.mercadopago.com.br/developers/pt/docs/sdks-library)

## 🎯 Próximos Passos

- [ ] Implementar webhooks para confirmação automática de pagamentos
- [ ] Adicionar relatórios financeiros
- [ ] Integrar com outros gateways de pagamento
- [ ] Adicionar notificações por email/SMS