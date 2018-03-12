import { connect } from 'react-redux'
import BJTJ from './components/bjtj.js'
import { message, auth, submit } from './actions'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
  return ({
    msg: (msg) => {dispatch(message(msg))},
    auth: (res) => {dispatch(auth(res))},
    submit: (move) => {dispatch(submit(move))}
  })
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJTJ)

export default Container
