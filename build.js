import dotenv from 'dotenv'
import concurrently from 'concurrently'

dotenv.config()

concurrently([
  {
    name: 'App',
    command: 'pnpm -C app build'
  }
], {
  prefixColors: 'auto',
  killOthers: ['failure', 'success'],
})