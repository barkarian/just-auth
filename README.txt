What this repo is good for?-------------------------------------------------------------------------------------/
    ->Is just a skeleton to create your authentication service with little modifications to the src code.
    ->Good for microservices architecture as it works with JWT.
    ->Simple and easy to understand.
CHANGE CODE AND SET IT UP FOR YOUR NEEDS AND/OR YOUR PROJECT----------------------------------------------------/
->Feel free to change front-end code.
->For the backend code it's a good practice to :
->change the code inside :
    >./server/routes/facebookAuthentication.js 
    change the code in comments : CHANGE THE CODE HERE IF YOU WANT
    >./server/middleware/authorization.js
    change the code that returns failureMsgData
Modules---------------------------------------------------------------------------------------------------------/
Error_Message
    ->displays <failureMsg STORE> if <failureMsg STORE>!=null for some time
    ->PROPS:
        -livingTime: display time in ms(default value is "forever")
LoginFacebook
    ->Asks the user for permissions and retrieves the facebook access token
      then access token is send to our server so our server can retrieve the 
      infos and search/insert to the database
      In case of success it can redirect
      In case of failure(serverSide or facebookSide) it can set <failureMsg STORE>
    ->PROPS:
        -appIdValue:get it from facebook for developers
        -scopeValue:ask user to give permissions to his access_token
        -redirectURL:defaultValue==null(which means don't redirect)
        -facebookErrMsg,serverErrMsg:<failureMsg STORE> gets the value of them
        (if null don't set a failureMsg)
UserMiddleware
    ->Checks if user exists and if a page reload has happened it checks that 
    the user is still logged by send "jwt from local storage" to server and 
    verify it.
    ->PROPS:
        -failureRedirect:if null (default) don't redirect.
        -failureMsgDefault:<failureMsg STORE> will get the value of <failureMsgData> which is send by the server.
        If server doesn't send <failureMsgData> or if jwt doesn't exist in our local storage then
        the value of<failureMsg STORE> will be set to <failureMsgDefault>
    ->CODE that takes failureMsgData for reference:
        const { userData, token, failureMsgData } = parseRes;
    ->CAUSION:
        -You can't put anything important on the front-end and feeling that is safe
        because of UserMiddleware module.
        -anything you send to front end is accessible by the client even if the UI 
        doesn't let them to see it.
        -UserMiddleware is just a module for responsiveness and good user experience.
        -for example:
        It must be use in a way to don't let a user see a profile page with no data 
        -null objects in it.