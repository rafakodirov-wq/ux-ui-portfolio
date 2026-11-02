(() => {
  const copy = {
    'Обзор': 'Overview', 'Процесс': 'Process', 'Дизайн': 'Design', 'Связаться': 'Contact',
    'Концепция лендинга профессионального фена. Продуктовая история, где форма, технологии и преимущества складываются в цельный визуальный опыт.': 'A professional hair dryer landing page concept. A product story where form, technology, and benefits create one coherent visual experience.',
    'Проблема': 'The challenge',
    'Технический продукт сложно представить так, чтобы посетитель одновременно почувствовал его характер и быстро понял, почему он ему нужен.': 'A technical product needs to feel distinctive while making its value immediately clear.',
    'Понять за секунды': 'Understand it in seconds',
    'Что это за устройство, чем оно отличается и какие преимущества важны лично мне?': 'What is this device, what makes it different, and which benefits matter to me?',
    'Показать, не перегрузить': 'Show, do not overload',
    'Сохранить премиальную подачу, не пряча технологические аргументы и действие «Оформить заказ».': 'Keep the premium tone while making the technical benefits and the order action easy to find.',
    'Цель': 'Objective',
    'Создать последовательный продуктовый лендинг: вызвать интерес первым экраном, объяснить технологию воздушного потока и привести к оформлению заказа.': 'Create a focused product landing page: engage on the first screen, explain the airflow technology, and lead naturally to an order.',
    'Выразительный hero': 'A distinctive hero', 'Крупный рендер устройства и ясный заголовок.': 'A large product render and a clear headline.',
    'Аргументы по порядку': 'Arguments in sequence', 'Преимущества → технология → характеристики → дизайн.': 'Benefits → technology → specifications → design.',
    'Доступный CTA': 'An accessible CTA', 'Повторяющееся действие «Оформить заказ».': 'A clear, repeated “Order now” action.',
    'Мой вклад': 'My contribution', 'Структура и сценарий': 'Structure and flow',
    'Организация блоков лендинга, логика знакомства с продуктом и расположение CTA.': 'Landing-page structure, the product-discovery flow, and CTA placement.',
    'UI и визуальная система': 'UI and visual system', 'Типографика, композиция, тёмно-зелёная палитра, продуктовые визуалы и карточки характеристик.': 'Typography, composition, a deep-green palette, product visuals, and specification cards.',
    'Процесс': 'Process', 'Гипотеза': 'Hypothesis',
    'Сначала человек оценивает продукт визуально, затем ищет доказательства его полезности.': 'People first assess the product visually, then look for proof of its value.',
    'Построение пути от первого впечатления до заказа.': 'Mapping the path from first impression to order.',
    'Иерархия контента': 'Content hierarchy', 'Крупные продуктовые изображения чередуются с объяснениями и короткими техническими блоками.': 'Large product images alternate with explanations and concise technical blocks.',
    'CJM / путь к заказу': 'CJM / path to order', 'Увидел Whoosh': 'Sees Whoosh', 'Оценил дизайн': 'Explores the design', 'Изучил технологию': 'Studies the technology', 'Сравнил параметры': 'Compares specifications', 'Решил заказать': 'Decides to order',
    'Low-fidelity / схема структуры': 'Low-fidelity / page structure',
    'Результаты': 'Final UI',
    'Разработана визуальная концепция продуктовой страницы: насыщенный зелёный фон, выразительный рендер фена, последовательная презентация технологии, параметров и преимуществ.': 'A visual concept for the product page: a rich green backdrop, an expressive dryer render, and a sequential presentation of technology, specifications, and benefits.',
    'Первый экран': 'First screen', 'Продукт занимает основное пространство; заголовок и действие читаются с первого взгляда.': 'The product owns the composition, while the headline and action are clear at a glance.',
    'Длинная продуктовая история': 'A complete product story', 'Преимущества, воздушный поток, характеристики, материалы, сравнение и финальный CTA.': 'Benefits, airflow, specifications, materials, comparison, and a final CTA.',
    'Полный макет': 'Full layout', 'Самопроверка': 'Design review', 'Сильные стороны: единая атмосфера, узнаваемая предметная подача и последовательность блоков.': 'Strengths: a coherent atmosphere, distinctive product presentation, and a deliberate page sequence.',
    'Форма поддерживает смысл': 'Form supports meaning', 'Визуальные акценты, крупный продуктовый рендер и короткие блоки ведут от впечатления к пониманию ключевых преимуществ.': 'Visual accents, a large product render, and concise blocks guide visitors from impression to understanding.',
    'Выводы': 'Reflection', 'Премиальный лендинг работает, когда эффектный визуал помогает объяснить продукт, а не конкурирует с информацией. Следующий шаг — адаптивная версия и проверка сценария заказа с пользователями.': 'A premium landing page works when a striking visual explains the product instead of competing with the information. The next step is responsive refinement and testing the order flow with users.',
    'Наверх ↑': 'Back to top ↑', 'Назад к проектам': 'Back to projects', 'Полный дизайн лендинга Whoosh': 'Full Whoosh landing-page design'
  };

  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      return parent && !['SCRIPT', 'STYLE', 'SVG'].includes(parent.tagName) && node.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  while (walker.nextNode()) textNodes.push([walker.currentNode, walker.currentNode.nodeValue]);

  const button = document.querySelector('#lang');
  const contact = document.querySelector('.portfolio-contact');
  const back = document.querySelector('#back');
  let english = false;
  const applyLanguage = () => {
    textNodes.forEach(([node, russian]) => {
      const trimmed = russian.trim();
      if (copy[trimmed]) node.nodeValue = russian.replace(trimmed, english ? copy[trimmed] : trimmed);
    });
    document.documentElement.lang = english ? 'en' : 'ru';
    document.title = english ? 'Whoosh — UX/UI case study · RZ.' : 'Whoosh — UX/UI кейс · RZ.';
    button.textContent = english ? 'EN' : 'RU';
    button.setAttribute('aria-label', english ? 'Switch to Russian' : 'Переключить на английский');
    contact?.setAttribute('aria-label', english ? 'Contact' : 'Связаться');
    back?.setAttribute('aria-label', english ? 'Back to projects' : 'Назад к проектам');
  };
  button.onclick = () => { english = !english; applyLanguage(); };
  applyLanguage();
})();
