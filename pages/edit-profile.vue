<template>
  <div>
    <h2>Add User Form</h2>
    <UserForm />

    <h2>Edit User Form</h2>
    <UserForm :id="1" />
  </div>
</template>

<script>
import FormBuilder from '@@/builders/FormBuilder'
import FormDirector from '@@/builders/FormDirector'
export default {
  name: 'EditProfilePage',
  head: () => ({
    title: 'Profile'
  }),
  components: {
    UserForm: new FormDirector(new FormBuilder()).makeUserForm()
  }
}
</script>
