import { useState } from "react";
import { Youtube, Link2, Send, Sparkles, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 overflow-x-hidden transition-all duration-300">
      <div className={`${video ? 'lg:w-1/2' : 'w-full'} flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:border-r border-gray-800`}>
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center p-2 sm:p-3 md:p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg shadow-red-900/30">
              <Youtube className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
            <h2 className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              TranscriptoQ
            </h2>
            <p className="mt-1 sm:mt-2 md:mt-3 lg:mt-4 text-xs sm:text-sm text-gray-400">
              Get AI-powered insights about any YouTube video from transcript
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 md:py-4 text-sm sm:text-base bg-gray-800/80 border border-gray-700 rounded-lg sm:rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute inset-y-0 right-0 px-2 sm:px-3 md:px-4 flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-r-lg sm:rounded-r-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <Send className="h-10 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </form>

          {!video && (
            <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 p-4 sm:p-6 md:p-8 border-2 border-dashed border-gray-700 rounded-lg sm:rounded-xl bg-gray-900/30 backdrop-blur-sm text-center">
              <Sparkles className="mx-auto h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-500 mb-2 sm:mb-3 md:mb-4" />
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">Video will appear here</p>
            </div>
          )}

          {video && (
            <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 rounded-lg sm:rounded-xl overflow-hidden shadow-xl">
              <VideoSection url={video} />
            </div>
          )}
        </div>
      </div>

      {video && (
        <div className="w-full lg:w-1/2 flex flex-col bg-gray-950/70 backdrop-blur-sm border-t lg:border-t-0 border-gray-800">
          <div className="flex-1 p-4 sm:p-5 md:p-6 lg:p-0 flex items-center justify-center">
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
