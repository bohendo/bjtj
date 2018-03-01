import sigUtil from 'eth-sig-util'
import agreement from '../Agreement.txt'

const signData = [{ type: 'string', name: 'Agreement', value: agreement }]

const verify = (usr, sig) => {
  if (usr.length !== 42 || sig.length !== 132) { return false }

  const signee = sigUtil.recoverTypedSignature({ data: signData, sig })
  return (signee.toLowerCase() === usr.toLowerCase())
}

export { agreement, signData, verify }
