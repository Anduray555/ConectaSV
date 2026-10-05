export function Recuadro({icono, texto}){
    return(
        <article>
            {icono}
            <p>{texto}</p>
        </article>
    )
}

export function Estadistica({numero, texto}){
    return(
        <article>
            <h2>{numero}</h2>
            <p>{texto}</p>
        </article>
    )
}
