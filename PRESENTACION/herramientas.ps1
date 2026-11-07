$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$bmp=[System.Drawing.Bitmap]::new(1920,1080)
$g=[System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#F1F5F9'))
function Box($x,$y,$w,$h,$color){$b=[System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($color));$g.FillRectangle($b,$x,$y,$w,$h);$b.Dispose()}
function T([string]$text,$x,$y,$w,$h,$size,$color,[bool]$bold=$false){
 $style=[System.Drawing.FontStyle]::Regular
 if($bold){$style=[System.Drawing.FontStyle]::Bold}
 $f=[System.Drawing.Font]::new('Segoe UI',$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
 $b=[System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($color))
 if($g.MeasureString($text,$f,[int]$w).Height -gt $h){throw "Texto excedido: $text"}
 $g.DrawString($text,$f,$b,[System.Drawing.RectangleF]::new($x,$y,$w,$h))
 $f.Dispose();$b.Dispose()
}
Box 0 0 1920 200 '#13263E'
T 'QUIMESA / PRUEBAS DE CALIDAD DEL SOFTWARE' 64 28 1780 42 26 '#BFD2E7' $true
T 'Herramientas utilizadas en las pruebas' 64 82 1780 78 50 '#FFFFFF' $true
T 'Qué hacen y cómo se aplicaron en el proyecto · P1–P6' 66 156 1780 42 25 '#BFD2E7'
Box 60 229 1800 58 '#DFE8F2'
T 'HERRAMIENTA / PRUEBA' 82 242 410 40 25 '#13263E' $true
T 'PARA QUÉ SIRVE' 520 242 530 40 25 '#13263E' $true
T 'APLICACIÓN EN EL PROYECTO' 1100 242 730 40 25 '#13263E' $true
$rows=@(
 @{Name='Vitest';Tests='P1 · Bloqueo / P2 · SLA';Purpose='Ejecuta pruebas unitarias y compara resultados con valores esperados.';Use='Validó 4 casos de bloqueo y 7 de SLA con repositorios simulados y tiempos controlados.'},
 @{Name='Playwright Test';Tests='P3, P4, P5 y P6';Purpose='Automatiza acciones en la web, respuestas HTTP, teclado y capturas.';Use='Registró tickets, comprobó persistencia, recorrió el modal y generó la bitácora exploratoria.'},
 @{Name='Chromium, Firefox y WebKit';Tests='P3 y P4 · Tres motores';Purpose='Permiten repetir un mismo recorrido en distintos motores de navegador.';Use='Reprodujeron el error sin equipo y verificaron el ticket con equipo tras recargar. P5–P6: solo Chromium.'},
 @{Name='axe-core + Playwright';Tests='P5 · Accesibilidad';Purpose='Detecta automáticamente problemas de accesibilidad según reglas seleccionadas.';Use='Analizó login y página con modal: halló contraste insuficiente. El foco y el nombre se comprobaron aparte.'},
 @{Name='PostgreSQL + cliente pg';Tests='P4 · Integración real';Purpose='Almacena datos y permite consultar directamente la base mediante SQL.';Use='Confirmó ID, descripción y estado del ticket en un esquema temporal exclusivo de pruebas.'},
 @{Name='Reportes y evidencias';Tests='P1–P6 · JSON, HTML, PNG y MD';Purpose='Conservan resultados, capturas y explicaciones para revisar lo ejecutado.';Use='Documentaron aprobaciones, fallos y hallazgos en AVANCE3.MD, evidencias y el reporte de Playwright.'}
)
$y=299
foreach($r in $rows){
 Box 60 $y 1800 111 '#FFFFFF'
 Box 60 $y 6 111 '#087F68'
 T $r.Name 82 ($y+12) 418 44 26 '#13263E' $true
 T $r.Tests 82 ($y+62) 418 38 22 '#087F68'
 T $r.Purpose 520 ($y+15) 540 88 24 '#24384F'
 T $r.Use 1100 ($y+15) 726 88 24 '#24384F'
 $y+=119
}
T 'Ejecución local · S/ 0 en licencias y servicios de pruebas · Exploración asistida sin participantes humanos' 64 1022 1800 35 23 '#40556C'
T 'Fuente: AVANCE3.MD y docs/calidad/evidencias/' 64 1056 1800 24 15 '#52657B'
$out=Join-Path $PSScriptRoot '08_Herramientas_utilizadas.png'
if(Test-Path -LiteralPath $out){throw "Ya existe: $out"}
$bmp.Save($out,[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$bmp.Dispose()
Write-Output $out
