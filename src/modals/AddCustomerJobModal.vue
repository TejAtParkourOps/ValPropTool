<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddCustomerJobModal",
  methods: {
    showForAdd(parentId) {
      this.description = "";
      this.parentId = parentId;
      this.$refs.modal.show();
    },
    showForEdit(customerJobToEdit) {
      this.customerJobToEdit = customerJobToEdit;
      this.description = this.customerJobToEdit.description;
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.customerJobToEdit) {
        this.customerJobToEdit.description = this.description;
        this.$emit("customerJobRedescribed", this.customerJobToEdit);
      } else {
        this.$emit("newCustomerJobDescribed", {
          id: uuidv4(),
          parentId: this.parentId,
          type: "Customer Job",
          description: this.description,
        });
      }
    },
  },
  data() {
    return {
      description: "",
      parentId: "",
      customerJobToEdit: null
    };
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    title="Add Customer Job"
    @ok="emit"
    :ok-disabled="description.length < 1"
  >
    <p>
      <strong>What</strong> job does the ideal customer do?
      <strong>How</strong> do they do it?
    </p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>
