const {
  gql
} = require('apollo-server-express');
const typeDefs = gql `
 type Student {
   id: String
   first_name: String
   last_name: String
   email: String
   phone:String
   address:String
   meeting_time:String
   error:String
   
 }
 type User {
  token: String
  error:String
}
type Success{
  student:Student
  error:String
  data:String
}
type UsersResult{
   students:[Student]
   currentPage: Int
  totalPages: Int
  error:String
 }
 type Query {

  #  getStudents: [Student]
   getStudent(id: String!): Student
   getStudents(search: String, page: Int, limit: Int): UsersResult
 }

 type Mutation {
   addStudent(first_name: String!, last_name: String!, email: String!,phone:String!,address:String!,meeting_time:String!): Student
   updateStudent(first_name: String, last_name: String, email: String,phone:String,address:String,meeting_time:String,id:String!): Success
   deleteStudent(id: ID!): Success
   register(username: String!, password: String!): User
   login(username: String!, password: String!): User
 }`;

module.exports = typeDefs