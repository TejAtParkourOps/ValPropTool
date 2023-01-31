<template>
  <b-modal
    ref="modal"
    no-close-on-backdrop
    :title="editMode ? `Edit ${type}` : `Add ${type}`"
    @ok="emit"
    :ok-disabled="!description || description.length < 1"
  >
    <!-- parents -->
    <div v-if="isChild && allowChangeParents && parentOptions.length > 0">
      <slot name="label-parents" />
      <multiselect
        v-model="parents"
        :options="parentOptions"
        class="mb-4"
        multiple
        placeholder=""
        :custom-label="(o) => o.description"
        hideSelected
        track-by="id"
      >
        <template slot="option" slot-scope="{ option }">
          {{ option.description }}
        </template>
      </multiselect>
    </div>

    <!-- relations -->
    <div v-if="isChild && allowChangeRelations && relationOptions.length > 0">
      <slot name="label-relations" />
      <multiselect
        v-model="relations"
        :options="relationOptions"
        class="mb-4"
        multiple
        placeholder=""
        :custom-label="(o) => o.description"
        hideSelected
        track-by="id"
      >
        <template slot="option" slot-scope="{ option }">
          {{ option.description }}
        </template>
      </multiselect>
    </div>

    <!-- description -->
    <div>
      <slot name="label-description" />
      <b-form-textarea placeholder="" v-model="description"></b-form-textarea>
    </div>
  </b-modal>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AddNodeModal",
  props: {
    type: {
      type: String,
      required: true,
    },
    isChild: {
      type: Boolean,
      default: false,
    },
    allowChangeParents: {
      type: Boolean,
      default: true,
    },
    isRelation: {
      type: Boolean,
      default: false,
    },
    allowChangeRelations: {
      type: Boolean,
      default: true,
    },
    parentOptions: {
      type: Array,
      default: () => [],
    },
    relationOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      id: null,
      parents: null,
      relations: null,
      description: null,
      editMode: false,
    };
  },
  methods: {
    showForAdd(parentItem) {
      this.editMode = false;
      this.id = uuidv4();
      this.parents = this.isChild
        ? [parentItem.id].map((p) =>
            this.parentOptions.find((po) => po.id === p)
          )
        : [];
      this.relations = [];
      this.description = "";
      this.$refs.modal.show();
    },
    showForEdit(item) {
      this.editMode = true;
      this.id = item.id;
      this.parents = this.isChild
        ? item.parentIds.map((p) =>
            this.parentOptions.find((po) => po.id === p)
          )
        : [];
      this.relations = this.isRelation
        ? item.relationIds.map((r) =>
            this.relationOptions.find((ro) => ro.id === r)
          )
        : [];
      this.description = item.description;
      this.$refs.modal.show();
    },
    emit() {
      const emitKey = this.editMode ? "itemRedescribed" : "itemDescribed";
      const obj = {
        id: this.id,
        type: this.type,
        parentIds: this.isChild ? this.parents?.map((p) => p.id) : [],
        relationIds: this.isRelation ? this.relations?.map((r) => r.id) : [],
        description: this.description,
      };
      this.$emit(emitKey, obj);
    },
  },
};
</script>
