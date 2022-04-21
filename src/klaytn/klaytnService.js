// 앞서 만든 caver 라이브러리 임포트
import {caver} from "@/klaytn/caver";

export default class KlaytnService {
    constructor() {}
    
    // 월렛 초기화
    init() {
        const walletFromSession = sessionStorage.getItem("walletInstance")
        if (walletFromSession) {
            try {
                // wallet 주소 파싱
                const walletJson = JSON.parse(walletFromSession)
                const address = walletJson.address
                // 네트워크 지갑과 연동
                caver.klay.accounts.wallet.add(walletJson)
                return address
            } catch (e) {
                sessionStorage.removeItem("walletInstance")
                return false
            }
        }
    }
    
    // 잔액 조회
    async getBalance(address) {
        const balance = await caver.klay.getBalance(address)
        return caver.utils.fromPeb(balance, "KLAY")
    }
    
    // KeyStore 파일로 로그인(지갑 연동) 하기
    async loginWithKeystore(keystore, password) {
        const { privateKey: privateKeyFromKeystore } = caver.klay.accounts.decrypt(keystore, password)
        await this.integrateWallet(privateKeyFromKeystore)
        return true
    }
    
    // PrivateKey 로 지갑 연동 하기
    async integrateWallet(privateKey) {
        // 개인키로 지갑 인스턴스를 가져온다
        const walletInstance = await caver.klay.accounts.privateKeyToAccount(privateKey)
        
        // 지갑 인스턴스를 월렛에 추가한다
        caver.klay.accounts.wallet.add(walletInstance)
        
        // 지갑 인스턴스를 JSON 형태로 세션에 저장한다
        sessionStorage.setItem("walletInstance", JSON.stringify(walletInstance))
        return true
    }
    
    // 지갑 연동 해제
    removeWallet() {
        caver.klay.accounts.wallet.clear()
        sessionStorage.removeItem("walletInstance")
        return true
    }
    
    // 연동 되어 있는 지갑 가져오기
    getWallet() {
        if (caver.klay.accounts.wallet.length) {
            return caver.klay.accounts.wallet[0]
        } else {
            return null
        }
    }
}