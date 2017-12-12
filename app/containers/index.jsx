import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import LocalStore from '../util/localStore.js'
import {CITYNAME} from '../config/localstoreKey.js'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import * as userInfoActionsFromOtherFile from '../actions/userinfo.js'



class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            initDone: false
        }
    }

    render() {
        return (
          <div>

            {
                this.state.initDone
                ? this.props.children
                : <div> loading...... </div>
            }

          </div>
        )
    }

    componentDidMount() {
      //从localstore中获取城市信息
      let cityName = LocalStore.getItem(CITYNAME);
      if (cityName == null) {
        cityName = '北京'
      }
      console.log(this.props);

      //将城市信息存储到Redux中
      this.props.userInfoActions.update({
        cityName: cityName
      })


      this.setState({
        initDone: true
      });

    }
}

function mapStateToProps(state){
  return {}
}

function mapDisPatchToProps(dispatch){
  return {
    userInfoActions: bindActionCreators(userInfoActionsFromOtherFile,dispatch)
  }
}


export default connect(
  mapStateToProps,
  mapDisPatchToProps
)(App)