require('dotenv-extended').load({ path: './.env' });

var builder = require('botbuilder');
var restify = require('restify');

var LuisActions = require('./core');
var SampleActions = require('./luis_actions/all');

//var searchContext = require('./searchContext');

var LuisModelUrl = process.env.LUIS_MODEL_URL;

var server = restify.createServer();

// server.get(
//     '/assets/*',
//     restify.plugins.serveStatic({
//       directory: './assets',
//       appendRequestPath: false
//     })
//   )


server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//var connector = new builder.ChatConnector();
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intentDialog = bot.dialog('/', new builder.IntentDialog({ recognizers: [recognizer] })
    .onDefault(DefaultReplyHandler));

LuisActions.bindToBotDialog(bot, intentDialog, LuisModelUrl, SampleActions, {
    defaultReply: DefaultReplyHandler,
    fulfillReply: FulfillReplyHandler,
    onContextCreation: onContextCreationHandler,
});

function DefaultReplyHandler(session) {
    session.endDialog(
        'Désolé je n\'ai pas compris "%s". Merci d\'utiliser des phrases comme "Quels sont les indicateurs stables pour Paris"',
        session.message.text);
}

function FulfillReplyHandler(session, actionModel) {
    console.log('Action Binding "' + actionModel.intentName + '" completed:', actionModel);

    // We found things
    if (actionModel.intentName === 'Afficher_Indicateurs'){
        handleSearch(session, actionModel);
    } else if (actionModel.intentName === 'Reset'){
        var reply = createEventMessage("reset", actionModel.parameters, session.message.address);
        session.send(reply);
    } else if (actionModel.intentName === 'Aide'){
        var timer = 0;
        if (!actionModel.parameters.EntityTypes){
            session
            .send("Je peux vous afficher les indicateurs en les filtrant sur un secteur, une tendance ou une couleur. Demandez moi par exemple « Quels sont les bons(vert) indicateurs stables (tendance) sur Paris (Secteur) ? »")
            timer = 1500;
        }
        setTimeout(timedHelpCard, timer, session, actionModel.parameters);
        // var card = createCardMessage(session, actionModel.parameters);
        // session.send(card);
    }

    session.endDialog(actionModel.result.toString());
}

function timedHelpCard(session, parameters){
    var card = createCardMessage(session, parameters);
    session.send(card);
}

function onContextCreationHandler(action, actionModel, next, session) {
    console.log("It's ok i'm here");

    // if (action.intentName === 'FindHotels') {
    //     if (!actionModel.parameters.Checkin) {
    //         actionModel.parameters.Checkin = new Date();
    //     }

    //     if (!actionModel.parameters.Checkout) {
    //         actionModel.parameters.Checkout = new Date();
    //         actionModel.parameters.Checkout.setDate(actionModel.parameters.Checkout.getDate() + 1);
    //     }
    // }

    next();
}

function handleSearch(session, actionModel){
    if (actionModel.parameters.Secteur === 'unknow'){
        session.send("Désolé, je ne connais pas le secteur demandé...");
        var msg = new builder.Message(session);
        msg.addAttachment(buildSectorsCard(session));            
        session.send(msg);
        return;
    }
    if (actionModel.parameters.Couleur === 'unknow'){
        session.send("Désoloé, je ne connais pas la couleur demandée...");
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments(buildColorsCard(session));             
        session.send(msg);
        return;        
    }

    var reply = createEventMessage("searchResult", actionModel.parameters, session.message.address);
    session.send(reply);
}

const createCardMessage = (session, parameters) => {
    var msg = new builder.Message(session);
    if (!parameters.EntityTypes){
        msg.addAttachment(buildHelpCard(session));
    } else {
        if (parameters.EntityTypes === 'Secteurs'){
            msg.addAttachment(buildSectorsCard(session));            
        } else if (parameters.EntityTypes === 'Couleurs'){
            msg.attachmentLayout(builder.AttachmentLayout.carousel)
            msg.attachments(buildColorsCard(session));            
        } else if (parameters.EntityTypes === 'Tendances'){
            msg.addAttachment(buildTrendingsCard(session));            
        }
    }
    return msg;
}

function buildHelpCard(session) {
    return new builder.HeroCard(session)
        .title('Aide')
        //.subtitle("Selection d'indicateurs")
        .text('Retrouvez vos indicateurs par secteur, couleur et tendance.')
        // .images([
        //     builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        // ])
        .buttons([
            builder.CardAction.imBack(session, "quels sont les secteurs ?", "Secteurs"),
            builder.CardAction.imBack(session, "quelles sont les couleurs ?", "Couleurs"),
            builder.CardAction.imBack(session, "quelles sont les tendances ?", "Tendances"),
        ]);
}

function buildSectorsCard(session) {
    return new builder.HeroCard(session)
        .title('Aide')
        .subtitle("Liste des secteurs")
        // .images([
        //     builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        // ])
        .buttons([
            builder.CardAction.imBack(session, "paris", "Paris"),
            builder.CardAction.imBack(session, "bordeaux", "Bordeaux"),
            builder.CardAction.imBack(session, "gentilly", "Gentilly"),
            builder.CardAction.imBack(session, "marseille", "Marseille"),
            builder.CardAction.imBack(session, "lille", "Lille"),
            builder.CardAction.imBack(session, "rennes", "Rennes"),
        ]);
}

function buildColorsCard(session) {
    return [
        new builder.HeroCard(session)
        .title('Vert')
        .subtitle("Liste des bons indicateur")
        .tap(builder.CardAction.imBack(session, "vert")),
        new builder.HeroCard(session)
        .title('Orange')
        .subtitle("Liste des indicateurs moyens")
        .tap(builder.CardAction.imBack(session, "orange")),
        new builder.HeroCard(session)
        .title('Rouge')
        .subtitle("Liste des mauvais indicateurs")
        .tap(builder.CardAction.imBack(session, "rouge")),
    ];
}

function buildTrendingsCard(session) {
    return new builder.HeroCard(session)
        .title('Aide')
        .subtitle("Liste des tendances")
        // .images([
        //     builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        // ])
        .buttons([
            builder.CardAction.imBack(session, "hausse", "Hausse"),
            builder.CardAction.imBack(session, "stable", "Stable"),
            builder.CardAction.imBack(session, "baisse", "Baisse"),
        ]);
}

//Creates a backchannel event
const createEventMessage = (eventName, value, address) => {
    var msg = new builder.Message().address(address);
    msg.data.type = "event";
    msg.data.name = eventName;
    msg.data.value = value;
    return msg;
}