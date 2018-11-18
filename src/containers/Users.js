import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel, ButtonGroup} from "react-bootstrap";
import {deleteUser, getProject, getUser, updateProject, updateUser} from "../utils/esayAPI";
import LoaderButton from "../components/LoaderButton";

export default class Users extends Component {
    constructor(props) {
        super(props);


        this.state = {
            user: {},
            isAdmin:false,
            skill:"",
            projects:"",
            details:"",
            isLoading:false
        }
    }

    async componentDidMount()
    {
        try {
            const user = await this.getUser();
            this.setState({user});
            this.setState({isAdmin:this.state.user.isAdmin});
            this.setState({skill:this.state.user.skill});
            this.setState({projects:this.state.user.projects});
            this.setState({details:this.state.user.details});
        } catch (e) {
            alert(e);
        }
    };

    getUser()
    {
        return getUser(this.props.match.params.id);
    };

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    validateForm(){
        return true;
    }

    handleSubmit = async event =>{
        event.preventDefault();

        this.setState({isLoading:true});

        try{
            let res = this.updateProjectDevelopers();
            console.log(res);
            res = await this.editUser();
            console.log(res);
            this.props.history.push("/");
        }catch (e) {
            alert(e.message);
            this.setState({isLoading:false});
        }


    };

    async updateProjectDevelopers() {
        const oldProjects = this.state.user.projects.split(",");
        const newProjects = this.state.projects.split(",");
        if (oldProjects !== newProjects) {
            const addProjects = newProjects.filter( project =>{
                return !oldProjects.includes(project);
            });
            const delProjects = oldProjects.filter( project =>{
                return !newProjects.includes(project);
            });

            addProjects.forEach( projectName =>{
                const res = this.changeDevelopers(true,projectName);
                console.log(res);
            });

            delProjects.forEach( projectName =>{
                const res = this.changeDevelopers(false,projectName);
                console.log(res);
            })
        }
    }

    async changeDevelopers(isAdd,projectName) {
        const project = await getProject(projectName);
        if (isAdd){
            project.developers = project.developers == null?  this.state.user.userName
                : project.developers.concat(","+this.state.user.userName);
        } else{
            project.developers = project.developers.split(",").filter( developer =>{
                return developer !== this.state.user.userName;
            }).toString();
        }
        delete project.projectName;
        delete project.projectKey;
        const res = await updateProject(projectName,project);
        console.log(res);
    }


    editUser(){
        const params= {
            isAdmin : this.state.isAdmin,
            skill:this.state.skill,
            projects:this.state.projects,
            details:this.state.details,
            lastEditAt: Date.now()
        };
        return updateUser(this.state.user.userName,params);
    };

    render()
    {
        return (
            <div className={"User"}>
                {
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="userName">
                            <ControlLabel>userName</ControlLabel>
                            <FormControl
                                readOnly={true}
                                value={this.state.user.userName}
                                componentClass="textarea"
                            />
                        </FormGroup>
                        <FormGroup controlId="isAdmin">
                            <ControlLabel>isAdmin</ControlLabel>
                            {this.props.isAdmin ?
                                <FormControl
                                    onChange={this.handleChange}
                                    value={this.state.isAdmin}
                                    componentClass="textarea"
                                />
                                :
                                <FormControl
                                    readOnly={true}
                                    value={this.state.isAdmin}
                                    componentClass="textarea"
                                />
                            }
                        </FormGroup>
                        <FormGroup controlId={"skill"}>
                            <ControlLabel>skill</ControlLabel>
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.skill}
                                componentClass={"textarea"}
                            />
                        </FormGroup>
                        <FormGroup controlId={"projects"}>
                            <ControlLabel>projects</ControlLabel>
                            {this.props.isAdmin ?
                                <FormControl
                                    onChange={this.handleChange}
                                    value={this.state.projects}
                                    componentClass={"textarea"}
                                />
                                :
                                <FormControl
                                    readOnly={true}
                                    value={this.state.projects}
                                    componentClass={"textarea"}
                                />
                            }
                        </FormGroup>
                        <FormGroup controlId={"details"}>
                            <ControlLabel>details</ControlLabel>
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.details}
                                componentClass={"textarea"}
                            />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="EditUser"
                            loadingText="Editing..."
                        />

                    </form>

                }


            </div>


        )
    }

}