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

// import { Ro } from '@/interface/route.interface';

type TabHolder = {
  key: string;
  name: string;
  page: ReactNode;
  // access:routeConfig.access,
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
    page: routeConfig?.element, // 不要使用outlet ,否则形成嵌套循环
    // access:routeConfig.access,
    uri: location.pathname,
    params,
  };
  const tab = tabList.current.get(newTabHolder.key);
  if (tab) {
    if (tab.uri !== location.pathname) {
      tabList.current.set(newTabHolder.key, newTabHolder);
    }
  } else {
    tabList.current.set(newTabHolder.key, newTabHolder);
  }

  const closeTab = useMemoizedFn(selectKey => {
    // 记录原真实路由,微前端可能修改
    // keyLruSquence.newest.value.curPath = window.location.pathname
    // navigate(keyLruSquence.get(selectKey).curPath,{replace:true});
    if (tabList.current.size >= 2) {
      tabList.current.delete(selectKey);
      const nextTab = last(Array.from(tabList.current.values()))!;

      navigate(getTabPath(nextTab), { replace: true });
    }
  });

  const selectTab = useMemoizedFn(selectKey => {
    // 记录原真实路由,微前端可能修改
    navigate(getTabPath(tabList.current.get(selectKey)!), {
      replace: true,
    });
  });

  // const hierarchy = Array.from(tabList.current.values()); // 每次都变化...

  useWhyDidYouUpdate('useWhyDidYouUpdateTabRoutes', { location, tabList, tabListCurrent: tabList.current });

  return (
    <div className="multiple-tabs">
      <Tabs
        // className={styles.tabs}
        activeKey={newTabHolder.key}
        onChange={selectTab}
        // tabBarExtraContent={operations}
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
