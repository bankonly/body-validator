const validate = require("./index");

const rule = {
  icon: "required|ERR4001|file"
};

// string generated by canvas.toDataURL()
var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0"
    + "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO"
    + "3gAAAABJRU5ErkJggg==";
// strip off the data: url prefix to get just the base64-encoded bytes
var data = img.replace(/^data:image\/\w+;base64,/, "");
var buf = Buffer.from(data, 'base64');
const body = {
  icon: buf,
};

setTimeout(async () => {
  try {
    await validate({ rule, req: { body }, exclude_body: true });
  } catch (error) {
    console.log(error);
  }
});
