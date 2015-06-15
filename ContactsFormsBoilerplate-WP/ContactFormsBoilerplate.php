<?php 

function send_application()
{
    $recruiter_query = new WP_User_Query(array('role'=>'administrator'));

    if ($recruiter_query->results){
        $recruiter = $recruiter_query->results[0];
        $recruiter_email = $recruiter->data->user_email;
    }

    $contact_fname = filter_var($_POST["fname"], FILTER_SANITIZE_STRING);
    $contact_lname = filter_var($_POST["lname"], FILTER_SANITIZE_STRING);
    $contact_email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $contact_phone = filter_var($_POST["phone"], FILTER_SANITIZE_STRING);
    $contact_portfolio = filter_var($_POST["portfolio"], FILTER_SANITIZE_URL);
    $contact_linkedin = filter_var($_POST["linkedin"], FILTER_SANITIZE_URL);
    $contact_website = filter_var($_POST["website"], FILTER_SANITIZE_URL);
    $contact_referrer = filter_var($_POST["referrer"], FILTER_SANITIZE_STRING);

    $to = $recruiter_email;
    $subject = "[Website Application Submission]: " . $contact_fname . " " . $contact_lname;
    $message = "Name: " . $contact_fname . " " . $contact_lname . "\n";
    $message .= "Email: " . $contact_email . "\n";
    $message .= "Phone: " . $contact_phone . "\n";
    $message .= "Portfolio URL: " . $contact_portfolio . "\n";
    $message .= "LinkedIn Profile: " . $contact_linkedin . "\n";
    $message .= "Website URL: " . $contact_website . "\n";
    $message .= "Referrer: " . $contact_referrer . "\n";

    $headers[] = "From: <" . $recruiter_email . ">";
    $headers[] = "Reply-To: " . $contact_fname . " " . $contact_lname . " <" . $contact_email . ">";
    $attachments = array();

    foreach ($_FILES as $key => $value) {
            $error_code = ($_FILES[$key]["error"]);
            switch ($error_code) {
                case "0":
                    $tmp_name = $_FILES[$key]["tmp_name"];
                    $name = $_FILES[$key]["name"];
                    rename($tmp_name, $name);
                    $attachments[$key] = $name;
                    break;

                case "1":
                case "2":
                    echo "exceeded max file size";
                    break;

                case "3":
                    echo "file only partially uploaded";
                    break;

                case "4":
                    echo "no file uploaded";
                    break;

                case "6":
                case "7":
                    echo "a problem occurred while saving the file on the server";
                    break;
                
                default:
                    echo "an error occurred, but we could not pinpoint it.";
                    break;
            }
    }
    wp_mail($to, $subject, $message, $headers, $attachments);
    die();
}
add_action( "wp_ajax_sendApplication", "send_application" );
add_action( "wp_ajax_nopriv_sendApplication", "send_application" );

function send_contact_form()
{
    $bus_contact_query = new WP_User_Query(array('role'=>'administrator'));

    if ($bus_contact_query->results){
        $bus_contact = $bus_contact_query->results[0];
        $bus_contact_email = $bus_contact->data->user_email;
    }

    $contact_fname = filter_var($_POST["fname"], FILTER_SANITIZE_STRING);
    $contact_lname = filter_var($_POST["lname"], FILTER_SANITIZE_STRING);
    $contact_email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $contact_phone = filter_var($_POST["phone"], FILTER_SANITIZE_STRING);
    $contact_message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);

    $to = $bus_contact_email;
    $subject = "[Website Inquiry]: " . $contact_fname . " " . $contact_lname;

    $message = "Name: " . $contact_fname . " " . $contact_lname . "\n";
    $message .= "Email: " . $contact_email . "\n";
    $message .= "Phone: " . $contact_phone . "\n";
    $message .= "Message: " . $contact_message . "\n";

    $headers[] = "From: <" . $bus_contact_email . ">";
    $headers[] = "Reply-To: " . $contact_fname . " " . $contact_lname . " <" . $contact_email . ">";

    wp_mail($to, $subject, $message, $headers);
    die();
}
add_action( "wp_ajax_sendContactForm", "send_contact_form" );
add_action( "wp_ajax_nopriv_sendContactForm", "send_contact_form" );

function AWS_mail_setup($PHPMailer)
{
    $PHPMailer->IsSMTP();
    $PHPMailer->SMTPAuth = true;
    $PHPMailer->SMTPSecure = 'ssl';
    $PHPMailer->Host = get_option('AWSSESRegion');
    $PHPMailer->Port = 465;
    $PHPMailer->Username = get_option("AWSSESUser");
    $PHPMailer->Password = get_option("AWSSESPass");
}
add_action('phpmailer_init', 'AWS_mail_setup');

?>