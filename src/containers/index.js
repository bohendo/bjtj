
import { connect } from 'react-redux'
import { DEAL, SHUFFLE } from '../actions'
import BJVM from '../components/bjvm.jsx'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => {
  return {
    deal: () => {
      dispatch(DEAL);
    },
    shuffle: () => {
      dispatch(SHUFFLE);
    }
  }
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
