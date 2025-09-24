<template>
  <div class="expense-form">
    <button class="cancel-btn" @click="back">
      <i class="ri-close-large-fill"></i>
    </button>
    <h1>Add Expense</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Title -->
      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          id="title"
          v-model="expense.title"
          placeholder="Enter expense title"
          @input="filterText"
        />
        <small v-if="errormsg" class="name-error">{{ errormsg }}</small>
      </div>

      <!-- Amount -->
      <div class="form-group">
        <label for="amount">Amount</label>
        <input
          type="number"
          id="amount"
          v-model.number="expense.amount"
          placeholder="Enter amount"
          step="any"
        />
        <small v-if="amountError" class="amount-error">{{ amountError }}</small>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="expense.category">
          <option disabled value="">Select category</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
      </div>

      <!-- Toggle Image -->
      <div class="form-group toggle-group">
        <label class="switch">
          <input
            type="checkbox"
            v-model="expense.toggel"
            @change="handleToggel"
          />
          <span class="slider round"></span>
        </label>
        <span class="toggle-label">Toggle to keep Image</span>
      </div>

      <!-- Image Input -->
      <div class="form-group" v-if="expense.toggel">
        <label for="image">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          multiple
          @change="handleImage"
        />
      </div>

      <!-- Date -->
      <div class="form-group toggle-group">
        <label for="date">Date</label>
        <input type="date" id="date" v-model="expense.date" />
        <small v-if="dateError" class="date-error">{{ dateError }}</small>
      </div>

      <button type="submit" class="submit-btn">Add Expense</button>
    </form>
  </div>
</template>

<script>
import { EventBus } from "../eventBus";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      expense: {
        id: null,
        title: "",
        amount: "",
        category: "Food",
        toggel: false,
        date: "",
      },

      errormsg: "",
      amountError: "",
      dateError: "",
    };
  },

  created() {
    const id = this.$route.query.id;
    if (id) {
      const saved = JSON.parse(localStorage.getItem("expenses") || "[]");
      const exp = saved.find((e) => e.id == id);
      if (exp) this.expense = { ...exp };
    }
  },

  methods: {
    filterText() {
      this.expense.title = this.expense.title.replace(/[^a-zA-Z\s]/g, "");
    },

    handleToggel() {
      console.log(this.expense.toggel ? "On" : "Off");
    },

    handleImage(element) {
      const files = element.target.files;
      this.expense.image = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.expense.image.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    handleSubmit() {
      let hasError = false;

      // Title validation
      if (!this.expense.title.trim()) {
        this.errormsg = "Name is required";
        hasError = true;
      } else {
        this.errormsg = "";
      }

      // Amount validation
      if (
        this.expense.amount === null ||
        this.expense.amount === "" ||
        this.expense.amount === undefined
      ) {
        this.amountError = "Amount is required";
        hasError = true;
      } else if (this.expense.amount <= 0) {
        this.amountError = "Amount must be greater than 0";
        hasError = true;
      } else if (!Number.isInteger(this.expense.amount)) {
        this.amountError = "Amount must be a whole number";
        hasError = true;
      } else {
        this.amountError = "";
      }

      // Date validation
      if (!this.expense.date) {
        this.dateError = "Date is required";
        hasError = true;
      } else {
        this.dateError = "";
      }

      if (hasError) return;

      const saved = JSON.parse(localStorage.getItem("expenses") || "[]");
      const id = this.$route.query.id;

      if (id) {
        const index = saved.findIndex((e) => e.id == id);
        if (index !== -1) saved[index] = { ...this.expense, id: Number(id) };
        localStorage.setItem("expenses", JSON.stringify(saved));

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Expense Updated Successfully!",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          this.$router.push("/"); // redirect after update
        });
      } else {
        const newExp = { ...this.expense, id: Date.now() };
        saved.push(newExp);
        localStorage.setItem("expenses", JSON.stringify(saved));
        EventBus.$emit("expenses-added", newExp);

        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Expense Added Successfully!",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          this.$router.push("/"); // redirect after update
        });
      }

      // Reset form
      this.expense = {
        title: "",
        amount: "",
        category: "Food",
        toggel: false,
        date: "",
      };
    },

    back() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped></style>
