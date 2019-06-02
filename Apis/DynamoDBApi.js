/**
 * Promise wrapper for DynamDB to allow async await usage
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 05/29/2019
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.IOT_REGION });
let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    createItem: (tableName, itemData) => {
        return new Promise((resolve, reject) => {
            const itemToCreate = {
                TableName: tableName,
                Item: itemData
            }

            docClient.put(itemToCreate, (error, data) => {
                if (error) {
                    return reject(error);
                }
    
                console.log(`DYNAMODB: Created new item`);
                resolve(true);
            });
        });
    },
    
    updateDocument: (updateData) => {
        return new Promise((resolve, reject) => {   
            docClient.update(updateData, (error, data) => {
                if (error) {
                    reject(error);
                }
    
                console.log(`DYNAMODB: Updated sensor document item`);
                resolve(true);
            });
        });
    },
    
    getItem: (identifiers) => {
        return new Promise((resolve, reject) => {
            docClient.get(identifiers, (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data.Item);
            });
        });
    },

    searchForItem: async (tableName, searchKey, searchValue) => {
        const searchParams = {
            TableName: tableName,
            KeyConditionExpression: `${searchKey} = :value`,
            ExpressionAttributeValues: {
                ":value": searchValue
            }
        };

        let items = await this.getItem(searchParams);
        return items;
    }
}