import * as dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  let params: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: "POST",
    body: JSON.stringify({
      symbol: req.body.symbol,
      name: req.body.name,
      decimal: req.body.decimal,
      monitor: req.body.monitor,
    }),
  };

  fetch(process.env.COMPILE_API, params).then((r) => {
    r.body
      .getReader()
      .read()
      .then((r) => {
        const textResult = new TextDecoder().decode(r.value);
        console.log(textResult);
      });
  });
  // const compileResponse = await fetch(process.env.COMPILE_API, params);

  res.send("test");
}
