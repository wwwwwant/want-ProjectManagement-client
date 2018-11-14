import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";


export default class CreateUser extends Component {
    constructor(props){
        super(props);

        this.state = {
            isAdmin : false,
            isLoading: false,
            skill: "Ruby",
            userName: "user10"
        }
    }
    validateForm() {
        return this.state.userName.length>0 && this.state.skill.length>0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({isLoading: true});
        const params = {
            isAdmin: this.state.isAdmin,
            skill: this.state.skill,
            userName: this.state.userName
        }

        try{
            const res = await API.post("projectManagement","/createUser",{
                            body:params
                        });
            console.log(res);
            this.props.history.push("/");
            alert("successfully create user!");
        } catch (e) {
            alert(e.message);
        }
        this.setState({isLoading: false});
    }

    render() {
        return (
            <div className="CreateUser">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="userName" bsSize="large">
                        <ControlLabel>userName</ControlLabel>
                        <FormControl
                            autoFocus
                            type="string"
                            value={this.state.userName}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="skill" bsSize="large">
                        <ControlLabel>skill</ControlLabel>
                        <FormControl
                            value={this.state.skill}
                            onChange={this.handleChange}
                            type="string"
                        />
                    </FormGroup>
                    <FormGroup controlId={"isAdmin"} bsSize={"large"}>
                        <ControlLabel>isAdmin</ControlLabel>
                        <FormControl
                            value={this.state.isAdmin}
                            onChange={this.handleChange}
                            type={"boolean"}
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text={"Create"}
                        loadingText={"Creating..."}
                    />
                </form>
            </div>
        );
    }
}
