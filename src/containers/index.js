
import { connect } from 'react-redux'
import { DEAL, HIT, STAND, DOUBLE, SPLIT } from '../actions'
import BJVM from '../components/bjvm.jsx'

const mapStateToProps = state => state

// This should probably be react middleware...
const pingServer = move => {
  fetch(`api/${move}`, { credentials: 'include' }).then((res) => {
    res.json().then((data) => { console.log(data) })
  })
}

const mapDispatchToProps = dispatch => {
  return {
    deal: () => {
      pingServer('deal')
      dispatch(DEAL());
    },
    hit: () => {
      pingServer('hit')
      dispatch(HIT());
    },
    stand: () => {
      pingServer('stand')
      dispatch(STAND());
    },
    double: () => {
      pingServer('double')
      dispatch(DOUBLE());
    },
    split: () => {
      pingServer('split')
      dispatch(SPLIT());
    },
  }
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(BJVM)

export default Container
