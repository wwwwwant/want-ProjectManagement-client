import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem,Button } from "react-bootstrap";
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
                const user = await this.getUserInfo(this.props.userName);
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

        async getUserInfo(userName)
        {
            return await getUser(userName);
        }

        attendedProjects(projectName){
           return this.state.attendedProjects.includes(projectName);
        }

        renderProjects(projects)
        {
            // if user is admin then he can see all of the projects
            if (this.props.isAdmin){
                return projects.map(
                    (project,i) =>
                        i!==0
                            ? <LinkContainer
                                key={project.projectName}
                                to={`/project/${project.projectName}`}
                                >
                                    <ListGroupItem  header={"projectName: "+project.projectName}>
                                        {"LastEdit: "+ new Date(project.lastEditAt).toLocaleString()}
                                    </ListGroupItem>
                                </LinkContainer>
                            : <LinkContainer
                                key="new"
                                to="/project/new"
                            >
                                <ListGroupItem>
                                    <h4>
                                        <b>{"\uFF0B"}</b> Create a new project
                                    </h4>
                                </ListGroupItem>
                            </LinkContainer>

                );
            } else{
                return projects.map(
                    (project,i) =>
                        this.attendedProjects(project.projectName)?
                        <LinkContainer
                            key={project.projectName}
                            to={`/project/${project.projectName}`}
                        >
                            <ListGroupItem  header={"projectName: "+project.projectName}>
                                {"LastEdit: "+ new Date(project.lastEditAt).toLocaleString()}
                            </ListGroupItem>
                        </LinkContainer>
                            : null

                );
            }

        }

        renderUsers(users){
            return users.map(
                (user,i) =>
                    i!==0?
                        <LinkContainer
                            key={user.userName}
                            to={`/user/${user.userName}`}
                        >
                            <ListGroupItem  header={"userName: "+user.userName}>
                                {"CreateAt: "+ new Date(user.createAt).toLocaleString()}
                            </ListGroupItem>
                        </LinkContainer>
                        :<LinkContainer
                            key="new"
                            to="/user/new"
                        >
                            <ListGroupItem>
                                <h4>
                                    <b>{"\uFF0B"}</b> Create a new user
                                </h4>
                            </ListGroupItem>
                        </LinkContainer>

            );
        }

        renderUserInfo(userInfo)
        {
            return (
                <div className="UserInfo">
                    <p>{userInfo}</p>
                </div>
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

        buttonEvent = event =>{
            event.preventDefault();
            this.props.history.push("/modifyUser");
        }

        renderInfo()
        {
            return (
                <div className="Info">
                    <div className="UserInfo">
                        <PageHeader>My Personal Info </PageHeader>
                        <div>{!this.state.isLoading && this.renderUserInfo(JSON.stringify(this.state.user))}</div>
                        <form onSubmit={this.buttonEvent}>
                            <Button
                                bsSize="large"
                                disabled={false}
                                type={"submit"}
                            >
                                modifyPersonalInfo
                            </Button>
                        </form>

                    </div>
                    <div className="Projects">
                        <PageHeader>My Projects</PageHeader>
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