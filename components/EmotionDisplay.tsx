
import React from 'react';

interface EmotionDisplayProps {
  emotion: string | null;
}

const EmotionIcon: React.FC<{ emotion: string }> = ({ emotion }) => {
  let emoji = "🤔"; // Default for unknown or generic
  const lowerEmotion = emotion.toLowerCase();

  if (lowerEmotion.includes("happy") || lowerEmotion.includes("joy")) emoji = "😊";
  else if (lowerEmotion.includes("sad") || lowerEmotion.includes("sorrow")) emoji = "😢";
  else if (lowerEmotion.includes("angry") || lowerEmotion.includes("rage")) emoji = "😠";
  else if (lowerEmotion.includes("surprised") || lowerEmotion.includes("astonished")) emoji = "😮";
  else if (lowerEmotion.includes("neutral")) emoji = "😐";
  else if (lowerEmotion.includes("fear")) emoji = "😨";
  else if (lowerEmotion.includes("disgust")) emoji = "🤢";
  else if (lowerEmotion.includes("contempt")) emoji = "😒";
  else if (lowerEmotion.includes("love")) emoji = "😍";

  return <span className="text-5xl mr-4">{emoji}</span>;
};


export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion }) => {
  if (!emotion) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-lg shadow-xl animate-fade-in">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Detected Emotion:</h3>
      <div className="flex items-center">
        <EmotionIcon emotion={emotion} />
        <p className="text-3xl font-bold text-slate-100 capitalize">{emotion}</p>
      </div>
       {emotion.toLowerCase().includes("could not determine") || emotion.toLowerCase().includes("no clear face") && (
        <p className="mt-3 text-sm text-slate-400">
          Try uploading a clearer image of a face, or ensure the face is well-lit and visible.
        </p>
      )}
    </div>
  );
};
