<?php 


//Instagram
function getInstagram($users) {
	$instagramList = array();

	$tags = array_map('trim', explode(',', get_option('instagramTags')));

	function sortInstagram($a, $b) {
		if ($a['created_time'] > $b['created_time']) {
			return 1;
		}
		if ($b['created_time'] > $a['created_time']) {
			return -1;
		}
		return 0;
	}
		
	foreach($tags as $tag) {

		// Open the file using the HTTP headers set above
		$url = 'https://api.instagram.com/v1/tags/' . $tag . '/media/recent?client_id=' . get_option('instagramClientId');
		
		$min_id = get_option('instagram_'.$tag.'_tag_min_id');
		if ($min_id) {
			$url .= '&min_id='.$min_id;
		}

		$file = file_get_contents($url);
		$json = json_decode($file, TRUE);

		if(isset($json['pagination']['min_tag_id'])) {
			update_option('instagram_'.$tag.'_tag_min_id', $json['pagination']['min_tag_id']);
		}

		foreach($json['data'] as $data) {
			$username = strtolower($data['user']['username']);
			if(!isset($users[$username])) {
				continue;
			}
			if (in_array($data, $instagramList)) {
				continue;
			}
			array_push($instagramList, $data);
		}
		
		usort($instagramList, 'sortInstagram');
		foreach($instagramList as $data) {
			$username = strtolower($data['user']['username']);
			insert_instagram_post($data, $users[$username]);
		}
	}
}

function insert_instagram_post($data, $author) {
	$username = strtolower($data['user']['username']);
	$date = date("Y-m-d H:i:s", $data['created_time']);

	$my_post = array(
	  'post_title'    => $username . '-' . $data['id'],
	  'post_content' => $data['caption']['text'],
	  'post_status'   => $author['isEditor'] ? 'publish' : 'pending',
	  'post_author'   => $author['id'],
	  'post_date' => $date,
	  'post_type' => 'instagram'
	);

	$post_id = wp_insert_post( $my_post, true );
	$image_url  = $data['images']['standard_resolution']['url'];
	generate_social_thumbnail($post_id, $image_url);

	__update_post_meta($post_id, 'wpcf-social-id', $data['id']);
	__update_post_meta($post_id, 'wpcf-social-url', $data['link']);
	__update_post_meta($post_id, 'wpcf-social-json', json_encode($data));
	return $post_id;
}

 ?>