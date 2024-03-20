export const applyMask = (template, input) => {
  let result = '';
  let inputIndex = 0;

  // Пройдемся по каждому символу в шаблоне маски
  for (let i = 0; i < template.length; i++) {
    const currentChar = template[i];

    // Если текущий символ - это маркер маски, заменяем его на соответствующую цифру из входных данных
    if (currentChar === '#' && inputIndex < input.length) {
      result += input[inputIndex];
      inputIndex++;
    } else if (currentChar === '#') {
      // Если мы прошлись по всем цифрам во входных данных, но маска еще осталась, прерываем цикл
      break;
    } else {
      // Если текущий символ - это обычный символ маски, добавляем его в результат напрямую
      result += currentChar;
    }
  }

  return result;
};
