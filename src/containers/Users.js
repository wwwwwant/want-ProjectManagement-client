import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {getUser, updateUser} from "../utils/esayAPI";
import LoaderButton from "../components/LoaderButton";

export default class Users extends Component {
    constructor(props) {
        super(props);


        this.state = {
            user: {},
            isAdmin:false,
            skill:"",
            projects:"",
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
        return true>0;
    }

    handleSubmit = async event =>{
        event.preventDefault();

        this.setState({isLoading:true});

        try{
            const res = await this.editUser();
            console.log(res);
            this.props.history.push("/");
        }catch (e) {
            alert(e.message);
            this.setState({isLoading:false});
        }


    };


    editUser(){
        const params= {
            isAdmin : this.state.isAdmin,
            skill:this.state.skill,
            projects:this.state.projects,
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
                                value={this.state.user.userName}
                                componentClass="textarea"
                            />
                        </FormGroup>
                        <FormGroup controlId="isAdmin">
                            <ControlLabel>isAdmin</ControlLabel>
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.isAdmin}
                                componentClass="textarea"
                            />
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
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.projects}
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