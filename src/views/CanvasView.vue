<template>
  <div>
    <!-- Canvas Header -->
    <div class="d-flex flex-row p-4 justify-content-between">
      <div id="toolbar">
        <b-button variant="primary" class="mr-1" @click="() => {$refs.AddIdealCustomerProfileModal.show()}">Add ICP</b-button>
        <b-button variant="primary" class="mr-1" @click="() => $refs.AddProductOrServiceModal.show()">Add Product/Service</b-button>
        <b-button variant="secondary" class="mr-1" @click="save" :disabled="nodes.length < 1" v-if="!routePropositionId">Save</b-button>
        <div v-else v-b-tooltip.hover.bottom title="Auto-saving" class="d-inline-block">
          <b-button variant="secondary" class="mr-1" disabled>Save</b-button>
        </div>
        <!-- <b-button variant="primary" class="mr-1" @click="share" :disabled="nodes.length < 1">Share</b-button> -->
        <b-button variant="secondary" class="mr-1" @click="reset" :disabled="nodes.length < 1">Reset</b-button>
      </div>
      <div>
        <h2 class="mr-1 cursor-pointer text-secondary project-name" @click="changeName">{{ Name }}</h2>
      </div>
    </div>
    <!-- Canvas -->
    <div id="canvas-wrapper">
      <svg id="canvas"></svg>
    </div>
    <!-- Context Menu -->
    <div id="context-menu" ref="context-menu">
      <b-card class="shadow" v-if="selectedItem" >
        Test
      </b-card>
    </div>
    <!-- Modals -->
    <TextboxPromptModal ref="TextboxPromptModal" />
    <AddCustomerJobModal ref="addCustomerJobModal" @newCustomerJobDescribed="newCustomerJob" />
    <AddCustomerGainModal ref="AddCustomerGainModal" @newCustomerGainDescribed="newCustomerGain" />
    <AddCustomerPainModal ref="AddCustomerPainModal" @newCustomerPainDescribed="newCustomerPain" />
    <AddIdealCustomerProfileModal ref="AddIdealCustomerProfileModal" @newIdealCustomerProfileDescribed="newIdealCustomerProfile" />
    <AddProductOrServiceModal ref="AddProductOrServiceModal" @newProductOrServiceDescribed="newProductOrService" />
    <AddMessageModal ref="AddMessageModal" @newMessageDescribed="newMessage" />
    <AddPainRelieverModal ref="AddPainRelieverModal" @newPainRelieverDescribed="newPainReliever" :customer-pains="Pains" />
    <AddGainCreatorModal ref="AddGainCreatorModal" @newGainCreatorDescribed="newGainCreator" :customer-gains="Gains" />
  </div>
</template>


<script>
  import { useUserInfo } from '@/plugins/userInfo';
  import { writeItem, readItem } from '@/plugins/firebase';
  import AddCustomerJobModal from "@/modals/AddCustomerJobModal.vue";
  import AddCustomerGainModal from "@/modals/AddCustomerGainModal.vue";
  import AddCustomerPainModal from "@/modals/AddCustomerPainModal.vue";
  import AddIdealCustomerProfileModal from "@/modals/AddIdealCustomerProfileModal.vue";
  import AddProductOrServiceModal from "@/modals/AddProductOrServiceModal.vue";
  import AddMessageModal from "@/modals/AddMessageModal.vue";
  import AddPainRelieverModal from "@/modals/AddPainRelieverModal.vue";
  import AddGainCreatorModal from "@/modals/AddGainCreatorModal.vue";
  import * as d3 from "d3";
  import { uuidv4 } from '@firebase/util';
  import TextboxPromptModal from '@/modals/TextboxPromptModal.vue';
import { timeout } from 'd3';

  const objCopy = (toCopy) => JSON.parse(JSON.stringify(toCopy));

  export default {
    name: "CanvasView",
    components: { AddCustomerJobModal, AddCustomerGainModal, AddCustomerPainModal, AddIdealCustomerProfileModal, AddProductOrServiceModal, TextboxPromptModal, AddMessageModal, AddPainRelieverModal, AddGainCreatorModal },
    setup() {
            const userInfoStore = useUserInfo();
            return {
                userInfoStore
            }
    },
    data() {
        return {
            Name: "Untitled Project",
            IdealCustomerProfiles: [],
            CustomerJobs: [],
            Pains: [],
            Gains: [],
            ProductsAndServices: [],
            GainCreators: [],
            PainRelievers: [],
            Messages: [],
            _graphContent: null,
            _simulation: null,
            _linkElements: null,
            _circleElements: null,
            _iconElements: null,
            selectedItem: null,
            hoveredItem: null,
            saved: false,
        };
    },
    methods: {
      newCustomerJob(job) {
        this.CustomerJobs.push(job);
        this.selectedItem = null;
      },
      newCustomerGain(gain) {
        this.Gains.push(gain);
        this.selectedItem = null;
      },
      newCustomerPain(pain) {
        this.Pains.push(pain);
        this.selectedItem = null;
      },
      newIdealCustomerProfile(icp) {
        this.IdealCustomerProfiles.push(icp);
        this.selectedItem = null;
      },
      newProductOrService(productOrService) {
        this.ProductsAndServices.push(productOrService);
        this.selectedItem = null;
      },
      newMessage(message) {
        this.Messages.push(message);
        this.selectedItem = null;
      },
      newPainReliever(painReliever) {
        this.PainRelievers.push(painReliever);
        this.selectedItem = null;
      },
      newGainCreator(gainCreator) {
        this.PainRelievers.push(gainCreator);
        this.selectedItem = null;
      },
      changeName() {
        this.$refs.TextboxPromptModal.show("Rename Proposition", undefined, "My Awesome Value Prop", this.Name)
          .then((newName) => {
            this.Name = newName;
          })
          .catch(()=>{})
      },
      draw() {
        if (this._circleElements || this._iconElements || this._linkElements) {
          const s = d3.selectAll("svg#canvas g");
          s.remove();
        }

        this._linkElements = this._graphContent
          .append('g')
          .selectAll('line')
          .data(this.links)
          .join('line')
            .attr('stroke-width', "7px")
            .attr('stroke', '#D4E9FF')
            .classed('pain-line', l => {
              const source = this.nodes.find(n => n.id === l.source);
              const target = this.nodes.find(n => n.id === l.target);
              const sourceIsPainReliever = (source.type === 'Pain Reliever');
              const targetIsCustomerPain = (target.type === 'Customer Pain');
              return sourceIsPainReliever && targetIsCustomerPain;
            })
            .classed('gain-line', l => {
              const source = this.nodes.find(n => n.id === l.source);
              const target = this.nodes.find(n => n.id === l.target);
              const sourceIsGainCreator = (source.type === 'Gain Creator');
              const targetIsCustomerGain = (target.type === 'Customer Gain');
              return sourceIsGainCreator && targetIsCustomerGain;
            })
            

        const _wrapperElements = this._graphContent
            .append('g')
            .selectAll("g")
            .data(this.nodes)
            .join("g")
            .classed("node-wrapper", true)
            .classed("icp", n => (n.type === "Ideal Customer Profile"))
            .classed("cj", n => (n.type === "Customer Job"))
            .classed("cg", n => (n.type === "Customer Gain"))
            .classed("cp", n => (n.type === "Customer Pain"))
            .classed("product", n => (n.type === "Product"))
            .classed("service", n => (n.type === "Service"))
            .classed("msg", n => (n.type === "Message"))
            .classed("pr", n => (n.type === "Pain Reliever"))
            .classed("gc", n => (n.type === "Gain Creator"))
            .on("mouseenter", (d, i) => {
              // d.preventDefault();
              // d.stopPropagation();
              this.hoveredItem = null;
              this.selectedItem = i;
              const ctxMenu = this.$refs["context-menu"];
              ctxMenu.style.top = `${d.y + window.scrollY}px`;
              ctxMenu.style.left = `${d.x}px`;
              ctxMenu.classList.add("show");
            })
            .on("mouseleave", (d) => {
              // d.preventDefault();
              // d.stopPropagation();
              this.hoveredItem = null;
              this.selectedItem = null;
            })
        
        this._circleElements = _wrapperElements
            .append("circle")
            .attr("r", 60);

        const a = this._graphContent.selectAll("g.icp").append('image')
        .attr("href",  "/icons/customer-profile.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const b = this._graphContent.selectAll("g.cj").append('image')
        .attr("href",  "/icons/customer-job.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const c = this._graphContent.selectAll("g.cg").append('image')
        .attr("href",  "/icons/customer-gain.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const d = this._graphContent.selectAll("g.cp").append('image')
        .attr("href",  "/icons/customer-pain.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const e = this._graphContent.selectAll("g.product").append('image')
        .attr("href",  "/icons/product.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const f = this._graphContent.selectAll("g.service").append('image')
        .attr("href",  "/icons/service.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const g = this._graphContent.selectAll("g.msg").append('image')
        .attr("href",  "/icons/message.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const h = this._graphContent.selectAll("g.pr").append('image')
        .attr("href",  "/icons/pain-reliever.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        const i = this._graphContent.selectAll("g.gc").append('image')
        .attr("href",  "/icons/gain-creator.svg")
        .attr("height", "60px")
        .attr("width", "60px");

        this._iconElements = d3.selectAll([...a, ...b, ...c, ...d, ...e, ...f, ...g, ...h, ...i]);

        this._graphContent.on("click", () => {
            this.selectedItem = null;
            const ctxMenu = this.$refs["context-menu"];
            ctxMenu.classList.remove("show");
        });

        // https://www.d3indepth.com/force-layout/
        this._simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink().id(d => d.id).distance(150).links(this.links))
            .force("charge", d3.forceManyBody().strength(100))
            .force("center", d3.forceCenter(window.innerWidth/2, window.innerHeight/2))
            .force("collision", d3.forceCollide().radius(60))
            .on("tick", (d) => {
              this._circleElements
                .attr("cx", n => n.x)
                .attr("cy", n => n.y);
                this._iconElements
                .attr("x", n => n.x - 30)
                .attr("y", n => n.y - 30);
              this._linkElements
                .attr("x1", l => l.source.x )
                .attr("y1", l => l.source.y )
                .attr("x2", l => l.target.x )
                .attr("y2", l => l.target.y )
            });
      },
      forEachNodeArray(funct){
        [
            "IdealCustomerProfiles", 
            "CustomerJobs",
            "Gains",
            "Pains", 
            "ProductsAndServices",
            "GainCreators",
            "PainRelievers",
            "Messages"
          ].forEach( arrKey => {
            funct(arrKey);
          })
      },
      innerDelete(item) {
        // delete all direct child elements
        let childNode = this.nodes.filter( n => n.parentId === item.id);
        childNode.forEach( n => this.innerDelete(n) );
        // delete all links to this item
        this.forEachNodeArray((arrKey) => this.$set(this, arrKey, this[arrKey].map(i => {
          if (i?.relatesTo?.includes(item.id)) {
            i.relatesTo = i.relatesTo.filter(j => j !== item.id);
          }
          return i;
        })));
        // delete this element
        this.forEachNodeArray((arrKey) => this.$set(this, arrKey, this[arrKey].filter(i => i.id !== item.id)));
      },
      deleteItem(item) {
        this.$bvModal.msgBoxConfirm("Are you sure you want to delete this item?", {okTitle: "Yes", cancelTitle: "No"})
          .then((val) => {
            if (val === true) {
              this.innerDelete(item);
              this.selectedItem = null;
            }
          }
        )
      },
      async save() {
        // if user is not logged in, save their work to local storage and redirect them to login
        if (!this.userInfoStore.isLoggedIn) {
          // ignore if no nodes
          if (this.nodes.length < 1) return;
          const res = await this.$bvModal.msgBoxConfirm("Please sign in to save your work.");
          if (res) {
            this.saveToTmp();
            this.$router.push({name: "login"});
          }
        // if user is signed in, either auto-update (if already saved) or create
        } else {
          console.debug("Saving...");
          const id = this.routePropositionId ?? uuidv4();
          const userId = this.userInfoStore.userInfo.uid;
          await writeItem(`users/${userId}/propositions/${id}`, {
            id,
            name: this.Name,
            owner: userId,
            data: {
              IdealCustomerProfiles: this.IdealCustomerProfiles,
              CustomerJobs: this.CustomerJobs,
              Pains: this.Pains,
              Gains: this.Gains,
              ProductsAndServices: this.ProductsAndServices,
              GainCreators: this.GainCreators,
              PainRelievers: this.PainRelievers,
              Messages: this.Messages
            }
          });
          // inform user
          if (!this.routePropositionId) {
            this.$bvToast.toast("Proposition saved.");  
            await new Promise(r => setTimeout(r, 500));
          }
          // (just incase if this was a previously not logged-in user) remove tmp data from local storage and redirect to doc link
          localStorage.removeItem("tmpSaved");
          this.$router.push({name: "proposition", params: {id}})
            .catch(()=>{});
          // set saved to true
          this.saved = true;
        }
      },
      async load() {
        const propositionId = this.routePropositionId;
        const userId = this.userInfoStore?.userInfo?.uid;
        if (userId && propositionId) {
          // proposition has been requested from database
          const snapshot = await readItem(`users/${userId}/propositions/${propositionId}`);
          if (!snapshot.exists()) {
            this.$bvModal.msgBoxOk("Request proposition could not be found.");
            this.$router.push({name:"create"});
          } else {
            const val = snapshot.val();
            console.debug(val);
            this.Name = val?.name ?? "Untitled Project";
            this.IdealCustomerProfiles = val?.data?.IdealCustomerProfiles ?? [];
            this.CustomerJobs = val?.data?.CustomerJobs ?? [];
            this.Pains = val?.data?.Pains ?? [];
            this.Gains = val?.data?.Gains ?? [];
            this.ProductsAndServices = val?.data?.ProductsAndServices ?? [];
            this.GainCreators = val?.data?.GainCreators ?? [];
            this.PainRelievers = val?.data?.PainRelievers ?? [];
            this.Messages = val?.data?.Messages ?? []
          }
        } else {
          // proposition data may or may not be in tmp storage
          this.loadFromTmp();
        }
      },
      saveToTmp() {
        console.debug("Saving to tmp...");
        const data = {
          Name: this.Name,
          IdealCustomerProfiles: this.IdealCustomerProfiles,
          CustomerJobs: this.CustomerJobs,
          Pains: this.Pains,
          Gains: this.Gains,
          ProductsAndServices: this.ProductsAndServices,
          GainCreators: this.GainCreators,
          PainRelievers: this.PainRelievers,
          Messages: this.Messages
        };
        const encodedData = btoa(JSON.stringify(data));
        localStorage.setItem("tmpSaved", encodedData);
        return JSON.stringify(encodedData);
      },
      loadFromTmp() {
        const encodedData = localStorage.getItem("tmpSaved");
        if (!encodedData) {
          console.debug("Nothing to load from tmp.");
          return;
        }
        console.debug("Loading from tmp...");
        const data = JSON.parse(atob(encodedData));
        //
        this.Name = data.Name;
        this.IdealCustomerProfiles = data.IdealCustomerProfiles;
        this.CustomerJobs = data.CustomerJobs;
        this.Pains = data.Pains;
        this.Gains = data.Gains;
        this.ProductsAndServices = data.ProductsAndServices;
        this.GainCreators = data.GainCreators;
        this.PainRelievers = data.PainRelievers;
        this.Messages = data.Messages;
      },
      reset() {
        this.$bvModal.msgBoxConfirm("Are you sure you want to reset your canvas?", {okTitle: "Yes", cancelTitle: "No"})
          .then((val) => {
            if (val === true) {
              localStorage.removeItem("tmpSaved");
              // this.Name = "Untitled Project";
              this.IdealCustomerProfiles = [];
              this.CustomerJobs = [];
              this.Pains = [];
              this.Gains = [];
              this.ProductsAndServices = [];
              this.GainCreators = [];
              this.PainRelievers = [];
              this.Messages = [];
            }
          }
        )
      },
      async share() {
        if (!this.routePropositionId) {
          this.$bvModal.msgBoxOk("Please save your proposition before publishing.");
        }
        try {

        } catch (error) {
          console.debug(error);
          this.$bvToast.toast("Failed to share proposition.");
        }
      }
    },
    computed: {
        nodes() {
            return [
                ...this.IdealCustomerProfiles,
                ...this.CustomerJobs,
                ...this.Pains,
                ...this.Gains,
                ...this.ProductsAndServices,
                ...this.GainCreators,
                ...this.PainRelievers,
                ...this.Messages
            ];
        },
        links() {
          const links = [];
          this.nodes.forEach( node => {
            if (node.parentId) {
              links.push({
                source: node.id,
                target: node.parentId
              })
            }
            if (node.relatesTo && Array.isArray(node.relatesTo)) {
              for (let relation of node.relatesTo) {
                links.push({
                  source: node.id,
                  target: relation
                })
              }
            }
          });
          return links
        },
        routePropositionId() {
          return this.$route.params?.id;
        }
    },
    watch: {
      nodes() {
        this.draw();
        // if this is a saved item, then auto-save changes
        if (this.routePropositionId) {
          this.save();
        }
      },
      Name() {
        // if this is a saved item, then auto-save changes
        if (this.routePropositionId) {
                  this.save();
                }
      }
    },
    mounted() {
        // load saved info if any
        this.load();
        // initialize graph
        this._graphContent = d3
          .select("#canvas")
        // TODO: apply zoom/pan here
        // draw
        this.draw();
    },
    beforeRouteLeave(to, from, next) {
      // TODO: Fix this notification!
      // if (this.nodes.length > 0 && !this.routePropositionId) {
      //   this.$bvModal.msgBoxConfirm("Are you sure you want to leave without saving your work?", {okTitle: "Yes", cancelTitle: "No"})
      //     .then((val) => {
      //       if (val === true) {
      //         next();
      //       }
      //     })
      // } else {
        next();
      // }
    }
}
</script>


<style lang="scss" >
  #canvas-wrapper {
    overflow: scroll;
    height: 100vh;
    width: 100%;
    #canvas {
      height: 100%;
      width: 100%;
    }
  }


  $fillColour: #D4E9FF;
  $highlightedFillColour: #8CC4FF;
  $fillColourPain: #FFD4D4;
  $highlightedFillColourPain: #FF8C8C;
  $fillColourGain: #FDD4FF;
  $highlightedFillColourGain: #E094E6;

  .gain-line {
    stroke: $fillColourGain;
  }

  .pain-line {
    stroke: $fillColourPain;
  }

  .line {
    stroke: $fillColour;
  }

  .icp {
    cursor: pointer;
    fill: $fillColour;
    &:hover {
      fill: $highlightedFillColour;
    }
  }

  .cj {
    cursor: pointer;
    fill: $fillColour;
    &:hover {
      fill: $highlightedFillColour;
    }
  }

  .cg {
    cursor: pointer;
    fill: $fillColourGain;
    &:hover {
      fill: $highlightedFillColourGain;
    }
  }

  .cp {
    cursor: pointer;
    fill: $fillColourPain;
    &:hover {
      fill: $highlightedFillColourPain;
    }
  }

  .product {
    cursor: pointer;
    fill: $fillColour;
    &:hover {
      fill: $highlightedFillColour;
    }
  }
  
  .service {
    cursor: pointer;
    fill: $fillColour;
    &:hover {
      fill: $highlightedFillColour;
    }
  }

  .msg {
    cursor: pointer;
    fill: $fillColour;
    &:hover {
      fill: $highlightedFillColour;
    }
  }

  .pr {
    cursor: pointer;
    fill: $fillColourPain;
    &:hover {
      fill: $highlightedFillColourPain;
    }
  }

  .gc {
    cursor: pointer;
    fill: $fillColourGain;
    &:hover {
      fill: $highlightedFillColourGain;
    }
  }

  #context-menu, #hover-menu {
    position: absolute;
    display: none;
    // padding: 0.5rem;
    // background-color: gray;
    &.show {
      display: block;
    }
    user-select: none;
    -webkit-user-drag: none;
    * {
      user-select: none;
      -webkit-user-drag: none;
    }
  }

  .project-name {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  :not(.node-wrapper) {
      pointer-events: none;
  }


</style>
