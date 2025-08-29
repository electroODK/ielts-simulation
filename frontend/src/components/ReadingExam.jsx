import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReadingTestPublic, submitReading } from "../api/api";
import TemplateRenderer from "./TemplateRenderer";

const formatTime = (sec) => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const ReadingExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [submitting, setSubmitting] = useState(false);
  const [passageIndex, setPassageIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getReadingTestPublic(id);
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

  const passages = useMemo(() => test?.readingPassages || [], [test]);
  const current = passages[passageIndex] || null;

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const renderQuestion = (q, idx) => {
    return (
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
                <input type="radio" name={`q-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={(e)=>handleChange(q.id, e.target.value)} /> {opt}
              </label>
            ))}
          </div>
        )}
        {(q.type === 'short' || !q.type) && (
          <input type="text" value={answers[q.id] || ''} onChange={(e)=>handleChange(q.id, e.target.value)} placeholder="Your answer" />
        )}
        {q.type === 'gap_text' && typeof q.prompt === 'string' && (
          <TemplateRenderer template={q.prompt} questionId={q.id} answers={answers} onChange={handleChange} />
        )}
      </div>
    );
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
      const res = await submitReading(payload);
      try {
        const a = JSON.parse(sessionStorage.getItem('assignment') || 'null');
        if (a?.writingTest?._id) {
          navigate(`/exam/writing/${a.writingTest._id}`);
          return;
        }
      } catch {}
      navigate('/endpage');
    } catch (e) {
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!test) return <div style={{ padding: 24 }}>Test not found</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div>
        <h2>Passage {passageIndex + 1} / {passages.length}</h2>
        <div>
          {(current?.content || []).map((node, i) => {
            if (node.type === 'text') return <p key={i} style={{ marginBottom: 12 }}>{node.value}</p>;
            if (node.type === 'image') return <img key={i} src={node.url} alt="passage" style={{ maxWidth: '100%', margin: '12px 0' }} />
            return null;
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button disabled={passageIndex === 0} onClick={()=>setPassageIndex((p)=>p-1)}>Prev passage</button>
          <button disabled={passageIndex === passages.length - 1} onClick={()=>setPassageIndex((p)=>p+1)}>Next passage</button>
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 16 }}>Time left: {formatTime(timeLeft)}</div>
        {(current?.questions || []).map((q, idx) => renderQuestion(q, idx))}
        <div style={{ marginTop: 24 }}>
          <button onClick={handleSubmit} disabled={submitting}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ReadingExam;

