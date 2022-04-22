<template>
  <div>
    <my-wallet></my-wallet>
    <betting-component v-on:complete-choose-number="onCompleteChooseNum" />
  </div>
</template>

<script>
import MyWallet from "@/components/MyWallet"
import {mapGetters, mapMutations} from 'vuex'
import KlaytnService from "@/klaytn/klaytnService"
import BettingComponent from "@/components/BettingComponent";

export default {
  name: "GameBapp",
  components: {BettingComponent, MyWallet},
  mounted() {
    this.connect()
  },
  computed: {
    ...mapGetters("walletStore", [
      "klaytn",
      "myAddress"
    ])
  },
  methods: {
    ...mapMutations("walletStore", [
      "setKlaytn",
      "setIsConnectWallet",
      "setMyAddress",
      "setBalance"
    ]),

    connect() {
      const klaytn = new KlaytnService()
      this.setKlaytn(klaytn)
      const address = klaytn.init()

      if (address) {
        this.setMyAddress(address)
        this.getBalance()
        this.setIsConnectWallet(true)
      } else {
        this.setIsConnectWallet(false)
      }
    },

    async getBalance() {
      if (this.myAddress) {
        const balance = await this.klaytn.getBalance(this.myAddress)
        this.setBalance(balance)
      }
    },

    onCompleteChooseNum() {
      this.getBalance()
    }
  }
}
</script>

<style scoped>

</style>