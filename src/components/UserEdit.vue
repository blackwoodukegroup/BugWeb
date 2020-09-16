<template>
  <b-form v-if="user != null" @change="formDirty = true">
    <b-row>
      <b-col md="6">
        <b-row>
          <b-col md="6">
            <b-form-group id="input-group-username" label="Username" label-for="input-username">
              <b-form-input
                id="input-username"
                v-model.trim="user.username"
                type="text"
                :state="usernameValid"
                required
                :disabled="! newUser"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group id="input-group-fullname" label="Full Name" label-for="input-fullname">
              <b-form-input id="input-fullname" v-model.trim="user.fullname" type="text"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group id="input-group-password" label="Password" label-for="input-password">
              <b-form-input 
                id="input-password" 
                v-model.trim="user.password"
                :state="passwordValidityStatus"
                type="password">
              </b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group
              id="input-group-password"
              label="Confirm Password"
              label-for="input-confirm-password"
            >
              <b-form-input
                id="input-confirm-password"
                v-model.trim="user.confirmPassword"
                :state="passwordValidityStatus"
                type="password"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <ListManager
          list-name="Roles"
          :list-items="user.roles"
          :list-possible-items="allUserRoles"
          add-item-prompt="(add roles)"
          @listChanged="listChanged"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-button :disabled="! formDirty" @click="save">Save</b-button>
        <b-button :disabled="! formDirty" @click="cancel" class="ml-2">Cancel</b-button>
      </b-col>
    </b-row>
  </b-form>
  <p v-else>Select a user to edit</p>
</template>

<script>
import ListManager from "@/components/ListManager.vue";

export default {
  name: "UserEdit",
  components: {
    ListManager,
  },
  props: {
    initialUser: Object,
    newUser: Boolean,
  },
  data: function () {
    return {
      user: null,
      allUserRoles: ["admin"],
      formDirty: false,
    };
  },
  methods: {
    setModel(user) {
      this.user = {
        username: user.username,
        fullname: user.fullname,
        roles: user.roles.slice(),
      };
    },
    listChanged(event) {
      console.log("listChanged: ", event);
      this.user.roles = event.slice();
      this.formDirty = true;
    },
    save() {
      this.$emit("saveUser", this.user);
      this.formDirty = false;
    },
    cancel() {
      this.setModel(this.initialUser);
      this.formDirty = false;
    },
  },
  computed: {
    passwordValidityStatus: function () {
      var p1 = this.user.password;
      var p2 = this.user.confirmPassword;

      if ( p1 == null ) p1 = "";
      if ( p2 == null ) p2 = "";
      
      if ( p1.length > 0 || p2.length > 0 )
        return this.user.password == this.user.confirmPasswod;
      else return null;
    },
    usernameValid: function() {
      if ( this.user.username == null )
        return null;
      else
        return ( this.user.username.length > 0);
    }
  },
  watch: {
    initialUser: function (newVal) {
      if (
        this.formDirty &&
        confirm("Changes will be lost. Proceed?") == false
      ) {
        this.$emit("setSelectedUser", this.user.username);
        return;
      }

      if (newVal) {
        this.setModel(newVal);
        this.formDirty = false;
      }
    },
    formDirty: function (newVal) {
      this.$emit("formDirty", newVal);
    },
  },
};
</script>

<style scoped>
</style>