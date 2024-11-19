import axios from "axios";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// function to get spotify access token

export const getSpotifyAccessToken = async () => {
	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			new URLSearchParams({
				grant_type: "client_credentials",
			}),
			{
				headers: {
					Authorization:
						"Basic " + btoa(`${clientId}:${clientSecret}`),
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		return response.data.access_token; //this returns the access token
	} catch (error) {
		console.error("Error fetching Spotify access token:", error);
		throw error;
	}
};
export const fetchSpotifyPlaylist = async (accessToken) => {
	try {
		const playlistId = "0p4XNTvmLTdbGeMxhuYuba";
		const response = await axios.get(
			`https://api.spotify.com/v1/playlists/${playlistId}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching Spotify playlist:", error);
		throw error; //rethrow the error for debugging
	}
};
