# Node - Koa - API

## How to start

```
npm i
docker-compose up -d
npm run watch-server
```

You have to use the following Auth token:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.zAIPIL0eT3YqDoXgIJ2hHPN7oJBeJ5_YHQk6pMdq6RA     
```


## Useful information

[![NPM version](https://img.shields.io/npm/v/node-typescript-koa-rest.svg)](https://www.npmjs.com/package/node-typescript-koa-rest)
[![Dependency Status](https://david-dm.org/javieraviles/node-typescript-koa-rest.svg)](https://david-dm.org/javieraviles/node-typescript-koa-rest)


Api Documentation for Users and User's book
-------------------------------------

* Allowed HTTPs requests:
* PUT     : To create resource 
* POST    : Update resource
* GET     : Get a resource or list of resources
* DELETE  : To delete resource

Description Of Usual Server Responses:
-------------------------------------

* 200 OK - the request was successful (some API calls may return 201 instead).
* 201 Created - the request was successful and a resource was created.
* 204 No Content - the request was successful but there is no representation to return (i.e. the response is empty).400 Bad Request - the request could not be understood or was missing required parameters.
* 401 Unauthorized - authentication failed or user doesn't have permissions for requested operation.403 Forbidden - access denied.
* 404 Not Found - resource was not found.405 Method Not Allowed - requested method is not supported for resource.




AVAILABLE ENDPOINTS USERS

| method             | resource         | description                                                                                    |
|:-------------------|:-----------------|:-----------------------------------------------------------------------------------------------|
| `GET`              | `/`              | Simple hello world response                                                                    |
| `GET`              | `/jwt`           | Dummy endpoint to show how JWT info gets stored in ctx.state                                   |
| `GET`              | `/users`         | returns the collection of users present in the DB                                              |
| `GET`              | `/users/:id`     | returns the specified id user                                                                  |
| `POST`             | `/users`         | creates a user in the DB (object user to be includued in request's body)                       |
| `PUT`              | `/users/:id`     | updates an already created user in the DB (object user to be includued in request's body)      |
| `DELETE`           | `/users/:id`     | deletes a user from the DB (JWT token user ID must be the same as the user you want to delete) |
| 

AVAILABLE ENDPOINTS BOOK

| method             | resource                  | description                                                                                            |
|:-------------------|:--------------------------|:-------------------------------------------------------------------------------------------------------|
| `GET`              | `/users/:id/books/`       | return all user's books                                                                                |
| `POST`             | `/users/:id/books/`       | creates new user's book                                                                                |
| `PUT`              | `/users/:userId/books/:id`| updates an already created user's book in the DB (object user's book to be includued in request's body)|                                             
| `DELETE`           | `/users/:userId/books/:id`| deletes a user's book the DB (JWT token user ID must be the same as the user you want to delete)       |
|                    |                           |                                                                                                        |


Usage
-----

## Get  

`http://localhost:3000/users/1/books/`

Response
```json
{
    "id": 1,
    "name": "Mary",
    "email": "yashuk806@gmail.com",
    "books": [
        {
            "id": 5,
            "name": "Test",
            "description": "is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
            "date": "2019-03-14"
        },
        {
            "id": 6,
            "name": "Test1",
            "description": "t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
            "date": "2019-12-25"
        }
    ]
}

```
## POST 

`http://localhost:3000/users/1/books/`

Header Content-Type application/json

```json
{      
   "name": "Test3",
   "description": "is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
   "date": "2019-03-14"
}
```

Response

```json
{
    "name": "Test3",
    "description": "is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    "date": "2019-03-14",
    "user": "1",
    "id": 7
}
```

## PUT 

Header Content-Type application/json

`http://localhost:3000/users/1/books/1`

```json
{
    "name": "Test4",
    "description": "is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    "date": "2019-03-14",
    "user": "1",
    "id": 7
}
```

Response
```json
{
    "name": "Test4",
    "description": "is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    "date": "2019-03-14",
    "user": "1",
    "id": 7
}
```

## DELETE 

`http://localhost:3000/users/1/books/1`
