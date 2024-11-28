const express = require("express")
const Sequelize = require("sequelize")
const fs = require("fs")  // Módulo para trabajar con el sistema de archivos
const path = require("path")  // Módulo para manejar rutas de archivos
const cors = require("cors")  // Módulo para habilitar CORS
require("dotenv").config()

// Inicialización de Express
const app = express()  // Crea una instancia de la aplicación Express
const PORT = process.env.PORT || 3000

// Configurar CORS con opciones específicas
app.use(cors({
    credentials: true
}))

// Configuración de la conexión a la base de datos con Sequelize
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,  // Host de la base de datos
    dialect: process.env.DB_SERVER || "mysql",  // Sistema de base de datos a usar
    port: process.env.DB_PORT || 3306,  // Puerto de la base de datos
});

// Función para cargar automáticamente todos los modelos
const loadModels = () => {
    const models = {};  // Objeto que almacenará todos los modelos
    const modelsPath = path.join(__dirname, 'src', 'models');  // Ruta a la carpeta de modelos

    // Lee todos los archivos de la carpeta models
    fs.readdirSync(modelsPath)
        .filter(file => file.endsWith('.js'))  // Filtra solo archivos JavaScript
        .forEach(file => {
            // Carga cada modelo y lo inicializa con Sequelize
            const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
            models[model.name] = model;  // Almacena el modelo en el objeto models
        });

    return models;
};

// Carga inmediata de los modelos
const models = loadModels();

// Función asíncrona para inicializar la aplicación
const initializeApp = async () => {
    try {
        // Verifica la conexión a la base de datos
        await sequelize.authenticate();
        console.log("Conexión a la base de datos exitosa");

        // Sincroniza los modelos con la base de datos (crea las tablas si no existen)
        await sequelize.sync();
        console.log("Modelos sincronizados con la base de datos");

        // Configura middleware para parsear JSON en las peticiones
        app.use(express.json());

        // Carga y configura las rutas de la aplicación
        const indexRouter = require("./src/routes/index");
        app.use(indexRouter);

        // Inicia el servidor HTTP
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        // Manejo de errores durante la inicialización
        console.error("Error durante la inicialización:", error);
        process.exit(1);  // Termina el proceso con código de error
    }
};

// Ejecuta la función de inicialización
initializeApp();

// Exporta los modelos y la instancia de Sequelize para uso en otros archivos
module.exports = { models, sequelize };