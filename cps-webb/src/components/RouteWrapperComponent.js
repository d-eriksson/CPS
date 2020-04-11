import React, { Component } from 'react';
const RouteWrapperComponent = InnerComponent=> RedirectRoute => Condition =>{
    class RouteWrapperComponent extends Component{
        componentDidMount(){
            if(Condition){
                return(this.props.history.push(RedirectRoute));
            }
        }
        render(){
            if(Condition){
                return null;
            }
            return(<InnerComponent {...this.props}/>);
        }
    }
    return RouteWrapperComponent;
}
export default RouteWrapperComponent;