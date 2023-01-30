<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddMessageModal",
  methods: {
    showForAdd(parentId) {
      this.messageToEdit = null;
      this.description = "";
      this.parentIds = [parentId];
      this.$refs.modal.show();
    },
    showForEdit(messageToEdit) {
      this.messageToEdit = messageToEdit;
      this.description = this.messageToEdit.description;
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.messageToEdit) {
        this.messageToEdit.description = this.description;
        this.$emit("messageRedescribed", this.messageToEdit);
      } else {
        this.$emit("newMessageDescribed", {
          id: uuidv4(),
          parentIds: this.parentIds,
          type: "Message",
          description: this.description,
        });
      }
    },
  },
  data() {
    return {
      description: "",
      parentIds: [""],
      messageToEdit: null,
    };
  },
};
</script>

<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="messageToEdit ? 'Edit Message' : 'Add Message'"
    @ok="emit"
    :ok-disabled="description.length < 1"
  >
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>
