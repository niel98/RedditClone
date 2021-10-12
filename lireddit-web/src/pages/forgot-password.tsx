import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import React, { useState } from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'

const ForgotPassword: React.FC<{}> = () => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
    return (
        <Wrapper variant='small'>
            <Formik 
        initialValues={{ email: ''}}
        onSubmit={ async (values) => {
            await forgotPassword(values)
            setComplete(true)
        }}
            >
            {({ isSubmitting }) =>
             complete ? (
             <Box>We sent a link to your email address to reset your password </Box>
             )  : (
                    <Form>
                        <InputField
                        name= 'email'
                        label='Email'
                        placeholder='email'
                        />
                        <Button 
                        mt={4}
                        type="submit" 
                        color="teal"
                        isLoading={isSubmitting}
                        >
                            Forgot Password
                            </Button>
                    </Form>
                    
             )
                
            }
        </Formik>
        </Wrapper>
    )
}

export default ForgotPassword