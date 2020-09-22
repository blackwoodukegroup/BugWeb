<template>
    <div class="userlist">
        <b-overlay :show="! this.$store.userDirectory">
            <b-table 
                :items="userTable" 
                :fields="userTableFields"
                primary-key="Username"
                @row-clicked="selectUser"
                small
                :per-page="perPage"
                :current-page="currentPage"
            >
              <template v-slot:cell(Name)="data">
                <router-link :to="{ name: 'AdminUsersEdit', params: { username: data.item.Username }}">{{ data.item.Name }}</router-link>
              </template>

            </b-table>
            <b-pagination 
              v-model="currentPage" 
              :per-page="perPage"
              :total-rows="userTable.length"
            ></b-pagination>
            <b-form inline>
              <router-link tag="b-btn" :to="{ name: 'AdminUsersNew' }">Create New User</router-link>
              <b-form-checkbox v-model="showDisabled" class="ml-5" inline>Show disabled accounts</b-form-checkbox>
            </b-form>
        </b-overlay>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserList",
  components: {
  },
  data: function () {
    return {
      currentPage: 1,
      perPage: 10,
      selectedUser: null,
      userTableFields: [
        { key: 'Name', sortable: true },
        { key: 'Username', sortable: true },
        { key: 'Email', sortable: true },
        { key: 'Roles', sortable: true }
      ],
      showDisabled: false
    };
  },
  computed: {
    userTable: function() {
        var result = [];
        if ( this.$store.userDirectory ) {
            for( var userName in this.$store.userDirectory ) {
                var user = this.$store.userDirectory[userName];
                if ( user.disable == this.showDisabled ){
                result.push({
                    Name: user.fullname,
                    Username: user.username,
                    Email: user.emailaddress,
                    Roles: user.roles,
                    Disabled: user.disable
                });
              }
            }
        }
        return result;
    }
  },
  created: function () {
    if ( this.$store.userDirectory == null ) {
      axios
        .get(
          this.$appConstants.bugUrl +
            "?command=getUserList&user-token=" +
            this.$store.userToken
        )
        .then((response) => {
          if ( response.data.status == "success" )
            this.$store.userDirectory = response.data.data;
          else {
            alert("ERROR: " + response.data.message);
            console.log(response.data.message);
          }
        })
        .catch((err) => {
          alert("ERROR: " + err.message);
          console.log(err)
        });
    }
  },
  methods: {
    selectUser: function(record) {
        this.selectedUser = record.Username;
    },
    deleteUser: function(){
        // todo: delete user

        // - prevent deleting final account with admin role

        // - prevent deleting account in use

    }
  }
};
</script>
