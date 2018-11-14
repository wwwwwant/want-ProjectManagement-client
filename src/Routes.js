import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import TestAPI from "./containers/TestAPI";
import CreateUser from "./containers/createUser";

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps}/>
        <AppliedRoute path={"/signup"} exact component={Signup} props={childProps}/>
        <AppliedRoute path={"/testAPI"} exact component={TestAPI} props={childProps}/>
        <AppliedRoute path={"/createUser"} exact component={CreateUser} props={childProps}/>

        <Route component={NotFound}/>
    </Switch>;