// This will hold the the form creating functions,
// not sure if I want to use it or just make the form on each page

import { required } from 'vuelidate/lib/validators'

import UserProvider from '@@/components/form/UserProvider.vue'

import FormInput from '@@/components/form/FormInput.vue'
import FormTextarea from '@@/components/form/FormTextarea.vue'

export default class FormDirector {
  constructor(builder) {
    this.builder = builder
  }

  makeUserForm() {
    return this.builder
      .withProvider(UserProvider)
      .addField({
        component: FormInput,
        label: 'Name',
        name: 'name',
        options: {
          attrs: {
            placeholder: 'Your name'
          }
        },
        validation: {
          required
        }
      })
      .addField({
        component: FormTextarea,
        label: 'Bio',
        name: 'bio',
        options: {
          attrs: {
            placeholder: 'About you'
          }
        }
      })
      .build()
  }
}
