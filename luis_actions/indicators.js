var util = require('util');
var LuisActions = require('../core');

var searchContext = require('../searchContext');

var FindIndicatorAction = {
    intentName: 'Afficher_Indicateurs',
    friendlyName: 'Afficher les indicateurs',
    confirmOnContextSwitch: true,           // true by default
    // Property validation based on schema-inspector - https://github.com/Atinux/schema-inspector#v_properties
    schema: {
        Secteur: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Secteur,
            optional: true,
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
    fulfill: actionfulfill
};

function actionfulfill (parameters, callback){
    if (parameters.Secteur === 'unknow' || parameters.Couleur === 'unknow'){
        callback('');
        return;
    }
    LastSector = parameters.Secteur ? parameters.Secteur : LastSector;
    LastColor = parameters.Couleur ? parameters.Couleur : LastColor;
    LastTrending = parameters.Tendance ? parameters.Tendance : LastTrending;

    var sectorText = LastSector === 'Tous' ? 'tous les secteurs' : LastSector;
    var colorText = '';
    if (LastColor === 'Toutes' || LastColor === 'Toute' || LastColor === 'toutes les couleurs'){
        colorText = 'toutes les couleurs'
    } else {
        colorText = util.format('de couleur \"%s\"', LastColor);        
    }
 
    var trendingText = '';
    if (LastTrending === 'Toutes' || LastTrending === 'Toute' || LastTrending === 'toutes les tendances'){
        trendingText = 'toutes les tendances';
    } else {
        if (LastTrending === 'Hausse'){
            trendingText = 'à la hausse';
        } else if (LastTrending === 'Baisse'){
            trendingText = 'à la baisse'
        } else {
            trendingText = 'stables'
        }
    }

    callback(util.format('Résultats pour %s, %s et %s',
        sectorText, colorText, trendingText));
}

module.exports = [
    FindIndicatorAction
];