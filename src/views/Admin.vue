<template>
  <div class="admin">
        <p>Users:</p>
        
        <b-list-group @click="selectUser">
            <b-list-group-item 
                v-for="user in this.userList" 
                v-bind:key="user.username" 
                v-bind:data-username="user.username"
                v-bind:active="selectedUser != null && user.username == selectedUser.username"
                >
                {{ user.username }} ({{ user.fullname }})
            </b-list-group-item>
        </b-list-group>

        <UserEdit v-bind:user="selectedUser" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import axios from "axios";
import UserEdit from "@/components/UserEdit.vue";

export default {
  name: 'Admin',
  components: {
   // HelloWorld
   UserEdit
  },
  data: function(){
      return {
          userList: null,
          selectedUser: null
      }
  },
  created: function(){
    if (this.userList == null) {
        console.log("loading user list...");
        axios
            .get(
                this.$appConstants.bugUrl + "?command=getUserList&user-token=" + this.$store.userToken,
            )
            .then((response) => {
                this.userList = response.data.data;
            })
            .catch((err) => console.log(err));
        }
    },
    methods: {
        selectUser: function(event){
            var e = event.target;
            if ( this.selectedUser != null && this.selectedUser.username == e.dataset.username )
                this.selectedUser = null;
            else
                this.selectedUser = this.userList[e.dataset.username];
        }
    }
}
</script>
