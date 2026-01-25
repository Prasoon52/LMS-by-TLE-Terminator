import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { serverUrl } from "../App";
import { Header } from "../components/guidence/Header";
import { LoadingSpinner } from "../components/guidence/LoadingSpinner";
import { GuidanceCard } from "../components/guidence/GuidenceCard";
import { GuidanceActions } from "../components/guidence/GuidenceAxtion";
import { ChatSidebar } from "../components/guidence/ChatSlidebar";

const Career = () => {
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] =
    useState(`Want to know the best career path for you?
         Click the GENERATE button below to get personalized AI-driven career guidance based on your skills and interests.`);
  const [chatHistory, setChatHistory] = useState([]); // Array of {role, content}
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef(null);

 const scrollToBottom = () => {
   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };

 useEffect(() => {
   scrollToBottom();
 }, [chatHistory, showChat]);

  const fetchGuidance = async () => {
    setLoading(true);
    setShowChat(false);
    setChatHistory([]);

    try {
      const response = await axios.get(`${serverUrl}/api/ai/career-guidance`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setGuidance(response.data.guidance);
    } catch (error) {
      console.error("Error fetching career guidance:", error);
      setGuidance(
        "Sorry, there was an error fetching your career guidance. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;

    setAsking(true);
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      const response = await axios.post(
        `${serverUrl}/api/ai/follow-up`,
        {
          previousGuidance: guidance,
          question: question,
          chatHistory: chatHistory.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setAsking(false);
    }
  };

  const toggleChat = () => {
    if (!showChat && chatHistory.length === 0) {
      // Initialize with a welcome message
      const welcomeMsg = {
        id: Date.now(),
        role: "assistant",
        content:
          "Hello! I'm your AI Career Assistant. You can ask me follow-up questions about your career guidance, clarify any points, or explore different career paths. What would you like to know?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory([welcomeMsg]);
    }
    setShowChat(!showChat);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleFollowUp(e);
    }
    }

  

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Header />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Guidance Card - Left Side */}
            <div
              className={`${
                showChat ? "lg:w-2/3" : "lg:w-full"
              } transition-all duration-300`}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <GuidanceCard guidance={guidance} />
                  <GuidanceActions
                    onGenerate={fetchGuidance}
                    onToggleChat={toggleChat}
                    showChat={showChat}
                  />
                </>
              )}
            </div>

            {/* Chat Sidebar - Right Side */}
            {showChat && (
              <ChatSidebar
                chatHistory={chatHistory}
                question={question}
                setQuestion={setQuestion}
                onSend={() => handleFollowUp()}
                onClose={toggleChat}
                asking={asking}
                onKeyPress={handleKeyPress}
              />
            )}
          </div>
        </div>
      </div>
    );
};

export default Career;
