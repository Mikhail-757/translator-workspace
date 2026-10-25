import { useState } from 'react';
import { Link } from 'react-router-dom';
import { App, Button, Empty, Input, Segmented, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import { useWorkspace } from '../app/store';
import { PageHeading } from '../shared/ui';
import type { Review } from '../shared/types';

export function ReviewsPage() {
  const { reviews, setReviews } = useWorkspace();
  const [filter, setFilter] = useState('Ожидают проверки');
  const { message } = App.useApp();
  const filtered = reviews.filter((review) => filter === 'Все правки' || review.status === 'open');
  const update = (id: number, changes: Partial<Review>) =>
    setReviews((items) => items.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  const resolve = (review: Review, status: 'approved' | 'rejected') => {
    if (status === 'approved' && !review.editorVersion.trim()) {
      message.warning('Добавьте версию редактора');
      return;
    }
    if (status === 'rejected' && !review.comment.trim()) {
      message.warning('Объясните причину отклонения в комментарии');
      return;
    }
    update(review.id, { status });
    message.success(
      status === 'approved' ? 'Правка одобрена в демо-очереди' : 'Правка возвращена переводчику',
    );
  };
  return (
    <>
      <PageHeading
        eyebrow="СВЕЖИЙ ВЗГЛЯД НА ТЕКСТ"
        title="Правки редактора"
        description="Помогайте хорошим переводам становиться точнее."
        action={
          <Tag className="summary-tag">
            {reviews.filter((review) => review.status === 'open').length} ожидают проверки
          </Tag>
        }
      />
      <div className="reviews-toolbar">
        <Segmented
          options={['Ожидают проверки', 'Все правки']}
          value={filter}
          onChange={setFilter}
        />
        <span className="muted">Демонстрация сценария редактора</span>
      </div>
      <div className="reviews-list">
        {filtered.length ? (
          filtered.map((review) => (
            <article key={review.id} className="surface review-card">
              <div className="review-heading">
                <Link to={`/documents/${review.documentId}`}>
                  <FileTextOutlined /> {review.docTitle}
                </Link>
                <Tag
                  color={
                    review.status === 'open'
                      ? 'blue'
                      : review.status === 'approved'
                        ? 'green'
                        : 'red'
                  }
                >
                  {review.status === 'open'
                    ? 'На проверке'
                    : review.status === 'approved'
                      ? 'Одобрено'
                      : 'Возвращено'}
                </Tag>
              </div>
              <div className="review-original">
                <span className="eyebrow">ОРИГИНАЛ · СЕГМЕНТ {review.id}</span>
                <p>{review.sourceText}</p>
              </div>
              <div className="review-versions">
                <div>
                  <label>Версия переводчика</label>
                  <div className="translator-version">{review.translatorVersion}</div>
                </div>
                <div>
                  <label htmlFor={`review-${review.id}`}>Версия редактора</label>
                  <Input.TextArea
                    id={`review-${review.id}`}
                    rows={2}
                    value={review.editorVersion}
                    readOnly={review.status !== 'open'}
                    onChange={(event) => update(review.id, { editorVersion: event.target.value })}
                  />
                </div>
              </div>
              <label className="comment-label" htmlFor={`comment-${review.id}`}>
                Комментарий
              </label>
              <Input
                id={`comment-${review.id}`}
                placeholder="Объясните правку или причину отклонения…"
                value={review.comment}
                readOnly={review.status !== 'open'}
                onChange={(event) => update(review.id, { comment: event.target.value })}
              />
              <div className="review-actions">
                <span className="muted">Анна Смирнова · переводчик</span>
                {review.status === 'open' && (
                  <div>
                    <Button icon={<CloseOutlined />} onClick={() => resolve(review, 'rejected')}>
                      Вернуть на доработку
                    </Button>
                    <Button
                      type="primary"
                      aria-label="Одобрить"
                      icon={<CheckOutlined />}
                      onClick={() => resolve(review, 'approved')}
                    >
                      Одобрить
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))
        ) : (
          <section className="surface empty-surface">
            <Empty description="Все правки проверены. Отличная работа!" />
          </section>
        )}
      </div>
    </>
  );
}
