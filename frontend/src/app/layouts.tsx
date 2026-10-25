import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Avatar, Button, Drawer, Layout, Tooltip } from 'antd';
import {
  AppstoreOutlined,
  BookOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  MenuOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  UserOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useWorkspace } from './store';

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Lexis — на главную">
      <span className="brand-mark">
        L<span />
      </span>
      <span>
        lexis<span className="brand-period">.</span>
      </span>
    </Link>
  );
}
const navigation = [
  { to: '/', label: 'Обзор', icon: <AppstoreOutlined /> },
  { to: '/tm', label: 'Память переводов', icon: <ReadOutlined /> },
  { to: '/glossary', label: 'Глоссарий', icon: <BookOutlined /> },
  { to: '/reviews', label: 'Правки редактора', icon: <CheckSquareOutlined /> },
];
export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, reviews } = useWorkspace();
  const { pathname } = useLocation();
  const openReviews = reviews.filter((review) => review.status === 'open').length;
  const section =
    navigation.find((item) => item.to === pathname)?.label ||
    (pathname === '/profile' ? 'Мой профиль' : 'Документы');
  const sidebar = (
    <div className="sidebar-inner">
      <Brand />
      <div className="workspace-label">
        <span className="workspace-icon">L</span>
        <div>
          Команда Lexis<small>Рабочее пространство</small>
        </div>
        <span className="workspace-chevron">⌄</span>
      </div>
      <div className="nav-caption">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <nav aria-label="Основная навигация">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.to === '/reviews' && openReviews > 0 && (
              <span className="nav-count">{openReviews}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <Link className="sidebar-create" to="/documents/new" onClick={() => setMenuOpen(false)}>
        <PlusOutlined /> Новый документ
      </Link>
      <div className="sidebar-bottom">
        <div className="team-note">
          <span className="note-icon">
            <ReadOutlined />
          </span>
          <strong>Знания остаются в команде</strong>
          <p>
            Каждый перевод — вклад
            <br />в общую память.
          </p>
        </div>
        <Link
          to="/profile"
          aria-label="Мой профиль"
          className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          <UserOutlined />
          <span>Мой профиль</span>
        </Link>
        <Link to="/login" className="sidebar-user" onClick={() => setMenuOpen(false)}>
          <Avatar size={35} style={{ background: '#e8e3d9', color: '#69614f' }}>
            {user.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </Avatar>
          <div>
            <strong>{user.name}</strong>
            <small>{user.role === 'translator' ? 'Переводчик' : 'Редактор'} · демо</small>
          </div>
          <span>↗</span>
        </Link>
      </div>
    </div>
  );
  return (
    <Layout className="app-layout">
      <aside className="desktop-sidebar">{sidebar}</aside>
      <Drawer
        title="Рабочее пространство"
        placement="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        width={272}
        styles={{ body: { padding: 0 } }}
      >
        {sidebar}
      </Drawer>
      <Layout className="main-layout">
        <header className="topbar">
          <div className="breadcrumbs">
            <Button
              className="menu-toggle"
              type="text"
              icon={<MenuOutlined />}
              aria-label="Открыть меню"
              onClick={() => setMenuOpen(true)}
            />
            <span className="breadcrumb-home">
              <FileTextOutlined /> Рабочее пространство
            </span>
            <span className="breadcrumb-slash">/</span>
            <span>{section}</span>
          </div>
          <div className="topbar-right">
            <span className="demo-badge">
              <span />
              Демо-режим
            </span>
            <Tooltip title="Учебный интерфейс. Данные хранятся в памяти и сбрасываются при обновлении страницы.">
              <Button type="text" aria-label="О демо-режиме" icon={<QuestionCircleOutlined />} />
            </Tooltip>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>
            LEXIS WORKSPACE <span className="footer-dot">·</span> Пространство точных переводов
          </span>
          <span>
            Лабораторная работа №1 <ArrowUpOutlined rotate={45} />
          </span>
        </footer>
      </Layout>
    </Layout>
  );
}
export function AuthLayout() {
  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div className="auth-story-content">
          <span className="auth-pill">ДЛЯ КОМАНД, КОТОРЫЕ РАБОТАЮТ СО СМЫСЛОМ</span>
          <h1>
            Хороший перевод
            <br />
            начинается
            <br />с общего языка<span>.</span>
          </h1>
          <p>
            Документы, терминология и опыт команды —<br />в одном рабочем пространстве.
          </p>
          <div className="translation-illustration">
            <div>
              <small>EN · ОРИГИНАЛ</small>
              <p>
                A shared language.
                <br />A stronger team.
              </p>
            </div>
            <span>↗</span>
            <div>
              <small>RU · ПЕРЕВОД</small>
              <p>
                Общий язык.
                <br />
                Сильная команда.
              </p>
            </div>
          </div>
        </div>
        <span className="auth-bottom">Единая память. Точные слова. Слаженная работа.</span>
      </aside>
      <main className="auth-main">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        <Outlet />
        <p className="auth-disclaimer">Учебный проект · Все действия выполняются на демоданных</p>
      </main>
    </div>
  );
}
