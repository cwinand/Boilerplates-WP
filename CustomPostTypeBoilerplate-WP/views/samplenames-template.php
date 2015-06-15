<?php
/**
 * The template for displaying all single posts and attachments
 *
 * @package WordPress
 */

 get_header(); ?>

 <h1><?php the_title(); ?></h1>

<?php the_content(); ?>
<?php get_footer(); ?>