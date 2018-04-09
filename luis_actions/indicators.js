var util = require('util');
var LuisActions = require('../core');

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
    var sectorValue = parameters.Secteur ? parameters.Secteur : 'tous les secteurs';
    var colorValue = parameters.Couleur ? parameters.Couleur : 'Toutes';
    var trendingValue = parameters.Tendance ? parameters.Tendance : 'Toutes';

    callback(util.format('Indicateur trouvés pour %s avec la couleur: %s et la tendance: %s',
        sectorValue, colorValue, trendingValue));
}

// Contextual action that changes location for the FindHotelsAction
/*
var FindHotelsAction_ChangeLocation = {
    intentName: 'FindHotels-ChangeLocation',
    friendlyName: 'Change the Hotel Location',
    parentAction: FindHotelsAction,
    canExecuteWithoutContext: true,         // true by default
    schema: {
        Place: {
            type: 'string',
            builtInType: LuisActions.BuiltInTypes.Geography.City,
            message: 'Please provide a new location for your hotel'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        // assign new location to FindHotelsAction
        parentContextParameters.Place = parameters.Place;

        callback('Hotel location changed to ' + parameters.Place);
    }
};
*/

// Contextual action that changes Checkin for the FindHotelsAction
/*
var FindHotelsAction_ChangeCheckin = {
    intentName: 'FindHotels-ChangeCheckin',
    friendlyName: 'Change the hotel check-in date',
    parentAction: FindHotelsAction,
    canExecuteWithoutContext: false,
    schema: {
        Checkin: {
            type: 'date',
            builtInType: LuisActions.BuiltInTypes.DateTime.Date,
            validDate: true, message: 'Please provide the new check-in date'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Checkin = parameters.Checkin;
        callback('Hotel check-in date changed to ' + formatDate(parameters.Checkin));
    }
};
*/

// Contextual action that changes CheckOut for the FindHotelsAction
/*
var FindHotelsAction_ChangeCheckout = {
    intentName: 'FindHotels-ChangeCheckout',
    friendlyName: 'Change the hotel check-out date',
    parentAction: FindHotelsAction,
    canExecuteWithoutContext: false,
    schema: {
        Checkout: {
            type: 'date',
            builtInType: LuisActions.BuiltInTypes.DateTime.Date,
            validDate: true, message: 'Please provide the new check-out date'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.Checkout = parameters.Checkout;
        callback('Hotel check-out date changed to ' + formatDate(parameters.Checkout));
    }
};
*/

module.exports = [
    FindIndicatorAction,
    //FindHotelsAction_ChangeLocation,
    //FindHotelsAction_ChangeCheckin,
    //FindHotelsAction_ChangeCheckout
];
/*
function formatDate(date) {
    var offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset).toDateString();
}
*/