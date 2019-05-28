module.exports = {
    // DynamoDB tables
    TABLE_USERS:     "Users",
    TABLE_SENSORS:   "Sensors",
    TABLE_ERRORS:    "ErrorLog",
    TABLE_ANALYTICS: "AnalyticEvents",
    
    // Components
    COMPONENT_SENSOR: "Sensor",
    COMPONENT_BACKEND: "Backend",
    COMPONENT_CLIENT: "Client",

    // Categories
    CATEGORY_EVENT:   "event",
    CATEGORY_COMMAND: "command",

    // Events
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