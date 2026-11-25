{{-- Correo en Markdown: Laravel lo convierte a HTML con su plantilla (botón, colores, pie). --}}
<x-mail::message>
# Te invitaron a {{ $companyName }}

@if ($inviterName)
{{ $inviterName }} te invitó a unirte a **{{ $companyName }}** como reclutador en ConectaSV.
@else
Te invitaron a unirte a **{{ $companyName }}** como reclutador en ConectaSV.
@endif

Desde ConectaSV podrás publicar ofertas, revisar candidatos y conversar con estudiantes.

<x-mail::button :url="$link">
Crear mi cuenta
</x-mail::button>

Este enlace vence en {{ $hours }} horas y solo puede usarse una vez.
Si no esperabas esta invitación, puedes ignorar este correo.

Saludos,<br>
El equipo de {{ config('app.name') }}
</x-mail::message>
