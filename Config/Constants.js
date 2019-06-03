module.exports = {
    // DynamoDB tables
    TABLE_USERS:     "Users",
    TABLE_SENSORS:   "Sensors",
    TABLE_ERRORS:    "ErrorLog",
    TABLE_ANALYTICS: "AnalyticEvents",
    
    // Table Indices
    TABLE_USERS_EMAIL_INDEX: "email-index",

    // Components
    COMPONENT_SENSOR: "Sensor",
    COMPONENT_BACKEND: "Backend",
    COMPONENT_CLIENT: "Client",

    // Categories
    CATEGORY_EVENT:   "event",
    CATEGORY_COMMAND: "command",

    // User events
    ENDPOINT_NEW_USER:      "/user/createNewUser",
    ENDPOINT_LOGIN:         "/user/login",

    // User info updates
    USER_UPDATE_ADDRESS:    "addressUpdate",
    USER_UPDATE_NAME:       "nameUpdate",
    USER_UPDATE_MOBILE:     "mobileNumberUpdate",
    USER_UPDATE_EMAIL:      "emailUpdate",

    // IOT Events
    EVENT_FIRST_BOOT:       "firstBoot",
    EVENT_BOOT:             "boot",
    EVENT_DOOR_STATE:       "doorStateChange",
    EVENT_HEALTH:           "health",
    EVENT_RECONNECT:        "reconnect",
    EVENT_ERROR:            "error",
    EVENT_MQTT_CONN_FAILED: "mqttConFailure",
    EVENT_DISCONNECT:       "disconnected", 

    // Commands
    COMMAND_HEALTH:     "health",
    COMMAND_ACTUATE:    "actuate",
}