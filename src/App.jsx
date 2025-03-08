import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { format, setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

import "./App.css";

function App() {
  setDefaultOptions({ locale: ptBR });

  document.title = "ChatBot - " + format(new Date(), "dd 'de' LLLL");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generateAnswer() {
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: crypto.randomUUID(),
        user: true,
        message: question,
      },
    ]);
    clearInputQuestion();

    const response = await axios({
      url: import.meta.env.VITE_API_GEMINI_URL,
      method: "post",
      data: { contents: [{ parts: [{ text: question }] }] },
    });
    setLoading(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: crypto.randomUUID(),
        user: false,
        message:
          response["data"]["candidates"][0]["content"]["parts"][0]["text"],
      },
    ]);
  }
  function clearInputQuestion() {
    setQuestion("");
  }
  return (
    <>
      <section className="main-section">
        <div className="container-chatbot">
          <div className="container-answer">
            {messages.map((msg) => {
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: msg.user ? "right" : "left",
                    paddingRight: msg.user ? "0px" : "1.5rem",
                  }}
                >
                  <p
                    className="p-message-chatbot"
                    key={msg.id}
                    style={{
                      backgroundColor: msg.user ? "#2F2F2F" : "#212121",
                    }}
                  >
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  </p>
                </div>
              );
            })}
            <div className="container-loader">
              {loading ? <div className="loader"></div> : ""}
            </div>
          </div>
          <div className="container-form">
            <input
              className="input-answer"
              type="text"
              placeholder="Pergunte alguma coisa"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={generateAnswer} className="button-answer">
              Generete answer
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
