
<template>
  <bax-select v-model="localValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :options="userOpts"
    :filter-method="query" />
</template>

<script>

import 'rxjs/add/operator/debounceTime'
import { Subject } from 'rxjs/Subject'

import BaxSelect from './select'

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
    async queryUsers(v) {
      const { users = [] } = await getUsers({name: v})
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
    this.throttle = new Subject().debounceTime(500)
  },
  async mounted() {
    this.throttle.subscribe(this.queryUsers)

    await this.queryUsers()
  },
  beforeDestroy() {
    this.throttle.unsubscribe(this.queryUsers)
  }
}

</script>
