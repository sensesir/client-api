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
        const password = userData.userPassword;
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

    logUserIn: async (userData) => {
        console.log("USER API: Attempting to log user in with email & password");
        let email = userData.email;
        let password = userData.userPassword;

        let searchResults = DynamoDBApi.searchForItem(Constants.TABLE_USERS, "email", email);
        if (searchResults.length === 1) {
            console.log("USER API: Found user for email, testing password");
            // Extract user password
        }
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