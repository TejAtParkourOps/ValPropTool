<template>
    <b-modal ref="modal" no-close-on-backdrop title="Gain Creator" @ok="emit" :ok-disabled="description.length < 1 || relatesTo.length < 1">
        <multiselect v-model="relatesTo" :options="customerGains" class="mb-2" multiple track-by="description" placeholder="" :custom-label="(o)=>o.description" hideSelected>
            <template slot="option" slot-scope="{ option }">
                {{ option.description }}
            </template>
            <!-- <template slot="tag" slot-scope="{ option, remove }">
                {{ option.description }}
                <a href="#" @click="()=>remove()">Delete</a>
            </template> -->
        </multiselect>
        <b-form-textarea
        placeholder="..."
        v-model="description"
        ></b-form-textarea>
    </b-modal>
</template>

<script>
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: "AddGainCreatorModel",
        props: {
            customerGains: Array,
        },
        methods: {
            show(parentId) {
                this.description = "";
                this.relatesTo = [];
                this.parentId = parentId;
                this.$refs.modal.show();
            },
            hide() {
                this.$refs.modal.hide();
            },
            emit() {
                this.$emit("newGainCreatorDescribed", {
                    id: uuidv4(),
                    parentId: this.parentId,
                    type: "Gain Creator",
                    description: this.description,
                    relatesTo: this.relatesTo.map(o => o.id)
                });
            }
        },
        data() {
            return {
                description: "",
                relatesTo: [],
                parentId: ""
            }
        }
    }
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