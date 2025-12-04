"use client";

import { useState } from "react";
import HandViewer from "./HandViewer";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AnalyzePage() {
  const [input, setInput] = useState("");
  const [parsedHand, setParsedHand] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/parse-hand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hand_text: text }),
      });

      const data = await res.json();

      let parsed;
      try {
        parsed = JSON.parse(data.parsed_hand);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I couldn't decode the hand JSON." },
        ]);
        setLoading(false);
        return;
      }

      setParsedHand(parsed);

      const summary = buildSummary(parsed);
      setMessages((prev) => [...prev, { role: "assistant", content: summary }]);
    } finally {
      setLoading(false);
    }
  };

  const buildSummary = (hand: any) => {
    if (!hand) return "I couldn't parse that hand.";
    const hero = hand.hero_hand ?? "your hand";
    const heroPos = hand.positions?.hero ?? "unknown position";
    const villPos = hand.positions?.villain ?? "unknown position";

    return `You played ${hero} from the ${heroPos} vs the ${villPos}. I've updated the poker table on the right.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative h-screen bg-[#1b1b1f] text-[#e0e0e3] overflow-hidden">
      <div className="flex h-full transition-all duration-300">

        {/* LEFT CHAT PANEL */}
        <div
          className={`
            h-full transition-all duration-300 bg-[#232327] border-r border-[#3a3a40]
            ${showChat ? "w-1/3" : "w-0 overflow-hidden"}
          `}
        >
          {showChat && (
            <div className="flex flex-col h-full">

              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a40]">
                <h1 className="text-xl font-semibold">AI Poker Coach</h1>
                <button
                  className="text-xs px-3 py-1 rounded-md bg-[#2a2a2e] border border-[#3a3a40] hover:bg-[#343439]"
                  onClick={() => setShowChat(false)}
                >
                  Hide Chat →
                </button>
              </div>

              {/* CHAT MESSAGES */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-sm text-[#a4a4aa]">
                    Describe a poker hand and I'll analyze it.
                  </p>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        m.role === "user"
                          ? "bg-[#4c6ef5] text-white"
                          : "bg-[#2a2a2e] text-[#e0e0e3] border border-[#3a3a40]"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="border-t border-[#3a3a40] px-4 py-3">
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="
                      flex-1 resize-none rounded-lg px-3 py-2 text-sm
                      bg-[#2a2a2e] text-[#e0e0e3] border border-[#3a3a40]
                      placeholder:text-[#7a7a80]
                      focus:outline-none focus:ring-2 focus:ring-[#4c6ef5]
                    "
                    placeholder="Describe your hand…"
                  />
                  <button
                    disabled={loading}
                    onClick={handleSend}
                    className="
                      h-9 w-9 flex items-center justify-center rounded-full
                      bg-[#4c6ef5] hover:bg-[#3b5bdb] disabled:opacity-40
                    "
                  >
                    {loading ? "…" : "➤"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT POKER TABLE VIEWER */}
        <div
          className={`
            h-full transition-all duration-300 relative overflow-hidden
            ${showChat ? "w-2/3 p-10" : "w-full p-10"}
          `}
        >
          {!showChat && (
            <button
              className="absolute top-4 left-4 text-xs px-3 py-1 rounded-md
                         bg-[#2a2a2e] border border-[#3a3a40] hover:bg-[#343439]"
              onClick={() => setShowChat(true)}
            >
              ← Show Chat
            </button>
          )}

          {!parsedHand && (
            <div className="text-[#7a7a80] text-center mt-24 text-lg">
              Your analyzed hand will appear here.
            </div>
          )}

          {parsedHand && (
            <div
              className="
                w-full h-full rounded-xl p-10
                bg-[#0f3d2e] border border-[#0a251c]
                shadow-[0_0_25px_rgba(0,0,0,0.6)]
                flex flex-col overflow-y-auto
              "
            >
              <HandViewer hand={parsedHand} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
