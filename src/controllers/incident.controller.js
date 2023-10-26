import express from 'express';
import Incident from '../models/incident.model.js'

/**
 * Obtiene una lista de incidencias y responde con ellas en formato JSON.
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 */
export const getIncidents = async (req, res) => {
    try {
        // Intenta obtener una lista de incidencias ordenadas por la fecha de creación de forma ascendente.
        const incidents = await Incident.find().sort({ create_at: 1 });

        // Si no se encuentran incidencias, responde con un código de estado 404 y un mensaje descriptivo.
        if (incidents.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron incidencias.' });
        }

        // Si se encontraron incidencias, responde con un código de estado 200 y la lista de incidencias en formato JSON.
        res.status(200).json(incidents);
    } catch (error) {
        // En caso de error, devuelve una respuesta de error con un código de estado 500 y un mensaje descriptivo.
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}

/**
 * Obtiene una lista de incidencias filtradas por severidad y responde con ellas en formato JSON.
 * @param {object} req - Objeto de solicitud HTTP que puede contener un parámetro de consulta 'severity'.
 * @param {object} res - Objeto de respuesta HTTP.
 */
export const getIncidentsBySeverity = async (req, res) => {
    try {
        // Obtiene el valor del parámetro de consulta 'severity' de la solicitud.
        const severity = req.query.severity;

        // Comprueba si 'severity' está presente en la solicitud; si no lo está, responde con un código de estado 400 y un mensaje indicando que 'severity' es requerido.
        if (!severity) {
            return res.status(400).json({ msg: 'La severidad es requerida.' });
        }

        // Intenta obtener una lista de incidencias filtradas por la severidad proporcionada y ordenadas por la fecha de creación en orden ascendente.
        const incidents = await Incident.find({ severity: severity }).sort({ create_at: 1 });

        // Si no se encuentran incidencias con la severidad proporcionada, responde con un código de estado 204 y un mensaje descriptivo.
        if (incidents.length === 0) {
            return res.status(204).json({ msg: 'No se encontraron incidencias con la severidad proporcionada.' });
        }

        // Si se encontraron incidencias, responde con un código de estado 200 y la lista de incidencias filtradas en formato JSON.
        res.status(200).json(incidents);
    } catch (error) {
        // En caso de error, devuelve una respuesta de error con un código de estado 500 y un mensaje descriptivo.
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}

/**
 * Obtiene una lista de incidencias filtradas por su estado de completado y responde con ellas en formato JSON.
 * @param {object} req - Objeto de solicitud HTTP que puede contener un parámetro de consulta 'completed'.
 * @param {object} res - Objeto de respuesta HTTP.
 */
export const getIncidentsByState = async (req, res) => {
    try {
        // Obtiene el valor del parámetro de consulta 'completed' de la solicitud.
        const completed = req.query.completed;

        // Comprueba si 'completed' está presente en la solicitud y no es nulo. Si no lo está, responde con un código de estado 400 y un mensaje indicando que el parámetro 'completed' es requerido.
        if (completed === undefined || completed === null) {
            return res.status(400).json({ msg: 'El parámetro "completed" es requerido.' });
        }

        // Intenta obtener una lista de incidencias filtradas por el estado de completado proporcionado y ordenadas por la fecha de creación en orden ascendente.
        const incidents = await Incident.find({ completed: completed }).sort({ create_at: 1 });

        // Si no se encuentran incidencias con el estado de completado proporcionado, responde con un código de estado 204 y un mensaje indicando que no se encontraron incidencias con el valor proporcionado.
        if (incidents.length === 0) {
            return res.status(204).json({ msg: 'No se encontraron incidencias completadas con el valor proporcionado.' });
        }

        // Si se encontraron incidencias, responde con un código de estado 200 y la lista de incidencias filtradas en formato JSON.
        res.status(200).json(incidents);
    } catch (error) {
        // En caso de error, devuelve una respuesta de error con un código de estado 500 y un mensaje descriptivo.
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}

/**
 * Crea una nueva incidencia y la almacena en el sistema. Responde con los detalles de la incidencia creada en formato JSON.
 * @param {object} req - Objeto de solicitud HTTP que debe contener en el cuerpo (body) los datos de la nueva incidencia, incluyendo el título (title), la descripción (description), el usuario (user), y la severidad (severity).
 * @param {object} res - Objeto de respuesta HTTP.
 */
export const createIncident = async (req, res) => {
    try {
        // Obtiene los datos de la nueva incidencia del cuerpo de la solicitud.
        const { title, description, user, severity } = req.body;

        // Comprueba si alguno de los campos requeridos (title, description, user, severity) falta en la solicitud.
        if (!title || !description || !user || !severity) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos.' });
        }

        // Crea una nueva instancia de la incidencia con los datos proporcionados.
        const incident = new Incident({
            title,
            description,
            user,
            severity
        });

        // Intenta guardar la incidencia en el sistema.
        const incidentStore = await incident.save();

        // Si no se pudo guardar la incidencia, responde con un código de estado 500 y un mensaje indicando que no se ha guardado la incidencia.
        if (!incidentStore) {
            return res.status(500).json({ msg: 'No se ha guardado la incidencia.' });
        }

        // Si la incidencia se ha guardado con éxito, responde con un código de estado 201 y los detalles de la incidencia creada en formato JSON.
        res.status(201).json({ incident: incidentStore });
    } catch (error) {
        // En caso de error, devuelve una respuesta de error con un código de estado 500 y un mensaje descriptivo.
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}

/**
 * Actualiza una incidencia existente en el sistema. Responde con un mensaje indicando una actualización exitosa.
 * @param {object} req - Objeto de solicitud HTTP que debe contener en el cuerpo (body) los datos actualizados de la incidencia, incluyendo el campo 'id' que identifica la incidencia a actualizar.
 * @param {object} res - Objeto de respuesta HTTP.
 */
export const updateIncident = async (req, res) => {
    try {
        // Obtiene el campo 'id' y los datos actualizados de la incidencia del cuerpo de la solicitud.
        const { _id, ...updatedData } = req.body;

        // Comprueba si el campo 'id' está presente en la solicitud. Si no lo está, responde con un código de estado 400 y un mensaje que indica que el campo 'id' es requerido.
        if (!_id) {
            return res.status(400).json({ msg: 'El campo "id" es requerido.' });
        }

        // Intenta actualizar la incidencia en la base de datos utilizando el 'id' proporcionado y los datos actualizados.
        const incident = await Incident.findByIdAndUpdate(_id, updatedData);

        // Si no se encuentra la incidencia a actualizar, responde con un código de estado 404 y un mensaje que indica que no se encontró la incidencia.
        if (!incident) {
            return res.status(404).json({ msg: 'No se encontró la incidencia a actualizar.' });
        }

        // Si la actualización se realiza con éxito, responde con un código de estado 200 y un mensaje que indica una actualización exitosa.
        res.status(200).json({ msg: 'Actualización exitosa' });
    } catch (error) {
        // En caso de error, devuelve una respuesta de error con un código de estado 500 y un mensaje descriptivo.
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}

/**
 * Elimina una incidencia existente en el sistema. Responde con un mensaje indicando una eliminación exitosa.
 * @param {object} req - Objeto de solicitud HTTP que debe contener en el cuerpo (body) el campo 'id' que identifica la incidencia a eliminar.
 * @param {object} res - Objeto de respuesta HTTP.
 */
export const deleteIncident = async (req, res) => {
    try {
        // Obtiene el campo 'id' del cuerpo de la solicitud.
        const { _id } = req.body;

        // Comprueba si el campo 'id' está presente en la solicitud. Si falta, responde con un código de estado 400 y un mensaje que indica que el campo 'id' es requerido.
        if (!_id) {
            return res.status(400).json({ msg: 'El campo "id" es requerido.' });
        }

        // Intenta eliminar la incidencia en la base de datos utilizando el 'id' proporcionado.
        const incident = await Incident.findByIdAndDelete(_id);

        // Si no se encuentra la incidencia a eliminar (por ejemplo, si el 'id' no coincide con ninguna incidencia existente), responde con un código de estado 404 y un mensaje que indica que no se encontró la incidencia.
        if (!incident) {
            return res.status(404).json({ msg: 'No se encontró la incidencia a eliminar.' });
        }

        // Si la eliminación se realiza con éxito, responde con un código de estado 200 y un mensaje que indica una eliminación exitosa.
        res.status(200).json({ msg: 'Eliminación exitosa' });
    } catch (error) {
        // En caso de error, devuelve una respuesta de error con un código de estado 500 y un mensaje descriptivo.
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
}
