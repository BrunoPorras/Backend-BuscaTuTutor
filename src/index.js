const app = require('./app')

//  Escuchar al puerto y confirmar
async function main() {
    app.listen(process.env.PORT || 3000)
}

main()