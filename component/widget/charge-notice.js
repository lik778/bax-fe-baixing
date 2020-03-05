import { MessageBox } from 'element-ui'
import { identityBindingPage } from '../../config'

const messageBoxContent = `
<div>
  <p>根据《网络安全法》规定，请提供您的真实身份信息后再进行支付。</p>
  <p>您尚未提供审核或通过审核，请进行身份认证。</p>
</div>
`

function chargeNotice() {
  MessageBox.alert(messageBoxContent, '提示', {
    dangerouslyUseHTMLString: true,
    closeOnClickModal: false,
    closeOnPressEscape: false
  })
    .then(() => {
      // 前往审核平台身份绑定认证
      window.open(identityBindingPage, '_target')
    })
    .catch(() => {
      console.error('用户取消身份绑定')
    })
}

export default chargeNotice
