'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="3"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/><circle cx="12" cy="14" r="3"/></svg>
);

const GalleryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"></polyline></svg>
);

type AIResponse = {
  category: string;
  subcategory: string;
  worker_names?: string[];
  names?: string[];
  message?: string;
};

interface ChatModalProps { isOpen: boolean; onClose: () => void; }

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryVideoInputRef = useRef<HTMLInputElement>(null);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    if(isListening) { recognitionRef.current?.stop(); }
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300);
  };

  useEffect(() => {
    if (!isOpen) { setDescription(''); setFile(null); setResult(null); setError(''); setIsLoading(false); }
  }, [isOpen]);

  useEffect(() => {
    if (result && (result.worker_names?.length ?? 0) > 0 && result.category && result.subcategory) {
      const format = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const SUBCATEGORY_DISPLAY_MAP: Record<string, string> = {
        tape_repair: "Tap Repair",
        leak_fixing: "Leak Fixing",
        pipe_installation: "Pipe Installation",
        drain_cleaning: "Drain Cleaning",
        electrical_repair: "Electrical Repair",
        wiring_installation: "Wiring Installation",
        switch_and_socket_repair: "Switch & Socket Repair",
        fan_installation: "Fan Installation",
        wood_work: "Wood Work",
        furniture_assembly: "Furniture Assembly",
        road_repair: "Road Repair",
        window_repair: "Window Repair",
        car_service: "Car Service",
        bike_service: "Bike Service",
        emergency_service: "Emergency Service",
        tire_change: "Tire Change",
        haircut: "Haircut",
        saving: "Shaving",
        full_body_massage: "Full Body Massage",
        facial: "Facial",
        hair_color: "Hair Color",
        body_massage: "Body Massage",
      };
      const categoryFormatted = format(result.category);
      const subcategoryFormatted = SUBCATEGORY_DISPLAY_MAP[result.subcategory] || format(result.subcategory);
      const url = `/booking/services?service=${encodeURIComponent(subcategoryFormatted)}&category=${encodeURIComponent(categoryFormatted)}`;
      router.push(url);
    }
  }, [result, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
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
      console.log('AI response:', data);
      if (!response.ok) { throw new Error(data.error || 'An API error occurred.'); }
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

  // Video menu handlers
  const handleVideoButtonClick = () => setShowVideoMenu(true);
  const handleCloseVideoMenu = () => setShowVideoMenu(false);
  const handleRecordVideo = () => {
    setShowVideoMenu(false);
    videoInputRef.current?.click();
  };
  const handleChooseVideo = () => {
    setShowVideoMenu(false);
    galleryVideoInputRef.current?.click();
  };

  // Helper to render workers section
  function renderWorkersSection(result: AIResponse | null) {
    const workers = result?.worker_names ?? result?.names ?? [];
    if (workers.length > 0) {
      return (
        <div>
          <p style={{ color: '#4338CA', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
            Available Workers ({workers.length}):
          </p>
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            {workers.map((workerName, index) => (
              <div key={index} className="worker-name">
                {workerName}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <p style={{ color: '#6B7280', textAlign: 'center', fontSize: '14px' }}>
          No workers available for this service at the moment.
        </p>
      );
    }
  }

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
        @keyframes listening-pulse-yellow { 0%, 100% { box-shadow: 0 0 10px 2px rgba(253, 224, 71, 0.7); } 50% { box-shadow: 0 0 14px 4px rgba(250, 204, 21, 1); } }
        .yellow-button:hover { background-color: #fde047; }
        .icon-button {
          flex: 1; padding: 10px;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 10px;
          color: #374151; cursor: pointer; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
          transition: background-color 0.2s;
        }
        .icon-button:hover { background: rgba(0, 0, 0, 0.1); }
        .worker-name {
          background: white; border: 1px solid #E5E7EB; border-radius: 8px;
          padding: 8px 12px; margin-bottom: 6px; 
          font-size: 14px; font-weight: 500; color: #374151;
        }
        .video-menu-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.15); z-index: 100;
        }
        .video-menu {
          position: fixed; bottom: 110px; left: 50%; transform: translateX(-50%); background: #fffbe8; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.13), 0 1.5px 8px rgba(250,204,21,0.10);
          padding: 14px 18px; z-index: 101; display: flex; flex-direction: column; align-items: center; min-width: unset; border: 1.5px solid #fde047;
        }
        .video-menu-row {
          display: flex; flex-direction: row; gap: 18px; margin-bottom: 6px;
        }
        .video-menu-icon-btn {
          background: #fde047; color: #b45309; border: none; border-radius: 50%; width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; font-size: 22px; cursor: pointer; box-shadow: 0 1.5px 8px rgba(250,204,21,0.10); transition: background 0.18s, box-shadow 0.18s;
          position: relative;
        }
        .video-menu-icon-btn:hover { background: #fef9c3; box-shadow: 0 4px 16px rgba(250,204,21,0.18); }
        .video-menu-tooltip {
          position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%); background: #fffbe8; color: #b45309; padding: 2px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; box-shadow: 0 2px 8px rgba(250,204,21,0.10); white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.15s;
        }
        .video-menu-icon-btn:hover .video-menu-tooltip { opacity: 1; }
        .video-menu-tip {
          font-size: 11px; color: #444444; margin-top: 6px; text-align: center; opacity: 0.85;
        }
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
                  rows={3}
                  style={{
                      width: '100%', padding: '10px', background: '#FFFFFF',
                      border: '1px solid #D1D5DB', borderRadius: '10px',
                      color: '#111827', resize: 'none', outline: 'none', marginBottom: '12px',
                  }}
                  placeholder="My tap is leaking water..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'left', marginBottom: '8px' }}>
                    {file ? `Selected: ${file.name}` : 'Optionally, add a file:'}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="icon-button" onClick={() => imageInputRef.current?.click()}>
                      <PictureIcon />
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>Picture</span>
                    </button>
                    <button type="button" className="icon-button" onClick={handleVideoButtonClick}>
                      <VideoIcon />
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>Video</span>
                    </button>
                  </div>
                </div>
                {/* Video source menu */}
                {showVideoMenu && (
                  <>
                    <div className="video-menu-backdrop" onClick={handleCloseVideoMenu}></div>
                    <div className="video-menu">
                      <div className="video-menu-row">
                        <button className="video-menu-icon-btn" onClick={handleRecordVideo} aria-label="Record Video">
                          <CameraIcon />
                          <span className="video-menu-tooltip">Record</span>
                        </button>
                        <button className="video-menu-icon-btn" onClick={handleChooseVideo} aria-label="Gallery">
                          <GalleryIcon />
                          <span className="video-menu-tooltip">Gallery</span>
                        </button>
                      </div>
                      <div className="video-menu-tip">
                        On some devices, you may need to select <b>Camera</b> or <b>Record</b> after the prompt.
                      </div>
                    </div>
                  </>
                )}
                {/* File inputs */}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={e => handleFileChange(e, 'image')}
                  style={{ display: 'none' }}
                  accept="image/*"
                  capture="environment"
                  title="Upload an image"
                  placeholder="Choose an image file"
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={e => handleFileChange(e, 'video')}
                  style={{ display: 'none' }}
                  accept="video/*"
                  capture="environment"
                  title="Upload a video"
                  placeholder="Choose a video file"
                />
                <input
                  type="file"
                  ref={galleryVideoInputRef}
                  onChange={e => handleFileChange(e, 'video')}
                  style={{ display: 'none' }}
                  accept="video/*"
                  title="Upload a video from gallery"
                  placeholder="Choose a video file from gallery"
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button type="button" onClick={handleVoiceInput}
                    style={{
                      height: '48px', width: '48px',
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: '#FACC15', border: 'none', borderRadius: '9999px', cursor: 'pointer',
                      animation: isListening ? 'listening-pulse-yellow 1.5s infinite' : 'none', transition: 'background-color 0.2s'
                    }}
                    className="yellow-button" aria-label="Use voice input">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2h2v2a5 5 0 0 0 10 0v-2h2z"/></svg>
                  </button>
                  <button type="submit" disabled={isLoading}
                    style={{
                      width: '100%', height: '48px',
                      padding: '0 16px', backgroundColor: '#FACC15',
                      border: 'none', borderRadius: '10px', color: '#FFFFFF', fontWeight: 'bold',
                      fontSize: '15px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'background-color 0.2s'
                    }}
                    className="yellow-button">
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
                          letterSpacing: '0.05em', marginTop: '8px', lineHeight: '1.4'
                        }}>
                          {result.category} - {result.subcategory}
                        </p>
                      </div>
                      
                      {/* Workers Section */}
                      {renderWorkersSection(result)}
                      
                      <p style={{ color: '#4338CA', fontSize: '12px', textAlign: 'center', marginTop: '12px', fontStyle: 'italic' }}>
                        {result.message}
                      </p>
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