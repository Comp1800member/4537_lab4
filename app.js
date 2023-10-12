/*
I used ChatGpt to code certain parts.
*/
const http = require("http");
const url = require("url");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Allowing CORS below.
    res.setHeader("Access-Control-Allow-Origin", "*");

    //get method then if pathname is /api/definitions or /api/definitions/ then get the word and definition
    //then write the word and definition to the response
    //if the word does not exist then write that the word does not exist to the response
    if (req.method === "GET" && pathname == "/api/definitions" || pathname == "/api/definitions/") {
        const word = query.word;
        const definition = getDefinition(word);
        if (definition) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: `${word} : ${definition}` }));
            res.end();
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: `${word}" does not exist.` }));
            res.end();
        }
    } 
    //post method then if pathname is /api/definitions or /api/definitions/ then get the word and definition
    //then write the word and definition to the response
    //if input is invalid then return that it's not
    else if (req.method === "POST" && pathname === "/api/definitions" || pathname === "/api/definitions/") {
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
    myWord = dict.find((entry) => entry.word === word);
    if (myWord) {
        return `"${word}" already exists.`;
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

addWord("pie", "a baked dish of fruit, or meat and vegetables, typically with a top and base of pastry.");
addWord("sleep", "a condition of body and mind that typically recurs for several hours every night, in which the eyes are closed, the postural muscles relaxed, the activity of the brain altered, and consciousness of the surroundings practically suspended.");
addWord("happy", "feeling or showing pleasure or contentment.");
addWord("play", "engage in activity for enjoyment and recreation rather than a serious or practical purpose.");
addWord("cart", "a strong open vehicle with two or four wheels, typically used for carrying loads and pulled by a horse.");

const port = process.env.PORT || 5500;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});
