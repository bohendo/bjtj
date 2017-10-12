
import { connect } from 'react-redux'
import { DEAL, HIT, STAND, DOUBLE, SPLIT } from '../actions'
import BJVM from '../components/bjvm.jsx'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
  return {
    deal: () => {
      dispatch(DEAL());
    },
    hit: () => {
      dispatch(HIT());
    },
    stand: () => {
      dispatch(STAND());
    },
    double: () => {
      dispatch(DOUBLE());
    },
    split: () => {
      dispatch(SPLIT());
    },
  }
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
