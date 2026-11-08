import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readFile, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dataFile = resolve(process.cwd(), 'data.json')

function localDataFile() {
  return {
    name: 'local-data-file',
    configureServer(server) {
      server.middlewares.use('/api/data', async (req, res) => {
        if (req.method === 'GET') {
          try {
            const data = await readFile(dataFile, 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          } catch {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Could not read data.json' }))
          }
          return
        }

        if (req.method !== 'PUT') {
          res.statusCode = 405
          res.setHeader('Allow', 'GET, PUT')
          res.end()
          return
        }

        try {
          let body = ''
          for await (const chunk of req) body += chunk
          const data = JSON.parse(body)
          if (!data || typeof data !== 'object' || Array.isArray(data)) {
            throw new Error('Expected a JSON object')
          }
          const temporaryFile = `${dataFile}.tmp`
          await writeFile(temporaryFile, `${JSON.stringify(data, null, 2)}\n`)
          await rename(temporaryFile, dataFile)
          res.statusCode = 204
          res.end()
        } catch {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Could not save data.json' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localDataFile()],
})
