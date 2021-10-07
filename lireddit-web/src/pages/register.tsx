import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, FormControl, FormLabel, Input, } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useMutation } from 'urql'
import { useRegisterMutation } from '../generated/graphql'
import { errorToMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {

    const router = useRouter()
    const [, register] = useRegisterMutation()
    return(
        <Wrapper variant='small'>
            <Formik 
        initialValues={{ email: '', username: '', password: ''}}
        onSubmit={ async (values, { setErrors }) => {
            console.log(values)
            const response = await register({ options: values})
            if (response.data?.register.errors) {
                setErrors(errorToMap(response.data.register.errors))
            } else {
                router.push('/')
            }
        }}
            >
            {({ isSubmitting }) => {
                return (
                <Form>
                    <InputField
                    name= 'username'
                    label='Username'
                    placeholder='username'
                    />
                    <Box mt={4}>
                    <InputField
                    name= 'email'
                    label='Email'
                    placeholder='email'
                    />
                    </Box>
                    <Box mt={4}>
                    <InputField
                    name= 'password'
                    label='Password'
                    placeholder='password'
                    type='password'
                    />
                    </Box>
                    <Button 
                    mt={4}
                    type="submit" 
                    color="teal"
                    isLoading={isSubmitting}
                    >
                        Register
                        </Button>
                </Form>
                )
            }}
        </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Register)