![IMG_20260401_032908](https://github.com/user-attachments/assets/90725a7d-3ad2-4ebf-8a63-9a3f28e31258)# Challenge API

API REST construida con NestJS, MongoDB y arquitectura hexagonal. Gestiona autenticación, locations, trucks y orders.

---

## Notas del desarrollador

**1. Por qué NestJS y arquitectura hexagonal**
NestJS encaja muy bien con este enfoque porque su sistema de módulos e inyección de dependencias hacen natural separar dominio, casos de uso e infraestructura. Los puertos son interfaces, los adaptadores los implementan, y TypeScript garantiza que ninguna capa se cuele en otra.

**2. Docker o local, los dos funcionan**
`docker compose up --build` levanta la API y MongoDB juntos sin instalar nada extra. Si se prefiere correr local con `npm run start:dev`, solo hay que asegurarse de que `MONGODB_URI` en el `.env` apunte a una instancia de MongoDB disponible.

**3. El módulo auth es mínimo a propósito**
Solo cubre registro y login. No hay roles, ni gestión de usuarios, ni edición de perfil. Está pensado para que sea fácil extenderlo siguiendo el mismo patrón hexagonal si se necesita.

**4. GET /orders retorna todo populado**
Por simplicidad, el listado de orders ya incluye el aggregate completo con user, truck, pickup y dropoff. En producción lo ideal sería un listado ligero además de paginación y un `GET /orders/:id` separado para el detalle.

**5. Eliminar locations o trucks no valida orders activas**
MongoDB no tiene foreign keys. Si se elimina un truck o una location que está referenciada en una order, esa order quedará con referencias vacias. Para evitarlo habría que validar dependencias antes del delete o implementar soft-delete.

---

## Requisitos

- Node.js 22+
- npm 10+
- MongoDB (local o en la nube) — **o** Docker + Docker Compose

---

## Variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1h`, `7d`) |
| `GOOGLE_PLACES_API_KEY` | Google Places API (New) key |
| `PORT` | Server port (default `3000`) |

---

## Opción 1 — Ejecución local

```bash
npm install
npm run start:dev
```

> **Nota:** `MONGODB_URI` debe apuntar a una instancia de MongoDB en ejecución, ya sea una local (`mongodb://localhost:27017/challenge`) o una cadena de conexión en la nube (MongoDB Atlas, etc.).

---

## Opción 2 — Ejecución con Docker

Levanta la API y un contenedor de MongoDB juntos. No se necesita MongoDB instalado localmente.

```bash
# First time or after code changes
docker compose up --build

# Subsequent runs (uses cached layers)
docker compose up
```

> **Nota:** `JWT_SECRET` y `GOOGLE_PLACES_API_KEY` deben estar definidos en el archivo `.env` antes de ejecutar. El compose fallará explícitamente si alguno falta.

---

## Documentación de la API

Una vez que el servidor esté corriendo, la interfaz interactiva de Swagger estará disponible en:

```
http://localhost:3000/api
```

### Módulos y endpoints

#### Auth — `/auth`
| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user, returns JWT |
| `POST` | `/auth/login` | Authenticate and get JWT |

#### Locations — `/locations`
> Requires `Authorization: Bearer <token>`

| Method | Path | Description |
|---|---|---|
| `POST` | `/locations` | Create a location from a Google Places `place_id` |
| `GET` | `/locations` | List all locations |
| `PATCH` | `/locations/:id` | Update address, latitude or longitude |
| `DELETE` | `/locations/:id` | Delete a location |

#### Trucks — `/trucks`
> Requires `Authorization: Bearer <token>`

| Method | Path | Description |
|---|---|---|
| `POST` | `/trucks` | Create a truck (assigned to the authenticated user) |
| `GET` | `/trucks` | List all trucks with owner info |
| `PATCH` | `/trucks/:id` | Update a truck (owner only) |
| `DELETE` | `/trucks/:id` | Delete a truck (owner only) |

#### Orders — `/orders`
> Requires `Authorization: Bearer <token>`

| Method | Path | Description |
|---|---|---|
| `POST` | `/orders` | Create an order (status starts as `created`) |
| `GET` | `/orders` | List all orders with all references populated |
| `PATCH` | `/orders/:id` | Update truck, pickup or dropoff (only when `created`) |
| `PATCH` | `/orders/:id/start` | Advance status from `created` → `in_transit` |
| `PATCH` | `/orders/:id/complete` | Advance status from `in_transit` → `completed` |
| `DELETE` | `/orders/:id` | Delete an order (any status) |

Diagrama super sencillo hecho en la pizarra previo a hacer el proyecto (perdón la mala caligrafia)
![IMG_20260401_032908](https://github.com/user-attachments/assets/734db8a7-3fa5-4ac2-b0e7-a223c74881c7)

