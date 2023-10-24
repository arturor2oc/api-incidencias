import mongoose from 'mongoose';
 
const Schema = mongoose.Schema;

const IncidentSchema = Schema({
    title:{
        type: 'string',
        require: true
    },
    description:{
        type: 'string',
        require: true
    },
    user:{
        type: 'string',
        require: true
    },
    severity:{
        type: 'string',
        require: true
    },
    completed:{
        type: 'boolean',
        require: true,
        default: false
    },
    create_at: {
        type: Date,
        require: true,
        default: Date.now()
    }
});

export default mongoose.model('Incident', IncidentSchema);