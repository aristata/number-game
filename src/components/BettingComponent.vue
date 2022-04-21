<template>

</template>

<script>
import { mapGetters } from "vuex";
import { caver } from "@/klaytn/caver";

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
    ...mapGetters("myWallet", [
        "klaytn"
    ])
  },
  methods: {
    // 번호를 클릭했을 때
    clickNumber(event) {
      console.log("betting number", event.target.innerHTML, this.amount)
      this.pending = true

      this.winEvent = {}
      this.klaytn.play(event.target.innerHTML, this.amount, (receipt) => {
        const result = receipt.events.Won.returnValues[0]
        const amount = receipt.events.Won.returnValues[1]

        this.winEvent.result = result
        this.winEvent.amount = caver.utils.fromPeb(amount, "KLAY")

        this.$emit("complete-choose-number")

        this.pending = false
      }, (error) => {
        console.error(error)
        this.pending = false
      })
    }
  }
}
</script>

<style scoped>

</style>