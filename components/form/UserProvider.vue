<script>
const users = [
  { id: 1, name: 'John Joe', description: 'Has good name' },
  { id: 2, name: 'John Doe', description: 'Is mysterious' }
]

export default {
  name: 'UserProvider',
  provide: {
    fetch: (id) => Promise.resolve(users.find((x) => x.id === id)),
    post: (user) => users.push(user) && Promise.resolve({ success: true })
  },
  render() {
    return this.$slots.default
  }
}
</script>
