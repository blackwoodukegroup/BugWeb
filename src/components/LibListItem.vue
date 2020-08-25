<template>
  <b-list-group-item href="#" v-bind:class="{ active: itemselected }">
    <span>{{ liblistitem.title }} - {{ liblistitem.artist }}</span>
  </b-list-group-item>
</template>

<script>
export default {
  name: "LibListItem",
  props: {
    "liblistitem": null, 
    "itemselected": null
  }
};
</script>

<style scoped>

</style>