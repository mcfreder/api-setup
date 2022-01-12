/**
 * Server setup
 */
import express, { Application } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import * as dotenv from "dotenv"
import AppController from './controllers/app.controller'
import { attachControllers } from '@decorators/express'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'

dotenv.config()

const HTTP_PORT = process.env.PORT || 1337

/**
 * Server
 */
export default class Server {
    private port: number
    private app: Application

    /**
     * Constructor
     * @param port : port to start server
     */
    constructor(port: number) {
        /* Props */
        this.port = port
        this.app = express()
    }

    /**
     * Initialize the server
     */
    public async initialize(): Promise<void> {
        /* Connect mongodb */
        await mongoose.connect(process.env.SERVER_DB_URI as string)

        this.initializeMiddlewares()
        this.listen()
    }

    /**
     * Initialize middlewares to use.
     */
    private initializeMiddlewares(): void {
        this.app.use(express.json(), helmet(), morgan('tiny'), rateLimit({ windowMs: 1000, max: 5 }), cors())

        attachControllers(this.app, [AppController]) /* Add Controllers here */

        /* Error handling in dev mode */
        this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(error)

            res.json({ message: error.message, status: 400, mode: 'dev' })
        })
    }

    /**
     * Make server listen.
     */
    private listen(): void {
        this.app.listen(this.port,
            () => console.log(`Server running on port: ${this.port}`)
        )
    }
}

/* Init server */
const server = new Server(HTTP_PORT as number)

server.initialize()