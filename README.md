# Account Manager Application:


## Documentation:
Read more about this [Project](https://drive.google.com/file/d/1WDUSNodQkUR9hEwEN5gEfal6ZfFya1O4/view?usp=sharing) here.


# Docker Installation

1. [Install Docker Compose](https://docs.docker.com/compose/install/)
1. Clone this repository
1. Update .env file inside Backend directory
1. Run all containers with `docker-compose build & docker-compose up`
1. Refresh `localhost:3000` a few times in your web browser to generate some traces. 
1. Register a single user by calling /RegisterUser End-point by following curl & signin as a guest:
```bash
curl --location 'http://127.0.0.1:8081/api/login/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "Name": "keyur",
    "Email": "kcode@gmail.com",
    "userName": "kcode",
    "passWord": "1234",
    "Address": "sample user",
    "City": "Gandhinagar"
}'
```