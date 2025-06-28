'use client';

import React, { useRef, useState, useEffect } from 'react';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const PictureIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

type Worker = {
  workerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  address?: string;
  description?: string;
  experienceYears: number;
  category: string;
  subCategory: string;
};

type WorkersResponse = {
  message: string;
  data: Worker[];
  error?: string;
};

type ServiceResult = { 
  keyword: string; 
  workers: WorkersResponse;
};

interface ChatModalProps { isOpen: boolean; onClose: () => void; }

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ServiceResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleClose = () => {
    if(isListening) { recognitionRef.current?.stop(); }
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300);
  };

  useEffect(() => {
    if (!isOpen) { setDescription(''); setFile(null); setResult(null); setError(''); setIsLoading(false); }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) { setFile(selectedFile); }
  };
  
  const handleSubmit = async (textToSubmit: string) => {
    if (!textToSubmit && !file) { setError('Please describe your problem, upload a file, or use voice.'); return; }
    setError(''); setResult(null); setIsLoading(true);
    const formData = new FormData();
    formData.append('description', textToSubmit);
    if (file) { formData.append('file', file); }
    try {
      const response = await fetch('http://localhost:8000/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.detail || 'An API error occurred.'); }
      setResult(data);
    } catch (err: any) { setError(err.message || 'Failed to connect to AI service. Is the Python server running?'); } 
    finally { setIsLoading(false); }
  };

  const handleVoiceInput = () => {
    if (!SpeechRecognition) { setError("Your browser doesn't support Speech Recognition."); return; }
    if (isListening) { recognitionRef.current?.stop(); return; }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => setError(`Voice error: ${event.error}`);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription(transcript);
      handleSubmit(transcript);
    };
    recognition.start();
  };

  const handleBookWorker = (worker: Worker) => {
    // Navigate to booking page with worker details
    const serviceName = `${worker.category} Service`;
    const url = `/booking/services?service=${encodeURIComponent(serviceName)}&workerId=${worker.workerId}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideUp { from { transform: translateY(50px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(0) scale(1); opacity: 1; } to { transform: translateY(50px) scale(0.95); opacity: 0; } }
        .modal-overlay-open { animation: fadeIn 0.3s ease-out forwards; }
        .modal-overlay-close { animation: fadeOut 0.3s ease-in forwards; }
        .modal-panel-open { animation: slideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .modal-panel-close { animation: slideDown 0.3s cubic-bezier(0.5, 0, 0.75, 0) forwards; }
        @keyframes listening-pulse-blue { 0%, 100% { box-shadow: 0 0 10px 2px rgba(29, 78, 216, 0.7); } 50% { box-shadow: 0 0 14px 4px rgba(37, 99, 235, 1); } }
        .blue-button:hover { background-color: #2563EB; }
        .icon-button {
          flex: 1; padding: 10px;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px;
          color: #374151; cursor: pointer; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
          transition: background-color 0.2s;
        }
        .icon-button:hover { background: rgba(0, 0, 0, 0.1); }
        .worker-card {
          background: white; border: 1px solid #E5E7EB; border-radius: 12px;
          padding: 12px; margin-bottom: 8px; cursor: pointer;
          transition: all 0.2s ease;
        }
        .worker-card:hover {
          border-color: #1D4ED8; box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
        }
        .book-button {
          background: #10B981; color: white; border: none; border-radius: 8px;
          padding: 6px 12px; font-size: 12px; font-weight: 500; cursor: pointer;
          transition: background-color 0.2s;
        }
        .book-button:hover { background: #059669; }
      `}</style>
      <div 
        className={isClosing ? 'modal-overlay-close' : 'modal-overlay-open'}
        style={{ position: 'fixed', inset: '0', zIndex: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', fontFamily: 'sans-serif' }}
        onClick={handleClose}
      >
        <div
          className={isClosing ? 'modal-panel-close' : 'modal-panel-open'}
          style={{
            position: 'relative', width: '100%', maxWidth: '480px',
            margin: '0 24px 96px 24px',
            background: 'rgba(249, 250, 251, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            color: '#1F2937',
            maxHeight: '80vh',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '24px', maxHeight: 'calc(80vh - 48px)', overflow: 'auto' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(description); }}>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>AI Service Assistant</h1>
                <p style={{ color: '#4B5563', marginBottom: '16px', fontSize: '14px' }}>How can we help?</p>
                <textarea
                  id="description"
                  rows={3} // COMPACT UI: Reduced rows from 4 to 3
                  style={{
                      width: '100%', padding: '10px', background: '#FFFFFF',
                      border: '1px solid #D1D5DB', borderRadius: '10px',
                      color: '#111827', resize: 'none', outline: 'none', marginBottom: '12px',
                  }}
                  placeholder="My car is making a strange noise..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'left', marginBottom: '8px' }}>
                    {file ? `Selected: ${file.name}` : 'Optionally, add a file:'}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="icon-button" onClick={() => fileInputRef.current?.click()}>
                      <PictureIcon />
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>Picture</span>
                    </button>
                    <button type="button" className="icon-button" onClick={() => fileInputRef.current?.click()}>
                      <VideoIcon />
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>Video</span>
                    </button>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,video/*"/>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button type="button" onClick={handleVoiceInput}
                    style={{
                      height: '48px', width: '48px', // COMPACT UI: Smaller button
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: '#1D4ED8', border: 'none', borderRadius: '9999px', cursor: 'pointer',
                      animation: isListening ? 'listening-pulse-blue 1.5s infinite' : 'none', transition: 'background-color 0.2s'
                    }}
                    className="blue-button" aria-label="Use voice input">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2h2v2a5 5 0 0 0 10 0v-2h2z"/></svg>
                  </button>
                  <button type="submit" disabled={isLoading}
                    style={{
                      width: '100%', height: '48px', // COMPACT UI: Smaller button
                      padding: '0 16px', backgroundColor: '#1D4ED8',
                      border: 'none', borderRadius: '10px', color: '#FFFFFF', fontWeight: 'bold',
                      fontSize: '15px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'background-color 0.2s'
                    }}
                    className="blue-button">
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </form>
              {(error || result) && (
                <div style={{ marginTop: '16px', padding: '16px', background: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)', borderRadius: '16px' }}>
                  {error && <p style={{ color: '#BE123C', textAlign: 'center', fontWeight: '500' }}>{error}</p>}
                  {result && (
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <p style={{ color: '#4338CA', fontSize: '12px', fontWeight: '500' }}>Service Required:</p>
                        <p style={{
                          color: '#1E1B4B', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase',
                          letterSpacing: '0.05em', marginTop: '8px', lineHeight: '1.4', wordBreak: 'break-all'
                        }}>
                          {result.keyword}
                        </p>
                      </div>
                      
                      {/* Workers Section */}
                      {result.workers && (
                        <div>
                          {result.workers.error ? (
                            <p style={{ color: '#BE123C', textAlign: 'center', fontSize: '14px' }}>
                              {result.workers.error}
                            </p>
                          ) : result.workers.data && result.workers.data.length > 0 ? (
                            <div>
                              <p style={{ color: '#4338CA', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                                Available Workers ({result.workers.data.length}):
                              </p>
                              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                                {result.workers.data.map((worker, index) => (
                                  <div key={worker.workerId} className="worker-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600', fontSize: '14px', margin: '0 0 4px 0' }}>
                                          {worker.firstName} {worker.lastName}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px 0' }}>
                                          {worker.category} • {worker.experienceYears} years experience
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0' }}>
                                          {worker.phoneNumber}
                                        </p>
                                      </div>
                                      <button 
                                        className="book-button"
                                        onClick={() => handleBookWorker(worker)}
                                      >
                                        Book Now
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p style={{ color: '#6B7280', textAlign: 'center', fontSize: '14px' }}>
                              No workers available for this service at the moment.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatModal;