import { createServer } from "node:http";
import fs from "fs"
const server = createServer((req, res) => {
    const index = fs.readFileSync("index.html", "utf-8");
    res.writeHead(200, {'content-type': 'html'});
    res.end(index);
})

server.listen(3000, () => {
    console.log("Listening on http://localhost:3000/")
})