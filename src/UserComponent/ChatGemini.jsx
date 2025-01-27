import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";

function ChatGemini() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    // Add user question to chat history
    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCEY1wH4krUFnR3ea2gsf2LseB4oCE0YXU`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.error(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <Container fluid className="bg-light d-flex align-items-center justify-content-center vh-100">
      <Card className="shadow-lg" style={{ width: "50rem", maxHeight: "90vh", overflow: "hidden" }}>
        {/* Header */}
        <Card.Header className="bg-primary text-white text-center py-3">
          <h2>Learn with Chat AI</h2>
        </Card.Header>

        {/* Chat History */}
        <Card.Body
          className="d-flex flex-column overflow-auto"
          style={{ height: "70vh" }}
          ref={chatContainerRef}
        >
          {chatHistory.length === 0 ? (
            <Card className="text-center p-4 border-0">
              <Card.Body>
                <Card.Title>Welcome to Chat AI! 👋</Card.Title>
                <Card.Text>
                  Ask me about general knowledge, technical questions, writing assistance, or problem-solving.
                  Type your question below and click Send!
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`d-flex mb-3 ${chat.type === "question" ? "justify-content-end" : "justify-content-start"}`}
              >
                <Card
                  className={`p-2 shadow-sm ${
                    chat.type === "question" ? "bg-primary text-white" : "bg-secondary text-light"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </Card>
              </div>
            ))
          )}
          {generatingAnswer && (
            <div className="d-flex justify-content-start">
              <Card className="p-2 shadow-sm bg-secondary text-light" style={{ maxWidth: "75%" }}>
                <Spinner animation="grow" size="sm" className="me-2" /> Thinking...
              </Card>
            </div>
          )}
        </Card.Body>

        {/* Input Form */}
        <Card.Footer className="bg-white p-3">
          <Form onSubmit={generateAnswer} className="d-flex gap-2">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Ask anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-grow-1"
              required
            />
            <Button
              type="submit"
              variant="primary"
              disabled={generatingAnswer}
              className="d-flex align-items-center justify-content-center"
            >
              {generatingAnswer ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default ChatGemini;
