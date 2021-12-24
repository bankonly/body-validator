```js
// Basic rule
const request_body = {
  name: "Souksavanh",
  age: 23,
  some_id: "61c3fc57c312253a7e1da187",
  gender: "male",
  phone_number: 526839374,
  contact_detail: {
    gmail: "souksavanh@gmail.com",
    whatsapp: "563434234",
  },
  contact_detail_else: {
    gmail: "souksavanh@gmail.com",
  },
  empty_object: ["1", "2"],
};

/*

    First rule string: requied optional objectid
    Second: Error message
    Third: value type or validation [string,object,number,object,array,enum,exist]

*/
const rule = {
  name: "required|name must be string|string",
  age: "required|name must be number|number",
  some_id: "required|name must be ojectid|ojectid",
  gender: "required|name must be string|enum:male,female",
  phone_number: "required|name must be string|exist:users", // users is model name base on mongoose model SUPPORT mongoose only / Mongodb
  "office_id:_id": "objectid|name must be string|exist:offices", // will use _id to find exist data, offices is model name base on mongoose model SUPPORT mongoose only / Mongodb
  contact_detail: "required|name must be string|object:gmail/string,whatsapp/required-string", //or
  contact_detail_else: "required|name must be string|object:gmail/string,whatsapp/string",
  array_data: "required|name must be array|array",
};

const exclude_body = await validate({ rule, req: req, exclude_body: true,type:"body" }); //or type = [body,query]
/*
 const rule = {
    name: "Souksavanh",
    age: 23,
    some_id: "61c3fc57c312253a7e1da187",
    gender: "male",
    phone_number: 526839374,
    contact_detail: {
        gmail: "souksavanh@gmail.com",
        whatsapp: "563434234",
    },
    contact_detail_else: {
        gmail: "souksavanh@gmail.com",
    },
    empty_object: ["1", "2"],
};
*/

const no_exclude_body = await validate({ rule, body: request_body });

/* return everything in object even nothing rule set
 const rule = {
    name: "Souksavanh",
    name1: "Souksavanh",
    name2: "Souksavanh",
    name2: "Souksavanh",
    age: 23,
    some_id: "61c3fc57c312253a7e1da187",
    gender: "male",
    phone_number: 526839374,
    contact_detail: {
        gmail: "souksavanh@gmail.com",
        whatsapp: "563434234",
    },
    contact_detail_else: {
        gmail: "souksavanh@gmail.com",
    },
    empty_object: ["1", "2"],
};
*/


# Using with async-api-response and helper async middleware with ExpressJS

const Res = require("async-api-response")
const async_middleware = (handler) => {
    return async (req, res, next) => {
      const resp = new Res(res);
      try {
        await handler(req, res, next);
      } catch (ex) {
        return resp.catch({ error: ex });
      }
    };
}

const simple_test = async_middleware(async (req,res)=> {
    const resp = new Res(res)
    const no_exclude_body = await validate({ rule, req, });
  return resp.response({data:"some_data"});
})

router.get("/",simple_test)


```
