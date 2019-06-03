/**
 * Function entry point
 * Lambda function to implement a client API
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 04/18/2019
 */

const axios = require('axios');
const Constants = require('../Config/Constants');
const DynamoDBApi = require('./DynamoDBApi');
const UUID = require('uuid-v4');

module.exports = {    
    createNewUser: async (userData) => {
        console.log("USER API: Creating new user");
        const username = userData.username;
        const password = userData.password;
        const email = userData.email;
        const appVersion = userData.appVersion;
        let names = processUsername(username);

        // Create new metrics for user 
        let newUserUID = UUID();
        const currentDate = new Date().toISOString();

        let newUserData = {
            activeDays: 1, 
            address: "None",
            appVersion: appVersion,
            city: "Unknown",
            country: "Unknown",
            email: email.toLowerCase(),
            firstName: names.userFirstName,
            lastName: names.userLastName,
            lastSeen: currentDate,
            masterAccount: true,
            mobileNumber: "None",
            password: password,
            premium: false,
            region: "Unknown",
            sensorUID: "None",
            signupDate: currentDate,
            userUID: newUserUID
        }

        let result = await DynamoDBApi.createItem(Constants.TABLE_USERS, newUserData);
        if (result === true) { 
            return { 
                statusCode: 200,
                body: JSON.stringify({
                    message: "Successfully created new user",
                    userUID: newUserUID 
                })
            } 
        }
        else { return result };
    },

    logUserIn: async (userCreds) => {
        console.log("USER API: Attempting to log user in with email & password");
        let email = userCreds.email.toLowerCase();
        let passwordAttempt = userCreds.password;

        let searchResults = await DynamoDBApi.searchForItem(Constants.TABLE_USERS, Constants.TABLE_USERS_EMAIL_INDEX, "email", email);
        if (searchResults.length === 1) {
            console.log("USER API: Found user for email, testing password");
            let userData = searchResults[0];

            if (userData.password === passwordAttempt) {
                console.log("USER API: Correct password");
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: true,
                        message: "Successful login",
                        userData: userData,
                        userUID: userData.userUID
                    })   
                }
            } else {
                console.log("USER API: Incorrect password");
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: false,
                        message: "Incorrect password",
                        userUID: null
                    })
                }
            }
        }

        else if (searchResults.length > 1) {
            // Log error to slack and tag @peza
            console.log(`USER API: Multiple accounts found for user email => ${email}`);
            return {
                statusCode: 404,
                body: JSON.stringify({
                    success: false,
                    message: "Error: Multiple accounts found for email address"
                })
            }
        } 
        
        else {
            console.log(`USER API: No user found for address => ${email}`);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: false,
                    message: "No user found for email address"
                })
            }
        }
    },

    updateUserDetails: async (updateData) => {
        // Figure out which update it is
        let updateQuery;
        if (updateData.updateType === Constants.USER_UPDATE_ADDRESS) { 
            updateQuery = { 
                expression: `address = :address`,
                attributValue: { ":address": updateData.updateValue } 
            }; 
        } 
        
        else if (updateData.updateType === Constants.USER_UPDATE_EMAIL) { 
            updateQuery = { 
                expression: `email = :email`,
                attributValue: { ":email": updateData.updateValue } 
            }; 
        } 
        
        else if (updateData.updateType === Constants.USER_UPDATE_MOBILE) { 
            updateQuery = { 
                expression: `mobileNumber = :mobileNumber`,
                attributValue: { ":mobileNumber": updateData.updateValue } 
            }; 
        } 
        
        else if (updateData.updateType === Constants.USER_UPDATE_NAME) { 
            // Special case - 
            let names = processUsername(updateData.updateValue);
            updateQuery = { 
                expression: `firstName = :firstName, lastName = :lastName`,
                attributValue: { 
                    ":firstName": names.userFirstName,
                    ":lastName": names.userLastName
                } 
            }; 
        }

        console.log(`USER API: Updating user information => ${JSON.stringify(updateData)}`);
        const update = {
            TableName: Constants.TABLE_USERS,
            Key: { 
                userUID: updateData.userUID 
            },
            UpdateExpression: `set ${updateQuery.expression}`,
            ExpressionAttributeValues: { ...updateQuery.attributValue },
            ReturnValues:"UPDATED_NEW"            
        };

        let result = await DynamoDBApi.updateDocument(update);
        if (result === true) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true,
                    message: "Updated user profile" 
                })
            };
        }
        else { return result }
    },

    activeDay: async (request) => {
        // Wrapper
        return await logActiveDay(request);
    },

    updateLastSeen: async (request) => {
        console.log("USER API: Updating user last seen");
        const payload = JSON.parse(request.body);
        const userUID = payload.userUID;
        const newLastSeen = new Date().toISOString();
        
        let activeDayRes;
        let requiresActiveDay = await assessActiveDay(userUID, newLastSeen);
        if (requiresActiveDay) { activeDayRes = await logActiveDay(request) }

        // Update the last seen time
        const update = {
            TableName: Constants.TABLE_USERS,
            Key: { userUID: userUID },
            UpdateExpression: `set lastSeen = :lastSeen`,
            ExpressionAttributeValues: { ":lastSeen": newLastSeen },
            ReturnValues:"UPDATED_NEW"     
        }

        let result = await DynamoDBApi.updateDocument(update);
        if (result === true) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true,
                    message: "Updated last seen time" 
                })
            };
        }
        else { return result }
    },

    addSensor: async (payload) => {
        console.log(`USER API: Adding sensor to user profile`);
        const update = {
            TableName: Constants.TABLE_USERS,
            Key: { userUID: payload.userUID },
            UpdateExpression: `set sensorUID = :sensorUID`,
            ExpressionAttributeValues: { ":sensorUID": payload.sensorUID },
            ReturnValues:"UPDATED_NEW"            
        };

        let result = await DynamoDBApi.updateDocument(update);
        if (result === true) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Added sensor"
                })
            };
        }
        else { return result }
    },

    actuateDoor: async (payload) => {
        const userUID = payload.userUID;
        const itemIdentifiers = {
            TableName: Constants.TABLE_USERS,
            Key: { userUID: userUID }
        };

        console.log(`USER API: Actuating door for user => ${userUID}`);
        const userData = await DynamoDBApi.getItem(itemIdentifiers);
        const sensorUID = userData.sensorUID;
        const actuatePayload = {
            sensorUID: sensorUID,
            command: Constants.COMMAND_ACTUATE
        };
        const config = {
            headers: {
                "x-api-key": process.env.SENSOR_BACKEND_API_KEY
            }
        }

        let res = await new Promise((resolve, reject) => {
            axios.post(process.env.ACTUATE_SENSOR_API, actuatePayload, config)
                .then(res => { return resolve(res) })
                .catch(error => { return reject(error) });
        });

        if (res.status !== 200) {
            return {
                statusCode: res.status,
                body: JSON.stringify({
                    message: res.statusText 
                })
            }
        }

        console.log(`USER API: Successfully actuated door`);
        let result = await updateDoorCommandCount(sensorUID);
        if (result === true) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Successfully actuated door"
                })
            }
        } 
        else { return result }
    },

    getSensorState: async (payload) => {
        console.log(`USER API: Getting sensor state for user.`);
        const userData = await getUserData(payload.userUID);
        const sensorUID = userData.sensorUID;

        if (sensorUID === "None") {
            console.warn("USER API: User tried to get sensor state without having a sensor");
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No sensor allocated to user, please add a sensor" })
            }
        }

        // NOTE! This is bad microservice design, but for the sake of agile dev, it is overlooked
        const itemIdentifiers = {
            TableName: Constants.TABLE_SENSORS,
            Key: { sensorUID: sensorUID}
        }
    
        const sensorData = await DynamoDBApi.getItem(itemIdentifiers);
        return {
            statusCode: 200,
            body: JSON.stringify({
                online: sensorData.online,
                lastPing: sensorData.lastPing
            })
        }
    },

    addLinkedAccount: async (eventData) => {

    }
}

const processUsername = (username) => {
    let nameComponents = username.split(" ");
    let firstName = nameComponents[0];
    let lastName = "None";
    if (nameComponents.length > 1) {
        lastName = nameComponents[nameComponents.length - 1];
    }

    return {
        userFirstName: firstName,
        userLastName: lastName
    }
}

const getLocationFromIP = async (req) => {
    console.log("USER API: Getting user location from IP address");
    const senderIP = getIPFromRequest(req);
    if (senderIP.length === 0) {
        console.log(`USER API: Couldn't get IP address`);
        return {};
    }

    let locationQuery = process.env.IP_STACK_ROOT_URL + senderIP + `?access_key=${process.env.IP_STACK_KEY}`;  
    return new Promise((resolve, reject) => {
        axios.get(locationQuery)
        .then(res => {
            // console.log(`USER API: Location data ${JSON.stringify(res.data)}`);
            let ipStackData = res.data;
            return resolve({
                city: ipStackData.city,
                country: ipStackData.country_name,
                region: ipStackData.region_name
            });
        }) 
        .catch(error => { return reject(error) });
    });
}

const getIPFromRequest = (req) => {
    const ipData = req.headers['X-Forwarded-For'];
    if (typeof(ipData) === 'string') {
        // Additional check for comma-separated IP addresses
        if (ipData.includes(',')) {
            // Need to splice the array and take the first IP address eg: "196.251.48.2, 196.251.48.2"
            const ipAddressArray = ipData.split(', ');
            const initialIPAddress = ipAddressArray[0];
            return initialIPAddress;
        }

        return ipData;
    } 

    else if (Array.isArray(ipData)){
        console.log("WARNING: IP Address data came in as array **");
        return ipAddress[0];
    }

    else{
        console.log(`ERROR: Unknown IP Data type = ${ipData}`);
        return "";
    }		
}

const updateDoorCommandCount = async (sensorUID) => {
    const sensorData = await getSensorData(sensorUID);
    let commandType = sensorData.doorState === "open" ? "doorCloseCommands" : "doorOpenCommands";
 
    const update = {
        TableName: Constants.TABLE_SENSORS,
        Key: { sensorUID: sensorUID },
        UpdateExpression: `set ${commandType} = ${commandType} + :addCommand`,
        ExpressionAttributeValues: { ":addCommand": 1 },
        ReturnValues:"UPDATED_NEW"            
    };

    let result = await DynamoDBApi.updateDocument(update);
    return result;
}

const getUserData = async (userUID) => {
    const itemIdentifiers = {
        TableName: Constants.TABLE_USERS,
        Key: { userUID: userUID}
    }
    return await DynamoDBApi.getItem(itemIdentifiers);
};

const getSensorData = async (sensorUID) => {
    const itemIdentifiers = {
        TableName: Constants.TABLE_SENSORS,
        Key: { sensorUID: sensorUID}
    }
    return await DynamoDBApi.getItem(itemIdentifiers);
}

const assessActiveDay = async (userUID, newLastSeenISO) => {
    const userProfile = await getUserData(userUID);
    const oldLastSeen = new Date(userProfile.lastSeen);
    const newLastSeen = new Date(newLastSeenISO);

    // Test for equality across year, date and day
    if (oldLastSeen.getFullYear() !== newLastSeen.getFullYear()) { return true }
    if (oldLastSeen.getMonth() !== newLastSeen.getMonth()) { return true }
    if (oldLastSeen.getDate() !== newLastSeen.getDate()) { return true }

    console.log("USER API: Not updating active days, last seen today.")
    return false;
}

const logActiveDay = async (request) => {
    console.log("USER API: Incrementing active days");
    const payload = JSON.parse(request.body);
    const locationData = await getLocationFromIP(request);

    const update = {
        TableName: Constants.TABLE_USERS,
        Key: { userUID: payload.userUID },
        UpdateExpression: `set city = :city,
                           country = :country,
                           #re = :re,
                           activeDays = activeDays + :addDay`,
        ExpressionAttributeValues: { 
            ":city":    locationData.city ? locationData.city : "None",
            ":country": locationData.country ? locationData.country : "None",
            ":re":  locationData.region ? locationData.region : "None",
            ":addDay": 1
        },
        ExpressionAttributeNames: { "#re": "region" }, // Reqired because "online" keyword is reserved
        ReturnValues:"UPDATED_NEW"            
    };

    let result = await DynamoDBApi.updateDocument(update);
    if (result === true) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Updated active days"
            })
        };
    }
    else { return result }
}