import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem,Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import {getUser, listProject} from "../utils/esayAPI";

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            projects: [],
            userInfo: ""

        }
    }

        async componentDidMount()
        {
            if (!this.props.isAuthenticated) {
                return;
            }
            try {
                console.log(this.props.userName);
                const userInfo = await this.getUserInfo(this.props.userName);
                const projects = await this.getListProjects();
                this.setState({userInfo: JSON.stringify(userInfo)});
                this.setState({projects})
                // const userInfo = await this.getUserInfo();
                // console.log(projects);
                // this.setState({ projects });
            } catch (e) {
                alert(e);
            }

            this.setState({isLoading: false});
        }

        async getListProjects()
        {
            const params = {
                projectKey: "Project"
            };
            return await listProject(params);
        }

        async getUserInfo(userName)
        {
            return await getUser(userName);
        }

        renderProjects(projects)
        {
            return projects.map(
                (project,i) =>
                    <LinkContainer
                        key={project.projectName}
                        to={`/project/${project.projectName}`}
                    >
                        <ListGroupItem  header={"projectName: "+project.projectName}>
                            {"Created: " + new Date(project.createAt).toLocaleString()}
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
                        <div>{!this.state.isLoading && this.renderUserInfo(this.state.userInfo)}</div>
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