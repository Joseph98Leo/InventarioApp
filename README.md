# API de Inventario para Tienda de Ropa

Backend API REST para gestionar inventario de productos de ropa con variantes, control de stock y transacciones de venta/entrada.

## 🚀 Características

- ✅ **Autenticación JWT** con roles (ADMIN, VENDEDORA)
- ✅ **Gestión de Productos** con variantes de talla y color
- ✅ **Control de Stock** con seguimiento de movimientos
- ✅ **Transacciones** de venta y entrada de mercadería
- ✅ **Documentación Swagger** automática
- ✅ **PostgreSQL** con Prisma ORM
- ✅ **Validación** automática de DTOs
- ✅ **Docker** ready para despliegue

## 📋 Requisitos

- Node.js >= 18
- PostgreSQL >= 14 (o Docker)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar e instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus configuraciones
```

### 3. Iniciar base de datos con Docker
```bash
docker-compose up -d
```

### 4. Generar Prisma Client
```bash
npm run prisma:generate
```

### 5. Ejecutar migraciones
```bash
npm run prisma:migrate
```

### 6. Poblar datos iniciales (seed)
```bash
npm run prisma:seed
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📚 Documentación API

Una vez iniciada la aplicación, accede a:
- **Swagger UI**: http://localhost:3000/api/docs

## 🔑 Credenciales de acceso por defecto

Después del seed, puedes usar:
- **Admin**: admin@tienda.com / Admin123!
- **Vendedora**: vendedora@tienda.com / Vendedora123!

## 📦 Estructura del Proyecto

```
src/
├── auth/              # Autenticación JWT
├── users/             # Gestión de usuarios
├── prisma/            # Servicio Prisma global
├── common/            # Guards, filters, decorators compartidos
└── main.ts            # Bootstrap de la aplicación

prisma/
├── schema.prisma      # Esquema de base de datos
└── seed.ts            # Datos iniciales
```

## 🗄️ Base de Datos

### Ver datos con Prisma Studio
```bash
npm run prisma:studio
```

### Crear nueva migración
```bash
npm run prisma:migrate
```

## 🔒 Endpoints Principales

### Autenticación
- **POST** `/api/v1/auth/login` - Login
- **POST** `/api/v1/auth/register` - Registro (admin only)

### Usuarios
- **GET** `/api/v1/users/me` - Perfil actual
- **GET** `/api/v1/users` - Listar usuarios (admin only)

## 🚀 Despliegue

### Con Docker
```bash
docker-compose up --build
```

### Variables de entorno para producción
```env
DATABASE_URL="postgresql://user:password@host:5432/db"
JWT_SECRET="generate-secure-random-key-here"
NODE_ENV=production
PORT=3000
```

## 🤝 Mejores Prácticas Aplicadas (NestJS)

- ✅ Arquitectura modular por features
- ✅ Inyección de dependencias con constructor injection
- ✅ Guards globales para autenticación/autorización
- ✅ DTOs con validación automática (class-validator)
- ✅ Exception filters para manejo centralizado de errores
- ✅ Repository pattern para abstracción de datos
- ✅ Configuración desde variables de entorno
- ✅ Documentación OpenAPI/Swagger

## 📝 LICENSE

UNLICENSED
