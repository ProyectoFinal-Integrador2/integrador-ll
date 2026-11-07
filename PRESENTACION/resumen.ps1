$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
function B($hex) { [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex)) }
$bmp=[System.Drawing.Bitmap]::new(1920,1080)
$g=[System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#F1F5F9'))
function Box($x,$y,$w,$h,$color) { $b=B $color; $g.FillRectangle($b,$x,$y,$w,$h); $b.Dispose() }
function T([string]$text,$x,$y,$w,$h,$size,$color,[bool]$bold=$false) {
 $style=[System.Drawing.FontStyle]::Regular
 if($bold){$style=[System.Drawing.FontStyle]::Bold}
 $f=[System.Drawing.Font]::new('Segoe UI',$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
 $b=B $color
 if($g.MeasureString($text,$f,[int]$w).Height -gt $h){throw "Texto excedido: $text"}
 $g.DrawString($text,$f,$b,[System.Drawing.RectangleF]::new($x,$y,$w,$h))
 $f.Dispose();$b.Dispose()
}
Box 0 0 1920 211 '#13263E'
T 'QUIMESA / EVALUACIÓN DE CALIDAD DEL SOFTWARE' 64 30 1780 44 26 '#BFD2E7' $true
T 'Funcionalidad, compatibilidad y usabilidad' 64 88 1790 80 54 '#FFFFFF' $true
T 'Resultados documentados · 05/11/2026 · Porcentajes sobre el alcance evaluado' 64 166 1780 36 24 '#BFD2E7'
$cols=@(
 @{X=60;Title='FUNCIONALIDAD';Percent='66,7 %';Count='2 de 3 bloques aprobados';Ratio=0.666667;Color='#A96509';Scope='P1 + P2 + P3 | Igual peso por bloque';Tools='Vitest + Playwright';Details="P1 · Bloqueo por correo: 4/4 (100 %).`nP2 · Cálculo SLA: 7/7 (100 %).`nP3 · Registro: 0/3 motores aprobados.";Result='Sin equipo: HTTP 500 en vez de 201. Con equipo y validación de datos: comportamiento correcto.'},
 @{X=680;Title='COMPATIBILIDAD';Percent='100 %';Count='3 de 3 recorridos aprobados';Ratio=1;Color='#087F68';Scope='P4 | Integración y tres motores';Tools='Playwright + PostgreSQL (pg)';Details="Chromium: aprobado.`nFirefox: aprobado.`nWebKit: aprobado.";Result='Ticket con equipo: creación HTTP 201, coincidencia en SQL y consulta correcta tras recargar.'},
 @{X=1300;Title='USABILIDAD';Percent='25 %';Count='2 de 8 controles satisfactorios';Ratio=0.25;Color='#BE3D45';Scope='P5 | Accesibilidad y teclado en Chromium';Tools='axe-core + Playwright';Details="Funcionan: Tab en login y Escape.`nFallan: contraste en 2 vistas y 4 controles`nde foco / nombre del diálogo.";Result='Mejorar contraste, foco inicial, confinamiento, restauración y nombre accesible del modal.'}
)
foreach($c in $cols){
 $x=$c.X
 Box $x 244 560 624 '#FFFFFF'
 Box $x 244 560 8 $c.Color
 T $c.Title ($x+24) 276 512 46 31 '#13263E' $true
 T $c.Percent ($x+24) 329 512 106 72 $c.Color $true
 T $c.Count ($x+24) 439 512 43 28 '#24384F' $true
 Box ($x+24) 494 512 12 '#E4EAF0'
 Box ($x+24) 494 ([single](512*$c.Ratio)) 12 $c.Color
 T $c.Scope ($x+24) 525 512 64 23 '#40556C'
 T $c.Tools ($x+24) 590 512 43 25 '#13263E' $true
 T $c.Details ($x+24) 644 512 110 24 '#24384F'
 T $c.Result ($x+24) 766 512 94 22 $c.Color
}
Box 60 890 1800 78 '#E2EAF3'
T 'P6 · EXPLORACIÓN ASISTIDA' 80 906 445 42 25 '#13263E' $true
T 'Ejecutada con hallazgos: aviso ausente tras recargar y recorte a 360 × 800. Sin porcentaje: no hubo usuarios humanos.' 530 904 1300 58 23 '#24384F'
T 'Bases distintas: bloques (funcionalidad), recorridos (compatibilidad) y controles (usabilidad). No son porcentajes comparables entre sí.' 64 984 1790 34 22 '#40556C'
T 'No expresan cumplimiento ISO ni satisfacción de usuarios. Fuente: AVANCE3.MD y docs/calidad/evidencias/.' 64 1027 1790 33 22 '#40556C'
$out=Join-Path $PSScriptRoot '07_Resumen_calidad_porcentajes.png'
if(Test-Path -LiteralPath $out){throw "Ya existe: $out"}
$bmp.Save($out,[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$bmp.Dispose()
Write-Output $out
