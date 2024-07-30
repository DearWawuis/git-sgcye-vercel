import Role from "../models/Roles";
import Division from "../models/Divisions";

export const createRoles = async () => {
    try {
        //Verificar si existen roles en la bd
        const count = await Role.estimatedDocumentCount();
        //Si no existen los crea
        if(count > 0) return;
        //Crear roles por defecto envolviendo en una promesa
        const values = await Promise.all([
            new Role({ name: "student" }).save(),
            new Role({ name: "professor" }).save(),
            new Role({ name: "admin" }).save()
        ]);
        console.log(values);
    } catch(error) {
        console.error(error);
    }
}

export const createDepartaments = async () => {
    try {
        //Verificar si existen categorias en la bd
        const count = await Department.estimatedDocumentCount();
        //Si no existen las crea
        if(count > 0) return;
        //Crear categoria por defecto envolviendo en una promesa
        const values = await Promise.all([
            new Category({ name: "default" }).save()
        ]);
        console.log(values);
    } catch(error) {
        console.error(error);
    }
}

export const createDivisions = async () => {
    try {
        //Verificar si existen divisiones en la bd
        const count = await Division.estimatedDocumentCount();
        //Si no existen las crea
        if(count > 0) return;
        //Crear categoria por defecto envolviendo en una promesa
        const values = await Promise.all([
            new Division({ name: "default" }).save()
        ]);
        console.log(values);
    } catch(error) {
        console.error(error);
    }
}