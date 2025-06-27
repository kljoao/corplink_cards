# Sistema de Autenticação 2FA - CorpLink

Este documento descreve como o sistema de autenticação 2FA foi implementado no projeto CorpLink.

## Funcionalidades Implementadas

### 1. Autenticação 2FA
- **Login em duas etapas**: Email + código SMS
- **Proteção de rotas**: Middleware para verificar autenticação
- **Gerenciamento de tokens**: Cookies e localStorage
- **Logout seguro**: Limpeza de tokens e redirecionamento

### 2. Gerenciamento de Perfil
- **Atualização de dados pessoais**: Nome, telefone, empresa
- **Redes sociais**: Instagram e LinkedIn
- **Informações empresariais**: Segmento, faturamento
- **Upload de foto**: Drag & drop e seleção de arquivo

## Estrutura de Arquivos

```
lib/
├── auth.ts              # Serviço principal de autenticação
hooks/
├── useAuth.ts           # Hook personalizado para autenticação
app/
├── login/page.tsx       # Página de login 2FA
├── perfil/page.tsx      # Página de perfil do usuário
components/
├── DebugPanel.tsx       # Painel de debug (desenvolvimento)
middleware.ts            # Proteção de rotas
```

## Endpoints da API

### Autenticação
- `POST /api/v1/auth/init` - Inicia processo 2FA
- `POST /api/v1/auth/verify` - Verifica código 2FA
- `POST /api/v1/auth/logout` - Faz logout
- `GET /api/v1/me` - Busca dados do usuário (protegido por auth:sanctum)

### Perfil
- `PUT /api/v1/profile` - Atualiza perfil do usuário (protegido por auth:sanctum)

## Rotas Laravel Configuradas

```php
Route::prefix('v1')->group(function () {
    Route::post('/auth/init', [AuthController::class, 'initAuth']);
    Route::post('/auth/verify', [AuthController::class, 'verifyAuth']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', function(Request $request) {
            return $request->user();
        });
        
        Route::put('/profile', [UserController::class, 'updateProfile']);
    });
});
```

## Como Usar

### 1. Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API=https://admin.corplink.co/api
NEXT_PUBLIC_AUTH_ENABLED=true
```

### 2. Login

O usuário acessa `/login` e:
1. Digita o email
2. Recebe código SMS
3. Digita o código de 4 dígitos
4. É redirecionado para `/perfil`

### 3. Proteção de Rotas

Rotas protegidas automaticamente:
- `/perfil` - Requer autenticação

### 4. Atualização de Perfil

Na página `/perfil`, o usuário pode:
- Editar informações pessoais
- Atualizar dados da empresa
- Conectar redes sociais
- Fazer logout

## Componentes Principais

### AuthService (`lib/auth.ts`)
```typescript
// Iniciar autenticação
await authService.initAuth(email)

// Verificar código
await authService.verifyAuth(email, pin)

// Atualizar perfil
await authService.updateProfile(profileData)

// Verificar se está autenticado
authService.isAuthenticated()

// Buscar dados do usuário
await authService.getCurrentUser()
```

### useAuth Hook (`hooks/useAuth.ts`)
```typescript
const { user, isAuthenticated, isLoading, login, logout, updateProfile } = useAuth()
```

## Estrutura de Dados

### UpdateProfileData
```typescript
interface UpdateProfileData {
  fullname?: string
  phone_prefix?: string
  phone?: string
  company?: string
  sector?: string
  revenue?: string
  social_links?: {
    instagram?: string
    linkedin?: string
  }
}
```

### User
```typescript
interface User {
  id: string
  name?: string // Campo opcional para compatibilidade
  firstname?: string // Campo do Laravel
  lastname?: string // Campo do Laravel
  email: string
  avatar?: string
  info?: {
    company?: string
    occupation?: string
    sector?: string
    phone?: string
    phone_prefix?: string
    social_links?: {
      instagram?: string
      linkedin?: string
    }
    revenue?: string
    birthday?: string
    numid?: string
    created_at?: string
    updated_at?: string
  }
}
```

### Mapeamento do Faturamento Anual (Revenue)

O campo `revenue` da API é mapeado para "Faturamento Anual" no frontend:

| API (revenue) | Frontend (Faturamento Anual) |
|---------------|------------------------------|
| `"-10MM"` | "Até 10 milhões" |
| `"10MM-30MM"` | "De 10 a 30 milhões" |
| `"30MM-50MM"` | "De 30 a 50 milhões" |
| `"+50MM"` | "Mais de 50 milhões" |

**Exemplo de conversão:**
```typescript
// API retorna: revenue: "-10MM"
// Frontend exibe: "Até 10 milhões"

// Usuário seleciona: "De 30 a 50 milhões"
// Frontend envia: revenue: "30MM-50MM"
```

### Formatação de Telefone

O sistema aplica máscara automática no campo telefone:

**Formatos suportados:**
- **Telefone fixo**: `(21) 3333-4444`
- **Celular**: `(21) 9 9999-9999`

**Processo de formatação:**
1. Usuário digita números
2. Sistema aplica máscara automaticamente
3. Ao salvar: extrai DDD e número para API
4. Ao carregar: formata dados da API para exibição

### Validação de Data de Nascimento

O campo "Data de Nascimento" agora é editável com validações:

**Regras de validação:**
- ✅ **Idade mínima**: 16 anos
- ✅ **Idade máxima**: 95 anos
- ✅ **Não pode ser no futuro**
- ✅ **Formato**: YYYY-MM-DD

**Exemplo de validação:**
```typescript
// Data válida: 1990-05-15 (idade: 33 anos)
// Data inválida: 2010-05-15 (idade: 13 anos) → "Você deve ter pelo menos 16 anos"
// Data inválida: 1900-05-15 (idade: 123 anos) → "Data de nascimento inválida"
```

## Fluxo de Autenticação

1. **Acesso à página protegida**
   - Middleware verifica token
   - Se não autenticado → redireciona para `/login`

2. **Login**
   - Usuário digita email
   - Sistema envia código SMS
   - Usuário digita código
   - Token é salvo em cookies e localStorage

3. **Acesso ao perfil**
   - Hook `useAuth` carrega dados do usuário via `/me`
   - Interface é atualizada com dados reais

4. **Atualização de perfil**
   - Dados são enviados para `/profile`
   - Perfil é atualizado em tempo real

## Debug e Testes

### Painel de Debug
Em desenvolvimento, um painel de debug é exibido na página `/perfil` com:
- Status de autenticação
- Teste do endpoint `/me`
- Informações do token
- Dados do usuário atual

### Console Logs
- Dados sendo enviados para atualização de perfil
- Erros de conexão e validação

## Tratamento de Erros

- **Erro de conexão**: Mensagem amigável para o usuário
- **Código inválido**: Permite reenvio após 60 segundos
- **Token expirado**: Logout automático e redirecionamento
- **Dados inválidos**: Validação no frontend e backend

## Segurança

- **Tokens**: Armazenados em cookies seguros (SameSite=Strict)
- **HTTPS**: Todas as requisições usam HTTPS
- **Validação**: Dados validados no frontend e backend
- **Logout**: Limpeza completa de tokens
- **Middleware**: Proteção de rotas no servidor

## Próximos Passos

1. **Implementar refresh token**
2. **Adicionar recuperação de senha**
3. **Implementar notificações push**
4. **Adicionar autenticação biométrica**
5. **Implementar sessões múltiplas**

## Troubleshooting

### Problema: Token não é salvo
**Solução**: Verificar se o domínio está configurado corretamente para cookies

### Problema: Middleware não funciona
**Solução**: Verificar se o arquivo `middleware.ts` está na raiz do projeto

### Problema: API retorna erro 401
**Solução**: Verificar se o token está sendo enviado corretamente no header Authorization

### Problema: Dados não são atualizados
**Solução**: Verificar se o endpoint `/api/v1/profile` está funcionando

### Problema: Endpoint /me não retorna dados
**Solução**: Verificar se o middleware `auth:sanctum` está configurado corretamente

### Problema: Debug panel não aparece
**Solução**: Verificar se está em modo de desenvolvimento (`NODE_ENV !== 'production'`) 