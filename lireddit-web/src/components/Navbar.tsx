import { Box, Button, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { useMeQuery } from '../generated/graphql'

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = () => {
    const [{ data, fetching }] = useMeQuery()
    let body = null

    //Data is loading
    if (fetching) {
        body = null
        //User is not logged in
    } else if (!data?.me) {
        body = (
            <>
        <NextLink href='login'>
                <Link color='white' m={2}>Login</Link>
                </NextLink>
                <NextLink href='register'>
                <Link color='white'>Register</Link>
                </NextLink>
        </>
        )
        
        //User is logged in
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button variant='link'>Logout</Button>
            </Flex>
            
        )
    }
    return (
        <Flex bg='tan' p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    )
}

export default Navbar