import { log } from 'console';
import models from '../models/index.js';
import { text } from 'stream/consumers';
import logger from '../config/logger.js';

const { Role, Permission, RolePermission, Company, PayrollTemplate,PayrollComponent } = models

const addNewTemplate = async (req, res) => {
    try {
        logger.info(`${req.user.id}--add new payroll template controller called`)
        const { templateName, companyId } = req.body;
        const existingComp = await Company.findOne({ where: { id: companyId } });
        if (!existingComp) {
            return res.status(400).json({ message: "Company not found" });
        }

        // Check if template name already exists for the given company
        const existingTemplate = await PayrollTemplate.findOne({
            where: {
                templateName,
                companyId
            }
        });

        if (existingTemplate) {
            return res.status(400).json({ message: "Template already exists for this company" });
        }

        // Create the new template
        const newTemplate = await PayrollTemplate.create({ templateName, companyId });
        logger.info(`${req.user.id}--new payroll template created`)
        return res.status(201).json({
            message: 'New template added successfully',
            template: newTemplate
        });

    } catch (error) {
        logger.error(`${req.user.id}--error in add new payroll template controller ${error.message}`)
        return res.status(500).json({
            message: 'Error adding new template',
            error: error.message
        });
    }
};

const getListOfTemplate = async (req, res) => {
    try {
        logger.info(`${req.user.id}--list all patroll templates controller called`)
        const { companyId } = req.query;

        const whereClause = {};
        if (companyId) whereClause.companyId = companyId;

        const templates = await PayrollTemplate.findAll({
            attributes: ['id', 'templateName', 'companyId'],
            where: whereClause,
        });
        logger.info(`${req.user.id}--payroll templates list fetched successfully`)
        return res.status(200).json(templates);
    } catch (error) {
        logger.error(`${req.user.id}--error in get list of payroll templates controller ${error.message}`)
        return res.status(500).json({ message: 'Error fetching list of templates', error: error.message });
    }
};


const editPayrollTemplateWithComponents = async (req, res) => {

    try {
        logger.info(`${req.user.id}--edit payroll template with components`)
        const { templateId } = req.params;
        const {
            templateName,
            companyId,
            components = [],
        } = req.body;
        console.log(templateName,components,templateId,companyId);
                

        // Step 1: Update the payroll template
        await PayrollTemplate.update(
            {templateName,companyId},
            { where: { id:templateId } }
        );

        // Step 2: Fetch existing components for comparison
        const existingComponents = await PayrollComponent.findAll({
            where: { templateId },
        });

        const existingIds = existingComponents.map((comp) => comp.id);

        const incomingIds = components.filter(c => c.id).map(c => c.id);


        console.log("111111111111");
        
        // Step 3: Delete removed components
        const toDeleteIds = existingIds.filter(id => !incomingIds.includes(id));
        await PayrollComponent.destroy({ where: { id: toDeleteIds } });
        console.log("22222222222");
        

        // Step 4: Upsert components
        for (const comp of components) {
            if (comp.id) {
                await PayrollComponent.update(
                    {
                        type: comp.type,
                        name: comp.name,
                        amountType: comp.amountType,
                        value: comp.value,
                    },
                    {
                        where: { id: comp.id, templateId: templateId },
                    }
                );
            } else {
                // Create new
                await PayrollComponent.create({
                    templateId,
                    type: comp.type,
                    name: comp.name,
                    amountType: comp.amountType,
                    value: comp.value,
                });
            }
        }
        logger.info(`${req.user.id}--payroll templates and components updated sucessfully`)
        res.status(200).json({ message: 'Payroll template and components updated successfully.' });

    } catch (error) {
        logger.error(`${req.user.id}--${error.message}--error while updating payroll template and components`)
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }

}

const getTempletesComponentList = async (req,res)=>{
    try {
        logger.info(`${req.user.id}--get payroll component list by template controller called`)
        const { templateId } = req.params;
        const components = await PayrollComponent.findAll({
            attributes: ['id', 'type', 'name', 'amountType', 'value', 'templateId'],
            where: { templateId },
        });
        logger.info(`${req.user.id}--component by template fetched successfully`)
        return res.status(200).json(components);
        
    } catch (error) {
        console.error(`Error fetching payroll component list by template: --${error}`);
        return res.status(500).json({ message: 'Error fetching list of components', error: error.message })
    }

}


export { addNewTemplate, getListOfTemplate, getTempletesComponentList , editPayrollTemplateWithComponents }