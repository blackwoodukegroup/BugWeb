<template>
  <div class="liblist">
    <div id="liblistheader">
      <b-row>
        <b-col md="8" offset-md="2">
          <b-nav>
            <b-nav-form>
              <b-nav-text id="navlabel-search">Search:</b-nav-text>
              <b-form-input
                debounce="500"
                v-model="searchParameter"
                placeholder="title / artist"
                type="search"
                style="ml-12;"
              ></b-form-input>
            </b-nav-form>
            <b-nav-form>
              <b-nav-text id="navlabel-filter">Filter:</b-nav-text>
              <b-form-select v-model="filterSelected" :options="filterOptions"></b-form-select>
            </b-nav-form>
          </b-nav>
          <b-nav v-on:click="sortclick">
            <b-nav-text>Sort by:</b-nav-text>
            <b-nav-item data-sortprop="title">Title</b-nav-item>
            <b-nav-item data-sortprop="artist">Artist</b-nav-item>
            <b-nav-item data-sortprop="mostRecentChartUpdate">Date</b-nav-item>
          </b-nav>
        </b-col>
      </b-row>
    </div>
    <b-row>
      <b-col md="8" offset-md="2">
        <b-list-group v-on:click="songClicked" style="height:100%; overflow:auto">
          <div v-if="this.songLib">
            <div
              v-for="song in this.songLib.getSongList(this.sortprop, this.sortdescending, this.searchParameter)"
              v-bind:key="song.id"
              v-bind:data-songid="song.id"
            >
              <div v-if="song.id == selectedSong">
                <b-card :title="song.title" :sub-title="song.artist" class="mb-1">
                  <p class="mr-1 mb-1" v-for="note in song.notes" v-bind:key="note.id">{{ note.note }}</p>
                  <b-button
                    class="mr-1 mb-1"
                    v-for="chart in song.charts"
                    v-bind:href="chart.url"
                    target="_blank"
                    v-bind:key="chart.id"
                  >{{ chart.description }}</b-button>
                  <b-button
                    class="mr-1 mb-1"
                    v-for="link in song.links"
                    v-bind:href="link.url"
                    target="_blank"
                    v-bind:key="link.id"
                  >{{ link.description }}</b-button>
                </b-card>
              </div>
              <div v-else>
                <b-list-group-item href="#" class="mb-1">
                  <span>{{ song.title }} - {{ song.artist }}</span>
                </b-list-group-item>
              </div>
            </div>
          </div>
        </b-list-group>
      </b-col>
    </b-row>
    <div id="liblistfooter"></div>
  </div>
</template>


<script>
import SongLib from "@/classes/songlib.js";

export default {
  name: "LibList",
  data: function () {
    return {
      sortprop: "title",
      sortdescending: false,
      searchParameter: "",
      selectedSong: null,
      filterSelected: null,
      filterOptions: [
        { value: null, text: "show all" },
        { value: 1, text: "just charts" },
        { value: 2, text: "just songbooks" },
      ],
    };
  },
  props: {
    songLib: SongLib,
  },
  components: {},
  methods: {
    songClicked: function (event) {
      var e = event.target;
      while (typeof e.dataset.songid == "undefined") e = e.parentElement;
      if (
        this.selectedSong == e.dataset.songid &&
        event.target.tagName != "A"
      ) {
        this.selectedSong = null;
      } else this.selectedSong = e.dataset.songid;
      // this.$emit("songSelected", this.librarydata[this.selectedSong]);
    },
    sortclick: function (event) {
      var e = event.target;
      while (e != null && e.dataset.sortprop == null) e = e.parentElement;
      if (e.dataset.sortprop) {
        if (e.dataset.sortprop == this.sortprop)
          this.sortdescending = !this.sortdescending;
        else this.sortdescending = false;
        this.sortprop = e.dataset.sortprop;
      }
      this.selectedSong == null;
    },
  },
};
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