const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.USERS_TABLE_NAME;

const getAllUsers = async () => {
  const params = {
    TableName: TABLE_NAME
  };
  const users = await dynamoClient.scan(params).promise();
  return users;
};

const getUserByEmail = async (email) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { email }
  };
  const user = await dynamoClient.get(params).promise();
  return user;
};

const addOrUpdateUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: user
  };
  const newUser = await dynamoClient.put(params).promise();
  return newUser;
};

const deleteUser = async (email) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      email
    }
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  addOrUpdateUser,
  deleteUser
};

//TESTING
// addOrUpdateUser({
//   email: "drakos@gmail.com",
//   friends: ["drakakos1", "drakakos2"]
// });
// getUserByEmail("drakos@gmail.com");
// getAllUsers();
//deleteUser("thodorisbarkas@gmail.com");
