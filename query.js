import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Initialize Apollo Client
export const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/44596/coffee-subgraph/v0.0.3",
  cache: new InMemoryCache(),
});

export const GET_CHECKINS = gql`
  query {
    workers {
      id
      daysUnpaid
    }
  }
`;

export const GET_WORKER_CHECKINS = (id) => gql`
    query {
      worker(id: "${id}") {
        daysWorked
        daysUnpaid
        checkIns {
          year
          month
          day
        }
      }
    }
  `;