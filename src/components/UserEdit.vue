<template>
    <b-form v-if="user">
        <hr/>
        <b-form-group
            id="input-group-username"
            label="Username"
            label-for="input-username"
        >
        <b-form-input
            id="input-username"
            v-model="user.username"
            type="text"
            required
            disabled
        ></b-form-input>
        </b-form-group>

        <b-form-group
            id="input-group-fullname"
            label="Fullname"
            label-for="input-fullname"
        >
        <b-form-input
            id="input-fullname"
            v-model="user.fullname"
            type="text"
        ></b-form-input>
        </b-form-group>

        <p>Roles</p>

        <b-list-group>
            <b-list-group-item 
                v-for="role in this.user.roles" 
                v-bind:key="role" 
                v-bind:data-role="role">
                {{ role }}
            </b-list-group-item>
        </b-list-group>


    </b-form>
</template>

<script>
export default {
  name: "UserEdit",
  props: {
      user: Object
  }
};
</script>

<style scoped>

</style>