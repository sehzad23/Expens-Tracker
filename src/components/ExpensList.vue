<template>
  <div class="main-list-div">
    <div class="title-addbtn">

      <h1>Your Expense List</h1>
      <button @click="goToAddForm">Add Expens</button>
    </div>

    <ul class="expense-list">
      <li v-for="(exp, index) in expenses" :key="index" class="expense-item">
        <!-- <div class="item-left">
          <span class="item-title">{{ exp.title }}</span>
          <small class="item-meta">{{ exp.category }} • {{ exp.date }}</small>
        </div>
        <div class="item-right">
          <span class="amount">Rs{{ exp.amount }}</span>
        </div> -->
        <span> {{ exp.title }}</span> <span> {{ exp.amount }} </span> <span> {{ exp.category }}</span> <span>{{ exp.date
        }}</span>
        <div class="btns">
          <span><i class="ri-delete-bin-6-line"></i></span>
          <span><i class="ri-edit-circle-fill"></i></span>
        </div>
      </li>


    </ul>
  </div>

</template>
<script>
import { EventBus } from '../eventBus';
export default {
  data() {
    return {
      expenses: [],
    }
  },
  created() {
    // load saved expenses from localStorage so items added while this component
    // was not mounted still appear
    const saved = localStorage.getItem('expenses');
    if (saved) {
      try {
        this.expenses = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved expenses:', e);
      }
    }

    EventBus.$on('expenses-added', (newexpens) => {
      console.log("Got new exp:", newexpens)
      this.expenses.push(newexpens)
    })
  },
  beforeDestroy() {
    // avoid duplicate listeners if component is recreated
    EventBus.$off('expenses-added')
  },

  computed: {
    totalAmount() {
      // sum amounts, guard for strings/empty values
      return this.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    },
  },

  methods: {
    goToAddForm() {
      this.$router.push("/expensaddform");
    },
  },
};
</script>
<style lang="">
</style>