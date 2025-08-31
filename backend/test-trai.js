import dotenv from 'dotenv';
import { checkWritingWithTRAI } from './src/ai/ai.controller.js';

dotenv.config();

// Тестовый текст для проверки
const testTask1 = `This report will describe a bar chart showing the average rainfall for Australia last year by month and the average rainfall in Australia for the past forty years.

Overall, it can be seen that the average rainfall for Australia last year was a little lower than average rainfall in Australia for the past forty years, but generally followed the same pattern.

The average rainfall of the last forty years in Australia decreased from a peak at the beginning of the year to lows in the months in the middle of the year. Towards the end of the year rainfall rose again. Rainfall data for last year generally followed the same trend as the last forty years’ average.

Although the general pattern of the two sets of data is similar, there are some differences. The line representing the accumulation of the average rainfall from the past forty years begins at around eighty millimetres in January and then drops sharply to around thirty millimetres in April. Rainfall then drops slowly to around thirteen millimetres in September and then again rises steadily to just under sixty millimetres in December. Average rainfall for the last year was a little lower than the forty-year average for most months, excepting March, May, June and November when the rainfall was a little heavier. August and October were particularly dry when compared with the forty-year average, at around five millimetres each compared with about fifteen and twenty millimetres each respectively for the forty-year average.`;

const testTask2 = `An alarming number of people today consume sugar-based drinks, whether it is in the form of soda, energy drinks or fruit drinks. Often consumers are lured by their widespread availability and convenience, however, marketing campaigns also play a role, targeting young people and giving them the perception that sugary drinks are not as unhealthy as they actually are.

The availability of these types of drinks has greatly increased over time. They can now be found in almost any store or restaurant, which makes them easily accessible to almost anyone. The fact that they are often cheaper than alternatives, such as water or freshly squeezed juice, makes them an especially attractive option for those on a budget. Marketing campaigns for sugary  beverages have been quite successful in creating positive associations attached to these products through advertisements on TV and billboards. This encourages people to consider them fun rather than unhealthy and normalises them within society.

Luckily, reversing the rise in popularity of sugary drinks is still possible, if we act now and attack the problem from different angles. One of the very first steps should be educating people on the health risks associated with high sugar intake so that they can make better-informed decisions when selecting what type of beverage they consume. Companies should also be held accountable by law for their misleading marketing campaigns aimed at children and teenagers who are more likely to believe the false claims about their products’ health benefits without fully understanding what’s being sold to them. Schools, colleges and universities, and any institutions catering for young people, should consider banning sugary drinks and replacing them with refreshing alternatives without added sugar.

Overall, it is important that we recognise the potential health risks posed by consuming too much sugar from soft drinks and take actionable steps towards reversing this trend in order to ensure our long-term wellbeing. Through greater education, government regulation, and increased corporate responsibility we can ensure that more people understand why reducing their intake of sugary beverages is important while still allowing them to access enjoyable yet healthier options.`;

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