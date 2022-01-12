import jwt_decode from 'jwt-decode'
import { Request, Response, NextFunction } from 'express'
import { Middleware } from '@decorators/express'

interface RequestIdentifier extends Request {
    uid: string
}

/**
 * Example of decoding JWTs here
 */
export default class AuthGuard implements Middleware {
    public use(req: RequestIdentifier, res: Response, next: NextFunction): any {
        const { authorization } = req.headers

        if (!authorization || !authorization.startsWith('Bearer '))
            return res.status(403).json({ message: 'Unauthorized' })

        const token = authorization.split('Bearer ')[1]
        const decoded: any = jwt_decode(token)

        req.uid = decoded.user_id

        next()
    }
}