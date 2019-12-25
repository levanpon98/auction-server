const seeder = require('mongoose-seed');
var fs = require('fs');

var items = JSON.parse(fs.readFileSync('./quan_huyen.json', 'utf8'));

const data = [{
    'model': 'District',
    'documents': Object.values(items)
}];

seeder.connect(
    'mongodb+srv://khmtgroup02:khmt.group02'
    + '@cluster0-zwf9v.mongodb.net/khmtgroup02?retryWrites=true&w=majority'
    , function () {
    seeder.loadModels(['../models/district']);
    seeder.clearModels(['District'], function() {
        seeder.populateModels(data, function() {
            seeder.disconnect();
        });
    });
    });
