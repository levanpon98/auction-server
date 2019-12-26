const seeder = require('mongoose-seed');

let items = [
    {
        username: 'admin',
        first_name: 'Computer',
        last_name: 'Science',
        password: '$2b$10$F4WwiLacPy30GCC2.FpQsu.BEdUb77KM9Pp8ShzD9vpZxDV0vioja', //adminadmin
        email: 'admin@gmail.com',
        role: '5e045fd2f7c98815044dcf88',
    }
];

const data = [{
    'model': 'Admin',
    'documents': items
}];

seeder.connect(
    'mongodb+srv://khmtgroup02:khmt.group02'
    + '@cluster0-zwf9v.mongodb.net/khmtgroup02?retryWrites=true&w=majority'
    , function () {
    seeder.loadModels(['../models/admin']);
    seeder.clearModels(['Admin'], function() {
        seeder.populateModels(data, function() {
            seeder.disconnect();
        });
    });
    });
