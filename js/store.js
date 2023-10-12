/*
Chat GPT was used to help code certain parts of this assignment.
*/
document.getElementById("storing-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const word = document.getElementById("word").value;
    const definition = document.getElementById("definition").value;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://minimaldictionary.onrender.com/api/definitions", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                const response = JSON.parse(xhr.responseText);
                document.getElementById("result").innerText = response.message;
            } else {
                console.error("Error:", xhr.status, xhr.statusText);
            }
        }
    };
    const formData = `word=${encodeURIComponent(word)}&definition=${encodeURIComponent(definition)}`;
    xhr.send(formData);
});