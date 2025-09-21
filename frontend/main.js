async function sendMessage(message) {
    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.reply;
}

const sendBtn = document.getElementById("sendBtn");
const inputBox = document.getElementById("inputBox");
const chatDiv = document.getElementById("chat");

sendBtn.addEventListener("click", async () => {
    const userMessage = inputBox.value;
    chatDiv.innerHTML += `<p><b>You:</b> ${userMessage}</p>`;
    const reply = await sendMessage(userMessage);
    chatDiv.innerHTML += `<p><b>Gemini AI:</b> ${reply}</p>`;
    inputBox.value = "";
});
