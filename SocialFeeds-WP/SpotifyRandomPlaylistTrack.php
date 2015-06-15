<?php 

function getSpotify($spotify_user, $playlist_id) {
	//Uses Client Credentials flow
	//first, get access token
	$spotify_client_id = get_option("spotifyClientId");
	$spotify_client_secret = get_option("spotifyClientSecret");

	$auth_req_url = "https://accounts.spotify.com/api/token";
	$auth_req_body = array(
		"grant_type" => "client_credentials"
	);
	$auth_req_header = array(
		"Authorization" => "Basic " . base64_encode($spotify_client_id . ":" . $spotify_client_secret)
	);
	$auth_args = array(
		"headers" => $auth_req_header,
		"body" => $auth_req_body
	);

	$auth_resp = wp_remote_post($auth_req_url, $auth_args);

	if( is_wp_error($auth_resp) ) {
		//end here if authorization fails
		return $auth_resp;
	} else {
		//get required access_token and make request to get playlist info
		$auth_resp_json = json_decode($auth_resp["body"], true);
		$token = $auth_resp_json["access_token"];

		$api_base = "https://api.spotify.com/v1/";
		$api_playlist_url = "users/" . $spotify_user . "/playlists/" . $playlist_id . "/tracks";
		$api_query_params = "?fields=items(track(name,artists,album(images)))";
		$api_req_header = array(
			"accept" => "application/json",
			"Authorization" => "Bearer " . $token
		);
		$api_args = array(
			"headers" => $api_req_header
		);
		
		$api_resp = wp_remote_get($api_base . $api_playlist_url . $api_query_params, $api_args);
		$api_resp_json = json_decode($api_resp["body"], true);

		//grab a random track from the playlist to display
		$tracks = $api_resp_json["items"];
		$selected_track = $tracks[rand(0, count($tracks)-1)];
		$songData = array(
			"name" => $selected_track['track']['name'],
			"artist" => $selected_track['track']['artists'][0]['name'],
			"images" => $selected_track['track']['album']['images']
		);

		return $songData;
	}
}

 ?>