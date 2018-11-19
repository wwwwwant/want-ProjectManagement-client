import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {createProject, getUser, updateUser} from "../utils/esayAPI";
import LoaderButton from "../components/LoaderButton";

export default class NewProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projectName: "",
            details: "",
            developers: "",
            managerName: "",
            projectStatus: "",
            isLoading: false
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    validateForm(){
        return this.state.projectName.length>0;
    }

    handleSubmit = async event =>{
        event.preventDefault();

        this.setState({isLoading:true});

        const params= {
            projectName:this.state.projectName,
            details: this.state.details,
            managerName: this.state.managerName,
            developers: this.state.developers,
            projectStatus: this.state.projectStatus,
            lastEditAt: Date.now()
        };
        try{
            this.state.developers.split(",").forEach(userName=>{
                const res = this.addAttendedProject(userName);
                console.log("success to add attended project to user ",res);
            });
            let res = await this.addAttendedProject(this.state.managerName);
            console.log("success to add attended project to user ",res);

            res = await createProject(params);
            console.log("success to create project ",res);
            this.props.history.push("/");

        }catch (e) {
            console.log(e.message);
        }

        this.setState({ isLoading: true });


    };


    async addAttendedProject(userName){
        const user = await getUser(userName);
        console.log(JSON.stringify(user));
        delete user.userName;
        delete user.userKey;
        user.projects == null? user.projects = this.state.projectName
            :user.projects = user.projects.concat(","+this.state.projectName);
        return await updateUser(userName,user);
    }



    render()
    {
        return (
            <div className={"Projects"}>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="projectName">
                        <ControlLabel>projectName</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.projectName}
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
                        text="CreateProject"
                        loadingText="Creating..."
                    />
                </form>



            </div>


        )
    }

}