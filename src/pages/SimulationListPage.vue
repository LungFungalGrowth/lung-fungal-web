<template>
  <v-main
    v-if="loaded"
    class="px-0"
  >
    <v-app-bar
      color="grey darken-3"
      dark
      dense
      flat
    >
      <v-tabs
        :value="currentTab"
        dark
        slider-color="primary"
        @change="setTabByIndex($event)"
      >
        <v-tab
          key="_simulationList"
        >
          <span>Simulation List</span>
        </v-tab>
        <v-tab
          v-for="tab in tabObjects"
          :key="tab._id"
        >
          <simulation-progress-bar
            v-if="tab.nli.progress < 100"
            :simulation="simulationCache[tab._id]"
            :circular="true"
          />
          <span class="ms-2">{{ tab.name }}</span>
          <v-btn
            icon
            small
          >
            <v-icon
              size="18"
              @click="closeTab(tab._id)"
            >
              mdi-close-circle
            </v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-tabs-items
      :value="currentTab"
      class="transparent"
      @change="setTabByIndex($event)"
    >
      <v-tab-item
        key="_simulationList"
      >
        <simulation-list-tab
          ref="simulationListTab"
          :sort-by="sortBy"
          :sort-desc="sortDescBoolean"
          @view="viewSimulation($event)"
          @paging="updatePagingRoute"
          @update="updateCache"
        />
      </v-tab-item>
      <v-tab-item
        v-for="tab in tabs"
        :key="tab"
      >
        <simulation-viewer :simulation-folder="simulationCache[tab]" />
      </v-tab-item>
    </v-tabs-items>
  </v-main>
</template>

<script>
import { boolean } from 'boolean';

import cache from '@/cache';
import SimulationListTab from '@/components/SimulationListTab.vue';
import SimulationViewer from '@/components/SimulationViewer.vue';
import SimulationProgressBar from '@/components/SimulationProgressBar.vue';

export default {
  name: 'SimulationListPage',
  components: {
    SimulationListTab,
    SimulationViewer,
    SimulationProgressBar,
  },
  inject: ['girderRest'],
  props: {
    sortBy: {
      type: String,
      default: 'Date',
    },
    sortDesc: {
      type: String,
      default: 'true',
    },
    activeTab: {
      type: String,
      default: '_simulationList',
    },
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loaded: false,
      simulationCache: cache,
    };
  },
  computed: {
    currentTab() {
      return this.tabs.indexOf(this.activeTab) + 1;
    },
    sortDescBoolean() {
      return boolean(this.sortDesc);
    },
    tabObjects() {
      return this.tabs.map(
        (id) => this.simulationCache[id],
      ).filter((tab) => tab !== undefined);
    },
  },
  async created() {
    await Promise.all(this.tabs.map((tab) => this.fetchSimulation(tab)));
    this.loaded = true;
  },
  activated() {
    if (this.$refs.simulationListTab) {
      this.$refs.simulationListTab.refresh();
    }
  },
  methods: {
    viewSimulation(simulation) {
      const id = simulation._id;
      this.simulationCache[id] = simulation;
      if (!this.tabs.filter((t) => t === id)[0]) {
        this.updateTabList([...this.tabs, id]);
      }
      this.setTab(id);
    },
    async fetchSimulation(id) {
      if (!this.simulationCache[id]) {
        this.$set(this.simulationCache, id, await this.girderRest.getSimulation(id));
      }
      return this.simulationCache[id];
    },
    setTab(simulationId) {
      const query = {
        ...this.$route.query,
        activeTab: simulationId,
      };
      this.$router.push({ path: 'simulations', query });
    },
    setTabByIndex(index) {
      let tab;
      if (index === 0) {
        tab = '_simulationList';
      } else {
        tab = this.tabs[index - 1];
      }
      this.setTab(tab);
    },
    closeTab(id) {
      this.updateTabList(this.tabs.filter((tab) => tab !== id));
    },
    updateTabList(tabs) {
      const query = {
        ...this.$route.query,
        tabs,
      };
      this.$router.replace({ path: 'simulations', query });
    },
    updatePagingRoute({ sortBy, sortDesc }) {
      const query = {
        ...this.$route.query,
        sortBy,
        sortDesc: sortDesc ? 'true' : 'false',
      };
      this.$router.replace({ path: 'simulations', query });
    },
    updateCache(simulation) {
      this.$set(this.simulationCache, simulation._id, simulation);
    },
  },
};
</script>

<style scoped>
.sorting {
  border-right: 1px solid #e0e0e0;
}
.drawer-wrapper {
  height: calc(100% - 65px);
}
.time-slider {
  align-items: center;
  display: flex;
}
</style>

<style>
.list-toolbar .v-toolbar__content {
  padding-right: 0;
}
</style>
