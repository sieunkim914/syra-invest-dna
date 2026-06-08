import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const readJsonBody = async (req: IncomingMessage) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
};

const createVercelLikeResponse = (res: ServerResponse) => ({
  status(statusCode: number) {
    res.statusCode = statusCode;
    return this;
  },
  setHeader(name: string, value: number | string | readonly string[]) {
    res.setHeader(name, value);
    return this;
  },
  json(payload: unknown) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }

    res.end(JSON.stringify(payload));
  },
});

const runApiHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  handlerPath: './api/analyze.js' | './api/chat.js',
) => {
  try {
    const body = await readJsonBody(req);
    const { default: handler } = await import(handlerPath);

    await handler(
      Object.assign(req, {
        body,
      }),
      createVercelLikeResponse(res),
    );
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Local API failed' }));
  }
};

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'syra-local-api',
        configureServer(server) {
          server.middlewares.use('/api/analyze', (req, res) => {
            runApiHandler(req, res, './api/analyze.js');
          });
          server.middlewares.use('/api/chat', (req, res) => {
            runApiHandler(req, res, './api/chat.js');
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.git/**',
          '**/Library/**',
          '**/Desktop/**',
          '**/Documents/**',
          '**/Downloads/**',
          '**/.Trash/**',
          '**/*.ipynb',
          '**/venv/**',
          '**/.cursor/**',
        ],
      },
    },
  };
});
