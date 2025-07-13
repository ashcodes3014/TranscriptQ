import ReactPlayer from 'react-player';
import { Video } from 'lucide-react';

export default function VideoSection({url}) {
  return (
    <div className="w-full text-gray-300 space-y-4">
      <div className="flex items-center gap-2">
        <Video className="h-5 w-5 text-blue-400" />
        <span className="text-xl font-bold">Video</span>
      </div>

      <div className="text-sm text-gray-400 flex items-center">
        <p>Ask questions about this video in the chat panel</p>
      </div>
        
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-md overflow-hidden p-2">
        <div className="relative pt-[56.25%]"> 
          <div className="absolute inset-0">
            <ReactPlayer
              src={url}
              controls
              width="100%"
              height="100%"
              style={{
                backgroundColor: '#111827' 
              }}
              config={{
                youtube: {
                  playerVars: { 
                    modestbranding: 1,
                    rel: 0
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}