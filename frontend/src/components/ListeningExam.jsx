import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListeningTestPublic, submitListening } from "../api/api";

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

  const questions = useMemo(() => test?.listening || [], [test]);

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

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!test) return <div style={{ padding: 24 }}>Test not found</div>;

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>Listening: {test.name}</h1>
      {test.listeningAudioUrl && (
        <audio controls style={{ width: '100%', marginBottom: 16 }}>
          <source src={test.listeningAudioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      <div style={{ marginBottom: 16 }}>Time left: {formatTime(timeLeft)}</div>
      <div>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{idx + 1}. {q.prompt}</div>
            {Array.isArray(q.options) && q.options.length > 0 ? (
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
            ) : (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e)=>handleChange(q.id, e.target.value)}
                placeholder="Your answer"
              />
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

