import { cacheExchange, query } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql";
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        //Implementing the logout cache
        logOut: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({ me: null})
          ) 
        },
        //Updating the Login Cache, just updating the MeQuery
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(cache, 
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.login.errors) {
                return query
              } else {
                return {
                  me: result.login.user
                }
              }
            })
        },
        //Updating the cache, that is updating the MeQuery
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(cache, 
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  me: result.register.user
                }
              }
            })
        }
      }
    }
  }),
  ssrExchange,
  fetchExchange],
})