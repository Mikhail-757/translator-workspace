import type { ReactNode } from 'react';
import { Tag, Typography } from 'antd';
import type { DocumentStatus, SegmentStatus } from '../types';

const labels = {
  draft: 'В работе',
  in_review: 'На проверке',
  approved: 'Одобрено',
  pending: 'Ожидает перевода',
  translated: 'Переведено',
  rejected: 'Нужны правки',
};
const colors = {
  draft: 'gold',
  in_review: 'blue',
  approved: 'green',
  pending: 'default',
  translated: 'cyan',
  rejected: 'red',
};
export function StatusTag({ status }: { status: DocumentStatus | SegmentStatus }) {
  return (
    <Tag className="status-tag" color={colors[status]}>
      <span className="status-dot" />
      {labels[status]}
    </Tag>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <Typography.Title level={1}>{title}</Typography.Title>
        <Typography.Paragraph>{description}</Typography.Paragraph>
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}
export function LanguagePair({
  source = 'en',
  target = 'ru',
}: {
  source?: string;
  target?: string;
}) {
  return (
    <span className="language-pair">
      <span>{source.toUpperCase()}</span>
      <span className="pair-arrow">→</span>
      <span>{target.toUpperCase()}</span>
    </span>
  );
}
export const languageOptions = [
  { value: 'en', label: 'Английский' },
  { value: 'ru', label: 'Русский' },
  { value: 'de', label: 'Немецкий' },
];
