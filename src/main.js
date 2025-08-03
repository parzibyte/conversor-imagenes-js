import './style.css'
const $input = document.querySelector("#imagenLocal");
const $calidad = document.querySelector("#calidad");
const $formatoSalida = document.querySelector("#formatoSalida");
const $indicadorCargando = document.querySelector("#indicadorCargando");
const $etiquetaCalidad = document.querySelector("#etiquetaCalidad");
const permitidos = ["image/jpeg", "image/png", "image/avif", "image/webp"];
$indicadorCargando.style.visibility = "hidden";

const refrescarCalidad = () => {
  $etiquetaCalidad.textContent = `2. Calidad: (${($calidad.value * 100).toFixed(2)} %)`
}
refrescarCalidad();

$calidad.oninput = () => {
  refrescarCalidad();
}

const extensionSegunFormatoSalida = (formato) => {
  if (formato === "image/jpeg") {
    return "jpg";
  }
  return formato.substring(formato.lastIndexOf("/") + 1);
}
$input.onchange = async (e) => {
  if (e.target.files.length <= 0) {
    return;
  }
  const primerArchivo = e.target.files[0];
  const nombreOriginalSinExtension = primerArchivo.name.substring(0, primerArchivo.name.lastIndexOf("."));
  if (!permitidos.includes(primerArchivo.type)) {
    $input.value = "";
    return alert("Tipo de imagen no soportado");
  }

  $indicadorCargando.style.visibility = "visible";
  const imagenComoBitmap = await createImageBitmap(primerArchivo);
  const canvasFueraDePantalla = new OffscreenCanvas(imagenComoBitmap.width, imagenComoBitmap.height);
  const contexto = canvasFueraDePantalla.getContext("2d");
  contexto.drawImage(imagenComoBitmap, 0, 0, imagenComoBitmap.width, imagenComoBitmap.height);
  const imagenConvertidaComoBlob = await canvasFueraDePantalla.convertToBlob({ quality: parseFloat($calidad.value), type: $formatoSalida.value });
  const url = URL.createObjectURL(imagenConvertidaComoBlob);
  const extension = extensionSegunFormatoSalida($formatoSalida.value);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: nombreOriginalSinExtension + "." + extension,
  });
  a.click();
  URL.revokeObjectURL(url);
  $input.value = "";
  $indicadorCargando.style.visibility = "hidden";
}