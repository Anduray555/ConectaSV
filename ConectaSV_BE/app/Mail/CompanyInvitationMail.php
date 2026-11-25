<?php

namespace App\Mail;

use App\Models\CompanyInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo "Te invitaron a unirte a {empresa} en ConectaSV".
 * Recibe el link ya armado porque el token en texto plano solo existe al crear la invitación.
 */
class CompanyInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    // Las propiedades públicas quedan disponibles en la vista Blade del correo.
    public function __construct(
        public CompanyInvitation $invitation,
        public string $link,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Te invitaron a unirte a {$this->invitation->company->name} en ConectaSV",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.company-invitation',
            with: [
                'companyName' => $this->invitation->company->name,
                'inviterName' => $this->invitation->inviter?->user?->first_name,
                'hours' => CompanyInvitation::TTL_HOURS,
            ],
        );
    }
}
