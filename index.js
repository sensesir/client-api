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
            body: JSON.stringify({
                message: error.message,
                stack: error.stack
            })
        }
    } 
}

const routeRequest = async (request) => {
    const path = request.path;
    const payload = request.body ? JSON.parse(request.body) : request;

    if (path === Constants.ENDPOINT_NEW_USER) {
        let result = await UserApi.createNewUser(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_LOGIN) {
        let result = await UserApi.logUserIn(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_UPDATE_DATA) {
        let result = await UserApi.updateUserDetails(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_ACTIVE_DAY) {
        let result = await UserApi.activeDay(request);  // special case - we need the headers
        return result;
    }

    else if (path === Constants.ENDPOINT_ADD_SENSOR) {
        let result = await UserApi.addSensor(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_ACTUATE_DOOR) {
        let result = await UserApi.actuateDoor(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_LAST_SEEN) {
        let result = await UserApi.updateLastSeen(request);
        return result;
    }

    else if (path == Constants.ENDPOINT_SENSOR_DATA) {
        let result = await UserApi.getSensorData(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_SENSOR_STATE) {
        let result = await UserApi.getSensorState(payload);
        return result;
    }

    else if (path == Constants.ENDPOINT_INIT_SENSOR) {
        let result = await UserApi.initializeSensor(payload);
        return result;
    }

    else {
        throw new Error(`INDEX: Unknown path for request => ${path}`);
    }
}

