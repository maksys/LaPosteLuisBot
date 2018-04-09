var util = require('util');
var LuisActions = require('../core');

var HelpAction = {
    intentName: 'Aide',
    friendlyName: "Afficher l'aide",
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
    callback("");
    //callback("Je peux vous afficher les indicateurs en les filtrant sur un secteur, une tendance ou une couleur. Demandez moi par exemple « Quels sont les bons(vert) indicateurs stables (tendance) sur Paris (Secteur) ? »");
}

module.exports = [
    HelpAction,
];
