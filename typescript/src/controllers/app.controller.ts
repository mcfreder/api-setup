import express from 'express'
import { Response, Controller, Get, Request, Query } from '@decorators/express'
import Service from '../service'
import { Example } from '../repositories/example'

@Controller('/')
export default class AppController extends Service {
    /**
    * Constructor
    */
    constructor() {
        /* Call super with MongoDB repository */
        super(Example)
    }

    /**
     * Basic API Route
     */
    @Get('/product/:slug')
    async getBasic(@Response() res: express.Response, @Request() req: express.Request) {
        res.json({ message: 'Welcome to this API' })
    }

}

