const ChamadoShow = ({ chamado }) => {
    const nome = chamado.nome;
    const texto = chamado.texto;
    const estado = chamado.estado;

    return (
        <div className='m-2'>
            <div className='my-2'>
                <label htmlFor="id-input-nome" className='form-label'>Nome</label>
                <input className="form-control" type="text" id="id-input-nome" value={nome} readOnly />
            </div>
            <div className='my-2'>
                <label htmlFor="id-input-texto" className='form-label'>Texto</label>
                <input className="form-control" type="text" id="id-input-texto" value={texto} readOnly />
            </div>
            <div className='my-2'>
                <label htmlFor="id-input-estado" className='form-label'>Estado</label>
                {estado === "a" && <input className="form-control" type="text" id="id-input-estado" value="Aberto" readOnly />}
                {estado === "f" && <input className="form-control" type="text" id="id-input-estado" value="Fechado" readOnly />}
            </div>
            <div className='my-2'>
                {chamado.url_imagem && (
                    <>
                        <div className='form-label d-block'>Imagem</div>
                        <div className='d-inline-flex justify-content-center w-100'>
                            <img
                                src={chamado.url_imagem}
                                alt={`Imagem do chamado ${chamado.id}`}
                                onError={(e) => {
                                    // Para evitar loops infinitos caso a imagem de fallback também falhe
                                    e.target.onerror = null;
                                    // Define uma imagem de fallback
                                    e.target.src = "https://dummyimage.com/40x40/cccccc/000000.png&text=Error";
                                }}
                                className='img-fluid border border-2 border-dark rounded'
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ChamadoShow