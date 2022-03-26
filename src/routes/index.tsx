import { lazy, FC } from 'react';
import Dashboard from '@/pages/dashboard';
import LoginPage from '@/pages/login';
import LayoutPage from '@/pages/layout';
import { Navigate, RouteObject } from 'react-router';
import WrapperRouteComponent from './config';
import { useRoutes } from 'react-router-dom';
import { Ro } from '@/interface/route.interface';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
const Documentation = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/doucumentation'));
const Guide = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/guide'));
const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route'));
const FormPage = lazy(() => import(/* webpackChunkName: "form'"*/ '@/pages/components/form'));
const TablePage = lazy(() => import(/* webpackChunkName: "table'"*/ '@/pages/components/table'));
const SearchPage = lazy(() => import(/* webpackChunkName: "search'"*/ '@/pages/components/search'));
const TabsPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs'));
const AsidePage = lazy(() => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside'));
const RadioCardsPage = lazy(() => import(/* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'));
const BusinessBasicPage = lazy(() => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic'));
const BusinessWithSearchPage = lazy(() => import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search'));
const BusinessWithAsidePage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside'));
const BusinessWithRadioCardsPage = lazy(
  () => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'),
);
const BusinessWithTabsPage = lazy(() => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs'));

export const routeList: Ro[] = [
  {
    path: '/login',
    name: '登录',
    key: 'k-login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/',
    name: '首页',
    key: 'k-root',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    children: [
      {
        path: '',
        name: 'to-仪表盘',
        key: 'k-to-dashboard',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        name: '仪表盘',
        key: 'k-dashboard',
        element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
      },
      {
        path: 'documentation',
        name: '文档',
        key: 'k-documentation',
        element: <WrapperRouteComponent element={<Documentation />} titleId="title.documentation" />,
      },
      {
        path: 'guide',
        name: '指南',
        key: 'k-guide',
        element: <WrapperRouteComponent element={<Guide />} titleId="title.guide" />,
      },
      {
        path: 'permission/route',
        name: '路由权限',
        key: 'k-route-permission',
        element: <WrapperRouteComponent element={<RoutePermission />} titleId="title.permission.route" auth />,
      },
      {
        path: 'component/form',
        name: '表单',
        key: 'k-form',
        element: <WrapperRouteComponent element={<FormPage />} titleId="title.account" />,
      },
      {
        path: 'component/table',
        name: '表格',
        key: 'k-table',
        element: <WrapperRouteComponent element={<TablePage />} titleId="title.account" />,
      },
      {
        path: 'component/search',
        name: '搜索',
        key: 'k-search',
        element: <WrapperRouteComponent element={<SearchPage />} titleId="title.account" />,
      },
      {
        path: 'component/tabs',
        name: '标签页',
        key: 'k-tabs',
        element: <WrapperRouteComponent element={<TabsPage />} titleId="title.account" />,
      },
      {
        path: 'component/aside',
        name: '侧边栏',
        key: 'k-aside',
        element: <WrapperRouteComponent element={<AsidePage />} titleId="title.account" />,
      },
      {
        path: 'component/radio-cards',
        name: '卡片',
        key: 'k-radio-cards',
        element: <WrapperRouteComponent element={<RadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/basic',
        name: '基础',
        key: 'k-basic',
        element: <WrapperRouteComponent element={<BusinessBasicPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-search',
        name: '带搜索',
        key: 'k-with-search',
        element: <WrapperRouteComponent element={<BusinessWithSearchPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-aside',
        name: '带侧边栏',
        key: 'k-with-aside',
        element: <WrapperRouteComponent element={<BusinessWithAsidePage />} titleId="title.account" />,
      },
      {
        path: 'business/with-radio-cards',
        name: '带卡片',
        key: 'k-with-radio-cards',
        element: <WrapperRouteComponent element={<BusinessWithRadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-tabs',
        name: '带标签页',
        key: 'k-with-tabs',
        element: <WrapperRouteComponent element={<BusinessWithTabsPage />} titleId="title.account" />,
      },
      {
        path: '*',
        name: '404',
        key: 'k-404',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
