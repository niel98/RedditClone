import { Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/dist/client/router'
import { InputField } from '../components/InputField'
import Layout from '../components/Layout'
import { useCreatePostMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useIsAuth } from '../utils/useIsAuth'

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter()
    useIsAuth()
    const [, createPost] = useCreatePostMutation()

    return (
        <Layout variant='small'>
            <Formik 
        initialValues={{ title: '', text: ''}}
        onSubmit={ async (values) => {
            console.log(values)
            const { error } = await createPost({input: values})
            if (!error) {
                router.push('/')
            }
        }}
            >
            {({ isSubmitting }) => {
                return (
                <Form>
                    <InputField
                    name= 'title'
                    label='Title'
                    placeholder='title'
                    />
                    <Box mt={4}>
                    <InputField
                    textarea
                    name= 'text'
                    label='Body'
                    placeholder='text...'
                    />
                    </Box>
                    <Button 
                    mt={4}
                    type="submit" 
                    color="teal"
                    isLoading={isSubmitting}
                    >
                        Create Post
                        </Button>
                </Form>
                )
            }}
        </Formik>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(CreatePost)