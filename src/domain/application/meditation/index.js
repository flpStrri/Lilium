import { gql } from 'apollo-server'

export default gql`
enum Category {
  morning
  evening
  night
}

type Meditation {
  id: ID!
  name: String!
  category: Category!
  shortDescription: String
  acts: [Act!]!
}

input CreateMeditationInput{
  name: String!
  category: Category!
  shortDescription: String
  acts: [CreateMeditationActInput!]!
}

input CreateMeditationActInput {
  title: String!
  shortDescription: String
  index: Int!
  textBody: String!
  audioTrackUrl: String
  videoTrackUrl: String
}

input UpdateMeditationInput{
  id: ID!
  name: String
  category: Category
  shortDescription: String
}

type Mutation {
  createMeditation(input: CreateMeditationInput): Meditation!
  deleteMeditation(id: ID!): Boolean
  updateMeditation(input: UpdateMeditationInput): Meditation!
}

input MeditationsInputFilter{
  category: Category
  search: String
}

type Query {
  meditations(input: MeditationsInputFilter): [Meditation]!
}
`
