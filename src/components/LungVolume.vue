<template>
  <v-container fluid>
    <Render3D />
  </v-container>
</template>

<script>
import Render3D from '@/components/Render3D.vue';

export default {
  name: 'LungVolume',
  components: {
    Render3D,
  },
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
