<template>
  <b-list-group-item href="#">{{ liblistitem.title }}</b-list-group-item>
</template>

<script>
export default {
  name: "LibListItem",
  props: ["liblistitem"],
};
</script>