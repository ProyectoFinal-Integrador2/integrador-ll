$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$slides = @(
    @{File='01_Bloqueo_login.png'; Id='P1'; Title='Bloqueo del inicio de sesión'; Area='ADECUACIÓN FUNCIONAL · HU01'; Status='4 / 4 APROBADAS'; Color='#087F68'; What='Prueba unitaria de la lógica que bloquea cada correo tras tres intentos fallidos durante 15 minutos.'; Tools='Vitest, aserciones de Node.js, repositorio simulado y reloj controlado.'; How='Se probaron correos independientes, vencimiento del bloqueo, reinicio del contador tras un acceso correcto y correo inexistente.'; Result='Los cuatro casos cumplieron lo esperado. El bloqueo se mantiene por correo y expira al llegar a los 15 minutos.'; Note='Alcance: tiempos simulados; no evalúa concurrencia ni la interfaz.'},
    @{File='02_Calculo_SLA.png'; Id='P2'; Title='Cálculo del cumplimiento SLA'; Area='ADECUACIÓN FUNCIONAL · HU20'; Status='7 / 7 APROBADAS'; Color='#087F68'; What='Prueba unitaria que verifica si un ticket cumple los tiempos de respuesta y resolución acordados (SLA).'; Tools='Vitest y repositorios simulados con fechas y resultados esperados conocidos.'; How='Se fijaron límites de 30 min de respuesta y 120 min de resolución: dentro, exactos, excedidos, sin tickets y con datos incompletos.'; Result='Los siete casos aprobaron. El límite exacto cumple; el conjunto mixto devuelve 50 % y los tickets no evaluables se separan.'; Note='Alcance: lógica aislada; no cubre todas las zonas horarias ni precisión de segundos.'},
    @{File='03_Registro_tickets.png'; Id='P3'; Title='Registro funcional de tickets'; Area='ADECUACIÓN FUNCIONAL · HU06–HU07'; Status='FALLÓ EN LOS 3 MOTORES'; Color='#BE3D45'; What='Prueba de extremo a extremo que comprueba la validación del formulario, creación y consulta de tickets.'; Tools='Playwright Test, interfaz y backend reales; Chromium, Firefox y WebKit.'; How='Se inició sesión y se enviaron datos incompletos, un ticket sin equipo y otro con equipo; se revisaron respuestas HTTP y la búsqueda.'; Result='Datos incompletos: rechazo correcto. Con equipo: HTTP 201 y ticket visible. Sin equipo: HTTP 500, cuando se esperaba 201, en los tres motores.'; Note='Mejora: normalizar el equipo opcional a null y validar el identificador antes del SQL.'},
    @{File='04_Integracion_compatibilidad.png'; Id='P4'; Title='Integración y compatibilidad'; Area='COMPATIBILIDAD · INTEROPERABILIDAD'; Status='3 / 3 RECORRIDOS APROBADOS'; Color='#087F68'; What='Prueba de integración real que verifica el recorrido interfaz → API → PostgreSQL y la recuperación del ticket.'; Tools='Playwright, cliente PostgreSQL pg y motores Chromium, Firefox y WebKit.'; How='Se creó un ticket con equipo, se comprobó HTTP 201 y su ID en SQL, se compararon descripción y estado, y se recargó para buscarlo.'; Result='En los tres motores el registro coincidió en la base de datos y siguió visible tras recargar la página.'; Note='Alcance: con equipo, un rol y Windows; no acredita Safari en un iPhone real.'},
    @{File='05_Interaccion_accesibilidad.png'; Id='P5'; Title='Interacción y accesibilidad'; Area='CAPACIDAD DE INTERACCIÓN'; Status='REQUIERE MEJORA'; Color='#BE3D45'; What='Revisión automática de accesibilidad y del uso del teclado en el login y el diálogo de nuevo ticket.'; Tools='axe-core integrado con Playwright y acciones de teclado en Chromium.'; How='Se analizaron login y página con modal; se comprobó Tab, apertura con Enter, foco inicial, confinamiento, Escape y nombre accesible.'; Result='Contraste serio: 1 nodo en login y 17 en página con modal. Fallaron foco inicial, confinamiento, restauración y nombre. Tab del login y Escape funcionan.'; Note='Los 18 nodos pertenecen a dos estados de página; no equivalen a 18 defectos distintos.'},
    @{File='06_Exploratoria.png'; Id='P6'; Title='Exploración guiada asistida'; Area='FUNCIONALIDAD E INTERACCIÓN'; Status='EJECUTADA CON HALLAZGOS'; Color='#A96509'; What='Recorrido exploratorio guiado para observar comportamientos y problemas durante tareas habituales.'; Tools='Playwright en Chromium, bitácora JSON, capturas y revisión visual a 360 × 800.'; How='Se alternaron correos bloqueados, se recargó, se canceló un borrador, se buscó texto inexistente y se redujo el tamaño de pantalla.'; Result='El bloqueo persiste, pero el aviso desaparece al recargar hasta reintentar. El borrador se limpia al cancelar. A 360 × 800 se observó contenido recortado.'; Note='Sin participantes humanos: no mide satisfacción ni acredita usabilidad o adaptación móvil completa.'}
)
function Brush([string]$hex) { return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex)) }
function Text($g, [string]$value, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size, [string]$color, [bool]$bold=$false) {
    $style = [System.Drawing.FontStyle]::Regular
    if ($bold) { $style = [System.Drawing.FontStyle]::Bold }
    $font = [System.Drawing.Font]::new('Segoe UI', $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = Brush $color
    $format = [System.Drawing.StringFormat]::new()
    $rect = [System.Drawing.RectangleF]::new($x,$y,$w,$h)
    $measured = $g.MeasureString($value,$font,[int]$w,$format)
    if ($measured.Height -gt $h) { throw "Texto fuera de espacio: $value" }
    $g.DrawString($value,$font,$brush,$rect,$format)
    $font.Dispose(); $brush.Dispose(); $format.Dispose()
}
foreach ($s in $slides) {
    $bmp = [System.Drawing.Bitmap]::new(1920,1080)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#F1F5F9'))
    $navy = Brush '#13263E'; $g.FillRectangle($navy,0,0,1920,255); $navy.Dispose()
    $accent = Brush $s.Color; $g.FillRectangle($accent,0,0,18,1080); $accent.Dispose()
    Text $g 'QUIMESA / SISTEMA DE GESTIÓN DE INCIDENCIAS CON SLA' 72 36 1720 40 25 '#BFD2E7' $true
    Text $g ($s.Id+'  /  '+$s.Title) 72 95 1780 84 56 '#FFFFFF' $true
    Text $g $s.Area 76 190 1700 42 26 '#BFD2E7' $true
    $cards = @(
        @{X=72;Y=292;Label='01   QUÉ ES';Body=$s.What},
        @{X=978;Y=292;Label='02   QUÉ SE USA';Body=$s.Tools},
        @{X=72;Y=564;Label='03   CÓMO SE APLICÓ';Body=$s.How},
        @{X=978;Y=564;Label='04   RESULTADOS';Body=$s.Result}
    )
    foreach ($card in $cards) {
        $white=Brush '#FFFFFF'; $g.FillRectangle($white,$card.X,$card.Y,870,244); $white.Dispose()
        Text $g $card.Label ($card.X+28) ($card.Y+22) 814 42 26 $s.Color $true
        Text $g $card.Body ($card.X+28) ($card.Y+78) 814 150 31 '#24384F'
    }
    Text $g $s.Status 76 842 1770 60 38 $s.Color $true
    Text $g $s.Note 76 914 1760 74 26 '#40556C'
    Text $g 'Fuente: AVANCE3.MD y docs/calidad/evidencias/ · Evaluación del 05/11/2026 · Alcance parcial ISO/IEC 25010' 76 1020 1710 34 21 '#52657B'
    Text $g ($s.Id.Substring(1)+' / 6') 1770 1020 100 34 21 '#52657B' $true
    $path=Join-Path $PSScriptRoot $s.File
    if (Test-Path -LiteralPath $path) { throw "Ya existe: $path" }
    $bmp.Save($path,[System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Output $path
}
