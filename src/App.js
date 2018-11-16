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

    setAdmin = (isAdmin) =>{
        this.setState({
            isAdmin: isAdmin
        });
    };

    setUserName = userName =>{
        this.setState({
            userName:userName
        })
    }

    userHasAuthenticated = authenticated =>{
        this.setState({
            isAuthenticated: authenticated
        });
    };

    handleLogout = async event =>{

        await Auth.signOut();

        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    }

  render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,

            userHasAuthenticated : this.userHasAuthenticated,

            userName: this.state.userName,

            isAdmin: this.state.isAdmin,

            setAdmin: this.setAdmin,

            setUserName: this.setUserName

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
                              {this.state.isAdmin
                                  ?
                                  <Fragment>
                                      <LinkContainer to={"/createUser"}>
                                          <NavItem>createUser</NavItem>
                                      </LinkContainer>
                                      <LinkContainer to={"/deleteUser"}>
                                          <NavItem>deleteUser</NavItem>
                                      </LinkContainer>
                                      <LinkContainer to={"/updateUser"}>
                                          <NavItem>updateUser</NavItem>
                                      </LinkContainer>
                                  </Fragment>
                                  :null}
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
