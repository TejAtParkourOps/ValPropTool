<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    title="Pain Reliever"
    @ok="emit"
    :ok-disabled="description.length < 1 || relatesTo.length < 1"
  >
    <p><strong>What</strong> pain(s) does this feature relieve?</p>
    <multiselect
      v-model="relatesTo"
      :options="customerPains"
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
      <strong>What</strong> does this feature do to relieve the
      {{ relatesTo.length > 1 ? "pains" : "pain" }}?
    </p>
    <p>
      <strong>How</strong> does this feature relieve the
      {{ relatesTo.length > 1 ? "pains" : "pain" }}?
    </p>
    <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
  </b-modal>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddPainRelieverModal",
  props: {
    customerPains: Array,
  },
  methods: {
    showForAdd(parentId) {
      this.description = "";
      this.relatesTo = [];
      this.parentId = parentId;
      this.$refs.modal.show();
    },
    showForEdit(painRelieverToEdit) {
      this.painRelieverToEdit = painRelieverToEdit;
      this.description = this.painRelieverToEdit.description;
      this.relatesTo = this.painRelieverToEdit.relatesTo.map(p => this.customerPains.find(q => q.id === p));
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    emit() {
      if (this.painRelieverToEdit) {
        this.painRelieverToEdit.description = this.description;
        this.painRelieverToEdit.relatesTo = this.relatesTo.map((o) => o.id);
        this.$emit("painRelieverRedescribed", this.painRelieverToEdit);
      } else {
        this.$emit("newPainRelieverDescribed", {
          id: uuidv4(),
          parentId: this.parentId,
          type: "Pain Reliever",
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
      parentId: "",
      painRelieverToEdit: null
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
