import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, FormControl, FormLabel, Input, } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
    return(
        <Wrapper variant='small'>
            <Formik 
        initialValues={{ username: '', password: ''}}
        onSubmit={(values) => {
            console.log(values)
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

export default Register