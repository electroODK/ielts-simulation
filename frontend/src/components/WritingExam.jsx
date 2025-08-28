import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitWriting } from "../api/api";

const WritingExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task1, setTask1] = useState("");
  const [task2, setTask2] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1>Writing</h1>
      <section style={{ marginBottom: 24 }}>
        <h2>Task 1</h2>
        <div style={{ marginBottom: 8 }}>
          <img src="" alt="Task 1" style={{ display: 'none' }} />
        </div>
        <textarea value={task1} onChange={(e)=>setTask1(e.target.value)} placeholder="Write Task 1 here" rows={10} style={{ width: '100%' }} />
      </section>
      <section>
        <h2>Task 2</h2>
        <textarea value={task2} onChange={(e)=>setTask2(e.target.value)} placeholder="Write Task 2 here" rows={15} style={{ width: '100%' }} />
      </section>
      <div style={{ marginTop: 16 }}>
        <button disabled={submitting} onClick={async ()=>{
          setSubmitting(true);
          try {
            await submitWriting({ testId: id, task1Text: task1, task2Text: task2 });
            try {
              const a = JSON.parse(sessionStorage.getItem('assignment') || 'null');
              if (a?.speakingTest?._id) {
                navigate(`/exam/speaking/${a.speakingTest._id}`);
                return;
              }
            } catch {}
            navigate('/endpage');
          } finally {
            setSubmitting(false);
          }
        }}>Submit Writing</button>
      </div>
    </div>
  );
};

export default WritingExam;

