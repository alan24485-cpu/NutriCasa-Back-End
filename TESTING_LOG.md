# Log de Pruebas E2E — 18 Mayo

## Rutas probadas:
- GET  /health                  ✅ 200 OK
- POST /api/auth/register       ✅ 201 — devuelve mensaje de verificación
- POST /api/auth/register       ✅ 400 — rechaza email duplicado correctamente

## Issues encontrados y resueltos:

### 1. app.ts ejecutaba server.start() al importarse
- **Problema:** Supertest abría puertos reales, Jest se quedaba colgado.
- **Solución:** Se separó el bootstrap en `src/server.ts`. `app.ts` solo exporta
  la instancia sin arrancar el servidor.

### 2. EmailService disparaba emails reales durante los tests
- **Problema:** El registro llama a `sendVerificationCode()`, que hace peticiones
  HTTP reales. Jest terminaba antes de que el email se enviara → "Cannot log
  after tests are done".
- **Solución:** `jest.mock('../services/emailService')` reemplaza el servicio
  con funciones falsas durante los tests. Cero emails reales.

### 3. Campos del body incorrectos en el test inicial
- **Problema:** El test enviaba `nombre` pero la API espera `name`. La respuesta
  de error usa `message`, no `errors`.
- **Solución:** Se ajustaron los tests para reflejar el contrato real de la API.

## Próximos pasos:
- Agregar tests para login (POST /api/auth/login)
- Agregar tests para rutas protegidas con JWT
- Probar endpoints de inventario y recetas
