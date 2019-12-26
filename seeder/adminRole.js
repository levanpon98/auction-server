const seeder = require('mongoose-seed');

let items = [
{'title': 'Super Admin'},
{'title': 'Registrar'},
{'title': 'Editor'},
];

const data = [{
    'model': 'AdminRole',
    'documents': items
}];

seeder.connect(
    'mongodb+srv://khmtgroup02:khmt.group02'
    + '@cluster0-zwf9v.mongodb.net/khmtgroup02?retryWrites=true&w=majority'
    , function () {
    seeder.loadModels(['../models/admin_role']);
    seeder.clearModels(['AdminRole'], function() {
        seeder.populateModels(data, function() {
            seeder.disconnect();
        });
    });
    });
