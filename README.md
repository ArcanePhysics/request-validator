# request-validator - an http request body validator
http request payload validator function. Takes in request payload and request map, and returns a list of field validation results to be used in Node.js apps

## Table of Contents
* [General Info](#general-info)
* [Installation](#installation)
* [Use](#use)
* [Request Map Strucure](#request-map-strucure)

## General Info
This is a simple http payload validator function.
Function takes in request payload and request map (see below) and outputs an array of validation results for each field present in the map.

## Installation

To install package run in terminal:
```
cd /path/to/project
$ npm install af-request-validator
```

## Use
To use the function in your app.js file
```
const validate = require('af-request-validator');

const reqMap = {
    "type"          : "Object",
    "needed"        : true,
    "name"          : "Req Body",
    "properties"    : {
        "name": {
            "type"      : "Simple",
            "needed"    : true,
            "express"   : "^[A-z- ]{3,20}$",
            "name"      : "Name"
        },
        "birthDate": {
            "type"      : "Simple",
            "needed"    : true,
            "express"   : "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            "name"      : "Date of Birth"
        },
        "friend": {
            "type"          : "Object",
            "needed"        : true,
            "name"          : "Friend",
            "properties"    : {
                "name": {
                    "type"      : "Simple",
                    "needed"    : true,
                    "express"   : "^[A-z- ]{3,20}$",
                    "name"      : "Name"
                },
                "birthDate": {
                    "type"      : "Simple",
                    "needed"    : true,
                    "express"   : "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
                    "name"      : "Date of Birth"
                }
            }
        },
        "friendArray" : {
            "type"          : "Array",
            "needed"        : true,
            "name"          : "List of Friends",
            "contents"  : {
                "type"          : "Object",
                "needed"        : true,
                "name"          : "Friend",
                "properties"    : {
                    "name": {
                    "type"      : "Simple",
                    "needed"    : true,
                    "express"   : "^[A-z- ]{3,20}$",
                    "name"      : "Name"
                    },
                    "birthDate": {
                        "type"      : "Simple",
                        "needed"    : true,
                        "express"   : "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
                        "name"      : "Date of Birth"
                    }
                }
            }
        }
    }
}

const requestBody = {
    "name" : "Vik",
    "birthDate" : "1985-02-10",
    "friend" : {
        "name" : "Alex",
        "birthDate" : "1986-01-02"
    },
    "friendArray" : [
        {
        "name" : "Dima",
        "birthDate" : "1987-12-09"
        }
    ] 
}

const validateSummary = validate(requestBody, reqMap);
```
validateSummary will contain an Array of validation results for each field in Map

## Request Map Strucure
Request map is a js object that contains filed descriptions for validator to check against

request map can describe 3 types of fields (Object, Array, and simple);

Simple type field map looks like this:
```
{
"type"      : "Simple",                 //Type
"needed"    : true,                     //Is this field mandatory?
"express"   : "^[A-z- ]{3,20}$",       //Regexp to validate the field
"name"      : "Name"                    //Field name
}
```

Object type filed map looks like this:
```
{
    "type"          : "Object",         //Type
    "needed"        : true,             //Is this field mandatory?
    "name"          : "Req Body",       //Field name
    "properties"    : {                 //Maps for properties the object has
        "name": {
            "type"      : "Simple",
            "needed"    : true,
            "express"   : "^[A-z- ]{3,20}$",
            "name"      : "Name"
        },
        "birthDate": {
            "type"      : "Simple",
            "needed"    : true,
            "express"   : "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            "name"      : "Date of Birth"
        }
    }
}
```
note that object can contain Abject and Array properties, just nest them

Array type field map looks like this:
```
{
"type"          : "Array",
"needed"        : true,
"name"          : "List of Friends",
"contents"  : {                         //map for contents of array 
    "type"          : "Object",
    "needed"        : true,
    "name"          : "Friend",
    "properties"    : {
        "name": {
        "type"      : "Simple",
        "needed"    : true,
        "express"   : "^[A-z- ]{3,20}$",
        "name"      : "Name"
        },
        "birthDate": {
            "type"      : "Simple",
            "needed"    : true,
            "express"   : "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
            "name"      : "Date of Birth"
        }
    }
}
```
