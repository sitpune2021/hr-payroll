import models from "../models/index.js";

const {Department} =  models

const AddNewDepartments= async (req,res) =>{

    try {
        const {name,description}=req.body;
        console.log(name,description);
        
        const existing=await Department.findOne({ where: { name } });
        if(existing){
           return res.status(400).json({message:"Department already exist"});
        }

        const createdDept= await Department.create({
            name,
            description
        });
        return res.status(201).json({message:"Departemnt created Successfully",createdDept})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

const FetchDepartmentList= async (req,res) =>{

    try {
        const deparments=await Department.findAll({
            attributes: ["id", "name", "description","isActive"],
        });
        return res.status(200).json(deparments)

        
    } catch (error) {
       return res.status(500).json({message:error.message});
    }
    
}

export {AddNewDepartments,FetchDepartmentList}