## Prueba Técnica para Desarrollador Fullstack - PrevalentWare

### 🚀 Resumen del Proyecto
Sistema de gestión ERP fullstack con Next.js, Prisma, Supabase y Better Auth. Permite administrar ingresos, egresos, usuarios y generar reportes financieros con exportación a CSV.

### 🛠️ Tecnologías Utilizadas
- **Frontend**: Next.js (Pages Router), Tailwind CSS, Shadcn UI, Recharts, Lucide React.
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL (Supabase).
- **Autenticación**: Better Auth (GitHub OAuth) + control de roles (RBAC).
- **Testing**: Vitest + React Testing Library.

---

### ⚙️ Instrucciones para Ejecutar Localmente

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno**:
   Crea o renombra el archivo `.env.local` con las siguientes llaves (solicítalo si es necesario):
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
   GITHUB_CLIENT_ID="Tu_Client_ID"
   GITHUB_CLIENT_SECRET="Tu_Client_Secret"
   BETTER_AUTH_SECRET="Tu_Secret_Generado"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
   ```

3. **Sincronizar variables de Prisma (para terminal)**:
   Asegúrate de copiar `DATABASE_URL` y `DIRECT_URL` a un archivo `.env` en la raíz (Prisma CLI solo lee `.env`). Luego ejecuta:
   ```bash
   npx prisma db push
   ```

4. **Levantar servidor local**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000)

---

### 🧪 Pruebas Unitarias
Para correr los tests unitarios (helpers API y utilidades Tailwind):
```bash
npm run test
```

### 📄 Documentación API (Swagger)
Puedes visualizar los endpoints, esquemas de solicitud y respuesta iniciando el servidor local y navegando a:
👉 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

### 🚢 Instrucciones de Despliegue en Vercel

1. **Subir a GitHub**: 
   Sube este repositorio a una cuenta de GitHub de manera privada o pública como requieras y comparte el acceso con `mlopera@prevalentware.com`, `jdsanchez@prevalentware.com` y `dfsorza@prevalentware.com`.

2. **Vercel Dashboard**: 
   - Ingresa a Vercel y selecciona **Add New... > Project**.
   - Importa el repositorio recién subido.

3. **Variables de entorno en Vercel**: 
   En la pestaña de configuración del proyecto (`Environment Variables`), copia y pega TODAS las variables del `.env.local`. **Nota:** Cambia el `NEXT_PUBLIC_BETTER_AUTH_URL` por el dominio que te asigne Vercel (ej. `https://mi-proyecto.vercel.app`).

4. **Desplegar**: Haz clic en **Deploy**. Vercel detectará Next.js y compilará automáticamente.
