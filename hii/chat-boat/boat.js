debugger;
const API_KEY = "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";
const submit = document.querySelector("#submit");
const output = document.querySelector("#output");
const input = document.querySelector("input");
const history = document.querySelector(".history");
const button = document.querySelector("button");
function changeInput(value) {
  const input = document.querySelector("input");
  input.value = value;
}
async function getMessage() {
  console.log("clicked");
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input.value }],
      max_tokens: 3000,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    console.log(data);
    output.textContent = data.choices[0].message.content;
    if (data.choices[0].message.content) {
      const pElement = document.createElement("p");
      pElement.textContent = input.value;
      input.value = "";
      pElement.addEventListener("click", () =>
        changeInput(pElement.textContent)
      );
      history.append(pElement);
    }
  } catch {
    console.error(error);
  }
}
submit.addEventListener("click", getMessage);
function clear() {
  input.value = "";
}
button.addEventListener("click", clear);
