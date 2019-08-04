module.exports = {
    // DynamoDB tables
    TABLE_USERS:     "Users",
    TABLE_SENSORS:   "Sensors",
    TABLE_ERRORS:    "ErrorLog",
    TABLE_ANALYTICS: "AnalyticEvents",
    
    // Table Indices
    TABLE_USERS_EMAIL_INDEX: "EmailIndex",

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
    ENDPOINT_UPDATE_DATA:   "/user/updateData",
    ENDPOINT_ACTIVE_DAY:    "/user/activeDay",
    ENDPOINT_ADD_SENSOR:    "/user/addSensor",
    ENDPOINT_ACTUATE_DOOR:  "/user/actuateDoor",
    ENDPOINT_SENSOR_DATA:   "/user/getSensorData",
    ENDPOINT_LAST_SEEN:     "/user/updateLastSeen",
    ENDPOINT_SENSOR_STATE:  "/user/getSensorState",
    ENDPOINT_INIT_SENSOR:   "/user/initializeSensor",
    ENDPOINT_PING:          "/user/ping",

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