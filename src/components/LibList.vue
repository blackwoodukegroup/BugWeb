<template>
  <div class="liblist">
    <div id="liblistheader">
      <b-nav v-on:click="sortclick">
          <b-nav-text>Sort by:</b-nav-text>
          <b-nav-item data-sortprop="title">Title</b-nav-item>
          <b-nav-item data-sortprop="artist">Artist</b-nav-item>
          <b-nav-item data-sortprop="date">Date</b-nav-item>
          <b-nav-form>
              <b-nav-text id="navlabel-filter">Filter: </b-nav-text>
              <b-form-input debounce="500" v-model="listfilter" placeholder="filter criteria" style="ml-12;"></b-form-input>        
          </b-nav-form>
      </b-nav>
    </div>
    <b-list-group v-on:click="itemClicked" style="height:100%; overflow:auto">
      <div v-for="(item, itemid) in orderedlibdata" v-bind:key="itemid" v-bind:data-itemid="item">
        <div v-if="item == selectedItem">
          <b-card :title="librarydata[item].title" :sub-title="librarydata[item].artist" class="mb-1">
            <b-button class="mr-1 mb-1" v-for="url in getkeys(librarydata[item].URL)" v-bind:href="librarydata[item].URL[url].URL" target="_blank" v-bind:key="url">{{ url }}</b-button>
          </b-card>
        </div>
        <div v-else>
          <b-list-group-item href="#" class="mb-1">
            <span>{{ librarydata[item].title }} - {{ librarydata[item].artist }}</span>
          </b-list-group-item>
        </div>
      </div>
    </b-list-group>
    <div id="liblistfooter"></div>
  </div>
</template>


<script>
// import LibListItem from "@/components/LibListItem.vue";

export default {
  name: "LibList",
  data: function() { 
    return {
      sortprop: "title",
      sortdescending: false,
      listfilter: "",
      selectedItem: null
    }
  },
  props: {
      librarydata: Object
  },
  components: {
    // LibListItem
  },
  methods: {
    itemClicked: function(event){
      var e = event.srcElement
      while ( typeof e.dataset.itemid == 'undefined') e = e.parentElement
      this.selectedItem = e.dataset.itemid
      this.$emit("itemselected", this.librarydata[this.selectedItem])
    },
    getkeys(o){
      if (o != null) {
          return Object.keys(o)
      } else {
          return []
      }
    },
    sortclick: function(event){
      var e = event.srcElement
      while (e != null && e.dataset.sortprop == null) e = e.parentElement
      console.log(e.dataset.sortprop)
      if (e.dataset.sortprop ) {
       if (e.dataset.sortprop == this.sortprop) this.sortdescending = ! this.sortdescending
        this.sortprop = e.dataset.sortprop
      }
    }
  },
  computed: {
      orderedlibdata: function() {
        if (this.librarydata == null) {
            return {}
        } else {
            var librarydatakeys = Object.keys(this.librarydata)
            librarydatakeys.sort((a,b) => {
                return (a > b ? 1 : -1)
            }) 
            if (this.listfilter) {
                var re = new RegExp(this.listfilter, "i")
                var filteredkeys = librarydatakeys.filter(v => {
                    return re.test(this.librarydata[v].title) || re.test(this.librarydata[v].artist)
                })
                return filteredkeys
            } else {
                return librarydatakeys
            }
        }
      }
  }
}
</script>

<style scoped>
    #navlabel-filter {
        margin-left: 12px;
        margin-right: 12px;
    }
    
    .navbar-text {
        font-weight: bold;
    }
</style>