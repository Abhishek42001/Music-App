import {authorize, refresh} from 'react-native-app-auth';


class AuthenticationHandler {
    constructor() {
        this.spotifyAuthConfig = {
          clientId: '2e662c9f29ce4f0ab32760be4b26fee6',
          clientSecret: 'e884f8caaf0248bca4946cebd8ee02b0',
          redirectUrl: "com.music://oauthredirect",
          scopes: [
            'playlist-read-private',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-library-read',
            'user-library-modify',
            'user-top-read',
          ],
          serviceConfiguration: {
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
            tokenEndpoint: 'https://accounts.spotify.com/api/token',
          },
        };
    }

async onLogin(navigation,dispatcher,backhandler) {
    try {
        const result = await authorize(this.spotifyAuthConfig);
        //console.log(result)
        backhandler.remove();
        dispatcher({accessToken:result.accessToken,refreshToken:result.refreshToken})
        navigation.navigate("DrawerHome",{accessToken:result.accessToken,refreshToken:result.refreshToken})
    } 
    catch (error) {
        console.log(error);
    } 
}
async refreshLogin(refreshToken) {
    const result = await refresh(this.spotifyAuthConfig, {
      refreshToken: refreshToken,
    });
    return result;
}

}

const authHandler = new AuthenticationHandler();

export default authHandler;