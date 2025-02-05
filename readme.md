# APIs

- Base url ->
  Development - http://localhost:5000/api/v1
  Production - https://iot-server-ft0b.onrender.com/api/v1

- Get sensor list
  endpoint - /sensor
  method - GET
  response - List of available sensor in db (in our case two already inserted )

<!-- Updated the api for update sensor data and battery sending an extra value in body : timestamp -->

- Update sensor data and battery
  endpoint - /sensor/data/:sensor_id
  method - PATCH
  body - sensorData (object which contain two key: "value", "unit") , battery (current battery percentage), timestamp (new date object )

<!-- don't hit this endpoint cause two demo sensor data already inserted in the DB -->

- Add new sensor in Collection
  endpoint - /sensor
  method - POST
  body -

<!-- New apis  -->

- Get the single document of the device by passing device id
  endpoint - /camera-device/:device_id (replace ":device_id" with actual device id)
  method - GET

- whenever a breach detected, hit this endpoint with the following body
  endpoint - /breach
  method - POST
  body - deviceId (\_id of device saved in the db), breach (true), timestamp (a new date object using datetime.datetime.now())

- get action document
  endpoint - /action
  method - GET
  response - will return object containing action document

- Update action status
  endpoint - /action/:action_id
  method - PATCH
  body - currentStatus (Boolean)
