<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;  // Public property to hold email data
    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->data = $data;  // Assigning the passed data to the class property
    }

    public function build()
    {
        return $this->from(env('MAIL_FROM_ADDRESS')) // Fetch sender email from .env
            ->subject($this->data['subject']) // Set the email subject dynamically
            ->html($this->generateEmailContent()); // Generate HTML email content dynamically
    }

    private function generateEmailContent()
    {
        return "
    <html>
        <head>
            <title>{$this->data['subject']}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                .email-wrapper {
                    width: 100%;
                    padding: 20px;
                    background-color: #f4f4f4;
                }

                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .email-header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }

                .email-body {
                    padding: 30px;
                    font-size: 16px;
                    color: #333;
                }

                .email-body h2 {
                    margin-bottom: 10px;
                    color: #007bff;
                }

                .email-body pre {
                    background-color: #f0f0f0;
                    padding: 15px;
                    border-left: 4px solid #007bff;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-size: 15px;
                    line-height: 1.5;
                }

                .email-footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 13px;
                    color: #888;
                }

                @media only screen and (max-width: 600px) {
                    .email-body {
                        padding: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class='email-wrapper'>
                <div class='email-container'>
                    <div class='email-header'>Muibu</div>
                    <div class='email-body'>
                        <p>Hi {$this->data['fullname']},</p>
                        <p>We're here to help you reset your password.</p>

                        <pre>{$this->data['message']}</pre>

                        <p>If you didn't request this, you can safely ignore this email.</p>
                        <p>Thanks,<br/>Muibu Support Team</p>
                    </div>
                    <div class='email-footer'>
                        &copy; " . date('Y') . " Phlwin. All rights reserved.
                    </div>
                </div>
            </div>
        </body>
    </html>
    ";
    }
}
