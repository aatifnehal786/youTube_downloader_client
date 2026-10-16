import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  const fetchInfo = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setInfo(null);
    try {
      const res = await fetch(`http://localhost:5000/api/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInfo(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (itag, type) => {
    window.location.href = `http://localhost:5000/api/download?url=${encodeURIComponent(url)}&itag=${itag}&type=${type}`;
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-5xl font-black bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-3">
          YT Fetch
        </h1>
        <p className="text-zinc-400">Download in 4K, 1080p, 720p & MP3 320kbps</p>
      </div>

      {/* Input */}
      <div className="w-full max-w-3xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube link here... https://youtube.com/watch?v="
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500 transition-all text-white placeholder-zinc-500"
          />
          <button
            onClick={fetchInfo}
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {loading? 'Fetching...' : 'Get Video'}
          </button>
        </div>

        {error && <p className="mt-4 text-red-400 bg-red-950/50 p-3 rounded-lg text-sm">{error}</p>}

        {/* Result */}
        {info && (
          <div className="mt-8 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-6">
              <img src={info.thumbnail} className="w-full md:w-80 rounded-xl border border-zinc-800" />
              <div className="flex-1">
                <h2 className="text-xl font-bold line-clamp-2">{info.title}</h2>
                <p className="text-zinc-400 text-sm mt-1">{info.author} • {Math.floor(info.duration / 60)}:{(info.duration % 60).toString().padStart(2,'0')} min</p>

                {/* Video Qualities */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Video Quality
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {info.videoQualities.map((q) => (
                      <button
                        key={q.itag}
                        onClick={() => handleDownload(q.itag, 'video')}
                        className="group bg-zinc-800 hover:bg-white hover:text-black border border-zinc-700 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:scale-105 flex justify-between items-center"
                      >
                        <span>{q.qualityLabel}</span>
                        <span className="text-xs opacity-60 group-hover:opacity-100">{q.container}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Qualities */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Audio Only
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {info.audioQualities.map((a) => (
                      <button
                        key={a.itag}
                        onClick={() => handleDownload(a.itag, 'audio')}
                        className="bg-zinc-800 hover:bg-green-500 hover:text-black border border-zinc-700 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:scale-105"
                      >
                        🎵 {a.quality}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-zinc-600 text-xs mt-10">Built with React + Tailwind + ytdl-core • For educational use</p>
    </div>
  );
}

export default App;