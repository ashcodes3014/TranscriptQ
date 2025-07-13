import { useState, useRef, useEffect } from 'react';
import { SendHorizonal, MessageSquare, Video, User, Bot, HelpCircle, Loader2 } from 'lucide-react';
import axiosClient from '../utilis/axiosClient';

export default function VideoChatSection({ url }) {
  const [messages, setMessages] = useState([
    { text: "Ask me anything about this video's content and I'll answer using the transcript", type: "system" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    const fetchVideoId = async () => {
      try {
        const { data } = await axiosClient.post("/getId", { url });
        setVideoId(data);
      } catch(err) {
        console.error("Failed to get video ID:", err.message);
      }
    };
    fetchVideoId();
  }, [url]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query || isLoading) return;

    setMessages(prev => [...prev, { text: query, type: "question" }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/query", {
        video_id: videoId,
        query: query
      });
      setMessages(prev => [...prev, { 
        text: response.data || `Here's what I found about: "${query}"`, 
        type: "answer" 
      }]);
    } catch (err) {
      console.error("API Error:", err.message);
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't find an answer in the video transcript. Try rephrasing your question.", 
        type: "error" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800">
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-900/50">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-blue-400" size={22} />
          <div>
            <h3 className="font-medium text-lg flex items-center gap-2">
              Video Transcript Q&A <Video className="text-red-400 animate-pulse" size={18} />
            </h3>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <HelpCircle size={14} /> Ask questions about the video content
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-900/40 to-gray-900/60">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`text-sm flex items-start gap-3 p-3 rounded-lg ${
              msg.type === "question" ? "bg-blue-900/30 text-blue-100" : 
              msg.type === "answer" ? "bg-gray-800/50 text-gray-100" : 
              msg.type === "error" ? "bg-red-900/20 text-red-300" :
              "bg-gray-900/30 text-gray-400"
            }`}
          >
            {msg.type === "question" ? (
              <User className="flex-shrink-0 mt-0.5 text-blue-400" size={18} />
            ) : msg.type === "answer" ? (
              <Bot className="flex-shrink-0 mt-0.5 text-green-400" size={18} />
            ) : msg.type === "error" ? (
              <HelpCircle className="flex-shrink-0 mt-0.5 text-red-400" size={18} />
            ) : (
              <HelpCircle className="flex-shrink-0 mt-0.5 text-gray-500" size={18} />
            )}
            <div className="flex-1">
              <span className="font-medium">
                {msg.type === "question" ? "You:" : 
                 msg.type === "answer" ? "AI Assistant:" : 
                 msg.type === "error" ? "Error:" : "System:"}
              </span> {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
            <Loader2 className="animate-spin text-green-400" size={18} />
            <span className="text-gray-300">Searching the video transcript...</span>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900/70 backdrop-blur-sm">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask about concepts, quotes,points related to this video"
            className="w-full bg-gray-900/40 rounded-lg py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 hover:border-gray-600 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
              input.trim() && !isLoading 
                ? 'text-blue-400 hover:text-blue-300 hover:scale-110' 
                : 'text-gray-600'
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <SendHorizonal size={18} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <HelpCircle size={12} /> Example: "Summarize the main points" or "What was said about [topic]?"
        </p>
      </div>
    </div>
  );
}