# How to run the project?

1. Open a terminal for front_end and run:
2. cd front_end && npm run dev -- --https
3. After that open a new terminal for server and run:
   - if you have nodemon installed:cd server && nodemon
   - if you don't have nodemon installed:cd server && node index.js

# What is this repo is good for?

- Is just a skeleton to create your authentication service with little modifications to the src code.

- Good for microservices architecture as it works with JWT.

- Scalable database (works with your dynamoDB).

- Simple and easy to understand.

# How it works

> Client side

1. The user throught front-end asks from facebook api to get the access token.

2. Then when the client agree to give permissions facebook sends the access token to the front end.

3. After that the front end will send the access token to the backend(server).

>

> Server side

4. The backend sends the access token to facebook and **asks to get data with your code**from the facebook profile.

5. And either insert/Fetch user(if already exists) to/from your database.

   - _You can **modify with your code** facebook data before you insert it to your database._

6. After that the server will get justInserted or fetched infos _user's data_ to/from the database.

7. that code may contain data client must not see so you have to **modify that data with your code**.

8. After that you sign them and server sends `{jwt,user_data,serverErrMsg`**modify with your code**`}` to your client.

>

> Client side

10. Get that data and inserted to stores {user,failureMsg}

11. Get {jwt,user} and inserted them on localStorage.

# Other functionalities

> ErrorMessage Component

- _ErrorMessage Component_ will show `failureMsg` store value for some time (passed through props) or until the component will be destroyed and after that will set `failureMsg.set(null)`

- _ErrorMessage_ doesn't have to be just a string.

- But to change the functionallity you have to **change both the code on backend(middlewares response : `failureMsgData`) as well as the code in the front end`"$lib/authentication/ErrorMessage.svelte"` component**
  > UserMiddleware Component
- It's used to redirect if user doesn't exist.During reloads of sensitive pages "like profile" it checks to see if token is still valid by hitting `"/auth-api/is-verify"` from the server.The server responds and data fetched like that`const { userData, token, failureMsgData } = parseRes;`
  - `failureMsgData` as discussed previously **can be changed with server code inside middlewares**.

# DOCUMENTATION

Check how we use the code by running and testing the source code in this github repo before you read the documentation.
Check the documentation only if you have problems to understanding something.

> Error_Message

- displays `failureMsg` store for some time if `failureMsg!=null`
- PROPS:

* livingTime: display time in ms(default value is "forever")

> LoginFacebook

- Asks the user for permissions and retrieves the facebook access tokenthen access token is send to our server so our server can retrieve the infos and search/insert to the database
- In case of success it can redirect
- In case of failure(serverSide or facebookSide) it can set <failureMsg  STORE>
- PROPS:
  _ appIdValue:get it from facebook for developers
  _ scopeValue:ask user to give permissions to his access\*token
  - redirectURL:defaultValue==null(which means don't redirect)
    \_ facebookErrMsg,serverErrMsg:<failureMsg  STORE> gets the value of them
    (if null don't set a failureMsg)

> UserMiddleware

- Checks if user exists and if a page reload has happened it checks that the user is still logged by send "jwt from local storage" to server and verify it.
- PROPS:

  - failureRedirect:if null (default) don't redirect.
  - failureMsgDefault:<failureMsg  STORE> will get the value of <failureMsgData> which is send by the server.
  - If server doesn't send <failureMsgData> or if jwt doesn't exist in our local storage then the value of<failureMsg  STORE> will be set to <failureMsgDefault>

- CAUSION:
  - You can't put anything important on the front-end and feeling that is safe because of UserMiddleware module.
  - anything you send to front end is accessible by the client even if the UI doesn't let them to see it.
  - UserMiddleware is just a module for responsiveness and good user experience.
  - for example:
    It must be use in a way to don't let a user see a profile page with no data
    -null objects in it.
