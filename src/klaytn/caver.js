// 클레이튼 네트워크와 통합하기 위한 SDK, caver-js 임포트
import Caver from "caver-js"

// 클레이튼의 테스트 네트워크인 바오밥의 URI
const TEST_NET_URI = "https://api.baobab.klaytn.net:8651"
export const config = {
    rpcURL: TEST_NET_URI
}

// 배포된 스마트 컨트랙트의 주소
const DEPLOYED_CONTRACT_ADDRESS = "0x1af791e81a02f2ebd908b1f50aa6b8ffef74715d"

// 스마트 컨트랙트의 ABI 데이터를 읽어 온다
const deployedABI = require("./deployedABI.json")

// 바오밥으로 연결된 Caver 인스턴스를 생성하여 변수에 저장한다
const caver = new Caver(config.rpcURL)

// 스마트 컨트랙트의 인스턴스를 가져와 변수에 저장한다
const contractInstance = () => {
    return deployedABI
        && DEPLOYED_CONTRACT_ADDRESS
        && new caver.klay.Contract(deployedABI, DEPLOYED_CONTRACT_ADDRESS)
}

export {caver, contractInstance}