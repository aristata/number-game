<template>
  <div>
    <h2>Connect to Wallet</h2>
    <div>
      <template v-if="walletInstance">
        <div>
          <h2>Integrated</h2>
          <div class="balance">Balance: {{ balance }}</div>
          <div class="address">Wallet Address: {{ walletInstance.address }}</div>
          <button class="btnSubmit" @click="this.handleDisconnectWallet">지갑 연결 해제</button>
        </div>
      </template>
      <template v-else>
        <div>
          <label for="keystore">Keystore: </label>
          <input type="file" name="keystore" v-on:change="this.handleImportKeystore"/>
        </div>
        <p></p>
        <div>
          <label for="password">Password: </label>
          <input type="password" name="password" ref="passwordInput" required v-model="password"/>
        </div>
        <h3>OR</h3>
        <label for="privateKey">PrivateKey: </label>
        <input type="password" name="privateKey" required v-model="privateKey"/>
        <p>
          <button class="btnSubmit" @click="this.handleConnectWallet">지갑 연결</button>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "MyWallet",
  data: () => ({
    keystore: null,
    password: '',
    privateKey: null,
    walletInstance: null
  }),
  computed: {
    ...mapGetters("walletStore", [
      "klaytn",
      "balance"
    ])
  },
  mounted() {
    console.log("[위치] MyWallet.vue > Wallet mounted")
    setTimeout(() => {
      if (this.klaytn) {
        this.initWallet()
      }
    }, 10)
  },

  methods: {
    ...mapMutations("walletStore", [
      "setIsConnectWallet",
      "setMyAddress",
      "setBalance"
    ]),

    async initWallet() {
      // 세션 스토리지에서 월렛 인스턴스를 가져온다
      const walletFromSession = sessionStorage.getItem('walletInstance')
      if (walletFromSession) {
        console.log("[분기] 세션 스토리지에서 월렛 인스턴스를 발견 했습니다.")
        // 세션에 담긴 월렛이 있으면 지갑을 화면에 가져온다
        await this.getWalletInfo()
      } else {
        console.log("[분기] 세션 스토리지에서 월렛 인스턴스를 발견 하지 못했습니다.")
        console.log("지갑 연동 작업을 진행 해 주세요.")
      }
    },

    // 키스토어 파일 임포트
    handleImportKeystore(event) {
      // 사용자가 선택한 키스토어 파일을 가져온다
      const keystore = event.target.files[0]
      const fileReader = new FileReader()
      fileReader.readAsText(keystore)
      fileReader.onload = (event) => {
        try {
          if (!this.checkValidKeystore(event.target.result)) {
            alert("유효하지 않은 keystore 파일 입니다")
            return
          }
          // 로드된 키스토어 파일 데이터를 데이터에 저장한다
          this.keystore = event.target.result
          alert("유효한 keystore 입니다. 비밀번호를 입력하세요")
          this.$refs.passwordInput.focus()
        } catch (error) {
          alert("파일을 읽는 도중에 에러가 발생하였습니다")
          console.error(error)
          return
        }
      }
    },
    // 키스토어 파일이 유효한 파일인지 확인
    checkValidKeystore(keystore) {
      const parsedKeystore = JSON.parse(keystore)
      return parsedKeystore.version
          && parsedKeystore.id
          && parsedKeystore.address
          && parsedKeystore.keyring
    },

    // 지갑 연동하기
    async handleConnectWallet() {
      try {
        if (this.privateKey) {
          // 프라이빗키로 지갑 연동하기
          await this.klaytn.integrateWallet(this.privateKey)
        } else {
          // 키스토어 파일과 패스워드로 지갑 연동하기
          await this.klaytn.loginWithKeystore(this.keystore, this.password)
        }
        await this.getWalletInfo()
      } catch (e) {
        alert("패스워드 또는 비밀키가 일치하지 않습니다")
      }
    },

    // 지갑 가져오기
    async getWalletInfo() {
      this.walletInstance = this.klaytn.getWallet()
      const address = this.walletInstance.address
      if (address) {
        this.setMyAddress(address)

        // 지갑 잔액 가져오기
        const balance = await this.klaytn.getBalance(address)
        this.setBalance(balance)
        this.setIsConnectWallet(true)
      } else {
        this.setIsConnectWallet(false)
      }
    },

    // 지갑 연동 끊기
    handleDisconnectWallet() {
      // KlaytnService.js 의 지갑 연동 해제 함수 호출
      this.klaytn.removeWallet()

      // state 의 setIsConnectWallet 의 값을 false 로 변경
      this.setIsConnectWallet(false)

      // 컴포넌트 데이터 walletInstance 의 값을 null 로 변경
      this.walletInstance = null
    }
  },


}
</script>

<style scoped>

</style>