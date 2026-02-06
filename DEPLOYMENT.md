# 🚀 Guía de Despliegue: Render + Neon

Sigue estos pasos para desplegar tu backend NestJS totalmente gratis.

## Paso 1: Base de Datos en Neon (PostgreSQL)

1.  Ve a [Neon.tech](https://neon.tech) y regístrate.
2.  Crea un nuevo **Project**.
3.  Copia el **Connection String** que te dan. Se verá algo así:
    `postgres://usuario:password@ep-algo.aws-region.neon.tech/neondb?sslmode=require`

## Paso 2: Preparar tu Código

1.  Asegúrate de que este archivo `render.yaml` esté en la raíz de tu proyecto.
2.  Sube tu código a **GitHub** (si aún no lo has hecho).

## Paso 3: Desplegar en Render

1.  Ve a [Render.com](https://render.com) y crea una cuenta.
2.  Haz clic en **"New +"** y selecciona **"Blueprint"**.
3.  Conecta tu cuenta de GitHub y selecciona tu repositorio `inventario-app`.
4.  Render detectará el archivo `render.yaml`.
5.  Te pedirá confirmar/llenar las **Environment Variables**:
    *   `DATABASE_URL`: Pega aquí el connection string de Neon (del Paso 1).
    *   `JWT_SECRET`: Escribe una clave secreta segura (ej. letras y números aleatorios).
6.  Haz clic en **"Apply"** o **"Create Web Service"**.

## ¡Listo! 🎉

Render comenzará a construir tu aplicación.
*   Instalará las dependencias.
*   Compilará el código.
*   Ejecutará las migraciones de base de datos automáticamente (gracias al comando en `render.yaml`).
*   Iniciará el servidor.

Cuando termine, verás una URL (ej. `https://inventario-app.onrender.com`).
¡Esa es la URL pública de tu API!

### 🔍 Probar
Puedes probar tu API en Postman usando esa nueva URL:
`GET https://tu-app.onrender.com/api/v1/health` (si tienes un endpoint de salud) o directa al login `POST /api/v1/auth/login`.
