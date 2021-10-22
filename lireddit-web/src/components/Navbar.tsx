import { Box, Button, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = () => {
    //Implement Logout here
    const [{fetching: logoutFetching}, logOut] = useLogoutMutation()

    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    })
    
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
                <Button 
                onClick={() => {
                    logOut()
                }}
                isLoading={logoutFetching} 
                 variant='link'>Logout</Button>
            </Flex>
            
        )
    }
    return (
        <Flex position='sticky' top={0} zIndex={1} bg='tan' p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    )
}

export default Navbar