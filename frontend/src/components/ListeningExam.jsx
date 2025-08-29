import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListeningTestPublic, submitListening } from "../api/api";
import TemplateRenderer from "./TemplateRenderer";

const formatTime = (sec) => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const ListeningExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [submitting, setSubmitting] = useState(false);
  const [partIndex, setPartIndex] = useState(0); // 0-based for listeningParts
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getListeningTestPublic(id);
        if (mounted) setTest(data);
      } catch (e) {}
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  const questions = useMemo(() => {
    if (test?.listeningParts && test.listeningParts.length > 0) {
      return test.listeningParts[partIndex]?.questions || [];
    }
    return test?.listening || [];
  }, [test, partIndex]);

  const currentAudio = useMemo(() => {
    if (test?.listeningParts && test.listeningParts.length > 0) {
      return test.listeningParts[partIndex]?.audioUrl || "";
    }
    return test?.listeningAudioUrl || "";
  }, [test, partIndex]);

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    if (!test) return;
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        testId: test.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      };
      const res = await submitListening(payload);
      // после успешной отправки — на endpage
      navigate('/endpage');
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleAudioEnded = () => {
    if (test?.listeningParts && partIndex < test.listeningParts.length - 1) {
      setPartIndex((p) => p + 1);
      // autoplay next part after slight delay
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.play().catch(()=>{});
        }
      }, 300);
    } else {
      // last part ended: auto-submit
      // navigate to Reading using assignment if available
      try {
        const a = JSON.parse(sessionStorage.getItem('assignment') || 'null');
        if (a?.readingTest?._id) {
          navigate(`/exam/reading/${a.readingTest._id}`);
          return;
        }
      } catch {}
      handleSubmit();
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!test) return <div style={{ padding: 24 }}>Test not found</div>;

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Listening: {test.name}</h1>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          Part {test?.listeningParts ? (partIndex + 1) : 1}{test?.listeningParts ? ` / ${test.listeningParts.length}` : ''}
        </div>
        {currentAudio && (
          <div>
            <audio
              ref={audioRef}
              src={currentAudio}
              style={{ width: '100%', marginBottom: 8 }}
              controls={false}
              autoPlay
              onEnded={handleAudioEnded}
              onPlay={(e)=>{ e.currentTarget.volume = volume; }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Volume</span>
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e)=>{
                const v = Number(e.target.value);
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = v;
              }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>Time left: {formatTime(timeLeft)}</div>
      <div>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{idx + 1}. {q.prompt}</div>
            {q.type === 'mcq' && Array.isArray(q.options) && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {q.options.map((opt) => (
                  <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e)=>handleChange(q.id, e.target.value)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === 'multi' && Array.isArray(q.options) && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {q.options.map((opt) => {
                  const arr = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                  const checked = arr.includes(opt);
                  return (
                    <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={checked}
                        onChange={(e)=>{
                          const next = new Set(arr);
                          if (e.target.checked) next.add(opt); else next.delete(opt);
                          handleChange(q.id, Array.from(next));
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === 'tf' && (
              <div style={{ display: 'flex', gap: 12 }}>
                {['True','False','Not Given'].map(opt => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e)=>handleChange(q.id, e.target.value)}
                    /> {opt}
                  </label>
                ))}
              </div>
            )}

            {(q.type === 'short' || !q.type) && (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e)=>handleChange(q.id, e.target.value)}
                placeholder="Your answer"
              />
            )}

            {q.type === 'gap_text' && typeof q.prompt === 'string' && (
              <TemplateRenderer template={q.prompt} questionId={q.id} answers={answers} onChange={handleChange} />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={handleSubmit} disabled={submitting}>Submit</button>
      </div>
    </div>
  );
};

export default ListeningExam;

