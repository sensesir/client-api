/**
 * Function entry point
 * Lambda function to implement a client API
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 04/18/2019
 */

const Constants = require('./Config/Constants');
const UserApi = require('./Apis/UserApi');

exports.handler = async (event) => {
    try {
        res = await routeRequest(event);
        return res;
    } 
    catch(error) {
        console.error(error);
        // todo: handle
        return {
            statusCode: 500,
            message: error.message
        }
    } 
}

const routeRequest = async (event) => {
    const path = event.path;

    if (path === Constants.ENDPOINT_NEW_USER) {
        let result = await UserApi.createNewUser(event);
        return result;
    }

    else if (path === Constants.ENDPOINT_LOGIN) {
        let result = await UserApi.logUserIn(event);
        return result;
    }

    else {
        throw new Error(`INDEX: Unknown path for request => ${path}`);
    }
}

