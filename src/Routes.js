import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import CreateNewUser from "./containers/createNewUser";
import ModifyUser from "./containers/modifyUser";
import Projects from "./containers/Projects";
import DelUser from "./containers/DelUser";
import EditUser from "./containers/EditUser";
import Users from "./containers/Users";
import NewProject from "./containers/NewProject";

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps}/>
        <AppliedRoute path={"/signup"} exact component={Signup} props={childProps}/>
        <AppliedRoute path={"/deleteUser"} exact component={DelUser} props={childProps}/>
        <AppliedRoute path={"/updateUser"} exact component={EditUser} props={childProps}/>
        <AppliedRoute path={"/modifyUser"} exact component={ModifyUser} props={childProps}/>
        <AppliedRoute path={"/user/new"} exact component={CreateNewUser} props={childProps}/>
        <AppliedRoute path={"/project/new"} exact component={NewProject} props={childProps}/>
        <AppliedRoute path={"/project/:id"} exact component={Projects} props={childProps}/>
        <AppliedRoute path={"/user/:id"} exact component={Users} props={childProps}/>

        <Route component={NotFound}/>
    </Switch>;