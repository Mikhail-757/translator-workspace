import type { Doc, Review, Term, TmEntry, User } from '../types';

export const demoUser: User = {
  id: 1,
  name: 'Анна Смирнова',
  email: 'anna@lexis.team',
  role: 'translator',
};
const pairs = [
  [
    'All personal data is encrypted at rest and in transit.',
    'Все персональные данные шифруются при хранении и передаче.',
  ],
  [
    'You can manage your notification preferences in the settings.',
    'Вы можете управлять настройками уведомлений в разделе настроек.',
  ],
  ['The service is available around the clock.', 'Сервис доступен круглосуточно.'],
  [
    'Changes take effect on the next business day.',
    'Изменения вступают в силу на следующий рабочий день.',
  ],
  ['Please contact the support team for assistance.', 'За помощью обратитесь в службу поддержки.'],
  [
    'The agreement remains valid for twelve months.',
    'Соглашение действует в течение двенадцати месяцев.',
  ],
  [
    'Access to the workspace is restricted to authorized users.',
    'Доступ к рабочему пространству предоставляется только авторизованным пользователям.',
  ],
  [
    'Create a backup before updating the application.',
    'Создайте резервную копию перед обновлением приложения.',
  ],
  [
    'The customer may terminate the agreement with prior notice.',
    'Клиент вправе расторгнуть соглашение с предварительным уведомлением.',
  ],
  ['Your changes have been saved successfully.', 'Ваши изменения успешно сохранены.'],
];
export const initialMemory: TmEntry[] = pairs.map(([sourceText, targetText], i) => ({
  id: i + 1,
  sourceText,
  targetText,
  domain: i === 5 || i === 8 ? 'Юридический' : 'Продукт',
  sourceDocTitle: i === 5 || i === 8 ? 'Пользовательское соглашение' : 'Руководство пользователя',
  sourceLang: 'en',
  targetLang: 'ru',
  updatedAt: '24.10.2026',
  score: i === 0 ? 100 : 87,
}));
export const initialDocuments: Doc[] = [
  {
    id: 1,
    title: 'Политика конфиденциальности',
    sourceLang: 'en',
    targetLang: 'ru',
    status: 'draft',
    progress: 50,
    updatedAt: '25.10.2026',
    domain: 'Юридический',
    segments: pairs
      .slice(0, 8)
      .map(([sourceText, targetText], i) => ({
        id: i + 1,
        position: i + 1,
        sourceText,
        targetText: i < 4 ? targetText : '',
        status: i < 4 ? 'translated' : 'pending',
        suggestion: initialMemory[i],
      })),
  },
  {
    id: 2,
    title: 'Руководство пользователя',
    sourceLang: 'en',
    targetLang: 'ru',
    status: 'in_review',
    progress: 100,
    updatedAt: '24.10.2026',
    domain: 'Продукт',
    segments: pairs
      .slice(0, 8)
      .map(([sourceText, targetText], i) => ({
        id: i + 21,
        position: i + 1,
        sourceText,
        targetText,
        status: 'translated',
        suggestion: null,
      })),
  },
  {
    id: 3,
    title: 'Пользовательское соглашение',
    sourceLang: 'en',
    targetLang: 'ru',
    status: 'approved',
    progress: 100,
    updatedAt: '23.10.2026',
    domain: 'Юридический',
    segments: pairs
      .slice(4)
      .map(([sourceText, targetText], i) => ({
        id: i + 41,
        position: i + 1,
        sourceText,
        targetText,
        status: 'approved',
        suggestion: null,
      })),
  },
  {
    id: 4,
    title: 'Описание интеграции API',
    sourceLang: 'de',
    targetLang: 'ru',
    status: 'draft',
    progress: 0,
    updatedAt: '22.10.2026',
    domain: 'Технический',
    segments: [
      {
        id: 61,
        position: 1,
        sourceText: 'Die API verwendet HTTPS für alle Anfragen.',
        targetText: '',
        status: 'pending',
        suggestion: null,
      },
      {
        id: 62,
        position: 2,
        sourceText: 'Jede Anfrage benötigt einen gültigen API-Schlüssel.',
        targetText: '',
        status: 'pending',
        suggestion: null,
      },
    ],
  },
];
const termPairs = [
  ['workspace', 'рабочее пространство', 'Продукт'],
  ['personal data', 'персональные данные', 'Юридический'],
  ['encryption', 'шифрование', 'Безопасность'],
  ['backup', 'резервная копия', 'Технический'],
  ['notification', 'уведомление', 'Продукт'],
  ['access token', 'токен доступа', 'Технический'],
  ['privacy policy', 'политика конфиденциальности', 'Юридический'],
  ['dashboard', 'обзор', 'Продукт'],
  ['support team', 'служба поддержки', 'Продукт'],
  ['data retention', 'хранение данных', 'Безопасность'],
];
export const initialTerms: Term[] = termPairs.map(([sourceTerm, targetTerm, domain], i) => ({
  id: i + 1,
  sourceTerm,
  targetTerm,
  domain,
  addedBy: i % 2 ? 'Михаил Волков' : 'Анна Смирнова',
}));
export const initialReviews: Review[] = [1, 2, 3, 4].map((id) => ({
  id,
  documentId: 2,
  docTitle: 'Руководство пользователя',
  sourceText: pairs[id - 1][0],
  translatorVersion:
    id === 1 ? 'Все личные данные зашифрованы при хранении и передаче.' : pairs[id - 1][1],
  editorVersion: pairs[id - 1][1],
  comment: id === 1 ? 'Используйте термин «персональные данные» из глоссария.' : '',
  status: 'open',
}));
