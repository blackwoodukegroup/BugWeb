<template>
  <div class="liblist">
    <div id="liblistheader">
    </div>
    <b-list-group>
    <template v-for="(item, itemid) in librarydata">
        <LibListItem v-bind:key="itemid" :liblistitem="item" />
    </template>
    </b-list-group>
    <div id="liblistfooter">
    </div>
  </div>
</template>


<script>
import LibListItem from "@/components/LibListItem.vue";

export default {
  name: "LibList",
  props: ["librarydata"],
  components: {
    LibListItem,
  },
};
</script>