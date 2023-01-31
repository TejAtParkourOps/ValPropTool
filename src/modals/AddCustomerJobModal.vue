<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddCustomerJobModal",
  methods: {
    showForAdd(parentId) {
      this.customerJobToEdit = null;
      this.description = "";
      this.parentIds = [
        this.idealCustomerProfiles.find((j) => j.id === parentId),
      ];
      this.$refs.modal.show();
    },
    showForEdit(customerJobToEdit) {
      this.customerJobToEdit = customerJobToEdit;
      this.description = this.customerJobToEdit.description;
      this.parentIds = this.customerJobToEdit.parentIds.map((i) =>
        this.idealCustomerProfiles.find((j) => j.id === i)
      );
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.customerJobToEdit) {
        this.customerJobToEdit.description = this.description;
        this.customerJobToEdit.parentIds = this.parentIds.map((i) => i.id);
        this.$emit("customerJobRedescribed", this.customerJobToEdit);
      } else {
        this.$emit("newCustomerJobDescribed", {
          id: uuidv4(),
          parentIds: this.parentIds.map((i) => i.id),
          type: "Customer Job",
          description: this.description,
        });
      }
    },
  },
  data() {
    return {
      description: "",
      parentIds: [""],
      customerJobToEdit: null,
    };
  },
  props: {
    idealCustomerProfiles: Array,
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="customerJobToEdit ? 'Edit Customer Job' : 'Add Customer Job'"
    @ok="emit"
    :ok-disabled="description.length < 1"
  >
    <p>Test</p>
    <multiselect
      v-model="parentIds"
      :options="idealCustomerProfiles"
      class="mb-4"
      multiple
      track-by="description"
      placeholder=""
      :custom-label="(o) => o.description"
      hideSelected
    >
      <template slot="option" slot-scope="{ option }">
        {{ option.description }}
      </template>
    </multiselect>

    <p>
      <strong>What</strong> job does the ideal customer do?
      <strong>How</strong> do they do it?
    </p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>
