<?php 

/**
 * @package Custom Post Type Boilerplate
 * @version 1.0
 */
/*
Plugin Name: Custom Post Type Boilerplate
Description: Starting point for creating custom post types as a plugin.
Author: Chris Winand
Version: 1.0
*/

function custom_post_type_sample() {
  $labels = array(
    'name'               => _x( 'Sample Name', 'post type general name' ),
    'singular_name'      => _x( 'Sample Name', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'sample name' ),
    'add_new_item'       => __( 'Add New Sample Name' ),
    'edit_item'          => __( 'Edit Sample Name' ),
    'new_item'           => __( 'New Sample Name' ),
    'all_items'          => __( 'All Sample Names' ),
    'view_item'          => __( 'View Sample Name' ),
    'search_items'       => __( 'Search Sample Names' ),
    'not_found'          => __( 'No sample names found' ),
    'not_found_in_trash' => __( 'No sample names found in the Trash' ), 
    'parent_item_colon'  => '',
    'menu_name'          => 'Sample Names'
  );
  $args = array(
    'labels'        => $labels,
    'description'   => 'Holds our sample names',
    'public'        => true,
    'menu_position' => 4,
    'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments', 'custom-fields' ),
    'taxonomies'    => array( 'post_tag', 'category'),
    'has_archive'   => true,
  );
  register_post_type( 'samplenames', $args ); 
}
add_action( 'init', 'custom_post_type_sample' );


function get_custom_post_type_template($single_template) {
     global $post;

     if ($post->post_type == 'samplenames') {
          $single_template = dirname( __FILE__ ) . '/views/samplenames-template.php';
     }
     return $single_template;
}
add_filter( 'single_template', 'get_custom_post_type_template' );



 ?>