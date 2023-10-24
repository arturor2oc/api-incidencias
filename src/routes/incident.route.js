import { Router } from "express";
import {
    createIncident,
    getIncidents,
    getIncidentsBySeverity,
    getIncidentsByState,
    updateIncident,
    deleteIncident
} from '../controllers/incident.controller.js';

const router = Router();

// Ruta para obtener todas las incidencias.
router.get('/incidents/get', getIncidents);

// Ruta para obtener incidencias filtradas por severidad.
router.get('/incidents/by-severity', getIncidentsBySeverity);

// Ruta para obtener incidencias filtradas por estado.
router.get('/incidents/by-state', getIncidentsByState);

// Ruta para crear una nueva incidencia.
router.post('/incidents/create', createIncident);

// Ruta para actualizar una incidencia existente.
router.put('/incidents/update', updateIncident);

// Ruta para eliminar una incidencia existente.
router.delete('/incidents/delete', deleteIncident);

export default router;