<template>
  <div class="expense-form">
    <button class="cancel-btn" @click="back"><i class="ri-close-large-fill"></i></button>
    <h1>Add Expense</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="expense.title" placeholder="Enter expense title" required />
      </div>

      <div class="form-group">
        <label for="amount">Amount</label>
        <input type="number" id="amount" v-model="expense.amount" placeholder="Enter amount" required />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="expense.category" required>
          <option disabled value="">Select category</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input type="date" id="date" v-model="expense.date" required />
      </div>

      <button type="submit" class="submit-btn">Add Expense</button>
    </form>
  </div>
</template>

<script>

import { EventBus } from '../eventBus'
export default {
  data() {
    return {
      expense: {
        title: "",
        amount: "",
        category: "",
        date: "",
      },
    };
  },

  methods: {
    handleSubmit() {
      // create new expense, ensure amount is numeric
      const newExp = { ...this.expense, amount: Number(this.expense.amount) };

      // persist to localStorage so list can read it even if it wasn't mounted
      const saved = JSON.parse(localStorage.getItem('expenses') || '[]');
      saved.push(newExp);
      localStorage.setItem('expenses', JSON.stringify(saved));

      // notify any active listeners
      EventBus.$emit("expenses-added", newExp);

      alert("Expense Added Successfully!");
      this.expense = { title: "", amount: "", category: "", date: "" }; // reset form

      // go back to list (list will load saved data on created)
      this.$router.push('/');
    },

    back() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped></style>
