<?php 

function getTweets($twitter_account){

	$twitter_consumer_key = get_option('twitterConsumerKey');
	$twitter_consumer_secret = get_option('twitterConsumerSecret');
	$base_url = "https://api.twitter.com";

	$auth_req_url = $base_url . "/oauth2/token";
	$auth_req_body = array(
		"grant_type" => "client_credentials"
	);
	$auth_req_header = array(
		"Authorization" => "Basic " . base64_encode($twitter_consumer_key . ":" . $twitter_consumer_secret),
		"Content-Type" => "application/x-www-form-urlencoded;charset=UTF-8"
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
		//get required access_token and make request to get user timeline
		$auth_resp_json = json_decode($auth_resp["body"], true);
		$token = $auth_resp_json["access_token"];

		
		$api_timeline_url = "/1.1/statuses/user_timeline.json";
		$api_query_params = "?screen_name=" . $twitter_account;
		
		$since_id = get_option('twitter_since_id');
		if ($since_id) {
			$api_query_params .= '&since_id=' . $since_id;
		}

		$api_req_header = array(
			"accept" => "application/json",
			"Authorization" => "Bearer " . $token
		);
		$api_args = array(
			"headers" => $api_req_header
		);
		
		$api_resp = wp_remote_get($base_url . $api_timeline_url . $api_query_params, $api_args);
		$api_resp_json = json_decode($api_resp['body'], true);


		if (count($api_resp_json) > 0) {
			update_option('twitter_since_id', $api_resp_json[0]['id_str']);
		}

		foreach($api_resp_json as $tweet) {

			if ( array_key_exists("retweeted_status", $tweet) ) {
				insert_twitter_post($tweet["retweeted_status"]);
			} else {
				insert_twitter_post($tweet);
			}
		}
	}
}

function insert_twitter_post($data) {
	$username = strtolower($data['user']['screen_name']);
	$tweet_date = date("Y-m-d H:i:s", strtotime($data['created_at']));
	$entityList = array();
	
	foreach($data['entities']['hashtags'] as $hash) {
		array_push($entityList, array(
			'text' => '#' . $hash['text'],
			'url' => 'https://twitter.com/search?q=%23' . $hash['text'] . '&src=hash',
			'startPos' => $hash['indices'][0],
			'length' => $hash['indices'][1] - $hash['indices'][0]
		));
	}
	foreach($data['entities']['symbols'] as $symbol) {
		array_push($entityList, array(
			'text' => '$' . $symbol['text'],
			'url' => 'https://twitter.com/search?q=%24' . $symbol['text'] . '&src=ctag',
			'startPos' => $symbol['indices'][0],
			'length' => $symbol['indices'][1] - $symbol['indices'][0]
		));
	}
	foreach($data['entities']['user_mentions'] as $mention) {
		array_push($entityList, array(
			'text' => '@' . $mention['screen_name'],
			'url' => 'https://twitter.com/' . $mention['screen_name'],
			'startPos' => $mention['indices'][0],
			'length' => $mention['indices'][1] - $mention['indices'][0]
		));
	}
	foreach($data['entities']['urls'] as $url) {
		array_push($entityList, array(
			'text' => $url['display_url'],
			'url' => $url['expanded_url'],
			'startPos' => $url['indices'][0],
			'length' => $url['indices'][1] - $url['indices'][0]
		));
	}
	
	usort($entityList, 'sortEntities');
	
	$tweet_text = $data['text'];
	
	foreach($entityList as $entity) {
		$tweet_text = substr_replace($tweet_text, '<a href="'.$entity['url'].'">'.$entity['text'].'</a>', $entity['startPos'], $entity['length']);
	}
	
	$my_post = array(
	  'post_title'    => 'tweet' . '-' . $data['id_str'],
	  'post_content' => $tweet_text,
	  'post_date' => $tweet_date,
	  'post_author'   => 8, //change to  wp admin user id
	  'post_type' => 'twitter',
	  'post_status' => 'publish'
	);
	$post_id = wp_insert_post( $my_post );
	$image_url  = $data['user']['profile_image_url'];
	
	generate_social_thumbnail($post_id, $image_url);
	
	__update_post_meta($post_id, 'wpcf-social-id', $data['id_str']);
	__update_post_meta($post_id, 'wpcf-social-url', 'http://twitter.com/'.$data['user']['screen_name'].'/status/'.$data['id_str']);
	__update_post_meta($post_id, 'wpcf-social-json', json_encode($data));
}



 ?>