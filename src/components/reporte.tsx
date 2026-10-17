import type { ReactNode } from "react";

export const fmt = (n: number, dec = 3) =>
  n.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export function Seccion({
  id,
  numero,
  etiqueta,
  titulo,
  children,
}: {
  id: string;
  numero: number;
  etiqueta: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="seccion revelar" aria-labelledby={`${id}-t`}>
      <p className="seccion-etiqueta">
        <span className="tabular">{String(numero).padStart(2, "0")}</span> · {etiqueta}
      </p>
      <h2 id={`${id}-t`} className="seccion-titulo">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

export function TarjetaMetrica({
  nombre,
  valor,
  decimales,
  unidad,
  explicacion,
  insignia,
}: {
  nombre: string;
  valor: number;
  decimales: number;
  unidad?: string;
  explicacion: string;
  insignia?: string;
}) {
  return (
    <div className="tarjeta">
      <div className="tarjeta-cabecera">
        <span className="tarjeta-nombre">{nombre}</span>
        {insignia && <span className="insignia">{insignia}</span>}
      </div>
      <p className="tarjeta-valor tabular">
        <span data-valor={valor} data-decimales={decimales}>
          {fmt(valor, decimales)}
        </span>
        {unidad && <span className="tarjeta-unidad"> {unidad}</span>}
      </p>
      <p className="tarjeta-texto">{explicacion}</p>
    </div>
  );
}

export function Figura({
  archivo,
  alt,
  leyenda,
  prioritaria = false,
}: {
  archivo: string;
  alt: string;
  leyenda: string;
  prioritaria?: boolean;
}) {
  return (
    <figure className="figura">
      <div className="figura-marco">
        <button type="button" className="figura-abrir" aria-label={`Ampliar figura: ${leyenda}`}>
          <img
            src={`/graficos/${archivo}`}
            alt={alt}
            loading={prioritaria ? "eager" : "lazy"}
            decoding="async"
            onLoad={(e) => e.currentTarget.closest(".figura-marco")?.classList.add("cargada")}
            onError={(e) => e.currentTarget.closest(".figura-marco")?.classList.add("falta")}
          />
        </button>
        <div className="figura-pendiente" aria-hidden="true">
          Figura pendiente: {archivo}
        </div>
      </div>
      <figcaption>{leyenda}</figcaption>
    </figure>
  );
}

export function Tabla({
  cabeceras,
  filas,
  leyenda,
  numericas = [],
}: {
  cabeceras: string[];
  filas: ReactNode[][];
  leyenda?: string;
  numericas?: number[];
}) {
  return (
    <div className="tabla-envoltura" tabIndex={0} role="region" aria-label={leyenda ?? "Tabla"}>
      <table className="tabla">
        {leyenda && <caption>{leyenda}</caption>}
        <thead>
          <tr>
            {cabeceras.map((c, i) => (
              <th key={i} scope="col" className={numericas.includes(i) ? "num" : undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i}>
              {f.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {c}
                  </th>
                ) : (
                  <td key={j} className={numericas.includes(j) ? "num tabular" : undefined}>
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BarrasImportancia({
  items,
}: {
  items: { variable: string; valor: number }[];
}) {
  const max = Math.max(...items.map((i) => i.valor));
  return (
    <ol className="barras revelar" aria-label="Importancia de variables del Random Forest">
      {items.map((it, i) => (
        <li key={it.variable} className={i === 0 ? "barra principal" : "barra"}>
          <span className="barra-nombre">{it.variable}</span>
          <span className="barra-pista" aria-hidden="true">
            <span className="barra-relleno" style={{ width: `${(it.valor / max) * 100}%` }} />
          </span>
          <span className="barra-valor tabular">{fmt(it.valor, 3)}</span>
        </li>
      ))}
    </ol>
  );
}

export function Texto({ children }: { children: ReactNode }) {
  return <p className="prosa">{children}</p>;
}
