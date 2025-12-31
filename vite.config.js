import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/items', (req, res, next) => {
          const DATA_FILE = path.resolve(__dirname, 'src/Data/items.json');

          if (req.method === 'GET') {
            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read data' }));
                return;
              }
              try {
                const jsonData = JSON.parse(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(jsonData.items || []));
              } catch (parseErr) {
                console.error(parseErr);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to parse data' }));
              }
            });
          } else if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const newItem = JSON.parse(body);

                fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                  if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Failed to read data' }));
                    return;
                  }

                  let jsonData = { items: [] };
                  try {
                    jsonData = JSON.parse(data);
                  } catch (parseErr) {
                    // Start empty if file is invalid
                  }

                  if (!jsonData.items) {
                    jsonData.items = [];
                  }

                  // Add ID if missing
                  if (!newItem.id) {
                    newItem.id = Date.now();
                  }

                  jsonData.items.push(newItem);

                  fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (writeErr) => {
                    if (writeErr) {
                      console.error(writeErr);
                      res.statusCode = 500;
                      res.end(JSON.stringify({ error: 'Failed to save data' }));
                      return;
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 201;
                    res.end(JSON.stringify(newItem));
                  });
                });
              } catch (e) {
                console.error(e);
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
          } else {
            next();
          }
        });
      },
    },
  ],
});
