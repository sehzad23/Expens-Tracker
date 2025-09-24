<template>
  <div class="expense-form">
    <button class="cancel-btn" @click="back">
      <i class="ri-close-large-fill"></i>
    </button>
    <h1>Add Expense</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="expense.title" placeholder="Enter expense title" @input="filterText" />
        <small v-if="errormsg" class="name-error">{{ errormsg }}</small>
      </div>

      <div class="form-group">
        <label for="amount">Amount</label>
        <input type="number" id="amount" v-model.number="expense.amount" placeholder="Enter amount" />
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

      <div class="form-group toggle-group">
        <label class="switch">
          <input type="checkbox" v-model="expense.toggel" @change="handleToggel">
          <span class="slider round"></span>
        </label>
        <span class="toggle-label">Toggel for keep Image</span>
      </div>

      <div class="form-group" v-if="expense.toggel">
        <label for="image">Image</label>
        <input type="file" id="image" accept="image/*" multiple @change="handleImage" />
      </div>



      <div class="form-group  toggle-group">
        <label for="date">Date</label>
        <input type="date" id="date" v-model="expense.date" required />
      </div>

      <button type="submit" class="submit-btn">Add Expense</button>
    </form>
  </div>
</template>

<script>

import { EventBus } from "../eventBus";
export default {
  data() {
    return {
      expense: {
        id: null,
        title: "",
        amount: "",
        category: "Food",
        toggel: false,
        date: ""

      },

      errormsg: ""
    };
  },

  created() {
    const id = this.$route.query.id;
    if (id) {
      const saved = JSON.parse(localStorage.getItem("expenses") || "[]");

      const exp = saved.find((e) => e.id == id);
      if (exp) {
        this.expense = { ...exp };
      }
    }
  },

  methods: {

    filterText() {
      this.expense.title = this.expense.title.replace(/[^a-zA-Z\s]/g, '');


    },

    handleToggel() {

      if (this.expense.toggel) {
        console.log("On Hai abhi")
      }

      else {
        console.log("Off hai abhi")
      }

    },


    handleImage(element) {
      const files = element.target.files
      this.expense.image = []

      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.expense.image.push(e.target.result)
        };
        reader.readAsDataURL(file)
      })

    },


    handleSubmit() {

      if (!this.expense.title.trim()) {
        this.errormsg = "Name is required";
      } else {
        this.errormsg = ""; // error hata do agar sahi hai
      }


      //  Amount validation
      if (this.expense.amount <= 0) {
        alert("The amount is required");
        return;
      }

      if (!Number.isInteger(this.expense.amount)) {
        alert("Amount must be a whole number");
        return;
      }

      const saved = JSON.parse(localStorage.getItem("expenses") || "[]");
      const id = this.$route.query.id;

      if (id) {
        //  edit yaha hoga
        const index = saved.findIndex((e) => e.id == id);
        if (index !== -1) {
          saved[index] = { ...this.expense, id: Number(id) };
        }
        localStorage.setItem("expenses", JSON.stringify(saved));
        alert("Expense Updated Successfully!");
      } else {
        // add yaha hoga
        const newExp = { ...this.expense, id: Date.now() };
        saved.push(newExp);
        localStorage.setItem("expenses", JSON.stringify(saved));
        EventBus.$emit("expenses-added", newExp);
        alert("Expense Added Successfully!");
      }

      this.expense = { title: "", amount: "", category: "", date: "" };
      this.$router.push("/");
    },

    back() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped></style>
