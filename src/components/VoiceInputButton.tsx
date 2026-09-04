import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: 'en' | 'hi';
  className?: string;
  placeholderPrompt?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language = 'en',
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const handleToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  if (!supported) return null;

  return (
    <button
      id="voice-input-toggle-btn"
      type="button"
      onClick={handleToggle}
      title={
        isListening
          ? language === 'hi'
            ? 'सुन रहे हैं...'
            : 'Listening...'
          : language === 'hi'
          ? 'बोलकर दर्ज करें'
          : 'Tap to speak'
      }
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        isListening
          ? 'bg-red-600 text-white animate-pulse shadow-md ring-2 ring-red-300'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
      } ${className}`}
    >
      {isListening ? (
        <>
          <MicOff className="w-3.5 h-3.5 animate-bounce" />
          <span>{language === 'hi' ? 'बोलिए...' : 'Listening...'}</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-emerald-700" />
          <span>{language === 'hi' ? 'माइक' : 'Voice'}</span>
        </>
      )}
    </button>
  );
};
