import express from 'express';
import incidentRoute from './routes/incident.route.js';

// Crea una instancia de la aplicación Express.
const app = express();

// Agrega middleware para analizar datos JSON en las solicitudes.
app.use(express.json());

// Agrega middleware para analizar datos codificados en URL en las solicitudes.
app.use(express.urlencoded({ extended: true }));

// Agrega las rutas relacionadas con las incidencias bajo el prefijo '/api'.
app.use('/api', incidentRoute);

export default app;