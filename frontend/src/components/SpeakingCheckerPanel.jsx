import React, { useEffect, useState } from "react";
import { getAllResults, updateResult } from "../api/api";

const SpeakingCheckerPanel = () => {
  const [results, setResults] = useState([]);

  const load = async () => {
    const r = await getAllResults();
    setResults(r);
  };

  useEffect(()=>{ load(); },[]);

  const grade = async (id, band, comment) => {
    await updateResult(id, { speaking: { band, comment } });
    load();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Speaking Checker</h1>
      {results.map(r => (
        <div key={r._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
          <div>User: {r.user?.username} | Test: {r.test?.name}</div>
          <div>Speaking band: {r.speaking?.band || 0}</div>
          <button onClick={()=>grade(r._id, 6, 'Good')}>Set 6</button>
          <button onClick={()=>grade(r._id, 7, 'Great')}>Set 7</button>
          <button onClick={()=>grade(r._id, 8, 'Excellent')}>Set 8</button>
        </div>
      ))}
    </div>
  );
};

export default SpeakingCheckerPanel;

