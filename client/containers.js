import { connect } from 'react-redux'
import BJVM from './components/bjvm.js'
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
)(BJVM)

export default Container
