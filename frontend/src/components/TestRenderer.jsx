import React, { useState } from 'react';
import './TestRenderer.css';

const TestRenderer = ({ test, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const updateAnswer = (blockIndex, questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSectionIndex}_${blockIndex}_${questionIndex}`]: value
    }));
  };

  const updateMatchingAnswer = (blockIndex, leftIndex, rightIndex) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSectionIndex}_${blockIndex}_matching_${leftIndex}`]: rightIndex
    }));
  };

  const updateTableAnswer = (blockIndex, rowIndex, colIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSectionIndex}_${blockIndex}_table_${rowIndex}_${colIndex}`]: value
    }));
  };

  const updateGapAnswer = (blockIndex, gapIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSectionIndex}_${blockIndex}_gap_${gapIndex}`]: value
    }));
  };

  const renderBlock = (block, blockIndex) => {
    switch (block.blockType) {
      case 'mcq_group':
        return (
          <div key={blockIndex} className="block-renderer mcq-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="questions-container">
              {block.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-container">
                  <p className="question-text">{question.prompt}</p>
                  <div className="options-container">
                    {question.options.map((option, oIndex) => (
                      <label key={oIndex} className="option-label">
                        <input
                          type="radio"
                          name={`mcq_${blockIndex}_${qIndex}`}
                          value={option}
                          checked={answers[`${currentSectionIndex}_${blockIndex}_${qIndex}`] === option}
                          onChange={(e) => updateAnswer(blockIndex, qIndex, e.target.value)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tfng_group':
        return (
          <div key={blockIndex} className="block-renderer tfng-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="questions-container">
              {block.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-container">
                  <p className="question-text">{question.prompt}</p>
                  <div className="options-container">
                    {['true', 'false', 'not_given'].map((option) => (
                      <label key={option} className="option-label">
                        <input
                          type="radio"
                          name={`tfng_${blockIndex}_${qIndex}`}
                          value={option}
                          checked={answers[`${currentSectionIndex}_${blockIndex}_${qIndex}`] === option}
                          onChange={(e) => updateAnswer(blockIndex, qIndex, e.target.value)}
                        />
                        <span className="option-text">
                          {option === 'true' ? 'True' : option === 'false' ? 'False' : 'Not Given'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'matching_statements':
        return (
          <div key={blockIndex} className="block-renderer matching-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="matching-container">
              <div className="left-column">
                <h4>Утверждения:</h4>
                {block.matching?.left?.map((item, index) => (
                  <div key={index} className="matching-item">
                    <span className="item-number">{index + 1}.</span>
                    <span className="item-text">{item}</span>
                  </div>
                ))}
              </div>
              <div className="right-column">
                <h4>Ответы:</h4>
                {block.matching?.right?.map((item, index) => (
                  <div key={index} className="matching-item">
                    <span className="item-letter">{String.fromCharCode(65 + index)}.</span>
                    <span className="item-text">{item}</span>
                  </div>
                ))}
              </div>
              <div className="matching-answers">
                <h4>Ваши ответы:</h4>
                {block.matching?.left?.map((_, index) => (
                  <div key={index} className="answer-input">
                    <span className="answer-label">{index + 1}.</span>
                    <select
                      value={answers[`${currentSectionIndex}_${blockIndex}_matching_${index}`] || ''}
                      onChange={(e) => updateMatchingAnswer(blockIndex, index, e.target.value)}
                    >
                      <option value="">Выберите ответ</option>
                      {block.matching?.right?.map((_, rIndex) => (
                        <option key={rIndex} value={rIndex}>
                          {String.fromCharCode(65 + rIndex)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'matching_headings_group':
        return (
          <div key={blockIndex} className="block-renderer headings-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="headings-container">
              <div className="headings-list">
                <h4>Заголовки:</h4>
                {block.headings?.headings?.map((heading, index) => (
                  <div key={index} className="heading-item">
                    <span className="heading-number">{index + 1}.</span>
                    <span className="heading-text">{heading}</span>
                  </div>
                ))}
              </div>
              <div className="texts-container">
                {block.headings?.items?.map((item, index) => (
                  <div key={index} className="text-item">
                    <p className="text-content">{item.prompt}</p>
                    <div className="answer-input">
                      <span className="answer-label">Ответ:</span>
                      <select
                        value={answers[`${currentSectionIndex}_${blockIndex}_${index}`] || ''}
                        onChange={(e) => updateAnswer(blockIndex, index, e.target.value)}
                      >
                        <option value="">Выберите заголовок</option>
                        {block.headings?.headings?.map((_, hIndex) => (
                          <option key={hIndex} value={hIndex}>
                            {hIndex + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'table_block':
        return (
          <div key={blockIndex} className="block-renderer table-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="table-container">
              <table className="answer-table">
                <thead>
                  <tr>
                    <th></th>
                    {block.table?.columns?.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.table?.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="row-label">{row}</td>
                      {block.table?.columns?.map((_, colIndex) => (
                        <td key={colIndex}>
                          <input
                            type="checkbox"
                            checked={answers[`${currentSectionIndex}_${blockIndex}_table_${rowIndex}_${colIndex}`] || false}
                            onChange={(e) => updateTableAnswer(blockIndex, rowIndex, colIndex, e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'gap_text_block':
        return (
          <div key={blockIndex} className="block-renderer gap-text-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="gap-text-container">
              {renderGapText(block.gapText?.template || '', blockIndex)}
            </div>
          </div>
        );

      case 'gap_table_block':
        return (
          <div key={blockIndex} className="block-renderer gap-table-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="gap-table-container">
              <table className="gap-table">
                <thead>
                  <tr>
                    {block.gapTable?.columns?.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.gapTable?.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="row-label">{row}</td>
                      {block.gapTable?.columns?.map((_, colIndex) => (
                        <td key={colIndex}>
                          <input
                            type="text"
                            placeholder="Введите ответ"
                            value={answers[`${currentSectionIndex}_${blockIndex}_gap_${rowIndex}_${colIndex}`] || ''}
                            onChange={(e) => updateGapAnswer(blockIndex, `${rowIndex}_${colIndex}`, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'writing_part1':
        return (
          <div key={blockIndex} className="block-renderer writing-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            {block.writing?.imageUrl && (
              <div className="writing-image">
                <img src={block.writing.imageUrl} alt="Writing task" />
              </div>
            )}
            <div className="writing-prompt">
              <p>{block.writing?.prompt}</p>
            </div>
            <div className="writing-answer">
              <textarea
                placeholder="Напишите ваш ответ здесь..."
                value={answers[`${currentSectionIndex}_${blockIndex}_writing`] || ''}
                onChange={(e) => updateAnswer(blockIndex, 'writing', e.target.value)}
                rows={15}
              />
            </div>
          </div>
        );

      case 'writing_part2':
        return (
          <div key={blockIndex} className="block-renderer writing-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="writing-prompt">
              <p>{block.writing?.prompt}</p>
            </div>
            <div className="writing-answer">
              <textarea
                placeholder="Напишите ваш ответ здесь..."
                value={answers[`${currentSectionIndex}_${blockIndex}_writing`] || ''}
                onChange={(e) => updateAnswer(blockIndex, 'writing', e.target.value)}
                rows={15}
              />
            </div>
          </div>
        );

      case 'speaking_questions': {
        const speakingItems = Array.isArray(block.speaking?.questions)
          ? block.speaking.questions.map((q) => (typeof q === 'string' ? { prompt: q } : { prompt: String(q) }))
          : Array.isArray(block.questions)
            ? block.questions.map((q) => ({ prompt: q?.prompt || '' }))
            : [];

        return (
          <div key={blockIndex} className="block-renderer speaking-block">
            <h3>{block.title}</h3>
            <p className="instructions">{block.instructions}</p>
            <div className="speaking-questions">
              {speakingItems.map((item, index) => (
                <div key={index} className="speaking-question">
                  <p className="question-text">{item.prompt}</p>
                  <div className="speaking-answer">
                    <textarea
                      placeholder="Подготовьте ваш ответ..."
                      value={answers[`${currentSectionIndex}_${blockIndex}_${index}`] || ''}
                      onChange={(e) => updateAnswer(blockIndex, index, e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return (
          <div key={blockIndex} className="block-renderer unknown-block">
            <p>Неизвестный тип блока: {block.blockType}</p>
          </div>
        );
    }
  };

  const renderListeningSection = () => {
    return (
      <div className="listening-section">
        {(currentSection.audioParts || []).map((part, partIndex) => (
          <div key={partIndex} className="listening-part">
            <h3>Part {part.index || partIndex + 1}</h3>
            {part.audioUrl && (
              <audio controls src={part.audioUrl} style={{ width: '100%' }} />
            )}
            <div className="questions-container">
              {(part.questions || []).map((question, qIndex) => {
                switch (question.type) {
                  case 'mcq':
                    return (
                      <div key={qIndex} className="question-container">
                        <p className="question-text">{question.prompt}</p>
                        <div className="options-container">
                          {(question.options || []).map((option, oIndex) => (
                            <label key={oIndex} className="option-label">
                              <input
                                type="radio"
                                name={`l_mcq_${partIndex}_${qIndex}`}
                                value={option}
                                checked={answers[`${currentSectionIndex}_${partIndex}_${qIndex}`] === option}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_${qIndex}`]: e.target.value }))}
                              />
                              <span className="option-text">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  case 'tfng':
                    return (
                      <div key={qIndex} className="question-container">
                        <p className="question-text">{question.prompt}</p>
                        <div className="options-container">
                          {['true', 'false', 'not_given'].map((option) => (
                            <label key={option} className="option-label">
                              <input
                                type="radio"
                                name={`l_tfng_${partIndex}_${qIndex}`}
                                value={option}
                                checked={answers[`${currentSectionIndex}_${partIndex}_${qIndex}`] === option}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_${qIndex}`]: e.target.value }))}
                              />
                              <span className="option-text">{option === 'true' ? 'True' : option === 'false' ? 'False' : 'Not Given'}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  case 'matching':
                    return (
                      <div key={qIndex} className="matching-container">
                        <p className="instructions">{question.prompt}</p>
                        <div className="left-column">
                          {(question.leftItems || []).map((item, index) => (
                            <div key={index} className="matching-item">
                              <span className="item-number">{index + 1}.</span>
                              <span className="item-text">{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="right-column">
                          {(question.rightItems || []).map((item, index) => (
                            <div key={index} className="matching-item">
                              <span className="item-letter">{String.fromCharCode(65 + index)}.</span>
                              <span className="item-text">{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="matching-answers">
                          {(question.leftItems || []).map((_, index) => (
                            <div key={index} className="answer-input">
                              <span className="answer-label">{index + 1}.</span>
                              <select
                                value={answers[`${currentSectionIndex}_${partIndex}_matching_${index}`] || ''}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_matching_${index}`]: e.target.value }))}
                              >
                                <option value="">Выберите ответ</option>
                                {(question.rightItems || []).map((_, rIndex) => (
                                  <option key={rIndex} value={rIndex}>
                                    {String.fromCharCode(65 + rIndex)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  case 'table':
                    return (
                      <div key={qIndex} className="table-block">
                        <p className="instructions">{question.prompt}</p>
                        <table className="answer-table">
                          <thead>
                            <tr>
                              <th></th>
                              {(question.columns || []).map((col, index) => (
                                <th key={index}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(question.rows || []).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                <td className="row-label">{row}</td>
                                {(question.columns || []).map((_, colIndex) => (
                                  <td key={colIndex}>
                                    <input
                                      type="checkbox"
                                      checked={answers[`${currentSectionIndex}_${partIndex}_table_${rowIndex}_${colIndex}`] || false}
                                      onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_table_${rowIndex}_${colIndex}`]: e.target.checked }))}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  case 'gap':
                    return (
                      <div key={qIndex} className="gap-text-block">
                        <p className="instructions">{question.prompt}</p>
                        {(question.text || '').split(/\{\{gap\}\}/).map((part, idx, arr) => (
                          <React.Fragment key={idx}>
                            <span className="text-part">{part}</span>
                            {idx < arr.length - 1 && (
                              <input
                                type="text"
                                className="gap-input"
                                placeholder="Введите ответ"
                                value={answers[`${currentSectionIndex}_${partIndex}_gap_${idx}`] || ''}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_gap_${idx}`]: e.target.value }))}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  default:
                    return (
                      <div key={qIndex} className="question-container">
                        <p className="question-text">{question.prompt}</p>
                        <input
                          type="text"
                          placeholder="Введите ответ"
                          value={answers[`${currentSectionIndex}_${partIndex}_${qIndex}`] || ''}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_${qIndex}`]: e.target.value }))}
                        />
                      </div>
                    );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadingSection = () => {
    return (
      <div className="reading-section">
        {(currentSection.readingParts || []).map((part, partIndex) => (
          <div key={partIndex} className="reading-part">
            <h3>{part.passageTitle || `Passage ${part.index || partIndex + 1}`}</h3>
            {part.passageText && <p className="passage-text">{part.passageText}</p>}
            <div className="questions-container">
              {(part.questions || []).map((question, qIndex) => {
                switch (question.type) {
                  case 'mcq':
                    return (
                      <div key={qIndex} className="question-container">
                        <p className="question-text">{question.prompt}</p>
                        <div className="options-container">
                          {(question.options || []).map((option, oIndex) => (
                            <label key={oIndex} className="option-label">
                              <input
                                type="radio"
                                name={`r_mcq_${partIndex}_${qIndex}`}
                                value={option}
                                checked={answers[`${currentSectionIndex}_${partIndex}_${qIndex}`] === option}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_${qIndex}`]: e.target.value }))}
                              />
                              <span className="option-text">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  case 'tfng':
                    return (
                      <div key={qIndex} className="question-container">
                        <p className="question-text">{question.prompt}</p>
                        <div className="options-container">
                          {['true', 'false', 'not_given'].map((option) => (
                            <label key={option} className="option-label">
                              <input
                                type="radio"
                                name={`r_tfng_${partIndex}_${qIndex}`}
                                value={option}
                                checked={answers[`${currentSectionIndex}_${partIndex}_${qIndex}`] === option}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_${qIndex}`]: e.target.value }))}
                              />
                              <span className="option-text">{option === 'true' ? 'True' : option === 'false' ? 'False' : 'Not Given'}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  case 'matching':
                    return (
                      <div key={qIndex} className="matching-container">
                        <p className="instructions">{question.prompt}</p>
                        <div className="left-column">
                          {(question.leftItems || []).map((item, index) => (
                            <div key={index} className="matching-item">
                              <span className="item-number">{index + 1}.</span>
                              <span className="item-text">{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="right-column">
                          {(question.rightItems || []).map((item, index) => (
                            <div key={index} className="matching-item">
                              <span className="item-letter">{String.fromCharCode(65 + index)}.</span>
                              <span className="item-text">{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="matching-answers">
                          {(question.leftItems || []).map((_, index) => (
                            <div key={index} className="answer-input">
                              <span className="answer-label">{index + 1}.</span>
                              <select
                                value={answers[`${currentSectionIndex}_${partIndex}_matching_${index}`] || ''}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_matching_${index}`]: e.target.value }))}
                              >
                                <option value="">Выберите ответ</option>
                                {(question.rightItems || []).map((_, rIndex) => (
                                  <option key={rIndex} value={rIndex}>
                                    {String.fromCharCode(65 + rIndex)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  case 'table':
                    return (
                      <div key={qIndex} className="table-block">
                        <p className="instructions">{question.prompt}</p>
                        <table className="answer-table">
                          <thead>
                            <tr>
                              <th></th>
                              {(question.columns || []).map((col, index) => (
                                <th key={index}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(question.rows || []).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                <td className="row-label">{row}</td>
                                {(question.columns || []).map((_, colIndex) => (
                                  <td key={colIndex}>
                                    <input
                                      type="checkbox"
                                      checked={answers[`${currentSectionIndex}_${partIndex}_table_${rowIndex}_${colIndex}`] || false}
                                      onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_table_${rowIndex}_${colIndex}`]: e.target.checked }))}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  case 'gap':
                    return (
                      <div key={qIndex} className="gap-text-block">
                        <p className="instructions">{question.prompt}</p>
                        {(question.text || '').split(/\{\{gap\}\}/).map((part, idx, arr) => (
                          <React.Fragment key={idx}>
                            <span className="text-part">{part}</span>
                            {idx < arr.length - 1 && (
                              <input
                                type="text"
                                className="gap-input"
                                placeholder="Введите ответ"
                                value={answers[`${currentSectionIndex}_${partIndex}_gap_${idx}`] || ''}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_gap_${idx}`]: e.target.value }))}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  default:
                    return (
                      <div key={qIndex} className="question-container">
                        <p className="question-text">{question.prompt}</p>
                        <input
                          type="text"
                          placeholder="Введите ответ"
                          value={answers[`${currentSectionIndex}_${partIndex}_${qIndex}`] || ''}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [`${currentSectionIndex}_${partIndex}_${qIndex}`]: e.target.value }))}
                        />
                      </div>
                    );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGapText = (template, blockIndex) => {
    const parts = template.split(/\{\{gap\}\}/);
    const gapCount = (template.match(/\{\{gap\}\}/g) || []).length;
    
    return (
      <div className="gap-text">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="text-part">{part}</span>
            {index < parts.length - 1 && (
              <input
                type="text"
                className="gap-input"
                placeholder="Введите ответ"
                value={answers[`${currentSectionIndex}_${blockIndex}_gap_${index}`] || ''}
                onChange={(e) => updateGapAnswer(blockIndex, index, e.target.value)}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const currentSection = test.sections[currentSectionIndex];

  if (!currentSection) {
    return <div>Тест не найден</div>;
  }

  return (
    <div className="test-renderer">
      <div className="test-header">
        <h1>{test.name}</h1>
        <p>{test.description}</p>
        <div className="section-info">
          <h2>Секция: {currentSection.title || currentSection.type}</h2>
          {currentSection.durationSec > 0 && (
            <p>Время: {Math.floor(currentSection.durationSec / 60)}:{(currentSection.durationSec % 60).toString().padStart(2, '0')}</p>
          )}
        </div>
      </div>

      <div className="section-content">
        {currentSection.type === 'listening'
          ? renderListeningSection()
          : currentSection.type === 'reading'
            ? renderReadingSection()
            : currentSection.blocks.map((block, blockIndex) => renderBlock(block, blockIndex))}
      </div>

      <div className="test-navigation">
        {currentSectionIndex > 0 && (
          <button 
            onClick={() => setCurrentSectionIndex(prev => prev - 1)}
            className="nav-button prev-button"
          >
            Предыдущая секция
          </button>
        )}
        
        {currentSectionIndex < test.sections.length - 1 ? (
          <button 
            onClick={() => setCurrentSectionIndex(prev => prev + 1)}
            className="nav-button next-button"
          >
            Следующая секция
          </button>
        ) : (
          <button 
            onClick={() => onComplete && onComplete(answers)}
            className="nav-button complete-button"
          >
            Завершить тест
          </button>
        )}
      </div>
    </div>
  );
};

export default TestRenderer;