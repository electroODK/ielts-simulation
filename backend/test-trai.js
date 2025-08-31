import dotenv from 'dotenv';
import { checkWritingWithTRAI } from './src/ai/ai.controller.js';

dotenv.config();

// Тестовый текст для проверки
const testTask1 = `The graph shows the percentage of people who used different types of transport to travel to work in a European city in 2000 and 2020.

In 2000, cars were the most popular mode of transport, with 45% of people using them. Buses were used by 30% of people, while trains were used by 15%. Walking and cycling were used by 10% of people combined.

By 2020, the use of cars had decreased to 35%, while the use of public transport had increased. Bus usage rose to 40%, and train usage increased to 25%. Walking and cycling also became more popular, with 20% of people using these modes of transport.`;

const testTask2 = `Some people believe that the best way to reduce crime is to give longer prison sentences. Others believe that there are better alternative ways of reducing crime.

Discuss both views and give your opinion.

Crime is a serious problem in many societies, and there are different opinions on how to address it effectively. Some people argue that longer prison sentences are the most effective way to reduce crime, while others believe that alternative approaches would be more successful.

Those who support longer prison sentences argue that they act as a strong deterrent. When criminals know they will face severe consequences for their actions, they are less likely to commit crimes. Additionally, longer sentences keep dangerous individuals off the streets for extended periods, protecting society from potential harm.

However, I believe that alternative approaches would be more effective in reducing crime. Education and rehabilitation programs can address the root causes of criminal behavior, such as poverty, lack of education, and social inequality. Community programs that provide support and opportunities for at-risk individuals can prevent crime before it occurs.

In conclusion, while longer prison sentences may provide temporary protection, I believe that addressing the underlying causes of crime through education, rehabilitation, and community support would be more effective in the long term.`;

async function testTRAI() {
  console.log('🤖 Тестирование TRAI...\n');
  
  try {
    console.log('📝 Проверяем Writing Task 1...');
    const result1 = await checkWritingWithTRAI(testTask1, null, "task1");
    
    if (result1.success) {
      console.log('✅ TRAI успешно проверил Task 1');
      console.log('📊 Общая оценка:', result1.data.overall_band);
      if (result1.data.criteria) {
        console.log('📋 Критерии:', result1.data.criteria);
      }
    } else {
      console.log('❌ Ошибка при проверке Task 1:', result1.error);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('📝 Проверяем Writing Task 2...');
    const result2 = await checkWritingWithTRAI(null, testTask2, "task2");
    
    if (result2.success) {
      console.log('✅ TRAI успешно проверил Task 2');
      console.log('📊 Общая оценка:', result2.data.overall_band);
      if (result2.data.criteria) {
        console.log('📋 Критерии:', result2.data.criteria);
      }
    } else {
      console.log('❌ Ошибка при проверке Task 2:', result2.error);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('📝 Проверяем оба задания вместе...');
    const resultBoth = await checkWritingWithTRAI(testTask1, testTask2, "both");
    
    if (resultBoth.success) {
      console.log('✅ TRAI успешно проверил оба задания');
      console.log('📊 Общая оценка:', resultBoth.data.overall_band);
      if (resultBoth.data.criteria) {
        console.log('📋 Критерии:', resultBoth.data.criteria);
      }
      if (resultBoth.data.strengths) {
        console.log('💪 Сильные стороны:', resultBoth.data.strengths);
      }
      if (resultBoth.data.areas_for_improvement) {
        console.log('🔧 Области для улучшения:', resultBoth.data.areas_for_improvement);
      }
    } else {
      console.log('❌ Ошибка при проверке обоих заданий:', resultBoth.error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании TRAI:', error);
  }
}

// Запускаем тест
testTRAI();