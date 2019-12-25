const seeder = require('mongoose-seed');
var fs = require('fs');

var items = JSON.parse(fs.readFileSync('./xa_phuong.json', 'utf8'));

const data = [{
    'model': 'Ward',
    'documents': Object.values(items)
}];

console.log(Object.values(items).length);
seeder.connect(
    'mongodb+srv://khmtgroup02:khmt.group02'
    + '@cluster0-zwf9v.mongodb.net/khmtgroup02?retryWrites=true&w=majority'
    , function () {
    seeder.loadModels(['../models/ward']);
    seeder.clearModels(['Ward'], function() {
        seeder.populateModels(data, function() {
            seeder.disconnect();
        });
    });
    });
