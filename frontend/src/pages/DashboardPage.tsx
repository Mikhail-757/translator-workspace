import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { Button, Empty, Input, Progress, Segmented, Statistic, Table, Tag } from 'antd';
import { useWorkspace } from '../app/store';
import { LanguagePair, PageHeading, StatusTag } from '../shared/ui';
import type { Doc } from '../shared/types';

export function DashboardPage() {
  const { documents, terms, user, memory } = useWorkspace();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Все документы');
  const [search, setSearch] = useState('');
  const filtered = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'Все документы' ||
        doc.status ===
          (filter === 'В работе' ? 'draft' : filter === 'На проверке' ? 'in_review' : 'approved')),
  );
  const translated = documents.reduce(
    (count, doc) => count + doc.segments.filter((segment) => segment.targetText.trim()).length,
    0,
  );
  const stats = [
    {
      title: 'Мои документы',
      value: documents.length,
      icon: <FileTextOutlined />,
      detail: `${documents.filter((d) => d.status === 'draft').length} в работе`,
      color: 'green',
    },
    {
      title: 'Переведено сегментов',
      value: translated,
      icon: <TranslationOutlined />,
      detail: 'Каждый сегмент имеет значение',
      color: 'blue',
    },
    {
      title: 'В памяти переводов',
      value: memory.length,
      icon: <CheckCircleOutlined />,
      detail: 'Проверены и готовы к работе',
      color: 'orange',
    },
    {
      title: 'Терминов в глоссарии',
      value: terms.length,
      icon: <BookOutlined />,
      detail: 'Единый язык вашей команды',
      color: 'purple',
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="ВАШЕ РАБОЧЕЕ ПРОСТРАНСТВО"
        title={`С возвращением, ${user.name.split(' ')[0]}`}
        description="Всё для точного перевода — в одном месте."
        action={
          <Link to="/documents/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Новый документ
            </Button>
          </Link>
        }
      />
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-top">
              <span>{stat.title}</span>
              <span className={`stat-icon ${stat.color}`}>{stat.icon}</span>
            </div>
            <Statistic value={stat.value} />
            <div className="stat-detail">{stat.detail}</div>
          </div>
        ))}
      </div>
      <section className="documents-section">
        <div className="section-heading">
          <div>
            <h2>
              Мои документы <span className="count-pill">{documents.length}</span>
            </h2>
            <p>Продолжите перевод или начните новый проект.</p>
          </div>
          <Tag bordered={false} className="quiet-tag">
            Октябрь 2026
          </Tag>
        </div>
        <div className="table-toolbar">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={['Все документы', 'В работе', 'На проверке', 'Одобрено']}
          />
          <Input
            aria-label="Поиск документов"
            prefix={<SearchOutlined />}
            placeholder="Найти документ…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
          />
        </div>
        <Table<Doc>
          className="document-table"
          rowKey="id"
          dataSource={filtered}
          pagination={false}
          scroll={{ x: 790 }}
          locale={{ emptyText: <Empty description="Документы не найдены" /> }}
          columns={[
            {
              title: 'Название документа',
              dataIndex: 'title',
              render: (title: string, doc) => (
                <Link to={`/documents/${doc.id}`} className="document-name">
                  <span className={`doc-icon ${doc.status === 'approved' ? 'approved' : ''}`}>
                    <FileTextOutlined />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>
                      {doc.domain} · {doc.segments.length} сегментов
                    </small>
                  </span>
                </Link>
              ),
            },
            {
              title: 'Языки',
              render: (_, doc) => <LanguagePair source={doc.sourceLang} target={doc.targetLang} />,
            },
            {
              title: 'Статус',
              dataIndex: 'status',
              render: (status: Doc['status']) => <StatusTag status={status} />,
            },
            {
              title: 'Прогресс',
              dataIndex: 'progress',
              width: 150,
              render: (value: number) => (
                <div className="progress-cell">
                  <Progress
                    percent={value}
                    showInfo={false}
                    strokeColor={value === 100 ? '#78a994' : '#cfad6b'}
                    size="small"
                  />
                  <span>{value}%</span>
                </div>
              ),
            },
            { title: 'Обновлён', dataIndex: 'updatedAt', className: 'muted-cell' },
            {
              title: '',
              width: 44,
              render: (_, doc) => (
                <Button
                  type="text"
                  aria-label={`Открыть ${doc.title}`}
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                />
              ),
            },
          ]}
        />
        <div className="table-footer">
          <span>
            Показано {filtered.length} из {documents.length} документов
          </span>
          <span>
            Ваша следующая точная формулировка — здесь <span className="tiny-star">✦</span>
          </span>
        </div>
      </section>
      <div className="resource-grid">
        <Link to="/tm" className="resource-card">
          <span className="resource-icon">
            <ReadMemoryIcon />
          </span>
          <div>
            <h3>Не переводите одно и то же дважды</h3>
            <p>Используйте одобренные переводы из общей памяти.</p>
            <span className="resource-link">
              Открыть память переводов <ArrowRightOutlined />
            </span>
          </div>
          <span className="resource-decoration">Aa</span>
        </Link>
        <Link to="/glossary" className="resource-card glossary-resource">
          <span className="resource-icon">
            <BookOutlined />
          </span>
          <div>
            <h3>Одно понятие — один термин</h3>
            <p>Сохраняйте единый стиль во всех документах команды.</p>
            <span className="resource-link">
              Перейти в глоссарий <ArrowRightOutlined />
            </span>
          </div>
        </Link>
      </div>
      <div className="workspace-note">
        <span className="small-green-dot" />
        Хорошие переводы становятся общим опытом.
      </div>
    </>
  );
}
function ReadMemoryIcon() {
  return <TranslationOutlined />;
}
