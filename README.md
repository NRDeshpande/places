# Places

#### Web application which will allow users to do CRUD operations for the places

> This app is developed having 2 separate modules backend and frontend. The communication between these modules takes place via REST(Representational State Transfer) API.

Backend Requirements to run this app:
* node >= v10.13.0
* npm >= 6.4.1
* DB (mongodb)
* Nginx > 1.10.x 
* Dependencies in package.json

Frontend Requirements to run this app:
* angular >= 6 (Using 7.0.2)
* angular material
* node >= v10.13.0
* npm >= 6.4.1
* Nginx > 1.10.x 
* Dependencies in package.json

List of REST API's: (All API's are prefixed with "https://node.iamnikhil.com")

| API Name    | Mathod      | Description |
| ----------- | ----------- | ----------- |
| /api/login      | POST    | The Authentication API enables user to login  with email id and password |
| /api/register   | POST    | API is to create a new user with User Name, Email ID and Password |
| /api/profile   | GET    | The Authentication API to check user login status |
| /api/places   | GET    | API return all the saved places in JSON format |
| /api/placeDetail/:id   | GET    | API return the saved place detail in JSON format for specified ID |
| /api/saveNewPlace/   | POST    | API to create/save new place  |
| /api/deletePlace/   | POST    | API to delete saved place for specified ID |
