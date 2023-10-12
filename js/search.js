// ChatGPT-3.5 (https://chat.openai.com/) was used to code solutions presented in this assignment

document.getElementById("searching-form").addEventListener("submit", function (error) {
    error.preventDefault();
    const searchWord = document.getElementById("searchWord").value;
    const ajaxReq = new XMLHttpRequest();
    ajaxReq.open("GET", `https://minimaldictionary.onrender.com/api/definitions/?word=${searchWord}`, true);
    ajaxReq.onreadystatechange = function () {
        if (ajaxReq.readyState === 4) {
            if (ajaxReq.status === 200) {
                const response = JSON.parse(ajaxReq.responseText);
                const word = response.message.split(" : ")[0];
                const definition = response.message.split(" : ")[1];
                const resultElement = document.getElementById("result");
                resultElement.innerHTML = `"${searchWord}": "${definition}"`;
            } else {
                const response = JSON.parse(ajaxReq.responseText);
                document.getElementById("result").textContent = response.message;
            }
        }
    };
    ajaxReq.send();
});