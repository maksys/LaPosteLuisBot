var util = require('util');
var LuisActions = require('../core');

var ResetAction = {
    intentName: 'Reset',
    friendlyName: "Recommencer",
    confirmOnContextSwitch: true,           // true by default
    schema: {
        Secteur: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Secteur,
            optional: true
        },
        Couleur: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Couleur,
            optional: true
        },
        Tendance: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Tendance,
            optional: true
        }
    },
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: actionFulfill
};

function actionFulfill (parameters, callback) {
    callback("J'espère vous avoir été utile.");
}

module.exports = [
    ResetAction,
];
