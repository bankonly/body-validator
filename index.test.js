const validate = require("./index");

const rule = {
  name: "required|ERR4001|object",
};

const body = {
  name: {
    name: "bank",
    total: 100,
    hello: "123",
    list: "61c3fc57c312253a7e1da187",
  },
  data: {
    name: "registers",
  },
};

setTimeout(async () => {
  try {
    await validate({ rule, body, exclude_body: true });
  } catch (error) {
    console.log(error);
  }
});
