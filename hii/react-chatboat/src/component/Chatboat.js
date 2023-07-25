import React, { useState } from "react";

const API_KEY = "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";

const ChatGpt = () => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [history, setHistory] = useState([]);

  const changeInput = (value) => {
    setInputValue(value);
  };

  const getMessage = async () => {
    console.log("clicked");
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: inputValue }],
      }),
    };
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        options
      );
      const data = await response.json();
      console.log(data);
      setOutputValue(data.choices[0].message.content);
      if (data.choices[0].message.content) {
        const pElement = document.createElement("p");
        pElement.textContent = inputValue;
        setInputValue("");
        pElement.addEventListener("click", () =>
          changeInput(pElement.textContent)
        );
        setHistory([...history, inputValue]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    setInputValue("");
  };

  return (
    <div>
      <section className="side-bar">
        <button>New Chat</button>
        <div className="history">
          {history.map((item, index) => (
            <p key={index} onClick={() => changeInput(item)}>
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="main">
        <h1>ChatGpt</h1>
        <p id="output">{outputValue}</p>
        <div className="bottom-section">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div onClick={getMessage}>
              <button id="submit" onClick={getMessage}>
                submit
              </button>
              <img src="send.jpg" alt="" />
            </div>
          </div>
        </div>
        <p className="info">Chat Gpt March14 Version,Free Research Review</p>
      </section>
    </div>
  );
};

export default ChatGpt;
