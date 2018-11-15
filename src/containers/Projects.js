import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {getProject, updateProject} from "../utils/esayAPI";
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
                const res = await this.editProject();
                console.log(res);
                this.props.history.push("/");
            }catch (e) {
                alert(e.message);
                this.setState({isLoading:false});
            }


        };


        editProject(){
            const params= {
                details: this.state.details,
                managerName: this.state.managerName,
                developers: this.state.developers,
                projectStatus: this.state.projectStatus
            }
            return updateProject(this.state.project.projectName,params);
        }

        // renderProjectInfo(project)
        // {
        //     for (let key in project) {
        //
        //     }
        //
        // }

        render()
        {
            return (
                <div className={"Projects"}>
                    { (!this.props.isAdmin) || (this.props.userName !== this.state.project.managerName) ?
                        <div>{JSON.stringify(this.state.project)}</div>
                        :
                        <form onSubmit={this.handleSubmit}>
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
                                <FormControl
                                    onChange={this.handleChange}
                                    value={this.state.managerName}
                                    componentClass={"textarea"}
                                />
                            </FormGroup>
                            <FormGroup controlId={"projectStatus"}>
                                <ControlLabel>projectStatus</ControlLabel>
                                <FormControl
                                    onChange={this.handleChange}
                                    value={this.state.projectStatus}
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
                                text="EditProject"
                                loadingText="Editing..."
                            />
                        </form>

                    }


                </div>


            )
        }

}