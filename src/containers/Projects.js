import React, { Component } from "react";
import {FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem} from "react-bootstrap";
import {getProject, getUser, updateProject, updateUser} from "../utils/esayAPI";
import LoaderButton from "../components/LoaderButton";

export default class Projects extends Component {
    constructor(props) {
        super(props);


        this.state = {
            project: {},
            details:"",
            developers:"",
            managerName:"",
            projectStatus:"",
            isLoading:false
        }
    }

        async componentDidMount()
        {
            try {
                const project = await this.getProject();
                this.setState({project});
                this.setState({details:this.state.project.details});
                this.setState({developers:this.state.project.developers});
                this.setState({managerName:this.state.project.managerName});
                this.setState({projectStatus:this.state.project.projectStatus});

            } catch (e) {
                alert(e);
            }
        };

        getProject()
        {
            return getProject(this.props.match.params.id);
        };

        handleChange = event => {
            this.setState({
                [event.target.id]: event.target.value
            });
        };

        validateForm(){
            return this.state.managerName.length>0;
        }

        handleSubmit = async event =>{
            event.preventDefault();

            this.setState({isLoading:true});


            try{
                const oldDevelopers = this.state.project.developers.split(",");
                const newDevelopers = this.state.developers.split(",");
                if (oldDevelopers !== newDevelopers) {
                    const addDevelopers = newDevelopers.filter( project =>{
                        return !oldDevelopers.includes(project);
                    });
                    const delDevelopers = oldDevelopers.filter( project =>{
                        return !newDevelopers.includes(project);
                    });

                    addDevelopers.forEach( userName =>{
                        const res = this.changeAttendedProject(true,userName);
                        console.log(res);
                    });

                    delDevelopers.forEach( userName =>{
                        const res = this.changeAttendedProject(false,userName);
                        console.log(res);
                    })
                }

                if (this.state.managerName !== this.state.project.managerName){
                    try{
                        let res = this.changeAttendedProject(true,this.state.managerName);
                        console.log(res);
                        res = this.changeAttendedProject(false,this.state.project.managerName);
                        console.log(res);
                    }catch (e) {
                        console.log(e.message);
                    }

                }

                const res = await this.editProject();
                console.log(res);
                this.props.history.push("/");
            }catch (e) {
                alert(e.message);
                this.setState({isLoading:false});
            }


        };


        async changeAttendedProject(isAdd,userName){
            const user = await getUser(userName);
            user.projects = user.projects.split(",").filter( projectName =>{
                return projectName!==this.state.project.projectName;
            }).toString();
            if (isAdd) {
                user.projects = user.projects.concat(","+this.state.project.projectName);
            }
            delete user.userName;
            delete user.userKey;

            return await updateUser(userName,user);
        }


        editProject(){
            const params= {
                details: this.state.details,
                managerName: this.state.managerName,
                developers: this.state.developers,
                projectStatus: this.state.projectStatus,
                lastEditAt: Date.now()
            };
            return updateProject(this.state.project.projectName,params);
        };

        renderReadOnlyProject(project){
            return (
                <ListGroup>
                    <ListGroupItem header={"projectName: "}>{project.projectName}</ListGroupItem>
                    <ListGroupItem header={"details: "}>{project.details}</ListGroupItem>
                    <ListGroupItem header={"developers: "}>{project.developers}</ListGroupItem>
                    <ListGroupItem header={"projectStatus: "}>{project.projectStatus}</ListGroupItem>
                    <ListGroupItem header={"lastEditAt: "}>{new Date(project.lastEditAt).toLocaleString()}</ListGroupItem>
                    <ListGroupItem header={"createAt: "}>{new Date(project.createAt).toLocaleString()}</ListGroupItem>
                </ListGroup>
            );

        };


        render()
        {
            return (
                <div className={"Projects"}>
                    { ((!this.props.isAdmin) && (this.props.userName !== this.state.project.managerName)) ?
                            <div>
                                {this.renderReadOnlyProject(this.state.project)}
                            </div>
                        :
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="projectName">
                                <ControlLabel>projectName</ControlLabel>
                                <FormControl
                                    readOnly={true}
                                    value={this.state.project.projectName}
                                    componentClass="textarea"
                                />
                            </FormGroup>
                            <FormGroup controlId="details">
                                <ControlLabel>details</ControlLabel>
                                <FormControl
                                    onChange={this.handleChange}
                                    value={this.state.details}
                                    componentClass="textarea"
                                />
                            </FormGroup>
                            <FormGroup controlId={"developers"}>
                                <ControlLabel>developers</ControlLabel>
                                <FormControl
                                    onChange={this.handleChange}
                                    value={this.state.developers}
                                    componentClass={"textarea"}
                                />
                            </FormGroup>
                            <FormGroup controlId={"managerName"}>
                                <ControlLabel>managerName</ControlLabel>
                                {this.props.isAdmin?
                                    <FormControl
                                    // only admin can change the value of project manager
                                    onChange={this.handleChange}
                                    value={this.state.managerName}
                                    componentClass={"textarea"}
                                />
                                    :
                                    <FormControl
                                        readOnly={true}
                                        value={this.state.managerName}
                                        componentClass={"textarea"}
                                    />
                                }
                            </FormGroup>
                            <FormGroup controlId={"projectStatus"}>
                                <ControlLabel>projectStatus</ControlLabel>
                                <FormControl
                                    onChange={this.handleChange}
                                    value={this.state.projectStatus}
                                    // componentClass={"textarea"}
                                />
                            </FormGroup>
                            <LoaderButton
                                block
                                bsStyle="primary"
                                bsSize="large"
                                disabled={!this.validateForm()}
                                type="submit"
                                isLoading={this.state.isLoading}
                                text="EditProject"
                                loadingText="Editing..."
                            />
                        </form>

                    }


                </div>


            )
        }

}