import { Link, useNavigate } from 'react-router-dom';
import { App, Button, Form, Input, Select, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useWorkspace } from '../app/store';
import type { Role } from '../shared/types';

const passwordRules = [
  { required: true, message: 'Введите пароль' },
  { min: 8, message: 'Не менее 8 символов' },
];
export function LoginPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { setUser } = useWorkspace();
  return (
    <div className="auth-card">
      <div className="eyebrow">С ВОЗВРАЩЕНИЕМ</div>
      <Typography.Title>Рады видеть вас</Typography.Title>
      <p className="auth-subtitle">Войдите в кабинет и продолжите работу.</p>
      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={(values: { email: string }) => {
          setUser((user) => ({ ...user, email: values.email }));
          message.success('Вы вошли в демонстрационный кабинет');
          navigate('/');
        }}
      >
        <Form.Item
          label="Рабочая почта"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Проверьте адрес почты' },
          ]}
        >
          <Input placeholder="name@company.ru" autoComplete="email" />
        </Form.Item>
        <Form.Item label="Пароль" name="password" rules={passwordRules}>
          <Input.Password placeholder="Не менее 8 символов" autoComplete="current-password" />
        </Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
        >
          Войти в кабинет
        </Button>
      </Form>
      <div className="auth-divider">или познакомьтесь с приложением</div>
      <Button block onClick={() => navigate('/')}>
        Открыть демо без входа
      </Button>
      <p className="auth-switch">
        Ещё нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
export function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useWorkspace();
  const { message } = App.useApp();
  return (
    <div className="auth-card">
      <div className="eyebrow">НАЧНИТЕ РАБОТУ ВМЕСТЕ</div>
      <Typography.Title>Ваше место в команде</Typography.Title>
      <p className="auth-subtitle">Создайте демонстрационный профиль.</p>
      <Form
        layout="vertical"
        requiredMark={false}
        initialValues={{ role: 'translator' }}
        onFinish={(values: { name: string; email: string; role: Role }) => {
          setUser({ id: 1, name: values.name, email: values.email, role: values.role });
          message.success('Демопрофиль создан. Теперь можно войти.');
          navigate('/login');
        }}
      >
        <Form.Item
          label="Имя и фамилия"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Введите имя' }]}
        >
          <Input placeholder="Анна Смирнова" autoComplete="name" maxLength={80} />
        </Form.Item>
        <Form.Item
          label="Рабочая почта"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Проверьте адрес почты' },
          ]}
        >
          <Input placeholder="name@company.ru" autoComplete="email" />
        </Form.Item>
        <div className="form-grid">
          <Form.Item label="Пароль" name="password" rules={passwordRules}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Повторите пароль"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Повторите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || value === getFieldValue('password')
                    ? Promise.resolve()
                    : Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </div>
        <Form.Item label="Ваша роль" name="role">
          <Select
            options={[
              { value: 'translator', label: 'Переводчик' },
              { value: 'editor', label: 'Редактор' },
            ]}
          />
        </Form.Item>
        <Button block type="primary" htmlType="submit">
          Создать демопрофиль
        </Button>
      </Form>
      <p className="auth-switch">
        Уже с нами? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
