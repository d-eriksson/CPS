import React from 'react';
import { connect } from 'react-redux'
import './App.scss';
import {
	BrowserRouter as Router,
	Switch,
	Route,
  } from "react-router-dom";
import Login from './pages/Login'
import RouteWrapperComponent from './components/RouteWrapperComponent';
import {setupToken} from './utils/api';


function App(props) {
	let hasToken = false;
	if(props.user && props.user.token.length > 0){
		hasToken = true;
		setupToken(props.user.token);
	} else{
		return null;
	}
	const LoginWrapper = RouteWrapperComponent(Login)('/')(hasToken);
	console.log(props.user)
  	return (
		<Router>
			<Switch>
				<Route exact path="/">Hem</Route>
				<Route exact path="/login" render={(props) => <LoginWrapper {...props}/>} />
			</Switch>
		</Router>
	);
}

function mapStateToProps(state){
    const user = state.userReducer;
    return user;
};

export default connect(mapStateToProps, null)(App);
