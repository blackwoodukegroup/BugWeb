<template>
  <div id="PlaylistBrowse">
    <b-row>
      <b-col md="6">
        <b-table
          v-if="playlists"
          @row-clicked="selectPlaylist"
          hover
          small
          :items="playlistTableItems"
          :fields="playlistTableFields"
          sort-by="date"
          :sort-desc="true"
          :sort-compare-options="{ caseFirst: false }"
          selectable
          select-mode="single"
        >
          <template
            v-slot:cell(date)="data"
          >{{ (new Date(data.value)).toLocaleDateString("en-GB") }}</template>
          <template v-slot:cell(songs)="data">{{ data.value == null ? 0 : data.value.length }}</template>
          <template
            v-slot:cell(type)="data"
          >{{ data.value == null ? "" : playlistTypes[data.value].description }}</template>
        </b-table>
        <b-button @click="newPlaylist">New Playlist</b-button>
        <b-button @click="editPlaylist" :disabled="selectedPlaylist == null" class="ml-2">Edit</b-button>
        <b-button
          @click="deletePlaylist"
          :disabled="selectedPlaylist == null"
          class="ml-2"
          variant="danger"
        >Delete</b-button>
        <b-button
          @click="duplicatePlaylist"
          :disabled="selectedPlaylist == null"
          class="ml-2"
        >Duplicate</b-button>
      </b-col>
      <b-col md="6">
        <b-table small :items="songTableItems" :fields="songTableFields"></b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "PlaylistBrowse",
  data: function () {
    return {
      selectedPlaylist: null,
      playlistTableFields: [
        { key: "name", sortable: true },
        { key: "date", sortable: true },
        { key: "songs", sortable: true },
        { key: "type", sortable: true },
      ],
      songTableFields: ["title", "artist"],
    };
  },
  props: {
    playlists: Object,
    playlistTypes: Object,
    songs: Object
  },
  computed: {
    playlistTableItems() {
      return Object.values(this.playlists);
    },
    songTableItems() {
      if (this.selectedPlaylist == null) return [];
      var playlistSongs = this.playlists[this.selectedPlaylist].songs ?? [];
      return Object.values(this.songs).filter((song) =>
        playlistSongs.includes(song.id)
      );
    },
  },
  methods: {
    selectPlaylist(record) {
      this.selectedPlaylist = record.id;
      this.$emit("select-playlist", record.id);
    },
    newPlaylist(){
        this.$emit("new-playlist");
    },
    editPlaylist() {
        this.$emit("edit-playlist", this.selectedPlaylist);
    },
    deletePlaylist() {
        this.$emit("delete-playlist", this.selectedPlaylist);
    },
    duplicatePlaylist() {
        this.$emit("duplicate-playlist", this.selectedPlaylist);
    },
  },
};
</script>