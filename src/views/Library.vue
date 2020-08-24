<template>
  <div class="library">
    <h2>Library</h2>
    <LibSearch />
    <LibList :librarydata="this.librarydata" />
  </div>
</template>

<script>
// @ is an alias to /src
import LibSearch from "@/components/LibSearch.vue";
import LibList from "@/components/LibList.vue";
import axios from "axios";

export default {
  name: "Library",
  components: {
    LibSearch,
    LibList,
  },
  data: function () {
    return {
      librarydata: null,
    };
  },
  created: function () {
    if (!this.librarydata) {
      console.log("loading library data...");
      axios
        .get(
          "https://script.google.com/macros/s/AKfycbx-0s1grPv0Wj_wXZUDRggB7Eac_c4TGHkMQ1aNOcNv41eCeg/exec"
        )
        .then((response) => {
          this.librarydata = response.data;
          console.log("loaded");
        })
        .catch((err) => console.log(err));
    } else {
      console.log("library data persisted");
    }
  },
};
</script>
