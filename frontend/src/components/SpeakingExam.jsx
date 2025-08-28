import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadSpeakingRecording } from "../api/api";

const SpeakingExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    };
  }, [mediaStream]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const form = new FormData();
        form.append('recording', blob, 'speaking.webm');
        form.append('testId', id);
        form.append('duration', '0');
        form.append('size', String(blob.size));
        await uploadSpeakingRecording(form);
        navigate('/endpage');
      };
      mr.start();
      setRecording(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    setRecording(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Speaking</h1>
      <p>Press Start to record your speaking answer.</p>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop & Submit</button>
      )}
    </div>
  );
};

export default SpeakingExam;

