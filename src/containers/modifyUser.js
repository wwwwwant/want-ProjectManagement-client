import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
// import { API } from "aws-amplify";
import {updateUser} from "../utils/esayAPI";


export default class ModifyUser extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            skill: "",
        }
    }

    validateForm() {
        return this.state.skill.length>0;
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
            skill: this.state.skill,
        }

        try{
            const res = await updateUser(this.props.userName,params);
            console.log("updateUser result: ",res);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
        }
        this.setState({isLoading: false});
    }

    render() {
        return (
            <div className="ModifyUser">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="skill" bsSize="large">
                        <ControlLabel>skill</ControlLabel>
                        <FormControl
                            value={this.state.skill}
                            onChange={this.handleChange}
                            type="string"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text={"Modify"}
                        loadingText={"Modifying..."}
                    />
                </form>
            </div>
        );
    }
}
