# Guía Interna: Backend Proxy en Vercel

> **Confidencial:** Documento para el equipo de desarrollo. No subir a repositorios públicos.

## Estructura del repositorio privado

```
timobot-backend/
├── api/
│   └── perplexity.js
├── package.json (opcional si agregamos dependencias locales)
└── README.md (interno)
```

- `api/perplexity.js`: función serverless compatible con Vercel (Node.js 18+).
- Opcional: añadir `package.json` para fijar dependencias. Vercel instala automáticamente `axios` si se declara.

## Código base de la función

```js
const axios = require('axios');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'PERPLEXITY_API_KEY is not configured on the server.' });
  }

  let body = req.body;
  if (!body || Object.keys(body).length === 0) {
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON payload.' });
    }
  }

  const {
    messages,
    model = 'llama-3.1-sonar-small-128k-online',
    max_tokens = 1000,
    temperature = 0.7,
    top_p = 0.9,
    stream = false
  } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'The request body must include a non-empty "messages" array.' });
  }

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model,
        messages,
        max_tokens,
        temperature,
        top_p,
        stream
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const errorPayload = {
      error: 'Failed to call Perplexity API.',
      status,
      details: error.response?.data || error.message
    };

    return res.status(status).json(errorPayload);
  }
};
```

## Pasos para desplegar en Vercel

1. Crear repositorio privado (`timobot-backend`).
2. Copiar la estructura anterior.
3. (Opcional) Añadir `package.json` con:
   ```json
   {
     "name": "timobot-backend",
     "version": "1.0.0",
     "dependencies": {
       "axios": "^1.6.2"
     }
   }
   ```
4. Subir a GitHub/GitLab/Bitbucket.
5. En Vercel, crear nuevo proyecto apuntando a ese repo.
6. En **Environment Variables**, añadir:
   - `PERPLEXITY_API_KEY = pplx-...`
7. Deploy. La URL final tendrá forma `https://<proyecto>.vercel.app/api/perplexity`.

## Integración con la app móvil

1. En el proyecto Expo, crear/editar `.env` (no se versiona):
   ```env
   PERPLEXITY_PROXY_URL=https://<proyecto>.vercel.app
   ```
2. Reiniciar Metro (`npm run start`).
3. Las llamadas desde `src/services/perplexityApi.js` detectan el proxy y evitan exponer la clave.

## Buenas prácticas internas

- Rotar la API key periódicamente y actualizarla en Vercel.
- Implementar rate limiting y logging en el proxy si la carga aumenta.
- Para auditoría, habilitar Vercel Logs y conservar registros privados.
- No exponer esta guía ni el código del backend en el repositorio público.
