import { connect } from 'react-redux'
import { submit, refresh, cashout } from '../actions'
import BJVM from '../components/bjvm.js'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
  return ({
    submit: (move) => {dispatch(submit(move))},
    refresh: () => {dispatch(refresh())},
    cashout: (addr) => {dispatch(cashout(addr))},
  })
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
