# ERP Financiero - PrevalentWare Digital Solutions

**Prueba Técnica para Desarrollador Fullstack**

Este proyecto es una plataforma integral de gestión ERP diseñada para centralizar el control financiero y la administración de usuarios. Implementa una arquitectura moderna con un enfoque en la seguridad, escalabilidad y una experiencia de usuario (UX) corporativa.

**Despliegue en Producción:** [https://prueba-tecnica-erp-prevalentware-ke.vercel.app/](https://prueba-tecnica-erp-prevalentware-ke.vercel.app/)

---

## Stack Tecnológico

La solución utiliza tecnologías de vanguardia para garantizar un rendimiento óptimo:

- **Core**: [Next.js](https://nextjs.org/) (Pages Router) con TypeScript para un tipado estricto.
- **Estilo**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) para una interfaz atómica y responsiva.
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) alojado en [Supabase](https://supabase.com/).
- **ORM**: [Prisma](https://www.prisma.io/) para una gestión de datos eficiente y migraciones seguras.
- **Autenticación**: [Better Auth](https://www.better-auth.com/) con **GitHub OAuth**, incluyendo control de acceso basado en roles (**RBAC**).
- **Visualización**: [Recharts](https://recharts.org/) para analítica financiera dinámica.
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para asegurar la calidad del código.

---

## Características Principales

### Seguridad y Acceso
- **Autenticación Social**: Inicio de sesión seguro a través de GitHub.
- **Roles y Permisos**: Sistema de roles (ADMIN/USER) que protege tanto las rutas del frontend como los endpoints de la API.
- **Middleware**: Validación de sesiones en el lado del servidor para prevenir accesos no autorizados.

### Gestión Financiera
- **Movimientos**: Registro y trazabilidad de ingresos y egresos vinculados al usuario que los crea.
- **Reportes Pro**: Panel de analítica con gráficos de flujo de caja y KPIs financieros.
- **Exportación CSV**: Generación de informes enriquecidos con cabecera institucional y resumen ejecutivo para auditoría.

### Administración de Usuarios
- **Panel de Control**: Gestión centralizada de nombres y roles de usuario para el personal administrativo.

---

## Guía de Inicio Rápido

### 1. Requisitos Previos
- Node.js (v18.0.0 o superior)
- Una instancia de PostgreSQL (recomendado Supabase)
- Una OAuth App creada en GitHub

### 2. Instalación y Configuración
Clona este repositorio y configura las dependencias:

```bash
git clone https://github.com/UziWrld/prueba-tecnica-erp-prevalentware.git
cd prueba-tecnica-erp-prevalentware-main
npm install
```

Configura tu archivo `.env.local` con las siguientes variables:

```env
# Database
DATABASE_URL="tu_url_de_conexion_prisma"
DIRECT_URL="tu_url_de_conexion_directa"

# Auth (Better Auth)
BETTER_AUTH_SECRET="tu_secret_generado"
BETTER_AUTH_URL="http://localhost:3000" # o tu URL de Vercel
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="tu_client_id"
GITHUB_CLIENT_SECRET="tu_client_secret"
```

### 3. Preparación de Base de Datos
Sincroniza el esquema de Prisma con tu base de datos:

```bash
npx prisma db push
```

### 4. Ejecución
```bash
npm run dev
```
Accede a la plataforma en `http://localhost:3000`.

---

## Calidad y Documentación

### Pruebas Unitarias
Ejecuta la suite de pruebas para validar la integridad de los helpers y componentes:
```bash
npm run test
```

### Documentación de API (Swagger)
El proyecto incluye documentación automática con Swagger UI. Puedes consultarla en:
`http://localhost:3000/api/docs` (o el equivalente en producción).

---

## Nota sobre Entrega
La base de datos se entrega con datos de prueba reales para demostrar la funcionalidad completa de los reportes y el sistema de roles. Se recomienda iniciar sesión con la cuenta de GitHub asociada para verificar el acceso administrativo.

