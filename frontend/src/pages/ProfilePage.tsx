import { Link } from 'react-router-dom';
import { Alert, App, Avatar, Button, Form, Input, Result, Select } from 'antd';
import { useWorkspace } from '../app/store';
import { PageHeading } from '../shared/ui';
import type { Role } from '../shared/types';

export function ProfilePage() {
  const { user, setUser } = useWorkspace();
  const { message } = App.useApp();
  return (
    <>
      <PageHeading
        eyebrow="УЧАСТНИК КОМАНДЫ"
        title="Мой профиль"
        description="Как вас видят коллеги в рабочем пространстве."
      />
      <section className="surface profile-surface">
        <div className="profile-heading">
          <Avatar size={64} style={{ backgroundColor: '#e7eee4', color: '#24695b' }}>
            {user.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </Avatar>
          <div>
            <h2>{user.name}</h2>
            <p className="muted">Команда Lexis · демопрофиль</p>
          </div>
        </div>
        <Form
          layout="vertical"
          requiredMark={false}
          initialValues={user}
          onFinish={(values: { name: string; email: string; role: Role }) => {
            setUser({ ...user, ...values, name: values.name.trim() });
            message.success('Демопрофиль обновлён');
          }}
        >
          <Form.Item
            label="Имя и фамилия"
            name="name"
            rules={[{ required: true, whitespace: true, message: 'Введите имя' }]}
          >
            <Input maxLength={80} />
          </Form.Item>
          <Form.Item
            label="Рабочая почта"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Проверьте email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Роль в демо" name="role">
            <Select
              options={[
                { value: 'translator', label: 'Переводчик' },
                { value: 'editor', label: 'Редактор' },
              ]}
            />
          </Form.Item>
          <Alert
            type="info"
            showIcon
            message="Роль меняет подпись профиля. Проверка прав и настоящая авторизация появятся в ЛР4."
          />
          <div className="form-actions">
            <Link to="/login">
              <Button>К экрану входа</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              Сохранить профиль
            </Button>
          </div>
        </Form>
      </section>
    </>
  );
}
export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Страница не найдена"
      subTitle="Проверьте адрес или вернитесь к документам."
      extra={
        <Link to="/">
          <Button type="primary">На главную</Button>
        </Link>
      }
    />
  );
}
