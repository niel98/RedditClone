import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { Request, Response } from 'express'
import { Redis } from 'ioredis'
// import { Session } from 'express-session'
// import { sessionWithUser } from './sessionType'

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    req: Request
    res: Response
    redis: Redis
    // session: Session & { userId: string | {} }
}