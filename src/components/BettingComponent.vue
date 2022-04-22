<template>
  <div class="betting">
    <h1>Numbergame BApp Test</h1>
    Amount: <input v-model="amount" placeholder="0 Klay"/>

    <ul>
      <li v-on:click="clickNumber">1</li>
      <li v-on:click="clickNumber">2</li>
      <li v-on:click="clickNumber">3</li>
      <li v-on:click="clickNumber">4</li>
      <li v-on:click="clickNumber">5</li>
    </ul>
    <div v-if="pending" id="loader">Loading...</div>
    <div class="event" v-else-if="winEvent">
      Won: {{ winEvent.result }}
      Reward: {{ winEvent.amount }} Klay
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {caver} from "@/klaytn/caver";

export default {
  name: "BettingComponent",
  data() {
    return {
      amount: null,
      pending: false,
      winEvent: null
    }
  },
  computed: {
    ...mapGetters("walletStore", [
      "klaytn"
    ])
  },
  methods: {
    // 번호를 클릭했을 때
    clickNumber(event) {
      console.log("betting number", event.target.innerHTML, this.amount)
      this.pending = true

      this.winEvent = {}
      this.klaytn.play(event.target.innerHTML, this.amount)
          .then(response => {
            const result = response.events.Won.returnValues[0]
            const amount = response.events.Won.returnValues[1]
            this.winEvent.result = result
            this.winEvent.amount = caver.utils.fromPeb(amount, "KLAY")
            this.$emit("complete-choose-number")
            this.pending = false
          })
          .catch(error => {
            console.error(error)
            this.pending = false
          })
    }
  }
}
</script>

<style scoped>
.betting {
  margin-top: 50px;
  text-align: center;
}

ul {
  margin: 25px;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 25px;
}

li {
  padding: 20px;
  margin-right: 3px;
  border-radius: 30%;
  cursor: pointer;
  background-color: #fff;
  color: #4b08e0;
  box-shadow: 3px 5px 1px #4b08e0;
}

li:hover {
  background-color: #4b08e0;
  color: white;
  box-shadow: 0px 0px 1px #4b08e0;
}

li:active {
  opacity: 0.7;
}

* {
  color: #444444;
}
</style>