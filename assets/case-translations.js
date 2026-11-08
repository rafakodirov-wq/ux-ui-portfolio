(function () {
  const dictionaries = {
    documents: {
      'Документы и договоры — UX/UI Case': 'Documents & contracts — UX/UI Case',
      'Обзор': 'Overview', 'Договор': 'Contract', 'Ордер': 'Receipt',
      'Документы.': 'Documents.', 'Без сложности.': 'Made simple.',
      'Один рабочий процесс — два формата взаимодействия. Карточка договора и приходный ордер для desktop и mobile.': 'One workflow in two formats. Contract details and goods receipts for desktop and mobile.',
      'ФОРМАТ': 'FORMAT', 'ЭКРАНЫ': 'SCREENS', 'ФОКУС': 'FOCUS', 'Информационная иерархия · Адаптация': 'Information hierarchy · Adaptation',
      'Договор — всё': 'Contract management.', 'под контролем.': 'Everything in view.',
      'Статус, сроки, исполнение, оплата, контрагент и документы объединены в одной карточке. На десктопе информация распределена по параллельным блокам; на мобильном — выстроена по приоритету в вертикальный сценарий.': 'Status, dates, completion, payment, counterparty and files are brought together in one card. On desktop, information is arranged in parallel blocks; on mobile, it follows a clear vertical priority.',
      'Приходный ордер.': 'Goods receipt.', 'Главное — на виду.': 'The essentials stay visible.',
      'Поставщик, склад, сумма, товары и история операций остаются доступными в обоих форматах. На широком экране — детальная таблица и контекстные панели; на смартфоне — компактная сводка и последовательные действия.': 'Supplier, warehouse, amount, goods and operation history remain accessible in both formats. Desktop uses a detailed table and contextual panels; mobile uses a compact summary and a sequential flow.',
      'Не уменьшать.': 'Do not shrink it.', 'Переосмыслять.': 'Rethink it.',
      'Иерархия': 'Hierarchy', 'Ключевые статусы и суммы видны без перехода в дополнительные разделы.': 'Key statuses and amounts remain visible without opening extra sections.',
      'Адаптация': 'Adaptation', 'Табличные данные на desktop превращаются в читаемые блоки на mobile.': 'Table data on desktop becomes readable blocks on mobile.',
      'Контекст': 'Context', 'История, файлы и комментарии находятся рядом с рабочим документом.': 'History, files and comments stay close to the working document.',
      'Продуманно.': 'Thoughtfully designed.', 'На каждом экране.': 'On every screen.',
      'Назад': 'Back', 'Назад к проектам': 'Back to projects', 'Связаться': 'Contact', 'Наверх': 'Back to top',
      'Договор на десктопе': 'Desktop contract', 'Договор на смартфоне': 'Mobile contract', 'Десктопная карточка договора': 'Desktop contract details', 'Мобильная карточка договора': 'Mobile contract details', 'Десктопный приходный ордер': 'Desktop goods receipt', 'Мобильный приходный ордер': 'Mobile goods receipt'
    },
    perfume: {
      'Perfume-Mode — UX/UI Case Study': 'Perfume-Mode — UX/UI Case Study',
      'Обзор': 'Overview', 'Процесс': 'Process', 'Дизайн': 'Design',
      'Аромат.': 'Fragrance.', 'Как опыт.': 'As an experience.',
      'Perfume-Mode — концепция цифрового бутика парфюмерии, где эмоциональная подача продукта встречается с понятным сценарием покупки.': 'Perfume-Mode is a digital perfume boutique concept where an emotional product story meets a clear purchase flow.',
      'Посмотреть сайт': 'View the site', 'ФОРМАТ': 'FORMAT', 'ФОКУС': 'FOCUS', 'ПРОЕКТ': 'PROJECT',
      'Эмоция.': 'Emotion.', 'И действие.': 'And action.',
      'Самостоятельный учебный концепт парфюмерного e-commerce. Задача — соединить имиджевую подачу аромата с понятным выбором товара и переходом к покупке.': 'An independent educational perfume e-commerce concept. The goal is to connect the fragrance’s editorial presentation with a clear product choice and path to purchase.',
      '01 / ПРОБЛЕМА': '01 / PROBLEM', 'Красивого кадра недостаточно': 'A beautiful image is not enough',
      'В парфюмерии невозможно почувствовать аромат через экран. Пользователю нужны ориентиры: ноты композиции, характер аромата, цена и аргументы доверия — без перегрузки интерфейса.': 'You cannot smell a fragrance through a screen. People need cues: notes, character, price and reasons to trust — without overloading the interface.',
      '02 / ЦЕЛЬ': '02 / GOAL', 'От впечатления к выбору': 'From impression to choice',
      'Построить последовательный путь от эмоционального первого контакта до изучения конкретного аромата, ассортимента и действия «Купить сейчас».': 'Build a coherent path from the emotional first encounter to exploring a specific fragrance, the collection and the “Buy now” action.',
      '03 / МОЯ РОЛЬ': '03 / MY ROLE', 'Полный дизайн-концепт': 'Complete design concept',
      'Идея, структура страницы, визуальное направление, типографика, карточки товаров и композиция desktop-макета. Проект не является коммерческим запуском.': 'Concept, page structure, visual direction, typography, product cards and desktop composition. This project is not a commercial launch.',
      '04 / ОГРАНИЧЕНИЯ': '04 / CONSTRAINTS', 'Один демонстрационный сценарий': 'One demonstration scenario',
      'В рамках концепта разработан desktop-лендинг. Корзина, оплата, реальные остатки и мобильный сценарий не реализованы; их нельзя считать проверенными.': 'The concept includes a desktop landing page. Cart, payment, real stock and a mobile flow are not implemented and therefore not validated.',
      'Логика': 'The logic', 'выбора.': 'of choice.',
      'Вместо вымышленных интервью и метрик — прозрачная продуктовая гипотеза и карта предполагаемого пути покупателя. Их ещё предстоит проверить на пользователях.': 'Instead of invented interviews and metrics, this presents a transparent product hypothesis and an assumed customer journey. Both still need user validation.',
      'User Flow / проектная гипотеза': 'User Flow / product hypothesis', 'Первый экран': 'First screen', 'Аромат': 'Fragrance', 'Коллекция': 'Collection', 'Доверие': 'Trust', 'Покупка': 'Purchase',
      'Образ бренда и ключевое обещание': 'Brand image and the key promise', 'Фото, описание и ноты': 'Image, description and notes', 'Другие варианты и цены': 'Other options and prices', 'История, преимущества, отзывы': 'Story, benefits and reviews', 'Переход к целевому действию': 'Moving to the primary action',
      'CJM / гипотетические точки контакта': 'CJM / hypothetical touchpoints', 'ЭТАП 01': 'STAGE 01', 'Заинтересовался': 'Gets interested', 'Изучает': 'Explores', 'Сомневается': 'Hesitates', 'Принимает решение': 'Decides',
      'Вопрос:': 'Question:', 'Решение:': 'Response:', 'Что это за бренд?': 'What is this brand?', 'Выразительный hero и краткое позиционирование.': 'A striking hero and concise positioning.', 'Подойдёт ли аромат?': 'Will this fragrance suit me?', 'Ноты, характер и крупное фото флакона.': 'Notes, character and a large bottle image.', 'Можно ли доверять?': 'Can I trust it?', 'История, преимущества и социальное доказательство.': 'Story, benefits and social proof.', 'Как купить?': 'How can I buy it?', 'Видимые цена и CTA рядом с продуктом.': 'A visible price and CTA next to the product.',
      'Это аналитическая реконструкция сценария на основе готового макета, а не результаты проведённых интервью, конкурентного аудита или юзабилити-тестирования.': 'This is an analytical reconstruction based on the completed layout, not the result of interviews, competitor research or usability testing.',
      'Визуальный': 'Visual', 'язык.': 'language.',
      'Минимум декоративного шума: продуктовая фотография создаёт настроение, а контрастные действия и информация о товаре помогают ориентироваться.': 'Minimal decorative noise: product photography sets the mood while contrasting actions and product information help people orient themselves.',
      'UI / ДИЗАЙН-РЕШЕНИЯ': 'UI / DESIGN DECISIONS', 'Сначала эмоция.': 'Emotion first.', 'Затем — аргументы.': 'Then the reasons.',
      'Главный экран формирует первое впечатление. Карточка Desert Breeze собирает цену, ноты и CTA в одной зоне. Коллекция расширяет выбор, а история и отзывы работают как блоки доверия.': 'The main screen creates the first impression. The Desert Breeze card brings price, notes and CTA together. The collection expands the choice, while story and reviews build trust.',
      'Палитра концепта: тёплые нейтрали, графитовые действия и медовые акценты фотографии.': 'The concept palette: warm neutrals, graphite actions and honey-toned photographic accents.',
      'Результат': 'The outcome', 'концепта.': 'of the concept.',
      'Получился законченный визуальный макет одностраничного бутика с ключевыми блоками покупательского пути. Это дизайн-результат, не подтверждённый рост конверсии.': 'The result is a complete visual layout for a one-page boutique with the core stages of the customer journey. It is a design outcome, not proven conversion growth.',
      'Desktop-концепт': 'Desktop concept', 'Собран единый экранный рассказ: hero, продукт, история, преимущества, коллекция, отзывы и подписка.': 'One cohesive screen story brings together the hero, product, story, benefits, collection, reviews and subscription.', 'Два типа мотивации': 'Two types of motivation', 'Имиджевые блоки формируют желание, функциональные — дают цену, описание и действие.': 'Editorial blocks build desire; functional ones provide price, description and action.', 'Требует проверки': 'Needs validation', 'Нет данных о конверсии, реальных заказах или тестах с пользователями. Показатели не выдумывались.': 'There is no data on conversion, real orders or user testing. No metrics were invented.',
      'Выводы': 'Lessons', 'и развитие.': 'and next steps.', 'Ключевой урок — эстетика должна работать вместе с информационной иерархией: пользователь должен не только захотеть продукт, но и понять следующий шаг.': 'The key lesson: aesthetics must work with information hierarchy. People should not only want the product, but also understand the next step.',
      'ЧТО УДАЛОСЬ': 'WHAT WORKED', 'Единая история продукта': 'One product story', 'Визуальная подача и коммерческие элементы связаны одним ритмом. У ключевого товара есть ясные атрибуты выбора и заметное действие.': 'The visual presentation and commercial elements share one rhythm. The key product has clear choice criteria and a visible action.',
      'СЛЕДУЮЩИЙ ЭТАП': 'NEXT STEP', 'Проверка гипотез': 'Validate hypotheses', 'Создать мобильную версию, прототип каталога и корзины, провести 5–7 модерируемых проверок понятности сценария и затем уточнить решения по наблюдениям.': 'Create a mobile version and cart/catalogue prototype, run 5–7 moderated comprehension sessions, then refine the design from the observations.',
      'Назад к проектам': 'Back to projects', 'Связаться': 'Contact', 'Наверх': 'Back to top'
    }
  };

  const caseId = document.body.dataset.case;
  const dictionary = dictionaries[caseId];
  if (!dictionary) return;
  const originals = new WeakMap();
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement && !node.parentElement.closest('script,style,.portfolio-language-menu,.case-lang,.travel-lang,.lang,.portfolio-contact,.floating-contact,.contact-chooser') && node.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  while (walker.nextNode()) {
    originals.set(walker.currentNode, walker.currentNode.nodeValue);
    textNodes.push(walker.currentNode);
  }

  function translate(lang) {
    textNodes.forEach(node => {
      const original = originals.get(node);
      const trimmed = original.trim();
      const next = lang === 'en' ? dictionary[trimmed] : trimmed;
      const translated = original.replace(trimmed, next || trimmed);
      if (node.nodeValue !== translated) node.nodeValue = translated;
    });
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
    if (caseId === 'documents') document.title = lang === 'en' ? dictionary['Документы и договоры — UX/UI Case'] : 'Документы и договоры — UX/UI Case';
  }

  function activeLanguage() {
    const button = document.querySelector('.travel-lang, .case-lang, .lang');
    return button && button.textContent.trim() === 'EN' ? 'en' : 'ru';
  }
  translate(activeLanguage());
  new MutationObserver(() => translate(activeLanguage())).observe(document.querySelector('.travel-lang, .case-lang, .lang'), { childList: true, characterData: true, subtree: true });
  window.addEventListener('message', event => {
    if (event.data?.type === 'portfolio-language') translate(event.data.lang === 'en' ? 'en' : 'ru');
  });
})();
