import type { NextApiRequest, NextApiResponse } from 'next';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API – Gestión de Ingresos y Egresos',
      version: '1.0.0',
      description:
        'Documentación de los endpoints REST de la prueba técnica fullstack.',
    },
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'better-auth.session_token',
          description:
            'Token de sesión generado por Better Auth al iniciar sesión con GitHub.',
        },
      },
    },
  },
  apis: ['./pages/api/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

// Sirve la especificación OpenAPI como JSON en /api/docs
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res
      .status(405)
      .json({ error: `Método ${req.method} no permitido.` });
  }

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>API Docs – Gestión de Ingresos y Egresos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerSpec)},
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
              layout: 'BaseLayout',
            });
          };
        </script>
      </body>
    </html>
  `);
}
