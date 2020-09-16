<template>
  <div class="admin">
    <b-overlay :show="! this.userList">
      <b-dropdown id="selectUser" :text="dropdownText" :disabled="editFormDirty" class="m-md-2">
        <b-dropdown-item-button
          v-for="user in this.userList"
          v-bind:key="user.username"
          v-bind:data-username="user.username"
          v-bind:active="selectedUser != null && user.username == selectedUser.username"
          @click="selectUser"
        >{{ user.fullname }}</b-dropdown-item-button>
        <b-dropdown-item-button @click="newUser">(create new user)
        </b-dropdown-item-button>
      </b-dropdown>
      <hr />
      <UserEdit :initial-user="selectedUser" :new-user="newUserMode" @saveUser="saveUser" @formDirty="formDirty" />
    </b-overlay>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import axios from "axios";
import UserEdit from "@/components/UserEdit.vue";

export default {
  name: "Admin",
  components: {
    UserEdit,
  },
  data: function () {
    return {
      userList: null,
      selectedUser: null,
      newUserMode: false,
      editFormDirty: false
    };
  },
  computed: {
    dropdownText: function () {
      if ( this.newUserMode ) 
        return "(create new user)"

      if ( this.selectedUser == null ) 
        return "Select User";
      else 
        return this.selectedUser.fullname;
    },
  },
  created: function () {
    if (this.userList == null) {
      axios
        .get(
          this.$appConstants.bugUrl +
            "?command=getUserList&user-token=" +
            this.$store.userToken
        )
        .then((response) => {
          this.userList = response.data.data;
        })
        .catch((err) => console.log(err));
    }
  },
  methods: {
    selectUser: function(event) {
      var e = event.target;
      if ( this.selectedUser != null && this.selectedUser.username == e.dataset.username )
        this.selectedUser = null;
      else 
        this.selectedUser = this.userList[e.dataset.username];

      this.newUserMode = false;
    },
    newUser: function(){
      this.selectedUser = null;
      this.newUserMode = true;
      this.selectedUser = {
        username: "",
        fullname: "",
        roles: []
      }
    },
    saveUser: function(user) {
      console.log("Admin.saveUser: ", user)

      var command = 'saveUser';

      if ( this.newUserMode )
        command = 'createUser';

      var url = this.$appConstants.bugUrl +
          "?command=" + command + "&user-token=" +
          this.$store.userToken

      axios
        .post(
          url,
          {
            user: user
          },
          {
            headers: {  'Content-Type': 'text/plain;charset=utf-8'}
          }
        )
        .then((response) => {
          // update the userList entry
          if ( response.data == null ) {
            // network error - should never get here
          } else if ( response.data.status == "success" ) {
            console.log("user saved");
            // yay - it worked
            this.selectedUser.fullname = user.fullname
            this.selectedUser.roles = user.roles.splice()
          } else {
            console.log("save failed:", response.data.message);
          }
        }
        )
        .catch((err) => console.log(err))
    },
    formDirty: function(status){
      console.log("Admin.formDirty: ", status)
      this.editFormDirty = status;
    }
  },
};
</script>
