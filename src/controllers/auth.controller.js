import User from '../models/Users';
import Role from '../models/Roles';
import Division from '../models/Divisions';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
// Cargar variables de entorno desde el archivo .env
dotenv.config();

const SECRET = process.env.SECRET;

//Crea la función que te ayudará a obtener el token
export const signToken = (user) => {
    if (!SECRET) {
        throw new Error('Falta la variable SECRET en el archivo .env');
    }
    const payload = {
        id: user.id,
    };
    return jwt.sign(payload, SECRET);
}

export const signUp = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la petición
        const { name, lname, age, divisionName, email, password, rolesNames } = req.body;

        // Verificar que la división existe y obtener su ID
        const foundDivision = await Division.findOne({ name: divisionName });
        if (!foundDivision) {
            return res.status(400).json({ message: "División no encontrada" });
        }

        // Verificar que los roles existen y obtener sus IDs
        const foundRoles = await Role.find({ name: { $in: rolesNames } });
        if (foundRoles.length !== rolesNames.length) {
            return res.status(400).json({ message: "Uno o más roles no encontrados" });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            name,
            lname,
            age,
            division: foundDivision._id,
            email,
            password: await User.encryptPassword(password),
            roles: foundRoles.map(role => role._id)
        });

        // Guardar el usuario en la bd
        const saveUser = await newUser.save();

        // Verificar que esten llegando correctamente
        console.log(saveUser);
        res.json({ token: signToken(saveUser) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signIn = async (req, res) => {
    try {
        // Buscar usuario por correo
        const userFound = await User.findOne({ email: req.body.email }).populate("roles");
        // Si no se encuentra el usuario, enviar mensaje de error
        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        // Verificar contraseña
        const matchPassword = await User.comparePassword(req.body.password, userFound.password);
        // Si la contraseña no coincide, enviar mensaje de error
        if (!matchPassword) return res.status(401).json({ token: null, message: "Contraseña inválida" });

        // Generar token
        const token = jwt.sign({ id: userFound.id }, process.env.SECRET, {
            expiresIn: 86400 // 24 horas
        });
        // Mostrar usuario encontrado
        console.log(userFound);
        // Json de prueba
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
