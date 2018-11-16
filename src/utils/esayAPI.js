import {API} from "aws-amplify"
import {constants} from "./constants";

export async function getUser(userName){
    const path = "/getUser/"+userName;
    return await API.get(constants.projectName,path,{});
}

export async function deleteUser(userName){
    const path = "/deleteUser/"+userName;
    return await API.del(constants.projectName,path,{});
}

export async function createUser(params){
    const path = "/createUser";
    return await API.post(constants.projectName,path,{body:params});
}

export async function updateUser(userName,params){
    const path = "/updateUser/"+userName;
    return await API.put(constants.projectName,path,{body:params});
}

export async function listUser(params) {
    const path = "/listUser"
    return await API.post(constants.projectName,path,{body:params});
}



export async function getProject(projectName){
    const path = "/getProject/"+projectName;
    return await API.get(constants.projectName,path,{});
}

export async function deleteProject(projectName){
    const path = "/deleteProject/"+projectName;
    return await API.del(constants.projectName,path,{});
}

export async function createProject(params){
    const path = "/createProject"
    return await API.post(constants.projectName,path,{body:params});
}

export async function updateProject(projectName,params){
    const path = "/updateProject/"+projectName;
    return await API.put(constants.projectName,path,{body:params});
}

export async function listProject(params) {
    const path = "/listProject"
    return await API.post(constants.projectName,path,{body:params});
}
