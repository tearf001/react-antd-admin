import { FC, ReactNode, Suspense, useRef } from 'react';
import { Params, generatePath, useLocation, useNavigate, useParams } from 'react-router';
import { matchRoutes } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { useWhyDidYouUpdate } from 'ahooks';
import { Tabs } from 'antd';
import { last } from 'lodash-es';

import { Ro } from '@/interface/route.interface';
import { routeList } from '@/routes';

import './tab.less';

type TabHolder = {
  key: string;
  name: string;
  page: ReactNode;
  uri: string;
  params: Params;
};
const { TabPane } = Tabs;

const getTabPath = (tab: TabHolder) => generatePath(tab.uri, tab.params);

const TabRoute: FC = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const tabList = useRef(new Map<string, TabHolder>());
  const currentPath = location.pathname;

  const matches = matchRoutes(routeList, currentPath);
  const routeConfig = matches ? (matches[matches.length - 1].route as any as Ro) : null;
  const newTabHolder: TabHolder = {
    name: routeConfig?.name || currentPath, // todo better name
    key: routeConfig?.key || currentPath,
    page: routeConfig?.element, // 不要使用outlet ,否则形成嵌套循环?
    uri: location.pathname,
    params,
  };
  const tab = tabList.current.get(newTabHolder.key);
  if (tab) {
    // todo 还要比较参数?
    if (tab.uri !== location.pathname) {
      tabList.current.set(newTabHolder.key, newTabHolder);
    }
  } else {
    tabList.current.set(newTabHolder.key, newTabHolder);
  }

  const closeTab = useMemoizedFn(selectKey => {
    if (tabList.current.size >= 2) {
      tabList.current.delete(selectKey);
      const nextTab = last(Array.from(tabList.current.values()))!;

      navigate(getTabPath(nextTab), { replace: true });
    }
  });

  const selectTab = useMemoizedFn(selectKey => {
    navigate(getTabPath(tabList.current.get(selectKey)!), {
      replace: true,
    });
  });

  useWhyDidYouUpdate('useWhyDidYouUpdateTabRoutes', { location, tabList, tabListCurrent: tabList.current });

  return (
    <div className="multiple-tabs">
      <Tabs
        activeKey={newTabHolder.key}
        onChange={selectTab}
        tabPosition="top"
        animated
        tabBarGutter={-1}
        hideAdd
        type="editable-card"
        size="small"
        onEdit={closeTab}
      >
        {[...tabList.current.values()].map(item => (
          <TabPane tab={item.name} key={item.key}>
            <Suspense fallback={<h1>加载中...</h1>}>{item.page}</Suspense>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default TabRoute;
