import { useState } from "react";
import { Youtube, Link2, Send, Sparkles,Loader2, Fullscreen } from "lucide-react";
import VideoSection from "./component/video";
import ChatSection from "./component/chatbot";

const App = () => {
  const [video, setVideo] = useState(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setVideo(url);
        setUrl('');
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="h-screen flex bg-gray-950 text-gray-100 overflow-hidden">

      <div className={`${video ? 'w-1/2' : 'w-full'} flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-950 border-r border-gray-800`} >
        <div className="max-w-md w-full text-center">

          <div className="mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg shadow-red-900/30">
              <Youtube size={48} className="text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              Video Analyzer
            </h2>
            <p className="mt-4 text-gray-400 text-sm">Get AI-powered insights about any YouTube video from transcript</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full pl-10 pr-12 py-4 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute inset-y-0 right-0 px-4 flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-r-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>

          {!video && (
            <div className="mt-12 p-8 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/30 backdrop-blur-sm text-center">
              <Sparkles className="mx-auto h-10 w-10 text-gray-500 mb-4" />
              <p className="text-gray-400">Video will appear here</p>
            </div>
          )}

          {video && (
            <div className="mt-8 rounded-2xl overflow-hidden shadow-xl">
              <VideoSection url={video} />
            </div>
          )}
        </div>
      </div>
      {video &&(
         <div className={`w-1/2 flex flex-col bg-gray-950`}>
          <div className="h-full flex items-center justify-center bg-gray-900/30">
            <div className="w-full h-full">
              <ChatSection url={video} />
            </div>
         </div>
        </div>
      )}
    </div>
  );
};

export default App;
