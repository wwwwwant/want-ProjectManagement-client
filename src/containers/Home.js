import React, {Component, Fragment} from "react";
import {PageHeader, ListGroup, ListGroupItem, ButtonGroup, Button} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import {getUser, listProject, listUser} from "../utils/esayAPI";

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            projects: [],
            user:{},
            users:[],
            showStatus:"allStatus",
            attendedProjects:[]

        }
    };

        async componentDidMount()
        {
            if (!this.props.isAuthenticated) {
                return;
            }
            try {
                if (this.props.isAdmin){
                    const users = await this.getListUsers();
                    this.setState({users});
                    console.log("get user num: "+users.length);
                }
                const user = await getUser(this.props.userName);
                // console.log(JSON.stringify(user));
                const projects = await this.getListProjects();
                this.setState({attendedProjects: user.projects.split(",")});
                this.setState({user});
                this.setState({projects});

            } catch (e) {
                alert(e);
            }

            this.setState({isLoading: false});
        };

        getListUsers() {
            const params = {
                userKey: "User"
            };
            return listUser(params);
        };

        async getListProjects()
        {
            const params = {
                projectKey: "Project"
            };
            return await listProject(params);
        };

        attendedProjects(projectName){
           return this.state.attendedProjects.includes(projectName);
        }

        changeShowStatus = event =>{
            this.setState({showStatus:event.target.value});
        };

        showProjectBasedOnStatus(project){
            return project.projectStatus === this.state.showStatus || this.state.showStatus==="allStatus";
        };

        renderLinkedProject(project){
            return (
                <LinkContainer
                    key={project.projectName}
                    to={`/project/${project.projectName}`}
                >
                    <ListGroupItem  header={"projectName: "+project.projectName}>
                        {"LastEdit: "+ new Date(project.lastEditAt).toLocaleString()}
                    </ListGroupItem>
                </LinkContainer>
            );
        }


        renderCreateProject(project){
            return (
                <Fragment key={"fragmentProject"}>
                    <LinkContainer
                        key="new"
                        to="/project/new"
                    >
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Create a new project
                            </h4>
                        </ListGroupItem>
                    </LinkContainer>
                    {this.renderLinkedProject(project)}
                </Fragment>
            );
        }


        renderProjects(projects)
        {
            // if user is admin then he can see all of the projects
            if (this.props.isAdmin){
                return projects.map(
                    (project,i) =>{
                        if (i === 0) {
                            return this.renderCreateProject(project);
                        }else if (this.showProjectBasedOnStatus(project)) {
                            return this.renderLinkedProject(project);
                        }
                        return null;
                    }

                );
            } else{
                return projects.map(
                    (project,i) =>{
                        if (this.attendedProjects(project.projectName) && this.showProjectBasedOnStatus(project))
                            return this.renderLinkedProject(project);
                        return null;
                    }
                );
            }

        }

        renderUsers(users){
            return users.map(
                (user,i) =>
                    i!==0?
                        this.renderUserInfo(user)
                        :
                        <Fragment key={"fragmentUser"}>
                            <LinkContainer
                                key="new"
                                to="/user/new"
                            >
                                <ListGroupItem>
                                    <h4>
                                        <b>{"\uFF0B"}</b> Create a new user
                                    </h4>
                                </ListGroupItem>
                            </LinkContainer>
                            {this.renderUserInfo(user)}
                        </Fragment>
            );
        }

        renderUserInfo(user)
        {
            return (
                <LinkContainer
                    key={user.userName}
                    to={`/user/${user.userName}`}
                >
                    <ListGroupItem  header={"userName: "+user.userName} >
                        {"CreateAt: "+ new Date(user.createAt).toLocaleString()}
                    </ListGroupItem>
                </LinkContainer>

            );
        }


        renderLander()
        {
            return (
                <div className="Home">
                    <div className="lander">
                        <h1>ProjectManagement</h1>
                    </div>
                </div>
            );
        }

        renderInfo()
        {
            return (
                <div className="Info">
                    <div className="UserInfo">
                        <PageHeader>My Personal Info </PageHeader>
                        <div>{!this.state.isLoading && this.renderUserInfo(this.state.user)}</div>
                    </div>
                    <div className="Projects">
                        <PageHeader>My Projects</PageHeader>
                        <ButtonGroup>
                            <Button
                                onClick={this.changeShowStatus}
                                value={"allStatus"}
                                type={"submit"}
                            >allStatus</Button>
                            <Button
                                onClick={this.changeShowStatus}
                                value={"completed"}
                                type={"submit"}
                            >completed</Button>
                            <Button
                                onClick={this.changeShowStatus}
                                value={"active"}
                                type={"submit"}
                            >active</Button>
                            <Button
                                onClick={this.changeShowStatus}
                                value={"commencing"}
                                type={"submit"}
                            >commencing</Button>
                        </ButtonGroup>;
                        <ListGroup>
                            {!this.state.isLoading && this.renderProjects(this.state.projects)}
                        </ListGroup>
                    </div>
                    {this.props.isAdmin
                        ? <div className="Users">
                            <PageHeader>AllUsers</PageHeader>
                            <ListGroup>
                                {!this.state.isLoading && this.renderUsers(this.state.users)}
                            </ListGroup>
                        </div>
                    : null}
                </div>
            );
        }

        render()
        {
            return (
                <div className="Home">
                    {this.props.isAuthenticated ? this.renderInfo() : this.renderLander()}
                </div>
            );
        }



}