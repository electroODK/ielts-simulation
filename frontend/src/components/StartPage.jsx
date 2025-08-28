import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMyAssignment } from "../api/api";

const StartPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [countdown, setCountdown] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c)=>c-1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleStart = async () => {
    if (!checked) return;
    setCountdown(5);
    setTimeout(async () => {
      try {
        const a = await getMyAssignment();
        if (a) {
          sessionStorage.setItem('assignment', JSON.stringify(a));
          const listeningId = a?.listeningTest?._id;
          if (listeningId) {
            navigate(`/exam/listening/${listeningId}`);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      // fallback: остаёмся на стартовой или идём на listening только если id задан админом в ссылке
      if (id && id !== 'start') navigate(`/exam/listening/${id}`);
    }, 5000);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>IELTS Test — Instructions</h1>
      <ul>
        <li>Listening starts immediately. No pause/seek, only volume control.</li>
        <li>Reading, then Writing, then Speaking will follow.</li>
        <li>Please ensure your headphones and microphone (if required) are working.</li>
      </ul>
      <div style={{ marginTop: 16 }}>
        <label>
          <input type="checkbox" checked={checked} onChange={(e)=>setChecked(e.target.checked)} /> I have read the rules
        </label>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={handleStart} disabled={!checked || countdown>0}>Start</button>
        {countdown>0 && <span style={{ marginLeft: 12 }}>Starting in {countdown}...</span>}
      </div>
    </div>
  );
};

export default StartPage;

