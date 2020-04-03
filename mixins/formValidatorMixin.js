import { validationMixin } from 'vuelidate'
import {
    alpha,
    required,
    email,
    minLength,
    maxLength,
    sameAs
} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    validations: {
        firstName: {
            required,
            alpha,
            minLength: minLength(2)
        },
        lastName: {
            required,
            alpha,
            minLength: minLength(2)
        },
        email: {
            required,
            email
            // async isUnique(value) {
            //     if (value === '') return true
            //     const response = await fetch(`/api/unique/${value}`)
            //     return Boolean(await response.json())
            // }
        },
        emailConfirm: {
            required,
            sameAsEmail: sameAs('email')
        },
        password: {
            required,
            minLength: minLength(8)
        },
        passwordConfirm: {
            required,
            sameAsPassword: sameAs('password')
        },
        users: {
            minLength: minLength(1),
            email: {
                required,
                email
            }
        },
        title: {
            required,
            maxLength: maxLength(25)
        },
        description: {
            required
        },
        priority: {
            required
        },
        type: {
            required
        },
        status: {
            required
        },
        points: {
            required
        },
        assignee: {
            required
        },
        reporter: {
            required
        },
        tags: {
            maxLength: maxLength(5)
        },
        select: {
            required
        }
        // loginForm: ['name', 'email'],
        // registerForm: ['users', 'tags']
    },
    computed: {
        checkboxErrors() {
            // const errors = []
            // if (!this.$v.checkbox.$dirty) return errors
            // !this.$v.checkbox.checked &&
            //     errors.push('You must agree to continue!')
            // return errors
        },
        selectErrors() {
            // const errors = []
            // if (!this.$v.select.$dirty) return errors
            // !this.$v.select.required && errors.push('Item is required')
            // return errors
        },
        firstNameErrors() {
            const errors = []
            if (!this.$v.firstName.$dirty) return errors
            !this.$v.firstName.minLength &&
                errors.push('Name must be at least 2 characters long')
            !this.$v.firstName.required &&
                errors.push('First name is required.')
            return errors
        },
        lastNameErrors() {
            const errors = []
            if (!this.$v.lastName.$dirty) return errors
            !this.$v.lastName.minLength &&
                errors.push('Name must be at least 2 characters long')
            !this.$v.lastName.required && errors.push('Last name is required.')
            return errors
        },
        emailErrors() {
            const errors = []
            if (!this.$v.email.$error) return errors
            !this.$v.email.email && errors.push('Must be valid e-mail')
            !this.$v.email.required && errors.push('E-mail is required')
            return errors
        },
        emailConfirmErrors() {
            const errors = []
            if (!this.$v.emailConfirm.$error) return errors
            !this.$v.emailConfirm.sameAsEmail && errors.push('Must match email')
            !this.$v.emailConfirm.required && errors.push('Must confirm email')
            return errors
        },
        passwordErrors() {
            const errors = []
            if (!this.$v.password.$error) return errors
            !this.$v.password.minLength &&
                errors.push('Must be at least 8 characters')
            !this.$v.password.required && errors.push('Password is required')
            return errors
        },
        passwordConfirmErrors() {
            const errors = []
            if (!this.$v.passwordConfirm.$error) return errors
            !this.$v.passwordConfirm.sameAsPassword &&
                errors.push('Must match password')
            !this.$v.passwordConfirm.required &&
                errors.push('Must confirm password')
            return errors
        },
        titleErrors() {
            const errors = []
            if (!this.$v.title.$dirty) return errors
            !this.$v.title.maxLength &&
                errors.push('Title must be at most 25 characters long')
            !this.$v.title.required && errors.push('Title is required.')
            return errors
        },
        descriptionErrors() {
            const errors = []
            if (!this.$v.description.$dirty) return errors
            !this.$v.description.required &&
                errors.push('Description is required.')
            return errors
        },
        priorityErrors() {
            const errors = []
            if (!this.$v.description.$dirty) return errors
            !this.$v.priority.required && errors.push('Priority is required.')
            return errors
        },
        typeErrors() {
            const errors = []
            if (!this.$v.type.$dirty) return errors
            !this.$v.type.required && errors.push('Type is required.')
            return errors
        },
        statusErrors() {
            const errors = []
            if (!this.$v.status.$dirty) return errors
            !this.$v.status.required && errors.push('Status is required.')
            return errors
        },
        pointsErrors() {
            const errors = []
            if (!this.$v.points.$dirty) return errors
            !this.$v.points.required && errors.push('Points is required.')
            return errors
        },
        assigneeErrors() {
            const errors = []
            if (!this.$v.assignee.$dirty) return errors
            !this.$v.assignee.required && errors.push('Assignee is required.')
            return errors
        },
        reporterErrors() {
            const errors = []
            if (!this.$v.reporter.$dirty) return errors
            !this.$v.reporter.required && errors.push('Reporter is required.')
            return errors
        }
    },
    methods: {
        focusFirstStatus(component = this) {
            if (component.status) {
                component.$el.focus()
                return true
            }

            let focused = false

            component.$children.some((childComponent) => {
                focused = this.focusFirstStatus(childComponent)
                return focused
            })

            return focused
        },
        validate() {
            this.$v.$touch()
            this.$nextTick(() => this.focusFirstStatus())
        }
    }
}
