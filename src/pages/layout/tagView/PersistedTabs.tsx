import { useRef, ReactNode, FC, Suspense, useEffect } from 'react';
import { last } from 'lodash-es';
import { Params, useParams, generatePath, useLocation, useOutlet, useNavigate, Location } from 'react-router';
import { Tabs } from 'antd';
import { useMemoizedFn } from 'ahooks';
import { Ro } from '@/interface/route.interface';

type TabHolder = {
  key: string;
  name: string;
  page: ReactNode;
  // access:routeConfig.access,
  location: Location;
  params: Params;
};
const { TabPane } = Tabs;

const getTabPath = (tab: TabHolder) => generatePath(tab.location.pathname, tab.params);

// tab的select key = location.pathname + , + matchpath
// 以此解决 微端情况下 tab 的 key 相同导致页面可能丢失的问题。
const generTabKey = (location: Location, mPath: string) => `${location.pathname},${mPath}`;

// 从key中返回 ,号后面的字符
const getTabMapKey = (key: string) => key.substring(key.indexOf(',') + 1, key.length);

type TabRouteProps = {
  routeConfig: Ro;
  matchPath: string;
};
const TabRoute: FC<TabRouteProps> = ({ routeConfig, matchPath }) => {
  const outlet = useOutlet();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const tabList = useRef(new Map<string, TabHolder>());

  useEffect(() => {
    const tab = tabList.current.get(matchPath);
    const newTab = {
      name: routeConfig.name,
      key: generTabKey(location, matchPath),
      page: outlet,
      // access:routeConfig.access,
      location,
      params,
    };
    if (tab) {
      //TODO 还要比较参数?
      if (tab.location.pathname !== location.pathname) {
        tabList.current.set(matchPath, newTab);
      }
    } else {
      tabList.current.set(matchPath, newTab);
    }

    return () => {
      //
    };
  }, [location.pathname]);

  const closeTab = useMemoizedFn(selectKey => {
    if (tabList.current.size >= 2) {
      tabList.current.delete(getTabMapKey(selectKey));
      const nextTab = last(Array.from(tabList.current.values()))!;

      navigate(getTabPath(nextTab), { replace: true });
    }
  });

  const selectTab = useMemoizedFn(selectKey => {
    navigate(getTabPath(tabList.current.get(getTabMapKey(selectKey))!), {
      replace: true,
    });
  });

  const hierarchy = [...tabList.current.values()];
  
  // useWhyDidYouUpdate('useWhyDidYouUpdateTabRoutes', { ...props, ele,location,tabList });

  return (
    <Tabs
      activeKey={generTabKey(location, matchPath)}
      onChange={key => selectTab(key)}
      tabPosition="top"
      animated
      tabBarGutter={-1}
      hideAdd
      type="editable-card"
      size="small"
      onEdit={targetKey => closeTab(targetKey)}
    >
      {hierarchy.map(item => (
        <TabPane tab={item.name} key={item.key}>
          <Suspense fallback={<h1>加载中...</h1>}>{item.page}</Suspense>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default TabRoute;
