const validate = require("./index");

const rule = {
  name: "required|ERR4001|exist.branch_id@_id:branch",
  "branch_id@_id": "required|ERR4002|exist:branch",
};

const buff = Buffer.from('abc');
const body = {
  name: "HELLO",
  branch_sid: "sd"
};

setTimeout(async () => {
  try {
    await validate({ rule, req: { body }, exclude_body: true });
  } catch (error) {
    console.log(error);
  }
});
