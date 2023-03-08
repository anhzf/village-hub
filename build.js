import dotenv from 'dotenv'
import concurrently from 'concurrently'

dotenv.config()

concurrently([
  process.argv.includes('--app') && {
    name: 'App',
    command: 'pnpm -C app build'
  },
  process.argv.includes('--functions') && {
    name: 'Functions',
    command: 'pnpm -C functions build'
  },
].filter(Boolean), {
  prefixColors: 'auto',
  killOthers: ['failure', 'success'],
})