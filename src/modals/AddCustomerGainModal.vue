<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddCustomerGainModal",
  methods: {
    showForAdd(parentId) {
      this.customerGainToEdit = null;
      this.description = "";
      this.parentIds = [parentId];
      this.$refs.modal.show();
    },
    showForEdit(customerGainToEdit) {
      this.customerGainToEdit = customerGainToEdit;
      this.description = this.customerGainToEdit.description;
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.customerGainToEdit) {
        this.customerGainToEdit.description = this.description;
        this.$emit("customerGainRedescribed", this.customerGainToEdit);
      } else {
        this.$emit("newCustomerGainDescribed", {
          id: uuidv4(),
          parentIds: this.parentIds,
          type: "Customer Gain",
          description: this.description,
        });
      }
    },
  },
  data() {
    return {
      description: "",
      parentIds: [""],
      customerGainToEdit: null,
    };
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="customerGainToEdit ? 'Edit Customer Gain' : 'Add Customer Gain'"
    @ok="emit"
    :ok-disabled="description.length < 1"
  >
    <p><strong>What</strong> gain does the job produce for the customer?</p>
    <p><strong>How</strong> does this gain feel?</p>
    <p><strong>When</strong> does the gain occur?</p>
    <p><strong>How</strong> and <strong>why</strong> does the gain occur?</p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>
