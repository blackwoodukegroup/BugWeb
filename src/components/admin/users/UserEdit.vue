<template>
<b-overlay :show="savingUser">
  <b-form v-if="user != null" @change="formDirty = true">
    <b-row>
      <b-col md="6">
        <b-form-group id="input-group-username" label="User ID" label-for="input-username">
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
          <b-form-input
            id="input-fullname"
            v-model.trim="user.fullname"
            :state="fullnameValid && showValidation"
            required
            type="text"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group id="input-group-email" label="Email Address" label-for="input-email">
          <b-form-input
            id="input-email"
            v-model.trim="user.emailaddress"
            :state="emailAddressValid && showValidation"
            required
            type="email"
          ></b-form-input>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group id="input-group-disable" label="Disable Account" label-for="input-disable">
          <b-form-checkbox 
            id="input-disable" 
            v-model="user.disable" 
            :disabled="editingSelf"
            ><span v-if="editingSelf">You may not disable your own account</span></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group id="input-group-password" label="Password" label-for="input-password">
          <b-form-input
            id="input-password"
            v-model.trim="password"
            :state="passwordValid"
            required
            type="password"
          ></b-form-input>
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
            v-model.trim="confirmPassword"
            :state="passwordValid"
            required
            type="password"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <ListManager
          list-name="Roles"
          :list-items="user.roles"
          :list-possible-items="allUserRoles"
          add-item-prompt="(add roles)"
          @listChanged="rolesChanged"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-button :disabled="! formDirty" @click="saveUser" class="mr-2">Save</b-button>
        <span class="mr-2">
          <router-link tag="b-button" :to="{ name: 'AdminUsers'}">{{ cancelButtonText }}</router-link>
        </span>
      </b-col>
    </b-row>
  </b-form>
  </b-overlay>
</template>

<script>
import axios from "axios";
import UserLib from "@/classes/userlib.js";
import ListManager from "@/components/admin/users/ListManager.vue";

export default {
  name: "UserEdit",
  components: {
    ListManager,
  },
  props: {
    username: String,
  },
  data: function () {
    return {
      user: null,
      newUser: false,   // true if we're creating a new user
      allUserRoles: ["admin"], // todo: get this list from the API
      formDirty: false,
      password: null,
      confirmPassword: null,
      showValidation: false, // flag to hide validation until user attempts Save
      savingUser: false,
    };
  },
  methods: {
    setModel(user) {
      this.user = UserLib.newUser();
      Object.assign(this.user, user);
    },
    rolesChanged(event) {
      this.user.roles = event.slice();
      this.formDirty = true;
    },
    saveUser() {
      this.showValidation = true;
      if (!this.formValid) return;

      if (this.password != null && this.password.length > 0)
        this.user.passwordHash = this.CryptoJS.MD5(this.password).toString();

      var command = 'saveUser';

      if ( this.newUser )
        command = 'createUser';

      var url = this.$appConstants.bugUrl +
          "?command=" + command + "&user-token=" +
          this.$store.userToken

      this.savingUser = true;
      axios
        .post(
          url,
          { user: this.user },
          { headers: { 'Content-Type': 'text/plain;charset=utf-8'} }
        )
        .then((response) => {
          this.savingUser = false;

          if ( response.data.status == "success" ) {
            console.log("user saved");
            alert('user saved');

            // no need to hang on the the password hash
            delete this.user.passwordHash

            // update the store
            this.$store.userDirectory[this.user.username] = this.user;

          } else {
            console.log(response.data.message);
            alert('ERROR: ' + response.data.message);
          }
        })
        .catch((err) => {
          this.savingUser = false;
          console.log(err)
        });

      this.formDirty = false;
      this.password = "";
      this.confirmPassword = "";
      this.showValidation = false;
    },
    cancel() {
      this.setModel(this.initialUser);
      this.formDirty = false;
      this.password = "";
      this.confirmPassword = "";
      this.showValidation = false;
    }
  },
  computed: {
    editingSelf: function(){
      return this.user.username.toLowerCase() == this.$store.currentUserUsername ;
    },
    cancelButtonText: function(){
      return this.formDirty ? "Cancel" : "Close";
    },
    passwordValid: function () {
      var p1 = this.password ?? "";
      var p2 = this.confirmPassword ?? "";

      if (p1.length > 0 || p2.length > 0 || this.newUser)
        return p1 == p2 && p1.length > 5;
      else return null;
    },
    usernameValid: function () {
      if (this.showValidation)
        return this.user.username != null && this.user.username.length > 3;
      else return null;
    },
    fullnameValid: function () {
      if (this.showValidation)
        return this.user.fullname != null && this.user.fullname.length > 0;
      else return null;
    },
    emailAddressValid: function () {
      if (this.showValidation)
        return (
          this.user.emailaddress != null && this.user.emailaddress.length > 3
        );
      else return null;
    },
    formValid: function () {
      return (
        this.passwordValid != false &&
        this.usernameValid != false &&
        this.fullnameValid != false &&
        this.emailAddressValid != false
      );
    },
  },
  created: function() {
    if ( ! this.username || this.username == '' ) {
      // create user
      this.setModel(UserLib.newUser());
      this.newUser = true;
    } else {
      // edit user
      this.setModel(this.$store.userDirectory[this.username]);
    }
    this.formDirty = false;
    this.password = "";
    this.confirmPassword = ""
    this.showValidation = false;
  }
};
</script>
