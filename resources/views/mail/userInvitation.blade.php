<div style="font-family: Arial, sans-serif; background: #f5f7fb; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px;">

        <h2 style="margin-bottom: 20px; color: #111;">
            Você foi convidado 🎉
        </h2>

        <p style="color: #555; font-size: 14px;">
            Você recebeu um convite para acessar a plataforma <strong>{{ config('app.name') }}</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ route('invitations.show', $invitation->uuid) }}"
                style="background: #2563eb; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Aceitar convite
            </a>
        </div>

        <p style="font-size: 12px; color: #888;">
            Este convite expira em 7 dias.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

        <p style="font-size: 11px; color: #aaa;">
            Se você não solicitou este convite, pode ignorar este email.
        </p>

    </div>
</div>
