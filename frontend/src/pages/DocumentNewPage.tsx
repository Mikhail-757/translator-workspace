import { Link, useNavigate } from 'react-router-dom';
import { App, Button, Form, Input, Select } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import { useWorkspace } from '../app/store';
import { languageOptions, PageHeading } from '../shared/ui';

export function DocumentNewPage() {
  const { setDocuments } = useWorkspace();
  const navigate = useNavigate();
  const { message } = App.useApp();
  return (
    <>
      <Link to="/" className="back-link">
        <ArrowLeftOutlined /> К документам
      </Link>
      <PageHeading
        eyebrow="НОВЫЙ ПРОЕКТ"
        title="Начнём с оригинала"
        description="Добавьте документ и выберите языковую пару для перевода."
      />
      <div className="new-document-layout">
        <section className="surface form-surface">
          <h2>
            <FileTextOutlined /> Данные документа
          </h2>
          <Form
            layout="vertical"
            requiredMark={false}
            initialValues={{ sourceLang: 'en', targetLang: 'ru', domain: 'Продукт' }}
            onFinish={(values: {
              title: string;
              sourceLang: string;
              targetLang: string;
              domain: string;
              text: string;
            }) => {
              const id = Date.now();
              // ЛР1: введённый текст — один демонстрационный сегмент. Сегментация появится в backend ЛР2.
              setDocuments((documents) => [
                {
                  id,
                  title: values.title.trim(),
                  sourceLang: values.sourceLang,
                  targetLang: values.targetLang,
                  domain: values.domain,
                  status: 'draft',
                  progress: 0,
                  updatedAt: new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow' }).format(
                    new Date(),
                  ),
                  segments: [
                    {
                      id,
                      position: 1,
                      sourceText: values.text.trim(),
                      targetText: '',
                      status: 'pending',
                      suggestion: null,
                    },
                  ],
                },
                ...documents,
              ]);
              message.success('Документ создан в демо-режиме');
              navigate(`/documents/${id}`);
            }}
          >
            <Form.Item
              label="Название документа"
              name="title"
              rules={[{ required: true, whitespace: true, message: 'Введите название документа' }]}
            >
              <Input placeholder="Например, руководство пользователя" maxLength={150} />
            </Form.Item>
            <div className="form-grid">
              <Form.Item label="Язык оригинала" name="sourceLang">
                <Select options={languageOptions} />
              </Form.Item>
              <Form.Item
                label="Язык перевода"
                name="targetLang"
                dependencies={['sourceLang']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      return value !== getFieldValue('sourceLang')
                        ? Promise.resolve()
                        : Promise.reject(new Error('Выберите другой язык перевода'));
                    },
                  }),
                ]}
              >
                <Select options={languageOptions} />
              </Form.Item>
            </div>
            <Form.Item label="Тематика" name="domain">
              <Select
                options={['Продукт', 'Технический', 'Юридический', 'Безопасность'].map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Текст оригинала"
              name="text"
              extra="На этом этапе текст добавляется как один сегмент. Автоматическая разбивка появится в ЛР2."
              rules={[{ required: true, whitespace: true, message: 'Вставьте текст для перевода' }]}
            >
              <Input.TextArea
                rows={7}
                maxLength={20000}
                showCount
                placeholder="Вставьте сюда текст документа…"
              />
            </Form.Item>
            <div className="form-actions">
              <Link to="/">
                <Button>Отмена</Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Перейти к переводу
              </Button>
            </div>
          </Form>
        </section>
        <aside className="help-panel">
          <span className="eyebrow">ХОРОШЕЕ НАЧАЛО</span>
          <h3>
            Точность начинается
            <br />с контекста.
          </h3>
          <p>
            Понятное название и тематика помогут команде быстрее находить документ и нужные
            формулировки.
          </p>
          <hr />
          <strong>Что дальше?</strong>
          <ol>
            <li>Переведите текст в редакторе</li>
            <li>Сверьтесь с памятью и глоссарием</li>
            <li>Отправьте перевод на проверку</li>
          </ol>
        </aside>
      </div>
    </>
  );
}
