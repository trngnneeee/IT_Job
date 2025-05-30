import epxress, { Request, Response } from "express"

const app = epxress();
const port = 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
})

app.listen(port, () => {
  console.log(`App running on port ${port}`);
})