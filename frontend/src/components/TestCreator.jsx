import React, { useState } from 'react';
import { createTest } from '../api/api';
import './TestCreator.css';

const TestCreator = () => {
  const [testData, setTestData] = useState({
    name: '',
    description: '',
    sections: []
  });

  const [currentSection, setCurrentSection] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);

  // Добавить новую секцию
  const addSection = (sectionType) => {
    const newSection = {
      type: sectionType,
      title: '',
      durationSec: 0,
      audioParts: [],
      blocks: []
    };
    setTestData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setCurrentSection(newSection);
  };

  // Добавить блок в текущую секцию
  const addBlock = (blockType) => {
    if (!currentSection) return;

    const newBlock = {
      blockType,
      title: '',
      instructions: '',
      questions: [],
      matching: {},
      headings: {},
      table: {},
      gapText: {},
      gapTable: {},
      writing: {},
      speaking: {}
    };

    const updatedSections = testData.sections.map(section => 
      section === currentSection 
        ? { ...section, blocks: [...section.blocks, newBlock] }
        : section
    );

    setTestData(prev => ({
      ...prev,
      sections: updatedSections
    }));

    setCurrentBlock(newBlock);
  };

  // Обновить данные секции
  const updateSection = (sectionIndex, field, value) => {
    const updatedSections = testData.sections.map((section, index) =>
      index === sectionIndex ? { ...section, [field]: value } : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Обновить данные блока
  const updateBlock = (sectionIndex, blockIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            blocks: section.blocks.map((block, bIndex) =>
              bIndex === blockIndex ? { ...block, [field]: value } : block
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Добавить вопрос в блок
  const addQuestion = (sectionIndex, blockIndex) => {
    const newQuestion = {
      prompt: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    };

    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            blocks: section.blocks.map((block, bIndex) =>
              bIndex === blockIndex
                ? { ...block, questions: [...block.questions, newQuestion] }
                : block
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Обновить вопрос
  const updateQuestion = (sectionIndex, blockIndex, questionIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            blocks: section.blocks.map((block, bIndex) =>
              bIndex === blockIndex
                ? {
                    ...block,
                    questions: block.questions.map((question, qIndex) =>
                      qIndex === questionIndex ? { ...question, [field]: value } : question
                    )
                  }
                : block
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Сохранить тест
  const handleSaveTest = async () => {
    try {
      await createTest(testData);
      alert('Тест успешно создан!');
      setTestData({ name: '', description: '', sections: [] });
      setCurrentSection(null);
      setCurrentBlock(null);
    } catch (error) {
      alert('Ошибка при создании теста: ' + error.message);
    }
  };

  const renderBlockEditor = (sectionIndex, blockIndex, block) => {
    const updateBlockField = (field, value) => updateBlock(sectionIndex, blockIndex, field, value);

    switch (block.blockType) {
      case 'mcq_group':
        return (
          <div className="block-editor">
            <h4>Multiple Choice Group</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="questions-list">
              {block.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-item">
                  <input
                    placeholder="Вопрос"
                    value={question.prompt}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'prompt', e.target.value)}
                  />
                  {question.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      placeholder={`Вариант ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[oIndex] = e.target.value;
                        updateQuestion(sectionIndex, blockIndex, qIndex, 'options', newOptions);
                      }}
                    />
                  ))}
                  <input
                    placeholder="Правильный ответ"
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'correctAnswer', e.target.value)}
                  />
                </div>
              ))}
              <button onClick={() => addQuestion(sectionIndex, blockIndex)}>Добавить вопрос</button>
            </div>
          </div>
        );

      case 'tfng_group':
        return (
          <div className="block-editor">
            <h4>True/False/Not Given Group</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="questions-list">
              {block.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-item">
                  <input
                    placeholder="Утверждение"
                    value={question.prompt}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'prompt', e.target.value)}
                  />
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'correctAnswer', e.target.value)}
                  >
                    <option value="">Выберите ответ</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                    <option value="not_given">Not Given</option>
                  </select>
                </div>
              ))}
              <button onClick={() => addQuestion(sectionIndex, blockIndex)}>Добавить утверждение</button>
            </div>
          </div>
        );

      case 'matching_statements':
        return (
          <div className="block-editor">
            <h4>Matching Statements</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="matching-editor">
              <div className="left-items">
                <h5>Вопросы/Утверждения:</h5>
                {block.matching?.left?.map((item, index) => (
                  <input
                    key={index}
                    placeholder={`Утверждение ${index + 1}`}
                    value={item}
                    onChange={(e) => {
                      const newLeft = [...(block.matching?.left || [])];
                      newLeft[index] = e.target.value;
                      updateBlockField('matching', { ...block.matching, left: newLeft });
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newLeft = [...(block.matching?.left || []), ''];
                  updateBlockField('matching', { ...block.matching, left: newLeft });
                }}>Добавить утверждение</button>
              </div>
              <div className="right-items">
                <h5>Ответы/Продолжения:</h5>
                {block.matching?.right?.map((item, index) => (
                  <input
                    key={index}
                    placeholder={`Ответ ${index + 1}`}
                    value={item}
                    onChange={(e) => {
                      const newRight = [...(block.matching?.right || [])];
                      newRight[index] = e.target.value;
                      updateBlockField('matching', { ...block.matching, right: newRight });
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newRight = [...(block.matching?.right || []), ''];
                  updateBlockField('matching', { ...block.matching, right: newRight });
                }}>Добавить ответ</button>
              </div>
            </div>
          </div>
        );

      case 'matching_headings_group':
        return (
          <div className="block-editor">
            <h4>Matching Headings Group</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="headings-editor">
              <div className="headings-list">
                <h5>Заголовки:</h5>
                {block.headings?.headings?.map((heading, index) => (
                  <input
                    key={index}
                    placeholder={`Заголовок ${index + 1}`}
                    value={heading}
                    onChange={(e) => {
                      const newHeadings = [...(block.headings?.headings || [])];
                      newHeadings[index] = e.target.value;
                      updateBlockField('headings', { ...block.headings, headings: newHeadings });
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newHeadings = [...(block.headings?.headings || []), ''];
                  updateBlockField('headings', { ...block.headings, headings: newHeadings });
                }}>Добавить заголовок</button>
              </div>
              <div className="items-list">
                <h5>Параграфы/Тексты:</h5>
                {block.headings?.items?.map((item, index) => (
                  <div key={index} className="item-editor">
                    <textarea
                      placeholder={`Текст ${index + 1}`}
                      value={item.prompt}
                      onChange={(e) => {
                        const newItems = [...(block.headings?.items || [])];
                        newItems[index] = { ...newItems[index], prompt: e.target.value };
                        updateBlockField('headings', { ...block.headings, items: newItems });
                      }}
                    />
                    <select
                      value={item.answerKey}
                      onChange={(e) => {
                        const newItems = [...(block.headings?.items || [])];
                        newItems[index] = { ...newItems[index], answerKey: e.target.value };
                        updateBlockField('headings', { ...block.headings, items: newItems });
                      }}
                    >
                      <option value="">Выберите заголовок</option>
                      {block.headings?.headings?.map((heading, hIndex) => (
                        <option key={hIndex} value={hIndex}>{heading}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button onClick={() => {
                  const newItems = [...(block.headings?.items || []), { prompt: '', answerKey: '' }];
                  updateBlockField('headings', { ...block.headings, items: newItems });
                }}>Добавить текст</button>
              </div>
            </div>
          </div>
        );

      case 'table_block':
        return (
          <div className="block-editor">
            <h4>Table Block</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="table-editor">
              <div className="columns-editor">
                <h5>Колонки (A, B, C, D...):</h5>
                {block.table?.columns?.map((col, index) => (
                  <input
                    key={index}
                    placeholder={`Колонка ${String.fromCharCode(65 + index)}`}
                    value={col}
                    onChange={(e) => {
                      const newColumns = [...(block.table?.columns || [])];
                      newColumns[index] = e.target.value;
                      updateBlockField('table', { ...block.table, columns: newColumns });
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newColumns = [...(block.table?.columns || []), ''];
                  updateBlockField('table', { ...block.table, columns: newColumns });
                }}>Добавить колонку</button>
              </div>
              <div className="rows-editor">
                <h5>Строки:</h5>
                {block.table?.rows?.map((row, index) => (
                  <input
                    key={index}
                    placeholder={`Строка ${index + 1}`}
                    value={row}
                    onChange={(e) => {
                      const newRows = [...(block.table?.rows || [])];
                      newRows[index] = e.target.value;
                      updateBlockField('table', { ...block.table, rows: newRows });
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newRows = [...(block.table?.rows || []), ''];
                  updateBlockField('table', { ...block.table, rows: newRows });
                }}>Добавить строку</button>
              </div>
            </div>
          </div>
        );

      case 'gap_text_block':
        return (
          <div className="block-editor">
            <h4>Gap Fill Text Block</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="gap-text-editor">
              <textarea
                placeholder="Текст с пропусками (используйте {{gap}} для обозначения пропуска)"
                value={block.gapText?.template || ''}
                onChange={(e) => updateBlockField('gapText', { ...block.gapText, template: e.target.value })}
                rows={10}
              />
            </div>
          </div>
        );

      case 'gap_table_block':
        return (
          <div className="block-editor">
            <h4>Gap Fill Table Block</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="gap-table-editor">
              <div className="columns-editor">
                <h5>Колонки:</h5>
                {block.gapTable?.columns?.map((col, index) => (
                  <input
                    key={index}
                    placeholder={`Колонка ${index + 1}`}
                    value={col}
                    onChange={(e) => {
                      const newColumns = [...(block.gapTable?.columns || [])];
                      newColumns[index] = e.target.value;
                      updateBlockField('gapTable', { ...block.gapTable, columns: newColumns });
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newColumns = [...(block.gapTable?.columns || []), ''];
                  updateBlockField('gapTable', { ...block.gapTable, columns: newColumns });
                }}>Добавить колонку</button>
              </div>
              <div className="rows-editor">
                <h5>Строки:</h5>
                {block.gapTable?.rows?.map((row, index) => (
                  <input
                    key={index}
                    placeholder={`Строка ${index + 1}`}
                    value={row}
                    onChange={(e) => {
                      const newRows = [...(block.gapTable?.rows || [])];
                      newRows[index] = e.target.value;
                      updateBlockField('gapTable', { ...block.gapTable, rows: newRows });
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newRows = [...(block.gapTable?.rows || []), ''];
                  updateBlockField('gapTable', { ...block.gapTable, rows: newRows });
                }}>Добавить строку</button>
              </div>
            </div>
          </div>
        );

      case 'writing_part1':
        return (
          <div className="block-editor">
            <h4>Writing Part 1</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="writing-editor">
              <input
                placeholder="URL изображения"
                value={block.writing?.imageUrl || ''}
                onChange={(e) => updateBlockField('writing', { ...block.writing, imageUrl: e.target.value })}
              />
              <textarea
                placeholder="Текст задания"
                value={block.writing?.prompt || ''}
                onChange={(e) => updateBlockField('writing', { ...block.writing, prompt: e.target.value })}
                rows={5}
              />
            </div>
          </div>
        );

      case 'writing_part2':
        return (
          <div className="block-editor">
            <h4>Writing Part 2</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="writing-editor">
              <textarea
                placeholder="Задание"
                value={block.writing?.prompt || ''}
                onChange={(e) => updateBlockField('writing', { ...block.writing, prompt: e.target.value })}
                rows={5}
              />
            </div>
          </div>
        );

      case 'speaking_questions':
        return (
          <div className="block-editor">
            <h4>Speaking Questions</h4>
            <input
              placeholder="Заголовок блока"
              value={block.title}
              onChange={(e) => updateBlockField('title', e.target.value)}
            />
            <textarea
              placeholder="Инструкции"
              value={block.instructions}
              onChange={(e) => updateBlockField('instructions', e.target.value)}
            />
            <div className="speaking-editor">
              <h5>Вопросы:</h5>
              {block.speaking?.questions?.map((question, index) => (
                <textarea
                  key={index}
                  placeholder={`Вопрос ${index + 1}`}
                  value={question}
                  onChange={(e) => {
                    const newQuestions = [...(block.speaking?.questions || [])];
                    newQuestions[index] = e.target.value;
                    updateBlockField('speaking', { ...block.speaking, questions: newQuestions });
                  }}
                  rows={2}
                />
              ))}
              <button onClick={() => {
                const newQuestions = [...(block.speaking?.questions || []), ''];
                updateBlockField('speaking', { ...block.speaking, questions: newQuestions });
              }}>Добавить вопрос</button>
            </div>
          </div>
        );

      default:
        return <div>Неизвестный тип блока</div>;
    }
  };

  return (
    <div className="test-creator">
      <h1>Создание теста</h1>
      
      <div className="test-basic-info">
        <h2>Основная информация</h2>
        <input
          placeholder="Название теста"
          value={testData.name}
          onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
        />
        <textarea
          placeholder="Описание теста"
          value={testData.description}
          onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="sections-creator">
        <h2>Секции теста</h2>
        <div className="section-types">
          <button onClick={() => addSection('listening')}>Listening</button>
          <button onClick={() => addSection('reading')}>Reading</button>
          <button onClick={() => addSection('writing')}>Writing</button>
          <button onClick={() => addSection('speaking')}>Speaking</button>
        </div>

        {testData.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section-editor">
            <h3>Секция: {section.type}</h3>
            <input
              placeholder="Название секции"
              value={section.title}
              onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
            />
            <input
              type="number"
              placeholder="Длительность в секундах"
              value={section.durationSec}
              onChange={(e) => updateSection(sectionIndex, 'durationSec', parseInt(e.target.value) || 0)}
            />

            <div className="blocks-creator">
              <h4>Блоки секции</h4>
              
              {section.type === 'listening' && (
                <div className="block-types">
                  <button onClick={() => addBlock('mcq_group')}>Multiple Choice Group</button>
                  <button onClick={() => addBlock('tfng_group')}>True/False/Not Given Group</button>
                  <button onClick={() => addBlock('matching_statements')}>Matching Statements</button>
                  <button onClick={() => addBlock('table_block')}>Table Block</button>
                  <button onClick={() => addBlock('gap_text_block')}>Gap Fill Text</button>
                  <button onClick={() => addBlock('gap_table_block')}>Gap Fill Table</button>
                </div>
              )}

              {section.type === 'reading' && (
                <div className="block-types">
                  <button onClick={() => addBlock('mcq_group')}>Multiple Choice Group</button>
                  <button onClick={() => addBlock('tfng_group')}>True/False/Not Given Group</button>
                  <button onClick={() => addBlock('matching_headings_group')}>Matching Headings Group</button>
                  <button onClick={() => addBlock('matching_statements')}>Matching Statements</button>
                  <button onClick={() => addBlock('table_block')}>Table Block</button>
                  <button onClick={() => addBlock('gap_text_block')}>Gap Fill Text</button>
                  <button onClick={() => addBlock('gap_table_block')}>Gap Fill Table</button>
                </div>
              )}

              {section.type === 'writing' && (
                <div className="block-types">
                  <button onClick={() => addBlock('writing_part1')}>Writing Part 1</button>
                  <button onClick={() => addBlock('writing_part2')}>Writing Part 2</button>
                </div>
              )}

              {section.type === 'speaking' && (
                <div className="block-types">
                  <button onClick={() => addBlock('speaking_questions')}>Speaking Questions</button>
                </div>
              )}

              {section.blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="block-container">
                  {renderBlockEditor(sectionIndex, blockIndex, block)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="save-section">
        <button onClick={handleSaveTest} className="save-button">
          Сохранить тест
        </button>
      </div>
    </div>
  );
};

export default TestCreator;