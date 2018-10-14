import { gql } from 'apollo-server'

export default gql`
type Act {
  id: ID!
  title: String!
  shortDescription: String
  meditation: Meditation!
  index: Int!
  textBody: String!
  audioTrackUrl: String
  videoTrackUrl: String
}

input CreateActInput {
  title: String!
  shortDescription: String
  meditationId: ID!
  index: Int!
  textBody: String!
  audioTrackUrl: String
  videoTrackUrl: String
}

input UpdateActInput {
  id: ID!
  title: String
  shortDescription: String
  index: Int
  textBody: String
  audioTrackUrl: String
  videoTrackUrl: String
}

type Mutation {
  createAct(input: CreateActInput): Act
  deleteAct(id: ID!): Boolean
  updateAct(input: UpdateActInput): Act
}
`
