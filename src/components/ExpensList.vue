<template>
  <div>
    <h1>I am expens list</h1>
    <button @click="goToAddForm">Add Expens</button>
    <p></p>
  </div>
</template>
<script>
export default {
  methods: {
    goToAddForm() {
      this.$router.push("/expensaddform");
    },
  },
};
</script>
<style lang="">
</style>