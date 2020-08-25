<template>
  <div class="library">
    <h2>Library</h2>
    <b-row>
      <b-col>
        <div v-if="librarydata == null">
          <b-spinner label="loading library data..."></b-spinner>
        </div>
        <div v-else>
          <LibList :librarydata="this.librarydata" v-on:itemselected="itemselected" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import LibList from "@/components/LibList.vue";
// import LibItemDetail from "@/components/LibItemDetail.vue";

import axios from "axios";

export default {
  name: "Library",
  components: {
    LibList,
    // LibItemDetail
  },
  data: function () {
    return {
      librarydata: null,
      selecteditem: null
    };
  },
  methods: {
    itemselected(event){
      this.selecteditem = event
    }
  },
  created: function () {
    if (this.librarydata == null) {
      console.log("loading library data...");
      axios
        .get(
          "https://script.google.com/macros/s/AKfycbx-0s1grPv0Wj_wXZUDRggB7Eac_c4TGHkMQ1aNOcNv41eCeg/exec"
        )
        .then((response) => {
          this.librarydata = response.data;
          console.log("loaded " + Object.keys(this.librarydata).length + " songs");

          var noDate = []
          Object.keys(this.librarydata).forEach(key => {
            // console.log(key)
            var song = this.librarydata[key]
            // console.log(song.title)
            Object.keys(song.URL).forEach(key => {
              var url = song.URL[key]
              // console.log(`${key}: ${url.LastUpdated} ${url.URL}`)
              if ( typeof url.LastUpdated == 'undefined' ) {
                if ( url.URL.match(/scorpex|ozbcoz/i) ) noDate.push(url)
              }
            })
          })
          console.log(noDate.length)
          noDate.forEach(item => {
            console.log(`- get date for ${item.URL}`)
            axios
              .head(item.URL)
              .then((response) => {
                console.log(`- response for ${item.URL}`)
                console.log(response.data)

              })
              .catch((err) => console.log(err))
          })
        })
        .catch((err) => console.log(err));
    }
  },
};
</script>
