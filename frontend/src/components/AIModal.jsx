import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

function AIModal({ isOpen, onClose, apiCall }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("flashcards"); // flashcards, quiz, ocr
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const [flashcards, setFlashcards] = useState(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [ocrResult, setOcrResult] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Storage State
  const [savedDecks, setSavedDecks] = useState([]);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [saveTitle, setSaveTitle] = useState("");

  const fetchSavedData = async () => {
    try {
      setLoading(true);
      const fdRes = await apiCall("/ai-storage/flashcards");
      if (fdRes.decks) setSavedDecks(fdRes.decks);
      const qRes = await apiCall("/ai-storage/quizzes");
      if (qRes.quizzes) setSavedQuizzes(qRes.quizzes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "saved") fetchSavedData();
  }, [activeTab]);

  const handleSaveDeck = async () => {
    if (!saveTitle.trim()) return alert("Please enter a title for the deck.");
    try {
      setLoading(true);
      await apiCall("/ai-storage/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: saveTitle, cards: flashcards })
      });
      setSaveTitle("");
      alert("Deck saved successfully!");
    } catch (e) {
      alert("Failed to save deck: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!saveTitle.trim()) return alert("Please enter a title for the quiz.");
    try {
      setLoading(true);
      await apiCall("/ai-storage/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: saveTitle, questions: quiz })
      });
      setSaveTitle("");
      alert("Quiz saved successfully!");
    } catch (e) {
      alert("Failed to save quiz: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeck = async (id) => {
    if (!window.confirm("Delete this deck?")) return;
    try {
      await apiCall(`/ai-storage/flashcards/${id}`, { method: "DELETE" });
      fetchSavedData();
    } catch (e) { alert("Delete failed"); }
  };

  const deleteQuizItem = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await apiCall(`/ai-storage/quizzes/${id}`, { method: "DELETE" });
      fetchSavedData();
    } catch (e) { alert("Delete failed"); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const generateFlashcards = async () => {
    if (!inputText.trim()) return setError("Please enter some text to generate flashcards.");
    try {
      setLoading(true);
      setError("");
      setFlashcards(null);
      const res = await apiCall("/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      });
      if (res.flashcards) {
        setFlashcards(res.flashcards);
        setCurrentCardIdx(0);
        setIsFlipped(false);
      } else {
        setError("Failed to generate flashcards.");
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!inputText.trim()) return setError("Please enter some text to generate a quiz.");
    try {
      setLoading(true);
      setError("");
      setQuiz(null);
      setAnswers({});
      setQuizSubmitted(false);
      const res = await apiCall("/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      });
      if (res.quiz) {
        setQuiz(res.quiz);
      } else {
        setError("Failed to generate quiz.");
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    if (!imageBase64) return setError("Please upload an image first.");
    try {
      setLoading(true);
      setError("");
      setOcrResult("");
      const b64Data = imageBase64.split(",")[1];
      const mimeType = imageFile.type;
      
      const res = await apiCall("/ai/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: b64Data, mimeType })
      });
      
      if (res.analysis) {
        setOcrResult(res.analysis);
      } else {
        setError("Failed to analyze image.");
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Quiz Handlers
  const handleAnswerSelect = (qIdx, option) => {
    if (quizSubmitted) return;
    setAnswers({ ...answers, [qIdx]: option });
  };
  const submitQuiz = () => {
    if (Object.keys(answers).length < quiz.length) return alert("Please answer all questions!");
    setQuizSubmitted(true);
  };

  return (
    <div className="modal-backdrop" style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 1050,
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div className="card shadow-lg" style={{ 
        width: "90%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", 
        background: "var(--card-bg)", color: "var(--text-color)", border: "var(--card-border)",
        borderRadius: "24px"
      }}>
        <div className="card-header border-0 d-flex justify-content-between align-items-center p-4" style={{ background: "var(--header-gradient)" }}>
          <h4 className="mb-0 text-white fw-bold">🧠 AI Study Studio</h4>
          <button className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

        <div className="card-body p-4">
          {/* Tabs */}
          <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
            <button className={`btn rounded-pill px-4 fw-bold ${activeTab === "flashcards" ? "btn-primary" : "btn-light"}`} style={{ minWidth: "max-content", color: activeTab !== "flashcards" ? "#000" : undefined }} onClick={() => setActiveTab("flashcards")}>🗂️ Flashcards</button>
            <button className={`btn rounded-pill px-4 fw-bold ${activeTab === "quiz" ? "btn-primary" : "btn-light"}`} style={{ minWidth: "max-content", color: activeTab !== "quiz" ? "#000" : undefined }} onClick={() => setActiveTab("quiz")}>📝 Mock Quiz</button>
            <button className={`btn rounded-pill px-4 fw-bold ${activeTab === "ocr" ? "btn-primary" : "btn-light"}`} style={{ minWidth: "max-content", color: activeTab !== "ocr" ? "#000" : undefined }} onClick={() => setActiveTab("ocr")}>📸 Image OCR</button>
            <button className={`btn rounded-pill px-4 fw-bold ${activeTab === "saved" ? "btn-primary" : "btn-light"}`} style={{ minWidth: "max-content", color: activeTab !== "saved" ? "#000" : undefined }} onClick={() => setActiveTab("saved")}>💾 Saved Materials</button>
          </div>

          {error && <div className="alert alert-danger rounded-4">{error}</div>}

          {/* Flashcards Tab */}
          {activeTab === "flashcards" && (
            <div>
              {!flashcards ? (
                <>
                  <textarea 
                    className="form-control rounded-4 p-3 mb-3" rows="5" 
                    style={{ background: "var(--primary-bg)", color: "var(--text-color)", border: "none" }}
                    placeholder="Paste your notes or text here to generate flashcards..."
                    value={inputText} onChange={e => setInputText(e.target.value)}
                  ></textarea>
                  <button className="btn btn-primary rounded-pill px-4 w-100 fw-bold py-2" onClick={generateFlashcards} disabled={loading}>
                    {loading ? "Generating..." : "✨ Generate Flashcards"}
                  </button>
                </>
              ) : (
                <div className="flashcard-container d-flex flex-column align-items-center">
                  <div className="text-muted mb-3 fw-bold">Card {currentCardIdx + 1} of {flashcards.length}</div>
                  
                  <div className={`flashcard-scene mb-4 cursor-pointer ${isFlipped ? 'is-flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <div className="flashcard-badge text-white">QUESTION</div>
                        <h3 className="mb-0 lh-base text-center px-3 fw-bold shadow-sm-text" style={{ zIndex: 2 }}>
                          {flashcards[currentCardIdx].question}
                        </h3>
                        <div className="position-absolute bottom-0 mb-3 text-white-50 small fw-bold"><i className="bi bi-arrow-repeat"></i> Click to flip</div>
                      </div>
                      <div className="flashcard-back">
                        <div className="flashcard-badge shadow-sm" style={{ background: "var(--primary-bg)", color: "var(--accent-color)" }}>ANSWER</div>
                        <h4 className="mb-0 lh-base text-center px-3" style={{ zIndex: 2 }}>
                          {flashcards[currentCardIdx].answer}
                        </h4>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-3 w-100 justify-content-center">
                    <button className="btn btn-light rounded-pill px-4 fw-bold shadow-sm text-dark" disabled={currentCardIdx === 0} onClick={() => { setCurrentCardIdx(c => c - 1); setIsFlipped(false); }}>⬅️ Prev</button>
                    <button className="btn btn-light rounded-pill px-4 fw-bold shadow-sm text-dark" onClick={() => setIsFlipped(!isFlipped)}>🔄 Flip</button>
                    <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" disabled={currentCardIdx === flashcards.length - 1} onClick={() => { setCurrentCardIdx(c => c + 1); setIsFlipped(false); }}>Next ➡️</button>
                  </div>
                  
                  <hr className="w-100 my-4" style={{ borderColor: "var(--card-border)" }} />
                  <div className="d-flex gap-2 w-100 align-items-center">
                    <input type="text" className="form-control rounded-pill px-3" placeholder="Deck Title (e.g. Bio Ch 1)" value={saveTitle} onChange={e => setSaveTitle(e.target.value)} style={{ background: "var(--primary-bg)", color: "var(--text-color)", border: "var(--card-border)" }} />
                    <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" onClick={handleSaveDeck} disabled={loading} style={{ minWidth: "max-content" }}>💾 Save Deck</button>
                  </div>

                  <button className="btn btn-link mt-3 text-decoration-none" onClick={() => { setFlashcards(null); setSaveTitle(""); }}>Create New Deck</button>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && (
            <div>
              {!quiz ? (
                <>
                  <textarea 
                    className="form-control rounded-4 p-3 mb-3" rows="5" 
                    style={{ background: "var(--primary-bg)", color: "var(--text-color)", border: "none" }}
                    placeholder="Paste a topic or notes to generate a mock test..."
                    value={inputText} onChange={e => setInputText(e.target.value)}
                  ></textarea>
                  <button className="btn btn-primary rounded-pill px-4 w-100 fw-bold py-2" onClick={generateQuiz} disabled={loading}>
                    {loading ? "Generating..." : "✨ Generate Mock Test"}
                  </button>
                </>
              ) : (
                <div className="quiz-container">
                  {quiz.map((q, idx) => (
                    <div key={idx} className="mb-4 p-4 rounded-4 shadow-sm" style={{ background: "var(--primary-bg)", border: "var(--card-border)" }}>
                      <h5 className="fw-bold mb-3">{idx + 1}. {q.question}</h5>
                      <div className="d-flex flex-column gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[idx] === opt;
                          const isCorrect = opt === q.correctAnswer;
                          let optStyle = { 
                            background: "var(--card-bg)", 
                            color: "var(--text-color)",
                            border: "1px solid var(--accent-color)" 
                          };
                          let className = "p-3 rounded-pill cursor-pointer fw-bold shadow-sm";
                          
                          if (quizSubmitted) {
                            if (isCorrect) {
                              optStyle = { background: "#10b981", color: "white", border: "1px solid #10b981" };
                            } else if (isSelected && !isCorrect) {
                              optStyle = { background: "#ef4444", color: "white", border: "1px solid #ef4444" };
                            } else {
                              optStyle.opacity = 0.5;
                            }
                          } else {
                            if (isSelected) {
                              optStyle = { background: "var(--accent-color)", color: "white", border: "1px solid var(--accent-color)" };
                            }
                          }

                          return (
                            <div 
                              key={oIdx} 
                              className={className}
                              style={{ ...optStyle, cursor: quizSubmitted ? "default" : "pointer", transition: "all 0.2s" }}
                              onClick={() => handleAnswerSelect(idx, opt)}
                            >
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      {quizSubmitted && (
                        <div className="mt-3 p-3 rounded-4 bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                          <small className="fw-bold d-block mb-1">💡 Explanation:</small>
                          <small>{q.explanation}</small>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {!quizSubmitted ? (
                    <button className="btn btn-success rounded-pill px-5 py-3 w-100 fw-bold fs-5 shadow-sm" onClick={submitQuiz}>Submit Quiz</button>
                  ) : (
                    <div className="text-center mt-4">
                      <h4 className="text-success fw-bold mb-3">Quiz Completed! 🎉</h4>
                      
                      <hr className="my-4" style={{ borderColor: "var(--card-border)" }} />
                      <div className="d-flex justify-content-center gap-2 mb-3">
                        <input type="text" className="form-control rounded-pill px-3" placeholder="Quiz Title (e.g. Midterm Prep)" value={saveTitle} onChange={e => setSaveTitle(e.target.value)} style={{ maxWidth: "250px", background: "var(--primary-bg)", color: "var(--text-color)", border: "var(--card-border)" }} />
                        <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" onClick={handleSaveQuiz} disabled={loading} style={{ minWidth: "max-content" }}>💾 Save Quiz</button>
                      </div>

                      <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => { setQuiz(null); setSaveTitle(""); setQuizSubmitted(false); setAnswers({}); }}>Take Another</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* OCR Tab */}
          {activeTab === "ocr" && (
            <div>
              <div className="mb-4 p-5 rounded-4 text-center shadow-sm" style={{ background: "var(--primary-bg)", border: "2px dashed var(--accent-color)" }}>
                <input type="file" id="ocrInput" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                {!imageBase64 ? (
                  <div onClick={() => document.getElementById("ocrInput").click()} style={{ cursor: "pointer" }}>
                    <div className="fs-1 mb-3">📸</div>
                    <h5 className="fw-bold">Upload an Image</h5>
                    <p className="text-muted small mb-0">Textbooks, handwritten notes, or whiteboards</p>
                  </div>
                ) : (
                  <div>
                    <img src={imageBase64} alt="Preview" className="img-fluid rounded-3 mb-4 shadow-sm" style={{ maxHeight: "250px", objectFit: "contain", border: "var(--card-border)" }} />
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-light rounded-pill px-4 fw-bold shadow-sm text-dark" onClick={() => document.getElementById("ocrInput").click()}>Change Image</button>
                      <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={analyzeImage} disabled={loading}>
                        {loading ? "Analyzing..." : "✨ Extract & Analyze"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {ocrResult && !loading && (
                <div className="card border-0 shadow-sm rounded-4 mt-4" style={{ background: "var(--primary-bg)", border: "var(--card-border) !important" }}>
                  <div className="card-body p-4 markdown-container" style={{ color: "var(--text-color)", lineHeight: "1.8" }}>
                    <ReactMarkdown>{ocrResult}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Tab */}
          {activeTab === "saved" && (
            <div>
              <h5 className="fw-bold mb-3">🗂️ Saved Flashcard Decks</h5>
              {savedDecks.length === 0 ? <p className="text-muted small">No saved decks.</p> : (
                <div className="row g-3 mb-4">
                  {savedDecks.map(deck => (
                    <div className="col-12 col-md-6" key={deck.id}>
                      <div className="p-3 border rounded-4 shadow-sm d-flex justify-content-between align-items-center" style={{ background: "var(--primary-bg)", border: "var(--card-border)" }}>
                        <div>
                          <h6 className="fw-bold mb-1">{deck.title}</h6>
                          <small className="text-muted">{deck.cards.length} cards</small>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => { setFlashcards(deck.cards); setCurrentCardIdx(0); setIsFlipped(false); setActiveTab("flashcards"); }}>Play</button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => deleteDeck(deck.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h5 className="fw-bold mb-3">📝 Saved Quizzes</h5>
              {savedQuizzes.length === 0 ? <p className="text-muted small">No saved quizzes.</p> : (
                <div className="row g-3">
                  {savedQuizzes.map(q => (
                    <div className="col-12 col-md-6" key={q.id}>
                      <div className="p-3 border rounded-4 shadow-sm d-flex justify-content-between align-items-center" style={{ background: "var(--primary-bg)", border: "var(--card-border)" }}>
                        <div>
                          <h6 className="fw-bold mb-1">{q.title}</h6>
                          <small className="text-muted">{q.questions.length} questions</small>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => { setQuiz(q.questions); setQuizSubmitted(false); setAnswers({}); setActiveTab("quiz"); }}>Take</button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => deleteQuizItem(q.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>
        {`
          .flashcard-scene {
            width: 100%;
            min-height: 280px;
            perspective: 1200px;
          }
          .flashcard-inner {
            display: grid;
            width: 100%;
            position: relative;
            transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
            transform-style: preserve-3d;
          }
          .flashcard-scene.is-flipped .flashcard-inner {
            transform: rotateY(180deg);
          }
          .flashcard-front, .flashcard-back {
            grid-area: 1 / 1;
            width: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 4rem 2rem 3rem 2rem;
            border-radius: 24px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            box-sizing: border-box;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .flashcard-front {
            background: linear-gradient(135deg, var(--accent-color) 0%, #4f46e5 100%);
            color: white;
          }
          .flashcard-back {
            background: var(--card-bg);
            color: var(--text-color);
            transform: rotateY(180deg);
            border: 2px solid var(--accent-color);
          }
          .flashcard-badge {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.25);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.75rem;
            letter-spacing: 1px;
            font-weight: 800;
            backdrop-filter: blur(8px);
          }
          .shadow-sm-text {
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .cursor-pointer {
            cursor: pointer;
          }
          .flashcard-scene:hover .flashcard-inner {
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
}

export default AIModal;
