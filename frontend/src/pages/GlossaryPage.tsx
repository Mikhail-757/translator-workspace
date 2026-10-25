import { useState } from 'react';
import { App, Button, Empty, Form, Input, Modal, Popconfirm, Select, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useWorkspace } from '../app/store';
import { PageHeading } from '../shared/ui';
import type { Term } from '../shared/types';

type TermValues = Pick<Term, 'sourceTerm' | 'targetTerm' | 'domain'>;
export function GlossaryPage() {
  const { terms, setTerms, user } = useWorkspace();
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Term | null>(null);
  const [form] = Form.useForm<TermValues>();
  const { message } = App.useApp();
  const open = (term: Term | null) => {
    setEditing(term);
    form.resetFields();
    form.setFieldsValue(term || { sourceTerm: '', targetTerm: '', domain: 'Продукт' });
    setModalOpen(true);
  };
  const filtered = terms.filter(
    (term) =>
      `${term.sourceTerm} ${term.targetTerm}`.toLowerCase().includes(query.trim().toLowerCase()) &&
      (domain === 'all' || term.domain === domain),
  );
  const save = (values: TermValues) => {
    const normalized = {
      ...values,
      sourceTerm: values.sourceTerm.trim(),
      targetTerm: values.targetTerm.trim(),
    };
    if (
      terms.some(
        (term) =>
          term.id !== editing?.id &&
          term.sourceTerm.toLowerCase() === normalized.sourceTerm.toLowerCase() &&
          term.domain === values.domain,
      )
    ) {
      form.setFields([{ name: 'sourceTerm', errors: ['Такой термин в этой тематике уже есть'] }]);
      return;
    }
    setTerms((items) =>
      editing
        ? items.map((term) => (term.id === editing.id ? { ...term, ...normalized } : term))
        : [...items, { ...normalized, id: Date.now(), addedBy: user.name }],
    );
    setModalOpen(false);
    message.success(editing ? 'Термин обновлён' : 'Термин добавлен в демоглоссарий');
  };
  return (
    <>
      <PageHeading
        eyebrow="ЕДИНЫЙ ЯЗЫК КОМАНДЫ"
        title="Глоссарий"
        description="Согласованные термины для последовательных переводов."
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => open(null)}>
            Добавить термин
          </Button>
        }
      />
      <section className="surface">
        <div className="search-toolbar">
          <Input
            aria-label="Поиск терминов"
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Найти термин или перевод…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            allowClear
          />
          <Select
            aria-label="Фильтр тематики"
            value={domain}
            onChange={setDomain}
            options={[
              { value: 'all', label: 'Все тематики' },
              ...Array.from(new Set(terms.map((term) => term.domain))).map((value) => ({
                value,
                label: value,
              })),
            ]}
          />
        </div>
        <Table<Term>
          rowKey="id"
          dataSource={filtered}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 700 }}
          locale={{ emptyText: <Empty description="Термины не найдены" /> }}
          columns={[
            {
              title: 'Термин · EN',
              dataIndex: 'sourceTerm',
              render: (value: string) => <strong className="term-source">{value}</strong>,
            },
            { title: 'Перевод · RU', dataIndex: 'targetTerm' },
            {
              title: 'Тематика',
              dataIndex: 'domain',
              render: (value: string) => <Tag className="domain-tag">{value}</Tag>,
            },
            { title: 'Добавил', dataIndex: 'addedBy', className: 'muted-cell' },
            {
              title: 'Действия',
              render: (_, term) => (
                <div className="row-actions">
                  <Button
                    type="text"
                    aria-label={`Изменить ${term.sourceTerm}`}
                    icon={<EditOutlined />}
                    onClick={() => open(term)}
                  />
                  <Popconfirm
                    title="Удалить термин?"
                    description="Он исчезнет из текущей демосессии."
                    okText="Удалить"
                    cancelText="Отмена"
                    onConfirm={() => {
                      setTerms((items) => items.filter((item) => item.id !== term.id));
                      message.success('Термин удалён');
                    }}
                  >
                    <Button
                      type="text"
                      danger
                      aria-label={`Удалить ${term.sourceTerm}`}
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </div>
              ),
            },
          ]}
        />
      </section>
      <div className="workspace-note">
        {terms.length} терминов · Изменения доступны до перезагрузки страницы
      </div>
      <Modal
        title={editing ? 'Изменить термин' : 'Новый термин'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? 'Сохранить' : 'Добавить'}
        cancelText="Отмена"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" requiredMark={false} onFinish={save}>
          <Form.Item
            label="Термин на английском"
            name="sourceTerm"
            rules={[{ required: true, whitespace: true, message: 'Введите термин' }]}
          >
            <Input maxLength={120} />
          </Form.Item>
          <Form.Item
            label="Перевод на русский"
            name="targetTerm"
            rules={[{ required: true, whitespace: true, message: 'Введите перевод' }]}
          >
            <Input maxLength={160} />
          </Form.Item>
          <Form.Item label="Тематика" name="domain" rules={[{ required: true }]}>
            <Select
              options={['Продукт', 'Технический', 'Юридический', 'Безопасность'].map((value) => ({
                value,
                label: value,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
