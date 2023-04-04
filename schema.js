const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Pizza {
    id: ID
    name: String
    image: String
    amount: Int
    price: Float
  }

  type Order {
    id: ID
    name: String
    amount: Int
  }

  type Query {
    pizzas(limit: Int!, offset: Int!): [Pizza]
    orders: [Order]
  }

  type Mutation {
    addOrder(order: [OrderInput]): [Order]
  }

  input OrderInput {
    id: ID
    name: String
    amount: Int
  }

  type Subscription {
    pizzasUpdated: [Pizza]
  }
`;

module.exports = typeDefs;
