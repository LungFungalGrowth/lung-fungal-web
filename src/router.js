import Router from 'vue-router';

import ConfigPage from '@/pages/ConfigPage.vue';
import ComparePage from '@/pages/ComparePage.vue';
import SimulationListPage from '@/pages/SimulationListPage.vue';

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/configure',
    },
    {
      path: '/configure',
      name: 'configuration',
      component: ConfigPage,
      props(route) {
        return {
          initialValues: route.query.initialValues || '{}',
        };
      },
    },
    {
      path: '/simulations',
      name: 'simulations',
      component: SimulationListPage,
      props(route) {
        let { tabs } = route.query;
        if (!Array.isArray(tabs)) {
          if (tabs) {
            tabs = [tabs];
          } else {
            tabs = [];
          }
        }
        return { ...route.query, tabs };
      },
    },
    {
      path: '/compare',
      name: 'compare',
      component: ComparePage,
    },
  ],
});
