<template>
  <my-wallet></my-wallet>
</template>

<script>
import MyWallet from "@/components/MyWallet"
import {mapGetters, mapMutations} from 'vuex'
import KlaytnService from "@/klaytn/klaytnService"

export default {
  name: "GameBapp",
  components: {MyWallet},
  mounted() {
    this.connect()
  },
  computed: {
    ...mapGetters("myWallet", [
        "klaytn",
        "myAddress"
    ])
  },
  methods: {
    ...mapMutations("myWallet", [
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
    }
  }
}
</script>

<style scoped>

</style>