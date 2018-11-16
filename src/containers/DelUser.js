import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import {deleteUser} from "../utils/esayAPI";


export default class delUser extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            userName: ""
        }
    }
    validateForm() {
        return this.state.userName.length>0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({isLoading: true});

        try{
            const res = await deleteUser(this.state.userName);
            alert("delete user success:"+res);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
        }
        this.setState({isLoading: false});
    };

    render() {
        return (
            <div className="DelUser">
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
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text={"Delete"}
                        loadingText={"Deleting..."}
                    />
                </form>
            </div>
        );
    }
}
