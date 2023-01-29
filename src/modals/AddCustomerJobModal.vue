<script>
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: "AddCustomerJobModal",
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
                this.$emit("newCustomerJobDescribed", {
                    id: uuidv4(),
                    parentId: this.parentId,
                    type: "Customer Job",
                    description: this.description
                });
            }
        },
        data() {
            return {
                description: "",
                parentId: ""
            }
        }
    }
</script>

<template>
      <b-modal ref="modal" no-close-on-backdrop title="Customer Job" @ok="emit" :ok-disabled="description.length < 1">
        <b-form-textarea
        placeholder="As a customer, I..."
        v-model="description"
        ></b-form-textarea>
      </b-modal>
</template>