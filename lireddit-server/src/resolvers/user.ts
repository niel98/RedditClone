import { User } from '../entities/User'
import { MyContext } from 'src/types'
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import argon2 from 'argon2'
import { UsernamePasswordInput } from './UsernamePasswordInput'
import { validateRegister } from '../utils/validateRegister'
import { sendEmail } from '../utils/sendEmail'
import { v4 } from 'uuid'
import { FORGOT_PASSWORD_PREFIX } from '../constants'

@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => Boolean)
    async forgotPassword (
        @Arg('email') email: string,
        @Ctx() { em, redis } : MyContext
    ) {
        const user = await em.findOne(User, { email })
        if (!user) {
            return true
        }

        const token = v4()
        await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3) // 3 days
        await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`)

        return true
    }

    @Query(() => User, { nullable: true })
    async me (
        @Ctx() { req, em }: MyContext
    ) {
        if (!req.session.userId) {
            //you are not logged in
            return null
        }

        const user = await em.findOne(User, { id: req.session.userId })
        return user
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext 
    ): Promise<UserResponse> {
        const errors = validateRegister(options)
        if (errors) {
            return { errors }
        }
        
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, { username: options.username, password: hashedPassword, email: options.email })

        try {
            await em.persistAndFlush(user)
        } catch (err) {
            if (err.code === '23505' || err.detail.includes('already exists')) {
                //duplicate key username error
                return {
                    errors: [{
                        field: 'username',
                        message: 'username is already taken'
                    }]
                }
            }
            console.log(err.message)
        }
        
        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext 
    ): Promise<UserResponse> {
        const user = await em.findOne(User, 
            usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail })
        if (!user) {
            return {
                errors: [{
                    field: 'usernameOrEmail',
                    message: 'user does not exist'
                }]
            }
        }
        const valid = await argon2.verify(user.password, password)
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'invalid credentials'
                }]
            }
        }

        req.session.userId = user.id
        console.log('User Id', req.session.userId)

        return { user }
    }

    @Mutation(() => Boolean)
    logout ( @Ctx() {req, res}: MyContext ) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie('qid')
            if (err) {
                console.log(err)
                resolve(false)
                return
            }

            resolve(true)
        }))
    }
}