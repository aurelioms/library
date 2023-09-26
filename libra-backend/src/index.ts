import { ENV } from './env'
import { createServer, setupRoutes, startServer } from './server'

const server = createServer()

setupRoutes(server)

startServer(server, ENV.PORT)
