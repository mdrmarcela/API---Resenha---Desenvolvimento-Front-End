// src/components/chamados/ChamadosListFilter.jsx

const ChamadosListFilter = ({ value, onChange }) => {
    const handleFilterChange = (e) => {
        onChange(e.target.value); // "a", "f" ou ""
    };

    return (
        <div className="mx-2 my-2">
            <select
                id="id-select-estado"
                className="form-select"
                onChange={handleFilterChange}
                value={value}
            >
                <option value="">Todos</option>
                <option value="a">Aberto</option>
                <option value="f">Fechado</option>
            </select>
        </div>
    );
};

export default ChamadosListFilter;
