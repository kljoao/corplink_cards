# Correções Sugeridas para o Backend Laravel

## Problema Identificado

O endpoint `/me` está retornando `firstname` e `lastname` separadamente, mas o frontend espera um campo `name` único.

## Solução 1: Modificar o Endpoint /me

```php
// Em routes/api.php, modifique a rota /me:
Route::get('/me', function(Request $request) {
    $user = $request->user();
    
    // Adicionar campo name calculado
    $user->name = trim($user->firstname . ' ' . $user->lastname);
    
    return $user;
});
```

## Solução 2: Modificar o Model User

```php
// Em app/Models/User.php, adicione um accessor:
public function getNameAttribute()
{
    return trim($this->firstname . ' ' . $this->lastname);
}

// Ou adicione ao array $appends:
protected $appends = ['name'];

public function getNameAttribute()
{
    return trim($this->firstname . ' ' . $this->lastname);
}
```

## Solução 3: Modificar o Controller updateProfile

```php
public function updateProfile(Request $request)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['message' => 'Usuário não autenticado.'], 401);
    }

    $validated = $request->validate([
        'fullname' => 'sometimes|string|max:255',
        'phone_prefix' => 'sometimes|string|max:10',
        'phone' => 'sometimes|string|max:20',
        'company' => 'sometimes|string|max:255',
        'sector' => 'sometimes|string|max:255',
        'revenue' => 'sometimes|string|max:255',
        'social_links' => 'sometimes|array',
        'social_links.instagram' => 'nullable|string|max:255',
        'social_links.linkedin' => 'nullable|string|max:255',
    ]);

    // Atualiza nome completo (firstname/lastname)
    if (isset($validated['fullname']) && !empty($validated['fullname'])) {
        $nameParts = preg_split('/\s+/', trim($validated['fullname']), 2);
        $user->firstname = $nameParts[0] ?? '';
        $user->lastname = $nameParts[1] ?? '';
        $user->save();
    }

    // Atualiza info (removendo fullname)
    $infoData = [];
    foreach (['phone_prefix', 'phone', 'company', 'sector', 'revenue', 'social_links'] as $field) {
        if (isset($validated[$field])) {
            $infoData[$field] = $validated[$field];
        }
    }
    
    if (!empty($infoData)) {
        $user->info()->update($infoData);
    }

    // Retorna o usuário atualizado com o campo name calculado
    $user->refresh();
    $user->name = trim($user->firstname . ' ' . $user->lastname);

    return response()->json([
        'message' => 'Perfil atualizado com sucesso.',
        'user' => $user
    ]);
}
```

## Solução 4: Resource Class (Recomendada)

```php
// Criar app/Http/Resources/UserResource.php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => trim($this->firstname . ' ' . $this->lastname),
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'info' => $this->info,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

// Usar nas rotas:
Route::get('/me', function(Request $request) {
    return new UserResource($request->user());
});
```

## Recomendação

Use a **Solução 4 (Resource Class)** pois é a mais limpa e mantém a consistência da API.

## Teste

Após implementar, teste com:

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
     -H "Accept: application/json" \
     https://admin.corplink.co/api/v1/me
```

Deve retornar:
```json
{
  "data": {
    "id": "9f0390fc-6930-4395-ad2b-043972f4bc2b",
    "name": "João Luis",
    "firstname": "João",
    "lastname": "Luis",
    "email": "joao@example.com",
    "info": { ... }
  }
}
``` 