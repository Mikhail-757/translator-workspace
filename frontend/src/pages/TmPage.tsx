import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Empty, Input, Select, Table, Tag } from 'antd';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useWorkspace } from '../app/store';
import { LanguagePair, PageHeading } from '../shared/ui';
import type { TmEntry } from '../shared/types';

export function TmPage() {
  const { memory, documents } = useWorkspace();
  const [query, setQuery] = useState('');
  const [pair, setPair] = useState('all');
  const filtered = memory.filter(
    (entry) =>
      `${entry.sourceText} ${entry.targetText}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (pair === 'all' || `${entry.sourceLang}-${entry.targetLang}` === pair),
  );
  return (
    <>
      <PageHeading
        eyebrow="ОБЩИЙ ОПЫТ КОМАНДЫ"
        title="Память переводов"
        description="Проверенные формулировки, к которым хочется возвращаться."
        action={
          <Tag className="summary-tag" icon={<CheckCircleOutlined />}>
            {memory.length} одобренных переводов
          </Tag>
        }
      />
      <div className="info-banner">
        <span className="banner-symbol">Aa</span>
        <div>
          <strong>Хороший перевод работает больше одного раза.</strong>
          <p>Найдите фразу на языке оригинала или перевода и используйте опыт команды.</p>
        </div>
      </div>
      <section className="surface">
        <div className="search-toolbar">
          <Input
            aria-label="Поиск в памяти переводов"
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Введите слово или фразу…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            allowClear
          />
          <Select
            aria-label="Языковая пара"
            value={pair}
            onChange={setPair}
            options={[
              { value: 'all', label: 'Все языковые пары' },
              { value: 'en-ru', label: 'EN → RU' },
              { value: 'de-ru', label: 'DE → RU' },
            ]}
          />
        </div>
        <Table<TmEntry>
          rowKey="id"
          dataSource={filtered}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          scroll={{ x: 780 }}
          locale={{
            emptyText: (
              <Empty description="Совпадений не найдено. Попробуйте другую фразу или языковую пару." />
            ),
          }}
          columns={[
            {
              title: 'Оригинал',
              dataIndex: 'sourceText',
              width: '29%',
              render: (value: string) => <span className="source-text">{value}</span>,
            },
            { title: 'Перевод', dataIndex: 'targetText', width: '29%' },
            {
              title: 'Языки',
              render: (_, entry) => (
                <LanguagePair source={entry.sourceLang} target={entry.targetLang} />
              ),
            },
            {
              title: 'Тематика',
              dataIndex: 'domain',
              render: (value: string) => <Tag>{value}</Tag>,
            },
            {
              title: 'Источник',
              dataIndex: 'sourceDocTitle',
              render: (value: string, entry) => {
                const doc = documents.find((item) => item.title === value);
                return (
                  <div className="source-reference">
                    {doc ? <Link to={`/documents/${doc.id}`}>{value}</Link> : value}
                    <small>{entry.updatedAt}</small>
                  </div>
                );
              },
            },
          ]}
        />
      </section>
    </>
  );
}
