// this is automatically detected by playground/vitestSetup.ts and will replace
// the default e2e test serve behavior

import path from 'path'
import kill from 'kill-port'
import { hmrPorts, ports, rootDir } from '~utils'

export const port = ports['ssr-deps']

export async function serve(): Promise<{ close(): Promise<void> }> {
  await kill(port)

  const { createServer } = require(path.resolve(rootDir, 'server.js'))
  const { app, vite } = await createServer(rootDir, hmrPorts['ssr-deps'])

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        resolve({
          // for test teardown
          async close() {
            await new Promise((resolve) => {
              server.close(resolve)
            })
            if (vite) {
              await vite.close()
            }
          }
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}