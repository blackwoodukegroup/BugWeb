<template>
  <div class="list-manager">
    <p>{{ listName }}</p>
    <b-list-group>
      <b-list-group-item
        v-for="(item, index) in listItems"
        :key="item"
        :data-item="item"
        :active="item == listItemSelected"
        @click="selectItem"
      >
        {{ item }}
        <b-button-group v-if="item == listItemSelected" style="float:right">
          <b-button :disabled="index==0" :data-item="item" @click.stop="moveItemUp">
            <b-icon icon="arrow-up" aria-hidden="true"></b-icon>
          </b-button>
          <b-button
            :disabled="index==(listItems.length-1)"
            :data-item="item"
            @click.stop="moveItemDown"
          >
            <b-icon icon="arrow-down" aria-hidden="true"></b-icon>
          </b-button>
          <b-button :data-item="item" @click.stop="deleteItem">
            <b-icon icon="trash" aria-hidden="true"></b-icon>
          </b-button>
        </b-button-group>
      </b-list-group-item>

      <b-list-group-item v-if="availableItems.length != 0">
        <b-dropdown :text="addItemPrompt">
          <b-dropdown-item
            v-for="item in availableItems"
            :key="item"
            :data-item="item"
            @click="addItem"
          >{{ item }}</b-dropdown-item>
        </b-dropdown>
      </b-list-group-item>
      <b-list-group-item v-else>
          (all roles are present)
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "ListManager",
  props: {
    listName: String,
    listItems: Array,
    listPossibleItems: Array,
    addItemPrompt: String
  },
  data: function () {
    return {
      listItemSelected: null,
    };
  },
  computed: {
    availableItems: function () {
      var result = [];
      var _vm = this;

      this.listPossibleItems.forEach(function (item) {
        if (!_vm.listItems.includes(item)) result.push(item);
      });
      return result;
    },
  },
  methods: {
    listChanged: function () {
      this.$emit("listChanged", this.listItems);
    },
    selectItem: function (event) {
      var el = event.target;
      while (el.dataset.item == null) el = el.parentElement;

      this.listItemSelected = el.dataset.item;
    },
    addItem: function (event) {
      var el = event.target;
      while (el.dataset.item == null) el = el.parentElement;

      var itemToAdd = el.dataset.item;

      if (!this.listItems.includes(itemToAdd)) {
        this.listItems.push(itemToAdd);
        this.listChanged();
      } else {
        alert("list already contains this item");
      }

      this.listItemSelected = null;
    },
    deleteItem: function (event) {
      var el = event.target;
      while (el.dataset.item == null) el = el.parentElement;

      var itemToDelete = el.dataset.item;

      if (itemToDelete) {
        var index = this.listItems.indexOf(itemToDelete);
        this.listItems.splice(index, 1);
        this.listItemSelected = null;
        this.listChanged();
      }
    },
    moveItemUp: function (event) {
      var el = event.target;
      while (el.dataset.item == null) el = el.parentElement;

      var item = el.dataset.item;

      if (item == null) return;

      var index = this.listItems.indexOf(item);

      this.listItems.splice(index, 1);
      this.listItems.splice(index - 1, 0, item);

      this.listChanged();
    },
    moveItemDown: function (event) {
      var el = event.target;
      while (el.dataset.item == null) el = el.parentElement;

      var item = el.dataset.item;

      if (item == null) return;

      var index = this.listItems.indexOf(item);

      this.listItems.splice(index, 1);
      this.listItems.splice(index + 1, 0, item);

      this.listChanged();
    },
  },
};
</script>

<style scoped>
</style>