import { connect } from 'react-redux'
import BJVM from './components/bjvm.js'
import { auth, message, submit, refresh, autograph } from './actions'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
  return ({
    updateMessage: (msg) => {dispatch(message(msg))},
    submit: (move) => {dispatch(submit(move))},
    refresh: () => {dispatch(refresh())},
    autograph: (addr) => {dispatch(autograph())},
    auth: (res) => {dispatch(auth(res))},
  })
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
