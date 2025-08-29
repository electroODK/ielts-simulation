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
    let newSection;
    
    if (sectionType === 'listening') {
      // Для Listening создаем 3 части по умолчанию
      newSection = {
        type: sectionType,
        title: '',
        durationSec: 0,
        audioParts: [
          { index: 1, audioUrl: '', duration: 0, questions: [] },
          { index: 2, audioUrl: '', duration: 0, questions: [] },
          { index: 3, audioUrl: '', duration: 0, questions: [] }
        ],
        blocks: []
      };
    } else {
      newSection = {
        type: sectionType,
        title: '',
        durationSec: 0,
        audioParts: [],
        blocks: []
      };
    }
    
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

  // Обновить данные audioPart
  const updateAudioPart = (sectionIndex, partIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            audioParts: section.audioParts.map((part, pIndex) =>
              pIndex === partIndex ? { ...part, [field]: value } : part
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Добавить вопрос в audioPart
  const addQuestionToAudioPart = (sectionIndex, partIndex, questionType) => {
    let newQuestion;
    
    switch (questionType) {
      case 'mcq':
        newQuestion = {
          id: `q_${Date.now()}`,
          type: 'mcq',
          prompt: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        };
        break;
      case 'tfng':
        newQuestion = {
          id: `q_${Date.now()}`,
          type: 'tfng',
          prompt: '',
          correctAnswer: ''
        };
        break;
      case 'matching':
        newQuestion = {
          id: `q_${Date.now()}`,
          type: 'matching',
          prompt: '',
          leftItems: [''],
          rightItems: [''],
          correctAnswers: []
        };
        break;
      case 'table':
        newQuestion = {
          id: `q_${Date.now()}`,
          type: 'table',
          prompt: '',
          columns: [''],
          rows: [''],
          correctAnswers: []
        };
        break;
      case 'gap':
        newQuestion = {
          id: `q_${Date.now()}`,
          type: 'gap',
          prompt: '',
          text: '',
          gaps: []
        };
        break;
      default:
        newQuestion = {
          id: `q_${Date.now()}`,
          type: 'short',
          prompt: '',
          correctAnswer: ''
        };
    }

    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            audioParts: section.audioParts.map((part, pIndex) =>
              pIndex === partIndex 
                ? { ...part, questions: [...part.questions, newQuestion] }
                : part
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Обновить вопрос в audioPart
  const updateQuestionInAudioPart = (sectionIndex, partIndex, questionIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            audioParts: section.audioParts.map((part, pIndex) =>
              pIndex === partIndex
                ? {
                    ...part,
                    questions: part.questions.map((question, qIndex) =>
                      qIndex === questionIndex ? { ...question, [field]: value } : question
                    )
                  }
                : part
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

  const renderQuestionEditor = (sectionIndex, partIndex, questionIndex, question) => {
    const updateQuestionField = (field, value) => updateQuestionInAudioPart(sectionIndex, partIndex, questionIndex, field, value);

    switch (question.type) {
      case 'mcq':
        return (
          <div className="question-editor">
            <h5>Multiple Choice Question</h5>
            <input
              placeholder="Вопрос"
              value={question.prompt}
              onChange={(e) => updateQuestionField('prompt', e.target.value)}
            />
            {question.options.map((option, oIndex) => (
              <input
                key={oIndex}
                placeholder={`Вариант ${oIndex + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[oIndex] = e.target.value;
                  updateQuestionField('options', newOptions);
                }}
              />
            ))}
            <input
              placeholder="Правильный ответ"
              value={question.correctAnswer}
              onChange={(e) => updateQuestionField('correctAnswer', e.target.value)}
            />
          </div>
        );

      case 'tfng':
        return (
          <div className="question-editor">
            <h5>True/False/Not Given Question</h5>
            <input
              placeholder="Утверждение"
              value={question.prompt}
              onChange={(e) => updateQuestionField('prompt', e.target.value)}
            />
            <select
              value={question.correctAnswer}
              onChange={(e) => updateQuestionField('correctAnswer', e.target.value)}
            >
              <option value="">Выберите ответ</option>
              <option value="true">True</option>
              <option value="false">False</option>
              <option value="not_given">Not Given</option>
            </select>
          </div>
        );

      case 'matching':
        return (
          <div className="question-editor">
            <h5>Matching Question</h5>
            <input
              placeholder="Инструкции"
              value={question.prompt}
              onChange={(e) => updateQuestionField('prompt', e.target.value)}
            />
            <div className="matching-items">
              <div className="left-items">
                <h6>Левые элементы:</h6>
                {question.leftItems.map((item, index) => (
                  <input
                    key={index}
                    placeholder={`Элемент ${index + 1}`}
                    value={item}
                    onChange={(e) => {
                      const newItems = [...question.leftItems];
                      newItems[index] = e.target.value;
                      updateQuestionField('leftItems', newItems);
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newItems = [...question.leftItems, ''];
                  updateQuestionField('leftItems', newItems);
                }}>Добавить элемент</button>
              </div>
              <div className="right-items">
                <h6>Правые элементы:</h6>
                {question.rightItems.map((item, index) => (
                  <input
                    key={index}
                    placeholder={`Элемент ${index + 1}`}
                    value={item}
                    onChange={(e) => {
                      const newItems = [...question.rightItems];
                      newItems[index] = e.target.value;
                      updateQuestionField('rightItems', newItems);
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newItems = [...question.rightItems, ''];
                  updateQuestionField('rightItems', newItems);
                }}>Добавить элемент</button>
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="question-editor">
            <h5>Table Question</h5>
            <input
              placeholder="Инструкции"
              value={question.prompt}
              onChange={(e) => updateQuestionField('prompt', e.target.value)}
            />
            <div className="table-items">
              <div className="columns">
                <h6>Колонки:</h6>
                {question.columns.map((col, index) => (
                  <input
                    key={index}
                    placeholder={`Колонка ${index + 1}`}
                    value={col}
                    onChange={(e) => {
                      const newCols = [...question.columns];
                      newCols[index] = e.target.value;
                      updateQuestionField('columns', newCols);
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newCols = [...question.columns, ''];
                  updateQuestionField('columns', newCols);
                }}>Добавить колонку</button>
              </div>
              <div className="rows">
                <h6>Строки:</h6>
                {question.rows.map((row, index) => (
                  <input
                    key={index}
                    placeholder={`Строка ${index + 1}`}
                    value={row}
                    onChange={(e) => {
                      const newRows = [...question.rows];
                      newRows[index] = e.target.value;
                      updateQuestionField('rows', newRows);
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newRows = [...question.rows, ''];
                  updateQuestionField('rows', newRows);
                }}>Добавить строку</button>
              </div>
            </div>
          </div>
        );

      case 'gap':
        return (
          <div className="question-editor">
            <h5>Gap Fill Question</h5>
            <input
              placeholder="Инструкции"
              value={question.prompt}
              onChange={(e) => updateQuestionField('prompt', e.target.value)}
            />
            <textarea
              placeholder="Текст с пропусками (используйте {{gap}} для обозначения пропуска)"
              value={question.text}
              onChange={(e) => updateQuestionField('text', e.target.value)}
              rows={4}
            />
          </div>
        );

      default:
        return (
          <div className="question-editor">
            <h5>Short Answer Question</h5>
            <input
              placeholder="Вопрос"
              value={question.prompt}
              onChange={(e) => updateQuestionField('prompt', e.target.value)}
            />
            <input
              placeholder="Правильный ответ"
              value={question.correctAnswer}
              onChange={(e) => updateQuestionField('correctAnswer', e.target.value)}
            />
          </div>
        );
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

            {section.type === 'listening' ? (
              <div className="audio-parts-creator">
                <h4>Аудио части (3 части по 15 вопросов каждая)</h4>
                {section.audioParts.map((part, partIndex) => (
                  <div key={partIndex} className="audio-part-container">
                    <h5>Часть {part.index}</h5>
                    <div className="audio-part-info">
                      <input
                        placeholder="URL аудиофайла"
                        value={part.audioUrl}
                        onChange={(e) => updateAudioPart(sectionIndex, partIndex, 'audioUrl', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Длительность (секунды)"
                        value={part.duration}
                        onChange={(e) => updateAudioPart(sectionIndex, partIndex, 'duration', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="questions-summary">
                      <span>Вопросов: {part.questions.length}/15</span>
                      {part.questions.length > 15 && (
                        <span className="warning">⚠️ Превышен лимит вопросов!</span>
                      )}
                    </div>

                    <div className="question-types">
                      <button onClick={() => addQuestionToAudioPart(sectionIndex, partIndex, 'mcq')}>Multiple Choice</button>
                      <button onClick={() => addQuestionToAudioPart(sectionIndex, partIndex, 'tfng')}>True/False/Not Given</button>
                      <button onClick={() => addQuestionToAudioPart(sectionIndex, partIndex, 'matching')}>Matching</button>
                      <button onClick={() => addQuestionToAudioPart(sectionIndex, partIndex, 'table')}>Table</button>
                      <button onClick={() => addQuestionToAudioPart(sectionIndex, partIndex, 'gap')}>Gap Fill</button>
                      <button onClick={() => addQuestionToAudioPart(sectionIndex, partIndex, 'short')}>Short Answer</button>
                    </div>

                    <div className="questions-list">
                      {part.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="question-container">
                          <div className="question-header">
                            <span className="question-type">{question.type.toUpperCase()}</span>
                            <span className="question-number">Вопрос {questionIndex + 1}</span>
                          </div>
                          {renderQuestionEditor(sectionIndex, partIndex, questionIndex, question)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="blocks-creator">
                <h4>Блоки секции</h4>
                
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
            )}
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