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

      <!-- name -->
      <div class="form-group">
        <label for="title">Name</label>
        <input
          type="text"
          id="title"
          v-model="expense.name"
          placeholder="Enter expense title"
          @input="filterText"
        />
        <small v-if="nameError" class="name-error">{{ nameError }}</small>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="expense.email"
          placeholder="Enter email"
        />
        <small v-if="emailError" class="name-error">{{ emailError }}</small>
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

      <!-- Radio Buttons Example -->
      <div class="form-group-payment">
        <label>Payment Mode</label>

        <div class="option">
          <input
            type="radio"
            id="cash"
            value="Cash"
            v-model="expense.paymentMode"
          />
          <label for="cash">Cash</label>
        </div>

        <div class="option">
          <input
            type="radio"
            id="card"
            value="Card"
            v-model="expense.paymentMode"
          />
          <label for="card">Card</label>
        </div>

        <div class="option">
          <input
            type="radio"
            id="upi"
            value="UPI"
            v-model="expense.paymentMode"
          />
          <label for="upi">UPI</label>
        </div>

        <small v-if="paymentModeError" class="amount-error">
          {{ paymentModeError }}
        </small>
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

      <!-- Toggle -->
      <div class="form-group toggle-group">
        <label class="switch">
          <input
            type="checkbox"
            v-model="expense.toggel"
            @change="handleToggel"
          />
          <span class="slider round"></span>
        </label>
        <span class="toggle-label"></span>
      </div>

      <!-- Image Input -->
      <div class="form-group">
        <label for="image">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          multiple
          @change="handleImage"
        />
        <small v-if="imageError" class="date-error">{{ imageError }}</small>
      </div>

      <!-- Date -->
      <div class="form-group toggle-group">
        <label for="date">Date</label>
        <input type="date" id="date" v-model="expense.date" />
        <small v-if="dateError" class="date-error">{{ dateError }}</small>
      </div>

      <!-- Textarea -->
      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="expense.notes"
          cols="40"
          rows="5"
          placeholder="Enter notes"
        ></textarea>
        <small v-if="notesError" class="date-error">{{ notesError }}</small>
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
        name: "",
        email: "",
        amount: "",
        paymentMode: "",
        category: "Food",
        toggel: false,
        date: "",
        notes: "",
        image: [],
      },

      // Error messages
      errormsg: "", // Title
      nameError: "", // Name
      emailError: "", // Email
      amountError: "", // Amount
      paymentModeError: "", // Payment Mode
      categoryError: "", // Category
      imageError: "", // Image
      dateError: "", // Date
      notesError: "", // Notes
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
        this.errormsg = "Title is required";
        hasError = true;
      } else {
        this.errormsg = "";
      }

      // Name validation
      if (!this.expense.name.trim()) {
        this.nameError = "Name is required";
        hasError = true;
      } else {
        this.nameError = "";
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.expense.email.trim()) {
        this.emailError = "Email is required";
        hasError = true;
      } else if (!emailRegex.test(this.expense.email)) {
        this.emailError = "Enter a valid email address";
        hasError = true;
      } else {
        this.emailError = "";
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

      // Payment Mode validation
      if (!this.expense.paymentMode) {
        this.paymentModeError = "Please select a payment mode";
        hasError = true;
      } else {
        this.paymentModeError = "";
      }

      // Category validation
      if (!this.expense.category) {
        this.categoryError = "Please select a category";
        hasError = true;
      } else {
        this.categoryError = "";
      }

      // Image validation (optional: only if toggle is true)
      if (!this.expense.image || this.expense.image.length === 0) {
        this.imageError = "Please upload at least one image";
        hasError = true;
      } else {
        this.imageError = "";
      }

      // Date validation
      if (!this.expense.date) {
        this.dateError = "Date is required";
        hasError = true;
      } else {
        this.dateError = "";
      }

      // Notes validation
      if (!this.expense.notes.trim()) {
        this.notesError = "Notes are required";
        hasError = true;
      } else if (this.expense.notes.length < 10) {
        this.notesError = "Notes must be at least 10 characters";
        hasError = true;
      } else {
        this.notesError = "";
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


Allow respondents to instantly schedule appointments, making it easier than ever to engage and connect right after
completing a funnel.
