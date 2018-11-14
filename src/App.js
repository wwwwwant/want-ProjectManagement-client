import React, {Component, Fragment} from 'react';
import { Link,withRouter } from "react-router-dom";
import {Navbar,Nav,NavItem} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import './App.css';
import Routes from "./Routes";
import { Auth } from "aws-amplify";

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            userName: "",
            isAdmin: false
        };
    }

    async componentDidMount() {
        try{
            await Auth.currentSession();
            this.userHasAuthenticated(true);
        }catch (e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({isAuthenticating: false});
    }

    userHasAuthenticated = authenticated =>{
        this.setState({
            isAuthenticated: authenticated
        });
    };

    setUserName = userName =>{
      this.setState({
          userName:userName
      })
    };

    setAdmin = isAdmin =>{
        this.setState({
            isAdmin:isAdmin
        })
    };

    handleLogout = async event =>{

        await Auth.signOut();

        this.userHasAuthenticated(false);
        console.log("before log out: ",this.state.userName);
        this.setUserName("");
        console.log(this.state.userName);

        this.props.history.push("/login");
    }

  render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,

            userHasAuthenticated : this.userHasAuthenticated,

            userName: this.state.userName,

            setUserName: this.setUserName,

            isAdmin: this.state.isAdmin,

            setAdmin: this.setAdmin
        };

    return (
        !this.state.isAuthenticating &&
      <div className="App container">
          <Navbar fluid collapseOnSelect>
              <Navbar.Header>
                  <Navbar.Brand>
                      <Link to={"/"}> ProjectManagement</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle/>
              </Navbar.Header>
              <Navbar.Collapse>
                  <Nav pullRight>
                      {this.state.isAuthenticated
                          ?
                          <Fragment>
                              <NavItem onClick={this.handleLogout}>Logout</NavItem>
                              <LinkContainer to={"/testAPI"}>
                                  <NavItem>testAPI</NavItem>
                              </LinkContainer>
                              <LinkContainer to={"/createUser"}>
                                  <NavItem>createUser</NavItem>
                              </LinkContainer>
                          </Fragment>
                          : <Fragment>
                              <LinkContainer to="/signup">
                                  <NavItem>Signup</NavItem>
                              </LinkContainer>
                              <LinkContainer to="/login">
                                  <NavItem>Login</NavItem>
                              </LinkContainer>
                              <LinkContainer to={"/testAPI"}>
                                  <NavItem>testAPI</NavItem>
                              </LinkContainer>
                          </Fragment>
                      }
                  </Nav>
              </Navbar.Collapse>
          </Navbar>
          <Routes childProps = {childProps}/>
      </div>
    );
  }
}

export default withRouter(App);
