<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddCustomerPainModal",
  methods: {
    show(parentId) {
      this.description = "";
      this.parentId = parentId;
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      this.$emit("newCustomerPainDescribed", {
        id: uuidv4(),
        parentId: this.parentId,
        type: "Customer Pain",
        description: this.description,
      });
    },
  },
  data() {
    return {
      description: "",
      parentId: "",
    };
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    title="Add Customer Pain"
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
    <b-form-textarea placeholder="..." v-model="description"></b-form-textarea>
  </b-modal>
</template>
