import Division from "../models/Divisions";
import User from "../models/Users";
import Course from "../models/Courses";

//Obtener todas las divisiones
export const getDivisions = async (req, res) => {
    try{
        const divisions = await Division.find();
    res.json(divisions);
    } catch(error){
        res.status(500).json({message: error.message})
    }
}

//Crear una division
export const createDivision = async (req, res) => {

    try {
        const { name, description } = req.body;
        const newDivision = new Division({ name, description });
        const divisionSave = await newDivision.save();
        res.status(201).json(divisionSave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Obtener una division por su ID
export const getDivisionById = async (req, res) => {
    const { DivisionId } = req.params;
    try {
        const division = await Division.findById(DivisionId);
        if (!division) return res.status(404).json({ message: 'Division no encontrada' });
        res.json(division);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la division' });
    }
};

//Actualizar una division por su ID
export const updateDivisionById = async (req, res) => {
    const { DivisionId } = req.params;
    const { name, description } = req.body;
    try {
        const updatedDivision = await Division.findByIdAndUpdate(DivisionId, { name, description }, { new: true });
        if (!updatedDivision) return res.status(404).json({ message: 'Division no encontrada' });
        res.json(updatedDivision);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la division' });
    }
};

//Eliminar una division por su ID
export const deleteDivisionById = async (req, res) => {
    const { DivisionId } = req.params;
    try {
        await User.updateMany(
            { division: DivisionId },
            { $set: { division: "66a1f139997f8623e4c64f77" } }  
        );

        await Course.updateMany(
            { division: DivisionId },
            { $set: { division: "66a1f139997f8623e4c64f77" } }  
        );

        const deletedDivision = await Division.findByIdAndDelete(DivisionId);
        if (!deletedDivision) return res.status(404).json({ message: 'Division no encontrada' });
        res.json({ message: 'Division eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la division' });
    }
};
