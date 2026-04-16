# Orion Core API

API REST para Orion Core (POS + inventario) construida con Node.js, TypeScript, Express y PocketBase, siguiendo Clean Architecture.

## Requisitos

- Node.js 20+
- PocketBase corriendo en local (por defecto en `http://127.0.0.1:8090`)

## Configuración

Crea el archivo `.env` en la carpeta `api` con:

```dotenv
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_SUPERUSER_EMAIL=tu_superuser_email
POCKETBASE_SUPERUSER_PASSWORD=tu_superuser_password
PORT=3000
JWT_SECRET=valor_largo_aleatorio
JWT_REFRESH_SECRET=valor_largo_aleatorio_distinto
REFRESH_TOKEN_PEPPER=valor_largo_aleatorio
```

Notas:

- `JWT_SECRET` firma access tokens.
- `JWT_REFRESH_SECRET` firma refresh tokens.
- `REFRESH_TOKEN_PEPPER` se usa para hashear refresh tokens antes de persistirlos.
- Los secretos deben ser distintos y no deben subirse a Git.

Generar secretos desde terminal:

```bash
openssl rand -base64 64
```

Ejecuta ese comando 3 veces y usa cada salida para:

- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `REFRESH_TOKEN_PEPPER`

## Scripts

```bash
npm run dev
npm run lint
npm run lint:fix
```

## Flujo de Autenticación

La API usa sesión continua con:

- Access token de corta duración.
- Refresh token de larga duración.
- Persistencia de sesión en colección `sessions` con hash del refresh token.
- Rotación de refresh token en cada refresh.
- Revocación explícita en logout.

### 1. Login

`POST /api/v1/auth/login`

Body:

```json
{
  "email": "admin-api@orion.local",
  "password": "123456789"
}
```

Respuesta esperada:

```json
{
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "expiresAt": "2026-04-14T00:00:00.000Z",
    "refreshTokenExpiresIn": 604800,
    "refreshTokenExpiresAt": "2026-04-21T00:00:00.000Z",
    "user": {
      "id": "...",
      "role": "ADMIN",
      "name": "...",
      "email": "..."
    }
  }
}
```

### 2. Refresh

`POST /api/v1/auth/refresh`

Body:

```json
{
  "refreshToken": "<refresh_token_actual>"
}
```

Comportamiento:

- Valida JWT refresh token.
- Verifica sesión activa en DB (no revocada y no expirada).
- Revoca sesión anterior.
- Crea nueva sesión con hash del nuevo refresh token.
- Devuelve nuevos tokens.

### 3. Logout

`POST /api/v1/auth/logout`

Body:

```json
{
  "refreshToken": "<refresh_token_actual>"
}
```

Comportamiento:

- Valida refresh token.
- Verifica sesión activa asociada.
- Revoca la sesión actual.
- Si el token ya estaba revocado/expirado, responde `INVALID_TOKEN`.

## Endpoints de Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

Nota: no existe registro publico de usuarios. La creacion de usuarios se realiza
desde rutas administrativas protegidas.

## Pruebas Manuales (Postman)

### Caso 1: login ok

1. Llamar `POST /api/v1/auth/login` con credenciales válidas.
2. Confirmar que devuelve `accessToken` y `refreshToken`.

### Caso 2: refresh ok

1. Usar `refreshToken` de login.
2. Llamar `POST /api/v1/auth/refresh`.
3. Confirmar que retorna tokens nuevos.

### Caso 3: refresh revocado (reuse)

1. Ejecutar refresh y guardar token nuevo.
2. Intentar refresh con token anterior.
3. Debe fallar con `INVALID_TOKEN`.

### Caso 4: logout ok

1. Llamar `POST /api/v1/auth/logout` con refresh token vigente.
2. Debe responder éxito.

### Caso 5: refresh después de logout

1. Intentar `POST /api/v1/auth/refresh` con el mismo token usado en logout.
2. Debe fallar con `INVALID_TOKEN`.

## Colección sessions (PocketBase)

Campos esperados:

- `userId` (relation, single, required)
- `refreshTokenHash` (text)
- `expiresAt` (date)
- `revokedAt` (date nullable)
- `created` (autodate)

## Arquitectura

- `domain`: entidades y contratos (`User`, `Session`, repositorios).
- `application`: casos de uso (`login`, `refresh`, `logout`).
- `infrastructure`: JWT, hashing y repositorios PocketBase.
- `presentation`: handlers, middlewares, rutas y validadores.
