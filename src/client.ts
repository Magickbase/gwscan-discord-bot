import { GraphQLClient } from "graphql-request";
import { config } from './config'

if (!config.server) {
  throw new Error(`Server url is required in GraphQL client`)
}

export const client = new GraphQLClient(config.server, { headers: { 'Accept': 'application/json' } })

