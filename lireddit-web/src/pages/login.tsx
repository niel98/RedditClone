import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, Flex, FormControl, FormLabel, Input, Link, } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
// import { useMutation } from 'urql'
import { useLoginMutation } from '../generated/graphql'
import { errorToMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import NextLInk from 'next/link'

interface loginProps {

}

const Login: React.FC<loginProps> = ({}) => {

    const router = useRouter()
    const [, login] = useLoginMutation()
    return(
        <Wrapper variant='small'>
            <Formik 
        initialValues={{ usernameOrEmail: '', password: ''}}
        onSubmit={ async (values, { setErrors }) => {
            console.log(values)
            const response = await login(values)
            if (response.data?.login.errors) {
                setErrors(errorToMap(response.data.login.errors))
            } else {
                router.push('/')
            }
        }}
            >
            {({ isSubmitting }) => {
                return (
                <Form>
                    <InputField
                    name= 'usernameOrEmail'
                    label='Username or email'
                    placeholder='Username or email'
                    />
                    <Box mt={4}>
                    <InputField
                    name= 'password'
                    label='Password'
                    placeholder='password'
                    type='password'
                    />
                    </Box>
                    <Flex mt={2}>
                    <NextLInk href='/forgot-password'>
                            <Link ml='auto' color='blue'>forgot Password?</Link>
                        </NextLInk>
                    </Flex>
                    <Button 
                    mt={4}
                    type="submit" 
                    color="teal"
                    isLoading={isSubmitting}
                    >
                        Login
                        </Button>
                </Form>
                )
            }}
        </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Login)