import React, { useState } from 'react';
import TestRenderer from './TestRenderer';

const TestDemo = () => {
  const [showTest, setShowTest] = useState(false);

  // Пример теста с различными типами блоков
  const demoTest = {
    name: "IELTS Academic Test Demo",
    description: "Демонстрационный тест с различными типами заданий",
    sections: [
      {
        type: "reading",
        title: "Reading Section",
        durationSec: 1800, // 30 минут
        blocks: [
          {
            blockType: "mcq_group",
            title: "Multiple Choice Questions",
            instructions: "Выберите правильный ответ из предложенных вариантов.",
            questions: [
              {
                prompt: "What is the main purpose of renewable energy sources?",
                options: [
                  "To reduce electricity costs",
                  "To protect the environment",
                  "To create more jobs",
                  "To increase energy independence"
                ]
              },
              {
                prompt: "Which of the following is NOT a renewable energy source?",
                options: [
                  "Solar power",
                  "Wind energy",
                  "Nuclear power",
                  "Hydroelectric power"
                ]
              }
            ]
          },
          {
            blockType: "tfng_group",
            title: "True/False/Not Given",
            instructions: "Определите, является ли утверждение истинным, ложным или информация не дана в тексте.",
            questions: [
              {
                prompt: "Solar panels are more expensive than traditional energy sources.",
                correctAnswer: "true"
              },
              {
                prompt: "Wind turbines can generate electricity 24 hours a day.",
                correctAnswer: "false"
              },
              {
                prompt: "The government provides subsidies for renewable energy projects.",
                correctAnswer: "not_given"
              }
            ]
          },
          {
            blockType: "matching_headings_group",
            title: "Matching Headings",
            instructions: "Выберите подходящий заголовок для каждого параграфа.",
            headings: {
              headings: [
                "Environmental Benefits",
                "Economic Considerations",
                "Technological Advances",
                "Government Policies"
              ],
              items: [
                {
                  prompt: "Renewable energy sources produce significantly fewer greenhouse gas emissions compared to fossil fuels. Solar and wind power generate electricity without burning any fuel, which means they don't release carbon dioxide or other harmful pollutants into the atmosphere."
                },
                {
                  prompt: "While the initial investment in renewable energy infrastructure can be high, the long-term operational costs are typically much lower than traditional energy sources. Solar panels and wind turbines have minimal maintenance requirements and no fuel costs."
                },
                {
                  prompt: "Recent developments in battery storage technology have made renewable energy more reliable and efficient. Smart grid systems can now better manage the intermittent nature of solar and wind power."
                }
              ]
            }
          }
        ]
      },
      {
        type: "writing",
        title: "Writing Section",
        durationSec: 3600, // 60 минут
        blocks: [
          {
            blockType: "writing_part1",
            title: "Writing Task 1",
            instructions: "Опишите график, диаграмму или процесс. Напишите минимум 150 слов.",
            writing: {
              imageUrl: "https://via.placeholder.com/600x400/3498db/ffffff?text=Chart+or+Graph",
              prompt: "The chart below shows the percentage of households using different types of energy in a European country from 2000 to 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant."
            }
          },
          {
            blockType: "writing_part2",
            title: "Writing Task 2",
            instructions: "Напишите эссе на заданную тему. Напишите минимум 250 слов.",
            writing: {
              prompt: "Some people believe that renewable energy sources should completely replace fossil fuels in the next 20 years. Others argue that this transition should be more gradual. Discuss both views and give your own opinion."
            }
          }
        ]
      },
      {
        type: "speaking",
        title: "Speaking Section",
        durationSec: 900, // 15 минут
        blocks: [
          {
            blockType: "speaking_questions",
            title: "Speaking Questions",
            instructions: "Подготовьте ответы на следующие вопросы для устного ответа.",
            speaking: {
              questions: [
                "What types of renewable energy are most common in your country?",
                "Do you think individuals should invest in renewable energy for their homes? Why or why not?",
                "What challenges do you think countries face when transitioning to renewable energy?",
                "How do you think renewable energy will change our daily lives in the future?"
              ]
            }
          }
        ]
      }
    ]
  };

  const handleTestComplete = (answers) => {
    console.log('Test completed with answers:', answers);
    alert('Тест завершен! Ответы сохранены.');
    setShowTest(false);
  };

  if (showTest) {
    return <TestRenderer test={demoTest} onComplete={handleTestComplete} />;
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        Демонстрация новой системы тестов
      </h1>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '10px',
        marginBottom: '30px',
        border: '1px solid #e9ecef'
      }}>
        <h2 style={{ color: '#34495e', marginBottom: '20px' }}>
          Особенности новой системы:
        </h2>
        
        <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>📋 Секции теста:</h3>
          <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
            <li><strong>Reading</strong> - чтение с различными типами заданий</li>
            <li><strong>Writing</strong> - письменные задания (Task 1 и Task 2)</li>
            <li><strong>Speaking</strong> - устные вопросы</li>
            <li><strong>Listening</strong> - аудирование (в разработке)</li>
          </ul>

          <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>🎯 Типы блоков:</h3>
          <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
            <li><strong>Multiple Choice</strong> - вопросы с выбором ответа</li>
            <li><strong>True/False/Not Given</strong> - определение истинности утверждений</li>
            <li><strong>Matching Headings</strong> - сопоставление заголовков с текстами</li>
            <li><strong>Matching Statements</strong> - сопоставление утверждений</li>
            <li><strong>Table Completion</strong> - заполнение таблиц</li>
            <li><strong>Gap Fill</strong> - заполнение пропусков в тексте</li>
            <li><strong>Writing Tasks</strong> - письменные задания</li>
            <li><strong>Speaking Questions</strong> - вопросы для устного ответа</li>
          </ul>

          <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>✨ Преимущества:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Гибкая система создания тестов через админ панель</li>
            <li>Единый рендерер для всех типов заданий</li>
            <li>Современный и удобный интерфейс</li>
            <li>Адаптивный дизайн для мобильных устройств</li>
            <li>Автоматическое сохранение ответов</li>
          </ul>
        </div>
      </div>

      <button 
        onClick={() => setShowTest(true)}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#2980b9';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#3498db';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }}
      >
        🚀 Запустить демо-тест
      </button>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#ecf0f1', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#7f8c8d'
      }}>
        <p><strong>Примечание:</strong> Это демонстрационная версия. В реальном тесте ответы будут отправляться на сервер для оценки.</p>
      </div>
    </div>
  );
};

export default TestDemo;