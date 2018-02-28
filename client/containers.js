import { connect } from 'react-redux'
import BJVM from './components/bjvm.js'
import { submit, refresh, autograph } from './actions'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
  return ({
    submit: (move) => {dispatch(submit(move))},
    refresh: () => {dispatch(refresh())},
    autograph: (addr) => {dispatch(autograph())},
  })
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
