import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import mikroConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { MyContext } from './types'
import cors from 'cors'

const main = async () => {

    const orm = await MikroORM.init(mikroConfig)
    await orm.getMigrator().up()

    const app = express()

    const RedisStore = connectRedis(session)
    const redis = new Redis()

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    
    app.use(
        session({
            name: 'qid',
            store: new RedisStore({ 
                client: redis,
                disableTouch: true    
            }),
            cookie: {
                maxAge: 1000 * 60 * 60,             // 1 hour
                sameSite: 'lax',
                secure: __prod__ // cookie only works in https 
            },
            saveUninitialized: false,
            secret: 'qwertyuiop',   //Create env variable later
            resave: false,
  })
)

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis })
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: false })

    app.get('/', (_, res) => {
        res.send('Hello from server')
    })

    // app.post('/sendEmail', (req, res) => {
    //     sendEmail(req.body.to, req.body.text)
    //     res.send('Email sent')
    // })

    app.listen(4000, () => {
        console.log('App running on the specified Port')
    })

    // const post = orm.em.create(Post, {title: 'my first post'})
    // await orm.em.persistAndFlush(post)

    // const posts = await orm.em.find(Post, {})
    // console.log(posts)
}

main().catch(err => {
    console.log(err)
})
// console.log('Hello world') 