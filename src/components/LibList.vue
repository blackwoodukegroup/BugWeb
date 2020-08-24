<template>
  <div class="liblist">
    <div id="liblistheader">
    <b-nav>
        <b-nav-text>Sort by:</b-nav-text>
        <b-nav-item>Title</b-nav-item>
        <b-nav-item>Artist</b-nav-item>
        <b-nav-form>
            <b-nav-text id="navlabel-filter">Filter: </b-nav-text>
            <b-form-input debounce="500" v-model="listfilter" placeholder="filter criteria" style="ml-12;"></b-form-input>        
        </b-nav-form>
    </b-nav>

    </div>
    <b-list-group>
      <template v-for="(item, itemid) in orderedlibdata">
        <LibListItem v-bind:key="itemid" :liblistitem="librarydata[item]" />
      </template>
    </b-list-group>
    <div id="liblistfooter"></div>
  </div>
</template>


<script>
import LibListItem from "@/components/LibListItem.vue";

export default {
  name: "LibList",
  data: function() { 
    return {
      sortprop: "title",
      sortdescending: false,
      listfilter: ""
    }
  },
  props: {
      librarydata: Object
  },
  components: {
    LibListItem
  },
  methods: {
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