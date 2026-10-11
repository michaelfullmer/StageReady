import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Copy, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeAudio } from './audioProcessor';
import { addSession } from './storage';
import { VocalSession } from './types';

export default function VocalCoach() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<VocalSession['scores'] | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsAnalyzing(true);
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(blob);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAnalysis(null);
      setTip(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAudio = async (blob: Blob) => {
    // Simulate a bit of processing time for the "Analyzing" state
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    
    const results = analyzeAudio(channelData);
    
    setAnalysis({
      pitchStability: results.pitchStability,
      toneConsistency: results.toneConsistency,
      breathControl: results.breathControl,
      overall: results.overall
    });
    setTip(results.tip);

    const session: VocalSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      scores: {
        pitchStability: results.pitchStability,
        toneConsistency: results.toneConsistency,
        breathControl: results.breathControl,
        overall: results.overall
      },
      tip: results.tip
    };
    addSession(session);
    setIsAnalyzing(false);
  };

  const copyToClipboard = () => {
    if (!analysis || !tip) return;
    const text = `StageReady Session\nOverall: ${analysis.overall}\nPitch: ${analysis.pitchStability}% | Tone: ${analysis.toneConsistency}% | Breath: ${analysis.breathControl}%\nTip: ${tip}`;
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const reset = () => {
    setAnalysis(null);
    setTip(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress arc calculations
  const radius = 60;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (recordingTime / 60) * circumference;

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto safe-bottom">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-teal">Vocal Coach</h1>
        <p className="text-brand-light-grey">Record your voice for instant AI feedback</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {isAnalyzing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <Loader2 className="w-12 h-12 text-brand-teal animate-spin" />
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-brand-teal font-bold"
            >
              Analyzing your session...
            </motion.p>
          </motion.div>
        ) : !analysis ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Progress Arc - Only visible while recording */}
              <AnimatePresence>
                {isRecording && (
                  <motion.svg
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    height={radius * 2}
                    width={radius * 2}
                    className="absolute transform -rotate-90"
                  >
                    <circle
                      stroke="rgba(0, 206, 209, 0.1)"
                      fill="transparent"
                      strokeWidth={stroke}
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                    />
                    <motion.circle
                      stroke="#00CED1"
                      fill="transparent"
                      strokeWidth={stroke}
                      strokeDasharray={circumference + ' ' + circumference}
                      style={{ strokeDashoffset }}
                      strokeLinecap="round"
                      r={normalizedRadius}
                      cx={radius}
                      cy={radius}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>

              <motion.div
                animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center z-10 ${
                  isRecording ? 'bg-red-500' : 'bg-brand-teal'
                } shadow-lg shadow-brand-teal/20`}
              >
                {isRecording ? (
                  <Square className="w-10 h-10 text-white fill-current" />
                ) : (
                  <Mic className="w-10 h-10 text-brand-black" />
                )}
              </motion.div>
            </div>

            <div className="text-center space-y-4">
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-mono font-bold text-white"
                >
                  {formatTime(recordingTime)}
                </motion.div>
              )}
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-10 py-3 rounded-full font-bold text-lg transition-all active:scale-95 ${
                  isRecording 
                    ? 'bg-brand-grey text-white border border-white/20' 
                    : 'bg-white text-brand-black hover:bg-brand-teal hover:text-white'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Session'}
              </button>
              <p className="text-xs text-brand-light-grey">Max 60 seconds</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            <div className="bg-brand-grey/50 border border-brand-teal/30 rounded-2xl p-6 backdrop-blur-sm relative">
              <button 
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-brand-black/50 rounded-lg hover:bg-brand-teal/20 transition-colors"
              >
                {showCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-brand-teal" />}
              </button>
              
              <AnimatePresence>
                {showCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-14 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Analysis Results</h2>
                <div className="bg-brand-teal text-brand-black px-4 py-1 rounded-full font-black text-xl">
                  {analysis.overall}
                </div>
              </div>

              <div className="space-y-4">
                <ScoreRow label="Pitch Stability" score={analysis.pitchStability} />
                <ScoreRow label="Tone Consistency" score={analysis.toneConsistency} />
                <ScoreRow label="Breath Control" score={analysis.breathControl} />
              </div>

              <div className="mt-8 p-4 bg-brand-teal/10 border-l-4 border-brand-teal rounded-r-lg">
                <p className="text-sm font-bold text-brand-teal uppercase tracking-wider mb-1">Coach's Tip</p>
                <p className="text-white text-sm italic">"{tip}"</p>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full py-4 bg-white text-brand-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-teal hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-brand-light-grey">{label}</span>
        <span className="font-mono">{score}%</span>
      </div>
      <div className="h-2 bg-brand-black rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-brand-teal"
        />
      </div>
    </div>
  );
}
