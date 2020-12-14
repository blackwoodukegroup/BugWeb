<template>
  <div id="PlaylistBrowse">
    <b-row>
      <b-col md="6">
        <b-table
          v-if="playlists"
          ref="PlaylistTable"
          @row-selected="selectPlaylist"
          hover
          small
          :items="playlistTableItems"
          :fields="playlistTableFields"
          sort-by="date"
          primary-key="id"
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
        <b-button @click="editPlaylist" :disabled="selectedPlaylistID == null" class="ml-2">Edit</b-button>
        <b-button
          @click="deletePlaylist"
          :disabled="selectedPlaylistID == null"
          class="ml-2"
          variant="danger"
        >Delete</b-button>
        <b-button
          @click="duplicatePlaylist"
          :disabled="selectedPlaylistID == null"
          class="ml-2"
        >Duplicate</b-button>
      </b-col>
      <b-col md="6">
        <b-table 
          small 
          :items="songTableItems" 
          :fields="songTableFields">
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "PlaylistBrowse",
  data: function () {
    return {
      selectedPlaylistID: null,
      // lastSelectedPlaylistID: null,
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
      return Object.entries(this.playlists).map( x=> { 
        var q = Object.assign({}, x[1]);
        q.id = x[0]
        return q } 
      );
    },
    songTableItems() {
      if (this.selectedPlaylistID == null) return [];
      var playlistSongs = this.playlists[this.selectedPlaylistID].songs ?? [];
      var _this = this;
      return Object.values(playlistSongs).map((songId) => {
        return _this.songs[songId];
      });
    },
  },
  methods: {
    selectPlaylist(record) {
      if ( record.length == 0 ) {
        this.selectedPlaylistID = null
      } else {
        this.selectedPlaylistID = record[0].id;
      }
      this.$emit("select-playlist", this.selectedPlaylistID);
    },
    newPlaylist(){
        this.$emit("new-playlist");
    },
    editPlaylist() {
      if ( this.selectedPlaylistID != null ) {
        this.$emit("edit-playlist", this.selectedPlaylistID);
      }
    },
    deletePlaylist() {
      if ( this.selectedPlaylistID != null && confirm("Delete Playlist - Are You Sure?") ){
        var deletePlaylistId = this.selectedPlaylistID;
        this.selectedPlaylistID = null;
        this.$refs.PlaylistTable.clearSelected();
        this.$emit("delete-playlist", deletePlaylistId);
      }
    },
    duplicatePlaylist() {
        this.$emit("duplicate-playlist", this.selectedPlaylistID);
    },
  },
};
</script>