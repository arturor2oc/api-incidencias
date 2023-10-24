import app from './app.js';
import mongoose from 'mongoose';

// Define el puerto en el que la aplicación estará escuchando.
const port = process.env.PORT || 5000;

// URL de la base de datos MongoDB a la que se conectará la aplicación.
const urlMongoDb = "mongodb+srv://admin:AZ2Thvvr3eb.RLB@api-incidencias.we67t1n.mongodb.net/incidenciasdb";

// Conecta la aplicación a la base de datos MongoDB utilizando Mongoose.
mongoose
  .connect(urlMongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect success");

    // Inicia la aplicación Express, y la hace escuchar en el puerto especificado.
    app.listen(port, () => {
      console.log('Listening on port ' + port);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });