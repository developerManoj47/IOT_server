# APIs

Base url -> http://localhost:5000/api/v1

- Get sensor list
  endpoint - /sensor
  method - GET
  response - List of available sensor in db (in our case two already inserted )

- Update sensor action
  endpoint - /sensor/action/:sensor_id (replace ":sensor_id" with actual sensor id)
  method - PATCH
  body - currentState (Boolean)
  response - will return new sensor document after action update

- Update sensor data and battery
  endpoint - /sensor/data/:sensor_id
  method - PATCH
  body - sensorData (object which contain sensor data) , battery (current battery percentage)

<!-- don't hit this endpoint cause two demo sensor data already inserted in the DB -->

- Add new sensor in Collection
  endpoint - /sensor
  method - POST
  body -
