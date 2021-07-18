function validateRequest(requestBody, fieldMap) {
    let body = requestBody || "";
    let reply = validate(body, fieldMap, "body", requestBody);
    return reply;
}

    // main recursive function. test payload according to map
function validate(field, fieldMap, path, root) {
    //node.error("validate start");
    //node.error(path);
    let replies = [];
        // call validation function, based on type in map
    switch (fieldMap.type) {
        case "Object":
            //node.error("type: Obj");
            replies = validateObj(field, fieldMap, path, root);
            break;
        case "Array":
            replies = validateArray(field, fieldMap, path, root);
            break;
        default:
            //node.error("type: Element");
            replies = validateElement(field, fieldMap, path, root);
    }
    return replies;
}
    // function for validating Objects
function validateObj(objField, objMap, path, root) {
    //node.error("validateObj start");
    let replies = [];
        // go through all properties in obj.
    for (let property in objMap.properties) {
        let currPath = path + "." + property;
        //node.error(currPath);
            // check if empty and required
        let checkPresenseReply = checkPresense(objField[property], objMap.properties[property], currPath, root);
        if (checkPresenseReply.empty) {
            replies = replies.concat(checkPresenseReply);
        } else {
                // if not empty validate properties in object recursively
            let validateElementReply = validate(objField[property], objMap.properties[property], currPath, root);
            replies = replies.concat(validateElementReply);
        }
    }
    return replies;
}
    // function for validating Arrays
function validateArray(arrField, arrMap, path, root) {
    //node.error("validateArray start");
    let replies = [];
    // if (arrField.length < arrMap.minLength) {
    //     replies = {
    //         "ok" : false,
    //         "message" : "min length = " + arrMap.minLength,
    //         "path" : path
    //     }
    // }
    let i = 0;
        // go through all contents of array and validate 1 by 1
    do {
            // check at least once even empty array to make sure empty array is ok in map (no "needed" contents)
        let currPath = `${path}[${i}]`;
        //node.error(currPath);
            // check if empty and required
        let checkPresenseReply = checkPresense(arrField[i], arrMap.contents, currPath, root);
        if (checkPresenseReply.empty) {
            replies = replies.concat(checkPresenseReply);   
        } else {
                // if not empty validate array cintents one by one recursively
            let validateElementReply = validate(arrField[i], arrMap.contents, currPath, root);
            replies = replies.concat(validateElementReply);
        }
        i++;
    } while (i < arrField.length)
    return replies;
}
    // validating simple types
function validateElement(element, elemMap, path, root) {
    //node.error("validateElement start");
    //node.error(path);
    let reply;
        // check if empty and required
    let checkPresenseReply = checkPresense(element, elemMap, path, root);
    if (checkPresenseReply.empty) {
        reply = checkPresenseReply;
    } else {
            // if not empty test element by regex
        let testElementReply = testElement(element, elemMap, path)
        reply = testElementReply;
    }
    return reply;
}
    // test besic element according to regex (end of recursion)
function testElement(nonObjField, fieldMap, path) {
    let ok = false;
    let message = `Ошибка формата поля: ${fieldMap.name}`;
    let regexp = new RegExp(fieldMap.express);
    if (regexp.test(nonObjField)) {
        ok = true;
        message = undefined;
    }
    let reply = {
        "ok"        : ok,
        "empty"     : false,
        "path"      : path,
        "message"   : message,
        "express"   : fieldMap.express,
        "value"     : nonObjField
    }
    return reply;
}

function isNeedField(needed, root) {
    let ret = {
        needed : needed,
        expess : "boolean",
        output : ""
    };
    //console.log(0, needed);
    if(typeof needed === 'string'){
        var mustache = require("mustache");
        var output = mustache.render(needed, root);
        //console.log(1, needed, output);
        ret.needed = false;
        ret.expess = needed;
        ret.output = output;
        ret.needed = eval(output);
        //console.log(2, needed, ret);
    }
    return ret;
}

    //check if element is present and required by map
function checkPresense(field, fieldMap, path, root) {
    let ok = true;
    let empty = false;
    let name = fieldMap.name;
    let message;
    //let message = fieldMap.message + ": Обязате   льное поле отсутствует";
    let check = isNeedField(fieldMap.needed, root);
    let needed = check.needed;
    let info = check.expess !== "boolean"?""+check.expess+"=>("+check.output+")="+needed:"boolean="+needed;
    if (field === undefined || field === null) {
        empty = true;
        //if (fieldMap.needed) {
        if (needed) {
            ok = false;
            message = `Обязательное поле: ${name} - отсутствует`;
        }
    }
    let reply = {
        "ok"        : ok,
        "empty"     : empty,
        "path"      : path,
        "needed"    : info,
        "message"   : message
    }
    return reply;
}

module.exports = validateRequest;