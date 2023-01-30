<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddIdealCustomerProfileModal",
  methods: {
    show(idealCustomerProfileToEdit) {
      if (idealCustomerProfileToEdit) {
        this.icpToEdit = idealCustomerProfileToEdit;
        this.description = this.icpToEdit.description;
      } else {
        this.description = "";
      }
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.icpToEdit) {
        this.icpToEdit.description = this.description;
        this.$emit("idealCustomerProfileRedescribed", this.icpToEdit);
      } else {
        this.$emit("newIdealCustomerProfileDescribed", {
          id: uuidv4(),
          type: "Ideal Customer Profile",
          description: this.description,
        });
      }
    },
  },
  data() {
    return {
      description: "",
      icpToEdit: null,
    };
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="icpToEdit ? 'Edit Ideal Customer Profile' : 'Add Ideal Customer Profile'"
    @ok="emit"
    :ok-disabled="description.length < 1"
  >
    <p>
      <strong>Who</strong> is your ideal customer? <strong>Where</strong> can
      they be found?
    </p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>
