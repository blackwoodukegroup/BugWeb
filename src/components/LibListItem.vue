<template>
  <b-list-group-item href="#">
    <span>{{ liblistitem.title }} - {{ liblistitem.artist }}</span>
  </b-list-group-item>
</template>

<script>
export default {
  name: "LibListItem",
  props: ["liblistitem"],
};
</script>