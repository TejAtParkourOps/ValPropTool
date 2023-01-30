<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="gainCreatorToEdit ? 'Edit Gain Creator' : 'Add Gain Creator'"
    @ok="emit"
    :ok-disabled="description.length < 1 || relatesTo.length < 1"
  >
    <p><strong>What</strong> gains(s) does this feature produce?</p>
    <multiselect
      v-model="relatesTo"
      :options="customerGains"
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
      <strong>What</strong> does this feature do to produce the
      {{ relatesTo.length > 1 ? "gains" : "gain" }}?
    </p>
    <p>
      <strong>How</strong> does this feature produce the
      {{ relatesTo.length > 1 ? "gains" : "gain" }}?
    </p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddGainCreatorModel",
  props: {
    customerGains: Array,
  },
  methods: {
    showForAdd(parentId) {
      this.gainCreatorToEdit = null;
      this.description = "";
      this.relatesTo = [];
      this.parentIds = [parentId];
      this.$refs.modal.show();
    },
    showForEdit(gainCreatorToEdit) {
      this.gainCreatorToEdit = gainCreatorToEdit;
      this.description = this.gainCreatorToEdit.description;
      this.relatesTo = this.gainCreatorToEdit.relatesTo.map((g) =>
        this.customerGains.find((h) => h.id === g)
      );
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.gainCreatorToEdit) {
        this.gainCreatorToEdit.description = this.description;
        this.gainCreatorToEdit.relatesTo = this.relatesTo.map((o) => o.id);
        this.$emit("gainCreatorRedescribed", this.gainCreatorToEdit);
      } else {
        this.$emit("newGainCreatorDescribed", {
          id: uuidv4(),
          parentIds: this.parentIds,
          type: "Gain Creator",
          description: this.description,
          relatesTo: this.relatesTo.map((o) => o.id),
        });
      }
    },
  },
  data() {
    return {
      description: "",
      relatesTo: [],
      parentIds: [""],
      gainCreatorToEdit: null,
    };
  },
};
</script>

<style lang="scss">
// .multiselect__tag {
//     background-color: blue;
//     * {
//         background-color: blue;
//         &:hover {
//             background-color: blue;
//         }
//     }
// }

// .multiselect__option, .multiselect__option--highlight, .multiselect__option--selected {
//     background-color: none;
//     * {
//         background-color: none;
//     }
// }
</style>
