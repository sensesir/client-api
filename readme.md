# GDoor Sensor Backend
---

This project contains an AWS Lambda function implemented in the Node.js runtime. 
It serves clients of the service - mobile and other.

## Quick Start

 1. Clone the repository from Github
 2. Set up AWS `sam cli`: `$ pip install --user aws-sam-cli` 
 3. Make sure the sam binary is globally available in your shell: `$ export PATH=$PATH:~/Library/Python/2.7/bin` where the path is the path to where your pip modules install to
 4. Restart your shell, and type `$ sam --version` - it should display the version, if it doesn't something has gone wrong.
 5. The template.yaml file should be included in the git repo, so you shouldn't have to run `$ sam init`
 6. Install the required dependancies: `$ npm install`
 7. **Running:** Use `$ sam local invoke "GDoorClientAPI" -e tests/.json` This should start a docker container on your local machine and invoke the function with an input.
 8. You can use the debugger of your choice - connect it to port 5858. Full command: `$ sam local invoke "GDoorSensorBackend" -e tests/first_boot_test.json --debug-port 5858` change the json file according to the desired test.
 9. If you were running any other Docker containers with port 5858 open as a debug port, you may need to restart Docker. 

**To deploy new code:**

 1. Upload a zipped file of the repo to the S3 bucket: *sensesir-code-store* | Recommend using CLI: `$ aws s3 cp local_file.zip s3://sensesir-code-store/sensor-backend/`
 2. In the Lambda management console, navigate to the *GDoorSensorBackend* function
 3. In the *Function code* section, use the `Code entry type` dropdown to select *"Upload a file from Amazon S3"*
 4. Click Save in the top right hand corner - this will 'deploy' the new code

## API
**Root Endpoint:** https://eu4nnl75bb.execute-api.eu-west-1.amazonaws.com/

The sensor backend is configured to accept incoming API requests. This is to make this servers the interface to injecting messages into the AWS IoT MQTT message broker. Endpoints employ a schema to direct to `Prod` or `Dev` (see below). Current endpoints:

  1. Command: Send a command to a specific sensor. Payload schema:
  `{
      sensorUID: uuid-v4
      command: _command // (i.e. "actuate" or "health")
   }`
  2.  

Example endpoint (full): https://eu4nnl75bb.execute-api.eu-west-1.amazonaws.com/dev/command

### Security

The API uses an api key for security, and this should be submitted as a header: `x-api-key`

## DynamoDB