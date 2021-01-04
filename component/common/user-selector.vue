
<template>
  <bax-select v-model="localValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :options="userOpts"
    :filter-method="query">
  </bax-select>
</template>

<script>
import 'rxjs/add/operator/debounceTime'
import { Subject } from 'rxjs/Subject'

import BaxSelect from './select'

import es from 'base/es'

import {
  getUsers
} from 'api/account'

export default {
  name: 'bax-user-selector',
  components: {
    BaxSelect
  },
  props: {
    placeholder: String,
    clearable: Boolean,
    multiple: Boolean,
    value: {
      type: [String, Number, Array]
    }
  },
  data() {
    return {
      localValue: this.value,
      users: []
    }
  },
  methods: {
    query(v) {
      console.debug('query', v)
      this.throttle.next(v)
    },
    setValue(v) {
      this.$emit('change', v)
      this.$emit('input', v)

      if (v === this.localValue) {
        return
      }

      this.localValue = v
    },
    async appendUsers(params = {}) {
      const { userId } = params

      if (userId) {
        const { users = [] } = await getUsers({userId})

        this.users = [
          ...users,
          ...this.users
        ]
      }
    },
    async queryUsers(mobile) {
      const { users = [] } = await getUsers({ mobile })
      this.users = users
    }
  },
  watch: {
    localValue(v) {
      this.setValue(v)
    },
    value(v) {
      if (v === this.localValue) {
        return
      }

      this.localValue = v
      console.debug('value changed', v)
      this.throttle.next(v)
    }
  },
  computed: {
    userOpts() {
      return this.users.map(u => ({
        label: u.name,
        value: u.id
      }))
    }
  },
  beforeMount() {
    this.throttle = new Subject().debounceTime(800)
  },
  beforeDestroy() {
    es.removeListener('new user created', this.appendUsers)
    this.throttle.unsubscribe()
  },
  async mounted() {
    es.addListener('new user created', this.appendUsers)

    this.throttle.subscribe(this.queryUsers)

    await this.queryUsers()
  }
}
</script>
