/*** Global Variables
***/

var app;    // [object StrangerThingsApp]
var flagFsaContinue;    // boolean

// app status
var APP_STATUS__INITIALIZED = "INITIALIZED";
var APP_STATUS__LOGIN = "LOGIN";
var APP_STATUS__LOGIN__WAIT_USER = "LOGIN__WAIT_USER";
var APP_STATUS__LOGIN__AUTHENTICATE = "LOGIN__AUTHENTICATE";
var APP_STATUS__LOGIN__OK = "LOGIN__OK";
var APP_STATUS__LOGIN__ERROR = "LOGIN__ERROR";
var APP_STATUS__LOGIN__ERROR__WAIT_USER = "LOGIN__ERROR__WAIT_USER";
var APP_STATUS__REGISTER = "REGISTER";
var APP_STATUS__REGISTER__WAIT_USER = "REGISTER__WAIT_USER";
var APP_STATUS__REGISTER__AUTHENTICATE = "REGISTER__AUTHENTICATE";
var APP_STATUS__REGISTER__OK = "REGISTER__OK";
var APP_STATUS__REGISTER__ERROR = "REGISTER__ERROR";
var APP_STATUS__REGISTER__ERROR__WAIT_USER = "REGISTER__ERROR__WAIT_USER";
var APP_STATUS__MESSAGE_LOGIN_ERROR = "MESSAGE_LOGIN_ERROR";
var APP_STATUS__MESSAGE_LOGIN_ERROR__WAIT_USER = "MESSAGE_LOGIN_ERROR__WAIT_USER";
var APP_STATUS__MESSAGE_REGISTER_ERROR = "MESSAGE_REGISTER_ERROR";
var APP_STATUS__MESSAGE_REGISTER_ERROR__WAIT_USER = "MESSAGE_REGISTER_ERROR__WAIT_USER";
var APP_STATUS__USER_AUTHENTICATED = "USER_AUTHENTICATED";
var APP_STATUS__MESSAGE_WELCOME = "MESSAGE_WELCOME";
var APP_STATUS__MESSAGE_WELCOME__WAIT_USER = "MESSAGE_WELCOME__WAIT_USER";
var APP_STATUS__CHARACTER_PROFILE = "CHARACTER_PROFILE";



var APP_STATUS__CHARACTER_PROFILE__WAIT_USER = "CHARACTER_PROFILE__WAIT_USER";
var APP_STATUS__CHARACTER_PROFILE__CHECK_SELECTION = "CHARACTER_PROFILE__CHECK_SELECTION";

// FSA continue flag
var FSA_CONTINUE__NO = 0;
var FSA_CONTINUE__YES = 1;


/*** FUNCTION controllerLoginAuthenticate
***/

controllerLoginAuthenticate = function( eventType , eventTargetId ) {
    console.group( "controllerLoginAuthenticate()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTargetId" , eventTargetId );

    // get data from login form
    var loginEmail = $( "#login-email" ).val();
    var loginPassword = $( "#login-password" ).val();
    var promise = app.firebaseSignIn( loginEmail , loginPassword );

    console.log( "promise" , promise );
    console.groupEnd();
    return promise;
};


/*** FUNCTION controllerRegisterAuthenticate
***/

controllerRegisterAuthenticate = function( eventType , eventTargetId ) {
    console.group( "controllerRegisterAuthenticate()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTargetId" , eventTargetId );

    // get data from register form
    var registerName = $( "#register-name" ).val();
    var registerEmail = $( "#register-email" ).val();
    var registerPassword = $( "#register-password" ).val();
    var promise = app.firebaseCreateUser( registerName , registerEmail , registerPassword );

    console.log( "promise" , promise );
    console.groupEnd();
    return promise;
};


/*** FUNCTION controllerGetCharacterProfile
***/

controllerGetCharacterProfile = function( eventType , eventTargetId ) {
    console.group( "controllerGetCharacterProfile()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTargetId" , eventTargetId );

    var promise =
        app.newCharacterProfile( "ELEVEN" )
        .then(
            () => {
                return app.newCharacterProfile( "MIKE_WHEELER" );
            }
        );

    console.log( "promise" , promise );
    console.groupEnd();
    return promise;
};


/*** FUNCTION controllerStep()
***/

controllerStep = function( eventType , eventTargetId ) {
    console.group( "controllerStep()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTargetId" , eventTargetId );

    // default behavior
    flagFsaContinue = FSA_CONTINUE__YES;

    // log app status
    if ( app === undefined ) {
        console.logValue( "app.status" , undefined );
    }
    else if ( app === null ) {
        console.logValue( "app.status" , null );
    }
    else {
        console.logValue( "app.status" , app.status );
    };

    // FSA initialize app
    if ( app === undefined ) {
        app = new StrangerThingsApp();
        viewInitializeUI();
        app.status = APP_STATUS__INITIALIZED;
    }
    else if ( app.status === APP_STATUS__INITIALIZED ) {
        app.status = APP_STATUS__LOGIN;
    }
    // FSA login
    else if ( app.status === APP_STATUS__LOGIN ) {
        viewHideRegister();
        viewShowLogin();
        app.status = APP_STATUS__LOGIN__WAIT_USER;
    }
    else if (
        app.status === APP_STATUS__LOGIN__WAIT_USER &&
        eventType === "click" &&
        eventTargetId === "login-submit"
    ) {
        app.status = APP_STATUS__LOGIN__AUTHENTICATE;
    }
    else if ( app.status === APP_STATUS__LOGIN__AUTHENTICATE ) {
        controllerLoginAuthenticate( eventType , eventTargetId )
            .then(
                ( isLoginOk ) => {
                    console.group( ".then()"  );
                    console.logValue( "isLoginOk" , isLoginOk );

                    if ( isLoginOk === true ) {
                        app.status = APP_STATUS__LOGIN__OK;
                    } else {
                        app.status = APP_STATUS__LOGIN__ERROR;
                    };

                    console.log( "app.status" , app.status );
                    console.groupEnd();
                    controllerMain( "promise" , undefined );
                }
            );

        flagFsaContinue = FSA_CONTINUE__NO;
    }
    else if (
        app.status === APP_STATUS__LOGIN__OK
    ) {
        app.status = APP_STATUS__USER_AUTHENTICATED;
    }
    else if (
        app.status === APP_STATUS__LOGIN__ERROR
    ) {
        viewShowAuthenticationMessage();
        app.status = APP_STATUS__MESSAGE_LOGIN_ERROR__WAIT_USER;
    }
    else if (
        app.status === APP_STATUS__MESSAGE_LOGIN_ERROR__WAIT_USER &&
        eventType === "click" &&
        eventTargetId === "authentication-message-button"
    ) {
        viewHideAuthenticationMessage();
        app.status = APP_STATUS__LOGIN__WAIT_USER;
    }
    else if (
        app.status === APP_STATUS__LOGIN__WAIT_USER &&
        eventType === "click" &&
        eventTargetId === "register-link"
    ) {
        app.status = APP_STATUS__REGISTER;
    }
    // Register form
    else if ( app.status === APP_STATUS__REGISTER ) {
        viewHideLogin();
        viewShowRegister();
        app.status = APP_STATUS__REGISTER__WAIT_USER;
    }
    else if (
        app.status === APP_STATUS__REGISTER__WAIT_USER &&
        eventType === "click" &&
        eventTargetId === "register-submit"
    ) {
        app.status = APP_STATUS__REGISTER__AUTHENTICATE;
    }
    else if (
        app.status === APP_STATUS__REGISTER__AUTHENTICATE
    ) {
        controllerRegisterAuthenticate( eventType , eventTargetId )
            .then(
                ( isRegisterOk ) => {
                    console.group( ".then()"  );
                    console.logValue( "isRegisterOk" , isRegisterOk );

                    if ( isRegisterOk === true ) {
                        app.status = APP_STATUS__REGISTER__OK;
                    } else {
                        app.status = APP_STATUS__REGISTER__ERROR;
                    };

                    console.log( "app.status" , app.status );
                    console.groupEnd();
                    controllerMain( "promise" , undefined );
                }
            );

        flagFsaContinue = FSA_CONTINUE__NO;
    }
    else if (
        app.status === APP_STATUS__REGISTER__OK
    ) {
        app.status = APP_STATUS__USER_AUTHENTICATED;
    }
    else if (
        app.status === APP_STATUS__REGISTER__ERROR
    ) {
        viewShowAuthenticationMessage();
        app.status = APP_STATUS__MESSAGE_REGISTER_ERROR__WAIT_USER;
    }
    else if (
        app.status === APP_STATUS__MESSAGE_REGISTER_ERROR__WAIT_USER &&
        eventType === "click" &&
        eventTargetId === "authentication-message-button"
    ) {
        viewHideAuthenticationMessage();
        app.status = APP_STATUS__REGISTER__WAIT_USER;
    }
    else if (
        app.status === APP_STATUS__REGISTER__WAIT_USER &&
        eventType === "click" &&
        eventTargetId === "login-link"
    ) {
        app.status = APP_STATUS__LOGIN;
    }
    else if ( app.status === APP_STATUS__USER_AUTHENTICATED ) {
        app.status = APP_STATUS__MESSAGE_WELCOME;
    }

    // FSA welcome message
    else if (
        app.status === APP_STATUS__MESSAGE_WELCOME
    ) {
        viewHideLogin();
        viewHideRegister();
        viewShowWelcomeMessage();
        app.status = APP_STATUS__MESSAGE_WELCOME__WAIT_USER;
    }
    else if (
        app.status === APP_STATUS__MESSAGE_WELCOME__WAIT_USER &&
        eventType === "click" &&
        eventTargetId === "welcome-message-button"
    ) {
        viewHideWelcomeMessage();
        viewHideAuthentication();
        app.status = APP_STATUS__CHARACTER_PROFILE;
    }
    else if ( app.status === APP_STATUS__CHARACTER_PROFILE ) {
        controllerGetCharacterProfile( eventType , eventTargetId )
            .then(
                () => {
                    console.group( ".then()"  );

                    viewShowCharacterProfile();
                    app.status = APP_STATUS__CHARACTER_PROFILE__WAIT_USER;

                    console.log( "app.status" , app.status );
                    console.groupEnd();
                    controllerMain( "promise" , undefined );
                }
            );

        flagFsaContinue = FSA_CONTINUE__NO;
    }

    // FSA character select
    else {
        console.warn( "Invalid FSA condition" );
        flagFsaContinue = FSA_CONTINUE__NO;
    };


    console.logValue( "app.status" , app.status );
    console.logValue( "flagFsaContinue" , flagFsaContinue );
    console.groupEnd();
    return flagFsaContinue;
};


/*** FUNCTION controllerMain()
***/

controllerMain = function( eventType , eventTargetId ) {
    console.group( "controllerMain()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTargetId" , eventTargetId );

    do {
        var flagFsaContinue = controllerStep( eventType , eventTargetId );
    }
    while ( flagFsaContinue === FSA_CONTINUE__YES );

    console.groupEnd();
};


/*** FUNCTION handleClickSubmit()
***/

handleClickSubmit = function( event ) {
    console.group( "handleClickSubmit()" );
    console.logValue( "event.type" , event.type );
    console.logValue( "event.currentTarget.id" , event.currentTarget.id );

    event.preventDefault();
    controllerMain( event.type , event.currentTarget.id );

    console.groupEnd();
};


/*** FUNCTION handleEvent()
***/

handleEvent = function( event ) {
    console.group( "handleEvent()" );
    console.logValue( "event.type" , event.type );
    console.logValue( "event.currentTarget.id" , event.currentTarget.id );

    controllerMain( event.type , event.currentTarget.id );

    console.groupEnd();
};


/*** FUNCTION handleClickWelcomeMessageButton()
***/

handleClickWelcomeMessageButton = function( event ) {
    console.group( "handleClickWelcomeMessageButton()" );
    console.logValue( "event.type" , event.type );
    console.logValue( "event.currentTarget.id" , event.currentTarget.id );

    controllerMain( event.type , "welcome-message-button" );

    console.groupEnd();
};


/*** FUNCTION handleReady()
***/

handleReady = function( event ) {
    console.group( "FUNCTION handleReady()" );

    // register event handlers

    $( "#login-submit" ).on( "click" , handleClickSubmit );
    $( "#register-submit" ).on( "click" , handleClickSubmit );
    $( "#login-link" ).on( "click" , handleEvent );
    $( "#register-link" ).on( "click" , handleEvent );
    $( "#authentication-message-button" ).on( "click" , handleEvent );
    // $( "#welcome-message-button" ).on( "click" , handleEvent );

    // $( "#game-message" ).on( "click" , handleClick );
    // $( "#game-trivia-answer-0" ).on( "click" , handleClick );
    // $( "#game-trivia-answer-1" ).on( "click" , handleClick );
    // $( "#game-trivia-answer-2" ).on( "click" , handleClick );

    // start FSA
    controllerMain( null , null , viewUpdateUI );

    console.groupEnd();
};


$( handleReady );
