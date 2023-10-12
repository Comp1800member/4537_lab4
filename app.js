// ChatGPT-3.5 (https://chat.openai.com/) was used to code solutions presented in this assignment

const http = require("http");
const url = require("url");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");

    if (req.method === "GET" && pathname == "/api/definitions" || pathname == "/api/definitions/") {
        const word = query.word;
        const definition = getDefinition(word);
        if (definition) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: `${word} : ${definition}` }));
            res.end();
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: `The word "${word}" does not exist.` }));
            res.end();
        }
    } else if (req.method === "POST" && pathname === "/api/definitions" || pathname === "/api/definitions/") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const postData = qs.parse(body);
            const word = postData.word;
            const definition = postData.definition;
            if (!word || !definition) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Invalid input. Both word and definition are required." }));
            } else {
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: addWord(word, definition) }));
            }
        });
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Dictionary</h1>");
        res.write(`<h2>Number of Requests: ${getNumRequests()}</h2>`);
        res.write(getDictionary().map((entry) => `<p><b>${entry.word}</b>: ${entry.definition}</p>`).join(""));
        res.end();
    }
});

let numRequests = 0;
const dict = [];

function getDictionary() {
    return dict;
}

function addWord(word, definition) {
    existingWord = dict.find((entry) => entry.word === word);
    if (existingWord) {
        return `Warning! The word "${word}" already exists.`;
    }
    dict.push({ word, definition });
    numRequests++;
    return `Request #${getNumRequests()}\nNew entry recorded:\n"${word}": "${definition}"`;
}

function getDefinition(word) {
    const entry = dict.find((entry) => entry.word === word);
    return entry ? entry.definition : null;
}

function getNumRequests() {
    return numRequests;
}

addWord("utilitarianism", "the doctrine that actions are right if they are useful or for the benefit of a majority");
addWord("objectivism", "the belief that certain things, especially moral truths, exist independently of human knowledge or perception of them");
addWord("relativism", "the doctrine that knowledge, truth, and morality exist in relation to culture, society, or historical context, and are not absolute");
addWord("absolutism", "the acceptance of or belief in absolute principles in political, philosophical, ethical, or theological matters");
addWord("john", "smith");

const port = process.env.PORT || 5500;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});
