import { withUrqlClient } from "next-urql"
import Layout from "../components/Layout"
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLInk from 'next/link'
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import React from "react"


const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10
    }
  })

  if (!data && !fetching) {
    return 'you have no posts for some reason'
  }
  return (
    <Layout>
      <Flex>
        <Heading>LiReddit</Heading>
      <NextLInk href='/create-post'>
        <Link ml='auto'>Create Post</Link>
      </NextLInk>
      </Flex>
      
    <br />
    <Stack spacing={8}>
    { !data && fetching ? (<div>loading...</div>) : data!.posts.map(p => (
      <Box key={p.id} p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{p.title}</Heading>
      <Text mt={4}>{p.textSnippet}</Text>
    </Box>
    ) )}
    </Stack>
    {data? <Flex>
    <Button isLoading={fetching} m='auto' my={8}>load more...</Button>
    </Flex>: null}
    
  </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
