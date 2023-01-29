<script>
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: "AddProductOrServiceModal",
        methods: {
            show() {
                this.description = "";
                this.type = "Product";
                this.$refs.modal.show();
            },
            hide() {
                this.$refs.modal.hide();
            },
            emit() {
                this.$emit("newProductOrServiceDescribed", {
                    id: uuidv4(),
                    type: this.type,
                    description: this.description
                });
            }
        },
        data() {
            return {
                description: "",
                type: "Product",
                typeOptions: ["Product", "Service"]
            }
        }
    }
</script>

<template>
    <b-modal ref="modal" no-close-on-backdrop title="Add Product or Service" @ok="emit" :ok-disabled="description.length < 1">
        <b-form-select v-model="type" :options="typeOptions" class="mb-2" />
        <b-form-textarea
        placeholder="..."
        v-model="description"
        ></b-form-textarea>
    </b-modal>
</template>