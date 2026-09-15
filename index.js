const Array = [
    954,
    9491,
    853,
    7585,
    7581,
    741,
    22440,
    22441,
    2671,
    3335,
    3579,
    4047,
    4690,
    5520
]

const baseUrl = "https://e01-mx-marca.uecdn.es/mx/assets/sports/logos/football/png/36x36/"

const fs = require("fs")
const path = require("path")
const https = require("https")

function descargarImagen(url, destino) {
    return new Promise((resolve, reject) => {
        const solicitud = https.get(url, respuesta => {
            if (respuesta.statusCode !== 200) {
                respuesta.resume()
                return reject(new Error(`Error ${respuesta.statusCode}: ${url}`))
            }

            const archivo = fs.createWriteStream(destino)
            respuesta.pipe(archivo)
            archivo.on("finish", () => archivo.close(resolve))
            archivo.on("error", error => {
                archivo.destroy()
                reject(error)
            })
        })

        solicitud.on("error", reject)
    })
}

async function descargarLogos() {
    const carpetaLogos = path.join(__dirname, "Logos")
    await fs.promises.mkdir(carpetaLogos, { recursive: true })

    await Promise.all(Array.map(id => {
        const nombreArchivo = `${id}.png`
        return descargarImagen(
            `${baseUrl}${nombreArchivo}`,
            path.join(carpetaLogos, nombreArchivo)
        )
    }))
}

descargarLogos().catch(console.error)