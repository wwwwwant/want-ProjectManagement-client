import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
// import { API } from "aws-amplify";
import {getUser, updateUser} from "../utils/esayAPI";


export default class ModifyUser extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            skill: "",
            details:""
        }
    }

    validateForm() {
        return this.state.skill.length>0;
    };

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    async componentDidMount()
    {
        if (!this.props.isAuthenticated) {
            return;
        }
        try {
            const user = await this.getUser();
            this.setState({skill:user.skill});
            this.setState({details:user.details});
        } catch (e) {
            alert(e);
        }

        this.setState({isLoading: false});
    };

    getUser()
    {
        return getUser(this.props.userName);
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({isLoading: true});
        const params = {
            skill: this.state.skill,
            details:this.state.details
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
                    <FormGroup controlId="details" bsSize="large">
                        <ControlLabel>details</ControlLabel>
                        <FormControl
                            value={this.state.details}
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
