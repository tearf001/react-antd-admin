import { FC, useEffect, useCallback, useState, Suspense } from 'react';
import { Layout, Drawer } from 'antd';
import './index.less';
import MenuComponent from './menu';
import HeaderComponent from './header';
import { getGlobalState } from '@/utils/getGloabal';
// import TagsView from './tagView';
import { getMenuList } from '@/api/layout.api';
import { MenuList, MenuChild } from '@/interface/layout/menu.interface';
import { useGuide } from '../guide/useGuide';
import { Outlet, useLocation } from 'react-router';
import { setUserItem } from '@/stores/user.store';
import { batch, useDispatch, useSelector } from 'react-redux';
import { getFirstPathCode } from '@/utils/getFirstPathCode';
import TabRoute from '@/pages/layout/tagView/PersistedTabs';
import { matchRoutes } from 'react-router-dom';
import { routeList } from '@/routes';
import { replace } from 'lodash-es';
import { Ro } from '@/interface/route.interface';

// 从config里 把 匹配的信息 调出来
// 放这因为activekey 在 prolayout 和 tabroute之间共享。
const pickRoutes = (routes: Ro[], pathname: string) => {
  // todo 匹配不到应返回404
  debugger;

  const matches = matchRoutes(routes, { pathname });
  const routeConfig = matches ? matches[matches.length - 1].route : null;

  return {
    routeConfig,
    // matchPath: matches ? matches.map(match => _.replace(match.route.path,'/*','')).join('/') : null // 解决下微端/*路径的问题
    matchPath: routeConfig ? replace(routeConfig.path!, '/*', '') : null,
  };
};

const { Sider, Content } = Layout;
const WIDTH = 992;

const LayoutPage: FC = () => {
  const location = useLocation();
  const [openKey, setOpenKey] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const [menuList, setMenuList] = useState<MenuList>([]);
  const { device, collapsed, newUser } = useSelector(state => state.user);
  const isMobile = device === 'MOBILE';
  const dispatch = useDispatch();
  const { driverStart } = useGuide();
  // // 动态路由
  // const getMenuListFunc = useCallback(async () => {
  //   const res = await getMenuList();
  //   if (res.code === 200) {
  //     setMenuList(res.data);
  //   }
  // }, []);
  const [tabsModel, setTabsModel] = useState(true);
  const { routeConfig, matchPath } = pickRoutes(routeList, location.pathname);

  useEffect(() => {
    const code = getFirstPathCode(location.pathname);

    setOpenKey(code);
  }, [location.pathname]);

  const toggle = () => {
    batch(() => {
      dispatch(
        setUserItem({
          collapsed: !collapsed,
        }),
      );
      setTabsModel(!tabsModel);
    });
  };

  const initMenuListAll = (menu: MenuList) => {
    const MenuListAll: MenuChild[] = [];

    menu.forEach(m => {
      if (!m?.children?.length) {
        MenuListAll.push(m);
      } else {
        m?.children.forEach(mu => {
          MenuListAll.push(mu);
        });
      }
    });

    return MenuListAll;
  };
  // 异步获取菜单.
  const fetchMenuList = useCallback(async () => {
    const { status, result } = await getMenuList();

    if (status) {
      setMenuList(result);
      dispatch(
        setUserItem({
          menuList: initMenuListAll(result),
        }),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMenuList();
  }, [fetchMenuList]);

  useEffect(() => {
    window.onresize = () => {
      const { device } = getGlobalState();
      const rect = document.body.getBoundingClientRect();
      const needCollapse = rect.width < WIDTH;

      dispatch(
        setUserItem({
          device,
          collapsed: needCollapse,
        }),
      );
    };
  }, [dispatch]);

  useEffect(() => {
    newUser && driverStart();
  }, [newUser]);

  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={toggle} />
      <Layout>
        {!isMobile ? (
          <Sider
            className="layout-page-sider"
            trigger={null}
            collapsible
            collapsedWidth={isMobile ? 0 : 80}
            collapsed={collapsed}
            breakpoint="md"
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenKey(k)}
              selectedKey={selectedKey}
              onChangeSelectedKey={k => setSelectedKey(k)}
            />
          </Sider>
        ) : (
          <Drawer
            width="200"
            placement="left"
            bodyStyle={{ padding: 0, height: '100%' }}
            closable={false}
            onClose={toggle}
            visible={!collapsed}
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenKey(k)}
              selectedKey={selectedKey}
              onChangeSelectedKey={k => setSelectedKey(k)}
            />
          </Drawer>
        )}
        <Content className="layout-page-content">
          {/*<TagsView />*/}
          {/*<Outlet />*/}
          {tabsModel ? (
            <TabRoute routeConfig={routeConfig as Ro} matchPath={matchPath!} />
          ) : (
            <Suspense fallback={<h1>路由+加载中.....</h1>}>
              <Outlet />
            </Suspense>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
