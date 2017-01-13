// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '243507276087412', // your App ID
        'clientSecret'    : '8c18212d0e63d6d0466e4656ae22fd62', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'        : 'PZkykzLgIkZ8MW7VBp9C89cWd',
        'consumerSecret'     : 'L9ZD7bYp1nLiw8SbZpyhHcYE4WUyxOFEWHmYB0DnNRlljwHmJL',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '7636279360-vhlv46veu95l8btgubt1sg6khq1du9i0.apps.googleusercontent.com',
        'clientSecret'     : 'e3iF7BPBKsuMNV1-970Bujg0',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
