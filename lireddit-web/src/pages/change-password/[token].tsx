import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { useState } from 'react'
import { InputField } from '../../components/InputField'
import { Wrapper } from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { errorToMap } from '../../utils/toErrorMap'
import  NextLInk  from 'next/link'

const ChangePassword: NextPage = () => {
    const router = useRouter()
    const [, ChangePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('')
    return (
        <Wrapper variant='small'>
            <Formik 
        initialValues={{ newPassword: '' }}
        onSubmit={ async (values, { setErrors }) => {
            console.log(values)
            const response = await ChangePassword({ newPassword: values.newPassword, 
                token: typeof router.query.token === 'string' ? router.query.token : '' })
            if (response.data?.changePassword.errors) {
                const errorMap = errorToMap(response.data.changePassword.errors)
                if ('token' in errorMap) {
                    setTokenError(errorMap.token)
                }
                setErrors(errorMap)
            } else {
                router.push('/')
            }
        }}
            >
            {({ isSubmitting }) => {
                return (
                <Form>
                    <InputField
                    name= 'newPassword'
                    label='New Passeord'
                    placeholder='new password'
                    type='password'
                    />
                    {tokenError ? (
                    <Flex>
                        <Box mr={2} color='red'>{tokenError}</Box>
                        <NextLInk href='/forgot-password'>
                            <Link color='blue'>forgot Password? Click here to reset Password</Link>
                        </NextLInk>
                    </Flex>)
                     : null}
                    <Button 
                    mt={4}
                    type="submit" 
                    color="teal"
                    isLoading={isSubmitting}
                    >
                        Change Password
                        </Button>
                </Form>
                )
            }}
        </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)