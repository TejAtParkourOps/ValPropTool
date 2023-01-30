<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddCustomerPainModal",
  methods: {
    showForAdd(parentId) {
      this.customerPainToEdit = null;
      this.description = "";
      this.parentIds = [parentId];
      this.$refs.modal.show();
    },
    showForEdit(customerPainToEdit) {
      this.customerPainToEdit = customerPainToEdit;
      this.description = this.customerPainToEdit.description;
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.customerPainToEdit) {
        this.customerPainToEdit.description = this.description;
        this.$emit("customerPainRedescribed", this.customerPainToEdit);
      } else {
        this.$emit("newCustomerPainDescribed", {
          id: uuidv4(),
          parentIds: this.parentIds,
          type: "Customer Pain",
          description: this.description,
        });
      }
    },
  },
  data() {
    return {
      description: "",
      parentIds: [""],
      customerPainToEdit: null,
    };
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="customerPainToEdit ? 'Edit Customer Pain' : 'Add Customer Pain'"
    @ok="emit"
    :ok-disabled="description.length < 1"
  >
    <p>
      <strong>What</strong> pain does the customer suffer while performing this
      job?
    </p>
    <p><strong>How</strong> does this pain feel?</p>
    <p><strong>When</strong> does the pain occur?</p>
    <p><strong>How</strong> and <strong>why</strong> does the pain occur?</p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>
