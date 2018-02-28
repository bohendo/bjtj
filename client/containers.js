import { connect } from 'react-redux'
import BJVM from './components/bjvm.js'
import { submit, refresh, cashout } from './actions'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
  return ({
    submit: (move) => {dispatch(submit(move))},
    refresh: () => {dispatch(refresh())},
    cashout: (addr) => {dispatch(cashout())},
  })
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
