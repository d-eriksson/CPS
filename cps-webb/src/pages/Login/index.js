import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Login.scss'
import {login, me} from '../../utils/api';
import {saveToken, saveUser} from '../../actions/userAction';


export class Login extends Component {
    state = {
        email: '',
        password: '',
    }
    handleInput = (e) => {
        e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value
		});
    }
    handleLogin = async(e) => {
        e.preventDefault();
        let data = await login(this.state.email, this.state.password);
        let userData ={
            ...data.result
        }
        userData.token = data.token;
        this.props.saveUser(userData);
    }
    render() {
        console.log(this.props);
        return (
            <div className="Login columns">
                <div className="column is-one-third is-offset-one-third">
                    <div className="field">
                        <p className="control has-icons-left has-icons-right">
                            <input className="input" name="email" type="email" placeholder="Email" onChange={this.handleInput}/>
                            <span className="icon is-small is-left">
                            <i className="fas fa-envelope"></i>
                            </span>
                            <span className="icon is-small is-right">
                            <i className="fas fa-check"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left">
                            <input className="input" type="password" name="password" placeholder="Password" onChange={this.handleInput}/>
                            <span className="icon is-small is-left">
                            <i className="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button is-success" onClick={this.handleLogin}>
                            Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    const user = state.userReducer;
    return user;
};

const mapDispatchToProps = dispatch => {
    return {
        saveToken: token => dispatch(saveToken(token)),
        saveUser: user => dispatch(saveUser(user))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Login)
