<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddProductOrServiceModal",
  methods: {
    showForAdd() {
      this.productOrServiceToEdit = null;
      this.description = "";
      this.type = "Product";
      this.$refs.modal.show();
    },
    showForEdit(productOrServiceToEdit) {
      this.productOrServiceToEdit = productOrServiceToEdit;
      this.description = this.productOrServiceToEdit.description;
      this.type = this.productOrServiceToEdit.type;
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.productOrServiceToEdit) {
        this.productOrServiceToEdit.description = this.description;
        this.productOrServiceToEdit.type = this.type;
        this.$emit("productOrServiceRedescribed", this.productOrServiceToEdit);
      } else {
        this.$emit("newProductOrServiceDescribed", {
          id: uuidv4(),
          type: this.type,
          description: this.description,
        });
      }
    },
  },
  data() {
    return {
      description: "",
      type: "Product",
      typeOptions: ["Product", "Service"],
      productOrServiceToEdit: null,
    };
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="
      productOrServiceToEdit
        ? 'Edit Product or Service'
        : 'Add Product or Service'
    "
    @ok="emit"
    :ok-disabled="description.length < 1"
  >
    <b-form-select v-model="type" :options="typeOptions" class="mb-4" />
    <p><strong>What</strong> is this {{ type.toLowerCase() }} called?</p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>
