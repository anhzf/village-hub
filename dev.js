import dotenv from 'dotenv'
import concurrently from 'concurrently'

dotenv.config()

concurrently([
  process.argv.includes('--app') && {
    name: 'App',
    command: 'pnpm -C app dev -p 3000'
  },
  process.argv.includes('--fns') && {
    name: 'Functions',
    command: 'pnpm -C functions dev'
  },
  process.argv.includes('--fns') && {
    name: 'Emulator',
    command: 'firebase emulators:start'
  },
].filter(Boolean), {
  prefixColors: 'auto',
  killOthers: ['failure', 'success'],
})