
import { connect } from 'react-redux'
import { submit } from '../actions'
import BJVM from '../components/bjvm.jsx'

const mapStateToProps = state => state

// submit is the only interactive action
const mapDispatchToProps = dispatch => {
  return ({
    submit: (move) => {dispatch(submit(move))}
  })
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
