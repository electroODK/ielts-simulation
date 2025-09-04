import React, { useState } from 'react';
import { createTest } from '../api/api';
import './TestCreator.css';

const TestCreator = () => {
  const [testData, setTestData] = useState({
    name: '',
    description: '',
    sections: []
  });

  // Отладочный useEffect для отслеживания изменений testData
  React.useEffect(() => {
    console.log('testData changed:', testData);
  }, [testData]);

  const [currentSection, setCurrentSection] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [activeTab, setActiveTab] = useState('listening');

  // Добавить новую секцию
  const addSection = (sectionType) => {
    console.log('addSection called:', { sectionType });
    console.log('Current testData:', testData);
    
    let newSection;
    
    if (sectionType === 'listening') {
      // Для Listening создаем 4 части по умолчанию
      newSection = {
        type: sectionType,
        title: '',
        durationSec: 0,
        audioParts: [
          { index: 1, audioUrl: '', duration: 0, questions: [] },
          { index: 2, audioUrl: '', duration: 0, questions: [] },
          { index: 3, audioUrl: '', duration: 0, questions: [] },
          { index: 4, audioUrl: '', duration: 0, questions: [] }
        ],
        blocks: []
      };
    } else if (sectionType === 'reading') {
      // Для Reading создаем 3 части с текстом по умолчанию
      newSection = {
        type: sectionType,
        title: '',
        durationSec: 0,
        readingParts: [
          { index: 1, passageTitle: '', passageText: '', questions: [] },
          { index: 2, passageTitle: '', passageText: '', questions: [] },
          { index: 3, passageTitle: '', passageText: '', questions: [] }
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
    
    console.log('New section created:', newSection);
    
    setTestData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setCurrentSection(newSection);
  };

  // Добавить блок в выбранную секцию (по индексу)
  const addBlock = (sectionIndex, blockType) => {
    console.log('addBlock called:', { sectionIndex, blockType });
    console.log('Current testData:', testData);
    
    let newBlock;
    
    if (blockType === 'speaking_questions') {
      newBlock = {
        blockType,
        title: 'Speaking Questions',
        instructions: 'Инструкции для speaking секции',
        questions: []
      };
    } else if (blockType === 'writing_part1' || blockType === 'writing_part2') {
      newBlock = {
        blockType,
        title: blockType === 'writing_part1' ? 'Writing Part 1' : 'Writing Part 2',
        instructions: `Инструкции для ${blockType === 'writing_part1' ? 'Part 1' : 'Part 2'}`,
        questions: []
      };
    } else {
      newBlock = {
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
    }

    console.log('New block created:', newBlock);

    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? { ...section, blocks: [...(section.blocks || []), newBlock] }
        : section
    );

    console.log('Updated sections for block:', updatedSections);
    setTestData(prev => ({ ...prev, sections: updatedSections }));
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
            blocks: (section.blocks || []).map((block, bIndex) =>
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
            audioParts: (section.audioParts || []).map((part, pIndex) =>
              pIndex === partIndex ? { ...part, [field]: value } : part
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Обновить данные readingPart
  const updateReadingPart = (sectionIndex, partIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            readingParts: (section.readingParts || []).map((part, pIndex) =>
              pIndex === partIndex ? { ...part, [field]: value } : part
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Удалить секцию
  const deleteSection = (sectionIndex) => {
    const updated = testData.sections.filter((_, idx) => idx !== sectionIndex);
    setTestData(prev => ({ ...prev, sections: updated }));
  };

  // Удалить блок
  const deleteBlock = (sectionIndex, blockIndex) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? { ...section, blocks: (section.blocks || []).filter((_, bIndex) => bIndex !== blockIndex) }
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
            audioParts: (section.audioParts || []).map((part, pIndex) =>
              pIndex === partIndex 
                ? { ...part, questions: [...(part.questions || []), newQuestion] }
                : part
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Обновить вопрос в audioPart
  // const updateQuestionInAudioPart = (sectionIndex, partIndex, questionIndex, field, value) => {
  //   const updatedSections = testData.sections.map((section, sIndex) =>
  //     sIndex === sectionIndex
  //       ? {
  //           ...section,
  //           audioParts: (section.audioParts || []).map((part, pIndex) =>
  //             pIndex === partIndex
  //               ? {
  //                   ...part,
  //                   questions: (part.questions || []).map((question, qIndex) =>
  //                     qIndex === questionIndex ? { ...question, [field]: value } : question
  //                   )
  //                 }
  //               : part
  //           )
  //         }
  //       : section
  //   );
  //   setTestData(prev => ({ ...prev, sections: updatedSections }));
  // };

  // Обновить вопрос в audioPart
  const updateQuestionInAudioPart = (sectionIndex, partIndex, questionIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            audioParts: (section.audioParts || []).map((part, pIndex) =>
              pIndex === partIndex
                ? {
                    ...part,
                    questions: (part.questions || []).map((question, qIndex) =>
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

  // Удалить вопрос из audioPart
  const deleteQuestionFromAudioPart = (sectionIndex, partIndex, questionIndex) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            audioParts: (section.audioParts || []).map((part, pIndex) =>
              pIndex === partIndex
                ? { ...part, questions: (part.questions || []).filter((_, qIndex) => qIndex !== questionIndex) }
                : part
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Добавить вопрос в readingPart
  const addQuestionToReadingPart = (sectionIndex, partIndex, questionType) => {
    console.log('addQuestionToReadingPart called:', { sectionIndex, partIndex, questionType });
    console.log('Current testData:', testData);
    
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

    console.log('New question created:', newQuestion);

    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            readingParts: (section.readingParts || []).map((part, pIndex) =>
              pIndex === partIndex 
                ? { ...part, questions: [...part.questions, newQuestion] }
                : part
            )
          }
        : section
    );
    
    console.log('Updated sections:', updatedSections);
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Обновить вопрос в readingPart
  const updateQuestionInReadingPart = (sectionIndex, partIndex, questionIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            readingParts: (section.readingParts || []).map((part, pIndex) =>
              pIndex === partIndex
                ? {
                    ...part,
                    questions: (part.questions || []).map((question, qIndex) =>
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

  // Удалить вопрос из readingPart
  const deleteQuestionFromReadingPart = (sectionIndex, partIndex, questionIndex) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            readingParts: (section.readingParts || []).map((part, pIndex) =>
              pIndex === partIndex
                ? { ...part, questions: (part.questions || []).filter((_, qIndex) => qIndex !== questionIndex) }
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
            blocks: (section.blocks || []).map((block, bIndex) =>
              bIndex === blockIndex
                ? { ...block, questions: [...(block.questions || []), newQuestion] }
                : block
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Добавить вопрос в Speaking блок
  const addQuestionToSpeakingBlock = (sectionIndex, blockIndex) => {
    console.log('addQuestionToSpeakingBlock called:', { sectionIndex, blockIndex });
    console.log('Current testData:', testData);
    
    const newQuestion = {
      prompt: '',
      type: 'speaking',
      instructions: '',
      timeLimit: 60,
      sampleAnswer: ''
    };

    console.log('New speaking question created:', newQuestion);

    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            blocks: (section.blocks || []).map((block, bIndex) =>
              bIndex === blockIndex
                ? { ...block, questions: [...(block.questions || []), newQuestion] }
                : block
            )
          }
        : section
    );
    
    console.log('Updated sections for speaking:', updatedSections);
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Добавить вопрос в Writing блок
  const addQuestionToWritingBlock = (sectionIndex, blockIndex, partType) => {
    console.log('addQuestionToWritingBlock called:', { sectionIndex, blockIndex, partType });
    console.log('Current testData:', testData);
    
    let newQuestion;
    
    if (partType === 'writing_part1') {
      newQuestion = {
        prompt: '',
        type: 'writing_part1',
        instructions: '',
        wordLimit: 150,
        timeLimit: 20,
        chartType: 'line', // line, bar, pie, table
        chartData: '',
        sampleAnswer: ''
      };
    } else {
      newQuestion = {
        prompt: '',
        type: 'writing_part2',
        instructions: '',
        wordLimit: 250,
        timeLimit: 40,
        essayType: 'argumentative', // argumentative, discussion, problem-solution
        sampleAnswer: ''
      };
    }

    console.log('New writing question created:', newQuestion);

    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            blocks: (section.blocks || []).map((block, bIndex) =>
              bIndex === blockIndex
                ? { ...block, questions: [...(block.questions || []), newQuestion] }
                : block
            )
          }
        : section
    );
    
    console.log('Updated sections for writing:', updatedSections);
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Обновить вопрос
  const updateQuestion = (sectionIndex, blockIndex, questionIndex, field, value) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            blocks: (section.blocks || []).map((block, bIndex) =>
              bIndex === blockIndex
                ? {
                    ...block,
                    questions: (block.questions || []).map((question, qIndex) =>
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

  // Удалить вопрос из блока
  const deleteQuestion = (sectionIndex, blockIndex, questionIndex) => {
    const updatedSections = testData.sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            blocks: (section.blocks || []).map((block, bIndex) =>
              bIndex === blockIndex
                ? { ...block, questions: (block.questions || []).filter((_, qIndex) => qIndex !== questionIndex) }
                : block
            )
          }
        : section
    );
    setTestData(prev => ({ ...prev, sections: updatedSections }));
  };

  // Подсчет вопросов в audioPart (Listening) - каждый вопрос считается отдельно
  const countQuestionsInPart = (part) => {
    return (part.questions || []).length; // Каждый вопрос = 1, независимо от типа
  };

  // Подсчет вопросов в readingPart с учетом специфики типов (старая логика)
  const countQuestionsInReadingPart = (part) => {
    return (part.questions || []).reduce((sum, q) => {
      if (q.type === 'table') {
        const cols = Array.isArray(q.columns) ? q.columns.length : 0;
        return sum + (cols || 0);
      }
      if (q.type === 'gap') {
        const text = q.text || '';
        const gaps = (text.match(/\{\{\s*gap\s*\}\}/g) || []).length;
        return sum + (gaps || 0);
      }
      return sum + 1;
    }, 0);
  };

  // Сохранить тест с валидацией
  const handleSaveTest = async () => {
    try {
      // Валидация: Writing должен содержать Part 1 и Part 2 хотя бы по одному
      const writingSections = testData.sections.filter(s => s.type === 'writing');
      for (const s of writingSections) {
        const types = (s.blocks || []).map(b => b.blockType);
        if (!types.includes('writing_part1') || !types.includes('writing_part2')) {
          alert('В секции Writing должны быть добавлены оба задания: Part 1 и Part 2.');
          return;
        }
      }
      // Валидация: Speaking должен содержать минимум 2 вопроса суммарно
      const speakingSections = testData.sections.filter(s => s.type === 'speaking');
      for (const s of speakingSections) {
        const totalSpeakingQs = (s.blocks || []).reduce((acc, b) => acc + ((b.speaking?.questions || []).length), 0);
        if (totalSpeakingQs < 2) {
          alert('В секции Speaking должно быть минимум 2 вопроса.');
          return;
        }
      }
      // Валидация: Listening лимиты - каждый вопрос считается отдельно
      const listeningSections = testData.sections.filter(s => s.type === 'listening');
      for (const s of listeningSections) {
        const perPartCounts = (s.audioParts || []).map(p => countQuestionsInPart(p));
        if (perPartCounts.some(c => c > 10)) {
          alert('В каждой части Listening не должно быть больше 10 вопросов (каждый вопрос считается отдельно).');
          return;
        }
        const total = perPartCounts.reduce((a, b) => a + b, 0);
        if (total > 40) {
          alert('В Listening суммарно не больше 40 вопросов (каждый вопрос считается отдельно).');
          return;
        }
      }

      // Валидация: Reading лимиты (3 части, по 15 максимум, всего 40) - логика остается прежней
      const readingSections = testData.sections.filter(s => s.type === 'reading');
      for (const s of readingSections) {
        const perPartCounts = (s.readingParts || []).map(p => countQuestionsInReadingPart(p));
        if (perPartCounts.some(c => c > 15)) {
          alert('В каждой части Reading не должно быть больше 15 вопросов.');
          return;
        }
        const total = perPartCounts.reduce((a, b) => a + b, 0);
        if (total > 40) {
          alert('В Reading суммарно не больше 40 вопросов.');
          return;
        }
      }

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
              placeholder="Вопрос"
              value={question.prompt}
              onChange={(e) => updateQuestionField('prompt', e.target.value)}
            />
            <div className="table-setup">
              <div className="columns-setup">
                <h6>Колонки:</h6>
                {question.columns.map((col, index) => (
                  <input
                    key={index}
                    placeholder={`Колонка ${index + 1}`}
                    value={col}
                    onChange={(e) => {
                      const newColumns = [...question.columns];
                      newColumns[index] = e.target.value;
                      updateQuestionField('columns', newColumns);
                    }}
                  />
                ))}
                <button onClick={() => {
                  const newColumns = [...question.columns, ''];
                  updateQuestionField('columns', newColumns);
                }}>Добавить колонку</button>
              </div>
              <div className="rows-setup">
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
              placeholder="Вопрос"
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

  // Рендеринг вопросов для Reading секции
  const renderReadingQuestionEditor = (sectionIndex, partIndex, questionIndex, question) => {
    const updateQuestionField = (field, value) => updateQuestionInReadingPart(sectionIndex, partIndex, questionIndex, field, value);

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
                  <div>
                    <button className="btn-danger" onClick={() => deleteQuestion(sectionIndex, blockIndex, qIndex)}>Удалить вопрос</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addQuestion(sectionIndex, blockIndex)}>Добавить вопрос</button>
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
            <div className="questions-list">
              {block.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-item">
                  <input
                    placeholder="Вопрос"
                    value={question.prompt}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'prompt', e.target.value)}
                  />
                  <textarea
                    placeholder="Инструкции для студента"
                    value={question.instructions}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'instructions', e.target.value)}
                    rows={3}
                  />
                  <input
                    type="number"
                    placeholder="Временной лимит (секунды)"
                    value={question.timeLimit}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'timeLimit', parseInt(e.target.value) || 60)}
                  />
                  <textarea
                    placeholder="Пример ответа"
                    value={question.sampleAnswer}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'sampleAnswer', e.target.value)}
                    rows={4}
                  />
                  <div>
                    <button className="btn-danger" onClick={() => deleteQuestion(sectionIndex, blockIndex, qIndex)}>Удалить вопрос</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addQuestionToSpeakingBlock(sectionIndex, blockIndex)}>Добавить вопрос</button>
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
            <div className="questions-list">
              {block.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-item">
                  <input
                    placeholder="Задание"
                    value={question.prompt}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'prompt', e.target.value)}
                  />
                  <textarea
                    placeholder="Инструкции для студента"
                    value={question.instructions}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'instructions', e.target.value)}
                    rows={3}
                  />
                  <input
                    type="number"
                    placeholder="Лимит слов"
                    value={question.wordLimit}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'wordLimit', parseInt(e.target.value) || 150)}
                  />
                  <input
                    type="number"
                    placeholder="Временной лимит (минуты)"
                    value={question.timeLimit}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'timeLimit', parseInt(e.target.value) || 20)}
                  />
                  <select
                    value={question.chartType}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'chartType', e.target.value)}
                  >
                    <option value="line">Линейный график</option>
                    <option value="bar">Столбчатая диаграмма</option>
                    <option value="pie">Круговая диаграмма</option>
                    <option value="table">Таблица</option>
                  </select>
                  <textarea
                    placeholder="Данные для графика/таблицы"
                    value={question.chartData}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'chartData', e.target.value)}
                    rows={4}
                  />
                  <textarea
                    placeholder="Пример ответа"
                    value={question.sampleAnswer}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'sampleAnswer', e.target.value)}
                    rows={4}
                  />
                  <div>
                    <button className="btn-danger" onClick={() => deleteQuestion(sectionIndex, blockIndex, qIndex)}>Удалить задание</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addQuestionToWritingBlock(sectionIndex, blockIndex, 'writing_part1')}>Добавить задание</button>
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
            <div className="questions-list">
              {block.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-item">
                  <input
                    placeholder="Задание"
                    value={question.prompt}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'prompt', e.target.value)}
                  />
                  <textarea
                    placeholder="Инструкции для студента"
                    value={question.instructions}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'instructions', e.target.value)}
                    rows={3}
                  />
                  <input
                    type="number"
                    placeholder="Лимит слов"
                    value={question.wordLimit}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'wordLimit', parseInt(e.target.value) || 250)}
                  />
                  <input
                    type="number"
                    placeholder="Временной лимит (минуты)"
                    value={question.timeLimit}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'timeLimit', parseInt(e.target.value) || 40)}
                  />
                  <select
                    value={question.essayType}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'essayType', e.target.value)}
                  >
                    <option value="argumentative">Аргументативное эссе</option>
                    <option value="discussion">Дискуссионное эссе</option>
                    <option value="problem-solution">Проблемно-решение</option>
                  </select>
                  <textarea
                    placeholder="Пример ответа"
                    value={question.sampleAnswer}
                    onChange={(e) => updateQuestion(sectionIndex, blockIndex, qIndex, 'sampleAnswer', e.target.value)}
                    rows={4}
                  />
                  <div>
                    <button className="btn-danger" onClick={() => deleteQuestion(sectionIndex, blockIndex, qIndex)}>Удалить задание</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addQuestionToWritingBlock(sectionIndex, blockIndex, 'writing_part2')}>Добавить задание</button>
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
        <div className="tabs">
          <button className={`tab ${activeTab === 'listening' ? 'active' : ''}`} onClick={() => setActiveTab('listening')}>Listening</button>
          <button className={`tab ${activeTab === 'reading' ? 'active' : ''}`} onClick={() => setActiveTab('reading')}>Reading</button>
          <button className={`tab ${activeTab === 'writing' ? 'active' : ''}`} onClick={() => setActiveTab('writing')}>Writing</button>
          <button className={`tab ${activeTab === 'speaking' ? 'active' : ''}`} onClick={() => setActiveTab('speaking')}>Speaking</button>
        </div>
        <div className="tab-actions">
          <button onClick={() => addSection(activeTab)}>Добавить секцию {activeTab}</button>
        </div>

        {(() => {
          console.log('Rendering sections for activeTab:', activeTab);
          console.log('All sections:', testData.sections);
          const filteredSections = testData.sections.filter(section => section.type === activeTab);
          console.log('Filtered sections:', filteredSections);
          return filteredSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section-editor">
            <h3>Секция: {section.type}</h3>
            <div className="section-actions">
              <button className="btn-danger" onClick={() => deleteSection(sectionIndex)}>Удалить секцию</button>
            </div>
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
                  <h4>Аудио части (4 части, максимум 40 вопросов всего, каждый вопрос считается отдельно)</h4>
                  {(() => {
                    const totalQuestions = section.audioParts.reduce((sum, part) => sum + part.questions.length, 0);
                    return (
                      <div className="total-questions-summary">
                        <span>Всего вопросов: {totalQuestions}/40 (каждый вопрос считается отдельно)</span>
                        {totalQuestions > 40 && (
                          <span className="warning">⚠️ Превышен общий лимит вопросов!</span>
                        )}
                      </div>
                    );
                  })()}
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
                    
                    {(() => {
                      const countQuestionsInPartLocal = (p) => p.questions.length; // Каждый вопрос = 1
                      const partCount = countQuestionsInPartLocal(part);
                      return (
                        <div className="questions-summary">
                          <span>Вопросов: {partCount}/10 (каждый вопрос считается отдельно)</span>
                          {partCount > 10 && (
                            <span className="warning">⚠️ Превышен лимит вопросов!</span>
                          )}
                        </div>
                      );
                    })()}

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
                            <button className="btn-danger" onClick={() => deleteQuestionFromAudioPart(sectionIndex, partIndex, questionIndex)}>Удалить</button>
                          </div>
                          {renderQuestionEditor(sectionIndex, partIndex, questionIndex, question)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : section.type === 'reading' ? (
              <div className="reading-parts-creator">
                <h4>Пассажи для чтения (3 части, максимум 40 вопросов всего)</h4>
                {(() => {
                  const totalQuestions = (section.readingParts || []).reduce((sum, part) => sum + countQuestionsInReadingPart(part), 0);
                  return (
                    <div className="total-questions-summary">
                      <span>Всего вопросов: {totalQuestions}/40</span>
                      {totalQuestions > 40 && (
                        <span className="warning">⚠️ Превышен общий лимит вопросов!</span>
                      )}
                    </div>
                  );
                })()}
                {(section.readingParts || []).map((part, partIndex) => (
                  <div key={partIndex} className="reading-part-container">
                    <h5>Часть {part.index}</h5>
                    <div className="reading-part-info">
                      <input
                        placeholder="Заголовок пассажа"
                        value={part.passageTitle}
                        onChange={(e) => updateReadingPart(sectionIndex, partIndex, 'passageTitle', e.target.value)}
                      />
                      <textarea
                        placeholder="Текст пассажа"
                        rows={6}
                        value={part.passageText}
                        onChange={(e) => updateReadingPart(sectionIndex, partIndex, 'passageText', e.target.value)}
                      />
                      <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            updateReadingPart(sectionIndex, partIndex, 'passageText', reader.result || '');
                          };
                          reader.readAsText(file);
                        }}
                      />
                    </div>
                    {(() => {
                      const partCount = countQuestionsInReadingPart(part);
                      return (
                        <div className="questions-summary">
                          <span>Вопросов: {partCount}/15</span>
                          {partCount > 15 && (
                            <span className="warning">⚠️ Превышен лимит вопросов!</span>
                          )}
                        </div>
                      );
                    })()}

                    <div className="question-types">
                      <button onClick={() => addQuestionToReadingPart(sectionIndex, partIndex, 'mcq')}>Multiple Choice</button>
                      <button onClick={() => addQuestionToReadingPart(sectionIndex, partIndex, 'tfng')}>True/False/Not Given</button>
                      <button onClick={() => addQuestionToReadingPart(sectionIndex, partIndex, 'matching')}>Matching</button>
                      <button onClick={() => addQuestionToReadingPart(sectionIndex, partIndex, 'table')}>Table</button>
                      <button onClick={() => addQuestionToReadingPart(sectionIndex, partIndex, 'gap')}>Gap Fill</button>
                      <button onClick={() => addQuestionToReadingPart(sectionIndex, partIndex, 'short')}>Short Answer</button>
                    </div>

                    <div className="questions-list">
                      {part.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="question-container">
                          <div className="question-header">
                            <span className="question-type">{question.type.toUpperCase()}</span>
                            <span className="question-number">Вопрос {questionIndex + 1}</span>
                            <button className="btn-danger" onClick={() => deleteQuestionFromReadingPart(sectionIndex, partIndex, questionIndex)}>Удалить</button>
                          </div>
                          {renderReadingQuestionEditor(sectionIndex, partIndex, questionIndex, question)}
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
                    <button onClick={() => addBlock(sectionIndex, 'mcq_group')}>Multiple Choice Group</button>
                    <button onClick={() => addBlock(sectionIndex, 'tfng_group')}>True/False/Not Given Group</button>
                    <button onClick={() => addBlock(sectionIndex, 'matching_headings_group')}>Matching Headings Group</button>
                    <button onClick={() => addBlock(sectionIndex, 'matching_statements')}>Matching Statements</button>
                    <button onClick={() => addBlock(sectionIndex, 'table_block')}>Table Block</button>
                    <button onClick={() => addBlock(sectionIndex, 'gap_text_block')}>Gap Fill Text</button>
                    <button onClick={() => addBlock(sectionIndex, 'gap_table_block')}>Gap Fill Table</button>
                  </div>
                )}

                {section.type === 'writing' && (
                  <div className="block-types">
                    <button onClick={() => addBlock(sectionIndex, 'writing_part1')}>Writing Part 1</button>
                    <button onClick={() => addBlock(sectionIndex, 'writing_part2')}>Writing Part 2</button>
                  </div>
                )}

                {section.type === 'speaking' && (
                  <div className="block-types">
                    <button onClick={() => addBlock(sectionIndex, 'speaking_questions')}>Speaking Questions</button>
                  </div>
                )}

                {section.blocks.map((block, blockIndex) => (
                  <div key={blockIndex} className="block-container">
                    <div className="block-actions">
                      <button className="btn-danger" onClick={() => deleteBlock(sectionIndex, blockIndex)}>Удалить блок</button>
                    </div>
                    {renderBlockEditor(sectionIndex, blockIndex, block)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ));
        })()}
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