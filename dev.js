import dotenv from 'dotenv'
import concurrently from 'concurrently'

dotenv.config()

concurrently([
  process.argv.includes('--app') && {
    name: 'App',
    command: 'pnpm -C app dev'
  },
  process.argv.includes('--functions') && {
    name: 'Functions',
    command: 'pnpm -C functions dev'
  },
  process.argv.includes('--functions') && {
    name: 'Emulator',
    command: 'firebase emulators:start --only functions'
  },
].filter(Boolean), {
  prefixColors: 'auto',
  killOthers: ['failure', 'success'],
})