import { Share2 } from 'lucide-react';

export function ShareButtons() {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        className="p-2 rounded-full bg-soft-blue text-white hover:bg-soft-blue/90 transition-colors"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: '猫咪心情日记',
              text: '看看我的猫咪今天心情如何！',
              url: window.location.href,
            });
          }
        }}
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}

