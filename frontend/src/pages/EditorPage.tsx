import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, App, Button, Empty, Input, Progress, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  CheckOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useWorkspace } from '../app/store';
import { LanguagePair, PageHeading, StatusTag } from '../shared/ui';

export function EditorPage() {
  const { id } = useParams();
  const { documents, setDocuments, terms } = useWorkspace();
  const document = documents.find((item) => item.id === Number(id));
  const { message } = App.useApp();
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [activeId, setActiveId] = useState<number | null>(null);
  if (!document)
    return (
      <section className="surface empty-surface">
        <Empty description="Документ не найден. Новые демодокументы доступны до перезагрузки страницы." />
        <Link to="/">
          <Button type="primary">К списку документов</Button>
        </Link>
      </section>
    );
  const current =
    document.segments.find((segment) => segment.id === activeId) || document.segments[0];
  const readOnly = document.status !== 'draft';
  const getText = (segment: typeof current) => drafts[segment.id] ?? segment.targetText;
  const completed = document.segments.filter((segment) => getText(segment).trim()).length;
  const dirty = document.segments.some((segment) => getText(segment) !== segment.targetText);
  const save = (submit = false) => {
    if (submit && completed !== document.segments.length) {
      message.warning('Сначала переведите все сегменты документа');
      return;
    }
    setDocuments((items) =>
      items.map((item) =>
        item.id !== document.id
          ? item
          : {
              ...item,
              status: submit ? 'in_review' : item.status,
              progress: Math.round((completed / item.segments.length) * 100),
              segments: item.segments.map((segment) => ({
                ...segment,
                targetText: getText(segment).trim(),
                status: getText(segment).trim() ? 'translated' : 'pending',
              })),
            },
      ),
    );
    setDrafts({});
    message.success(
      submit
        ? 'Документ отправлен на проверку в демо-режиме'
        : 'Переводы сохранены до обновления страницы',
    );
  };
  const relevantTerms = terms.filter((term) =>
    current?.sourceText.toLowerCase().includes(term.sourceTerm.toLowerCase()),
  );
  return (
    <>
      <Link to="/" aria-label="Все документы" className="back-link">
        <ArrowLeftOutlined /> Все документы
      </Link>
      <PageHeading
        eyebrow="РЕДАКТОР ПЕРЕВОДА"
        title={document.title}
        description="Сохраняйте смысл. Находите точные формулировки."
        action={
          <Button
            type="primary"
            icon={<SendOutlined />}
            disabled={readOnly}
            onClick={() => save(true)}
          >
            Отправить на проверку
          </Button>
        }
      />
      <div className="editor-meta">
        <LanguagePair source={document.sourceLang} target={document.targetLang} />
        <StatusTag status={document.status} />
        <span className="editor-save-state">
          {readOnly
            ? 'Режим просмотра'
            : dirty
              ? 'Есть несохранённые изменения'
              : 'Все изменения сохранены'}
        </span>
        <div className="editor-overall">
          <span>
            {completed} из {document.segments.length} переведено
          </span>
          <Progress
            percent={Math.round((completed / document.segments.length) * 100)}
            showInfo={false}
          />
        </div>
      </div>
      {readOnly && (
        <Alert
          className="editor-alert"
          type="info"
          showIcon
          message={
            document.status === 'approved'
              ? 'Документ одобрен. Переводы доступны для просмотра.'
              : 'Документ на проверке. Изменения доступны редактору на экране правок.'
          }
        />
      )}
      <div className="editor-workspace">
        <section className="segments-panel">
          <div className="segment-columns">
            <span>ОРИГИНАЛ · {document.sourceLang.toUpperCase()}</span>
            <span>ПЕРЕВОД · {document.targetLang.toUpperCase()}</span>
          </div>
          {document.segments.map((segment) => (
            <article
              key={segment.id}
              className={`segment-row ${current?.id === segment.id ? 'selected' : ''}`}
              onFocus={() => setActiveId(segment.id)}
            >
              <div className="source-segment">
                <span className="segment-number">{String(segment.position).padStart(2, '0')}</span>
                <p>{segment.sourceText}</p>
              </div>
              <div className="target-segment">
                <div className="segment-status">
                  <StatusTag
                    status={
                      getText(segment).trim()
                        ? segment.status === 'approved'
                          ? 'approved'
                          : 'translated'
                        : 'pending'
                    }
                  />
                  {!readOnly && getText(segment).trim() && <CheckOutlined />}
                </div>
                <Input.TextArea
                  aria-label={`Перевод сегмента ${segment.position}`}
                  autoSize={{ minRows: 2, maxRows: 8 }}
                  value={getText(segment)}
                  placeholder="Введите перевод…"
                  readOnly={readOnly}
                  onChange={(event) =>
                    setDrafts((values) => ({ ...values, [segment.id]: event.target.value }))
                  }
                />
              </div>
            </article>
          ))}
          <div className="editor-bottom">
            <span>Демоданные · сохранение в текущей сессии</span>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => save()}
              disabled={readOnly || !dirty}
            >
              Сохранить переводы
            </Button>
          </div>
        </section>
        <aside className="editor-assistance">
          <section className="surface suggestion-panel">
            <div className="panel-label">
              <BookOutlined /> Память переводов
            </div>
            <p className="muted">Подсказки для сегмента {current?.position}</p>
            {current?.suggestion ? (
              <>
                <Tag color="green">Совпадение {current.suggestion.score}%</Tag>
                <p className="suggestion-source">{current.suggestion.sourceText}</p>
                <p className="suggestion-target">{current.suggestion.targetText}</p>
                <small className="muted">Источник: {current.suggestion.sourceDocTitle}</small>
                <Button
                  block
                  icon={<ArrowRightOutlined />}
                  disabled={readOnly}
                  onClick={() => {
                    setDrafts((values) => ({
                      ...values,
                      [current.id]: current.suggestion!.targetText,
                    }));
                    message.success('Подсказка вставлена. Сохраните перевод.');
                  }}
                >
                  Использовать перевод
                </Button>
              </>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Нет совпадений для этого сегмента"
              />
            )}
          </section>
          <section className="surface suggestion-panel">
            <div className="panel-label">
              <BookOutlined /> Термины в сегменте
            </div>
            {relevantTerms.length ? (
              relevantTerms.map((term) => (
                <div className="term-hint" key={term.id}>
                  <strong>{term.sourceTerm}</strong>
                  <span>{term.targetTerm}</span>
                </div>
              ))
            ) : (
              <p className="muted">Термины из глоссария не найдены.</p>
            )}
            <Link to="/glossary" className="resource-link">
              Открыть глоссарий <ArrowRightOutlined />
            </Link>
          </section>
          <p className="assistance-note">
            Подсказки взяты из демонстрационной памяти переводов. Подключение AI — в следующих
            этапах.
          </p>
        </aside>
      </div>
    </>
  );
}
