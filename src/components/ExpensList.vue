<template>
  <div class="main-list-div">
    <div class="title-addbtn">
      <h1>Your Expense List</h1>
      <button @click="goToAddForm">Add Expens</button>
    </div>



    <table class="expense-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(exp, index) in expenses" :key="exp.id">
          <td class="exp-titel">{{ exp.title }}</td>
          <td class="exp-amount">{{ exp.amount }}</td>
          <td class="exp-cetegory">{{ exp.category }}</td>
          <td class="exp-date">{{ exp.date }}</td>


          <td>
            <div v-if="exp.image && exp.image.length">
              <div v-for="(img, index) in exp.image" :key="index" class="preview-item">
                <img :src="img" alt="Expens image">
              </div>
            </div>
          </td>
          <td class="exp-btns">
            <i class="ri-delete-bin-6-line delete-icon" @click="DeleteList(index)"></i>
            <i class="ri-edit-circle-fill update-icon" @click="UpdateList(exp.id)"></i>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { EventBus } from "../eventBus";
import swal from "sweetalert";
export default {
  data() {
    return {
      expenses: [],
    };
  },
  created() {
    // load saved expenses from localStorage so items added while this component
    // was not mounted still appear
    const saved = localStorage.getItem("expenses");
    if (saved) {
      try {
        this.expenses = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved expenses:", e);
      }
    }

    EventBus.$on("expenses-added", (newexpens) => {
      console.log("Got new exp:", newexpens);
      this.expenses.push(newexpens);
    });
  },
  beforeDestroy() {
    // avoid duplicate listeners if component is recreated
    EventBus.$off("expenses-added");
  },

  methods: {
    goToAddForm() {
      this.$router.push("/expensaddform");
    },

    DeleteList(index) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this item!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("Poof! Your item has been deleted!", {
            icon: "success",
          });
          // 👇 yaha tum apna delete ka logic likh sakte ho
          // Example: this.items.splice(index, 1);
          this.expenses.splice(index, 1);
          localStorage.setItem("expenses", JSON.stringify(this.expenses));
        } else {
          swal("Your item is safe!");
        }
      });
    },

    UpdateList(id) {
      console.log(id);
      this.$router.push({ path: "/expensaddform", query: { id } });
    },
  },
};
</script>
<style lang="">
</style>