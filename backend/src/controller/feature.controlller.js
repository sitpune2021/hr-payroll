import models from "../models/index.js";

const { Permission,Role } = models;

const addNewFeature = async (req, res) => {

    try {
        const { name, description } = req.body;
        const existingFeature = await Permission.findOne({ where: { name } });
        if (existingFeature) {
            return res.status(400).json({ message: "Feature already exists" });
        }
        const newFeature = await Permission.create({ name, description });

        return res.status(201).json({ message: "Feature added successfully", feature: newFeature });
    } catch (error) {
        return res.status(500).json({ message: "Error adding feature", error: error.message });

    }
}


const getAllFeatures = async (req, res) => {
    try {
        const featuresList = await Permission.findAll({
            attributes: ["id", "name", "description"],
        });
        return res.status(200).json(featuresList);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching features", error: error.message });

    }
}

const getFeaturesByRole = async (req, res) => {
    const roleName= req.user.role;
    const companyId= req.user.companyId;

    try {
        if(roleName==="SUPER_ADMIN"){

            const featuresList = await Permission.findAll({
                attributes: ["id", "name", "description"],
            });
            return res.status(200).json(featuresList);
        }
        const role = await Role.findOne({
            where: { name: roleName,companyId }, 
            include: {
              model: Permission,
              attributes: ['id', 'name', 'description'],
              through: { attributes: [] },  
            },
          });

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        return res.status(200).json(role.Permissions);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching role features", error: error.message });
    }
};

const editFeatureCOntroller = async (req,res) => {
    try {
        const id=req.params.featureId;
        const {name, description} = req.body;
        console.log(id);

        const feature= await Permission.findOne({
            where: { id }
        })

        if(!feature){
            return res.status(400).json({message:"Feature not found"})
        }

        feature.description=description;
         await feature.save(); 
         return res.status(200).json(feature);
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }

}



export { addNewFeature, getAllFeatures,getFeaturesByRole, editFeatureCOntroller };