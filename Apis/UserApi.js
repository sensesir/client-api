/**
 * Function entry point
 * Lambda function to implement a client API
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 04/18/2019
 */

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
            email: email,
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
        if (result === true) { return { userUID: newUserUID } }
        else { return result };
    },

    logUserIn: async (userCreds) => {
        console.log("USER API: Attempting to log user in with email & password");
        let email = userCreds.email;
        let passwordAttempt = userCreds.password;

        let searchResults = await DynamoDBApi.searchForItem(Constants.TABLE_USERS, Constants.TABLE_USERS_EMAIL_INDEX, "email", email);
        if (searchResults.length === 1) {
            console.log("USER API: Found user for email, testing password");
            let userData = searchResults[0];

            if (userData.password === passwordAttempt) {
                console.log("USER API: Correct password");
                return {
                    statusCode: 200,
                    success: true,
                    message: "Successful login",
                    userUID: userData.userUID
                }
            } else {
                console.log("USER API: Incorrect password");
                return {
                    statusCode: 200,
                    success: false,
                    message: "Incorrect password",
                    userUID: userData.userUID
                }
            }
        }

        else if (searchResults.length > 1) {
            // Log error to slack and tag @peza
            console.log(`USER API: Multiple accounts found for user email => ${email}`);
            return {
                statusCode: 404,
                success: false,
                message: "Error: Multiple accounts found for email address"
            }
        } 
        
        else {
            console.log(`USER API: No user found for address => ${email}`);
            return {
                statusCode: 200,
                success: false,
                message: "No user found for address"
            }
        }
    },

    updateUserDetails: async (updateData) => {
        // Figure out which update it is
        let updatePair;
        if (updateData.updateType === Constants.USER_UPDATE_ADDRESS) { updateData = { address: updateData.updateValue } } 
        else if (updateData.updateType === Constants.USER_UPDATE_EMAIL) { updateData = { email: updateData.updateValue } } 
        else if (updateData.updateType === Constants.USER_UPDATE_MOBILE) { updateData = { mobileNumber: updateData.updateValue } } 
        else if (updateData.updateType === Constants.USER_UPDATE_NAME) { 
            // Special case - 
            let names = processUsername(updateData.updateValue);
            updateData = { 
                firstName: names[0],
                lastName: names[1]
            }; 
        }

        console.log(`USER API: Updating user information => ${updateData}`);
        let update = {
            TableName: Constants.TABLE_USERS,

        }

        let result = await DynamoDBApi.updateDocument(update);
        return result;
    },

    actuateDoor: async (userUID) => {

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
    // TODO
    console.log("USER API: Getting user location from IP address");
}

const createItem = async (data) => {

}