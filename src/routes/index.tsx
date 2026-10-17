import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  resultados,
  MODO_DISENO,
  conclusionPrincipal,
  etiquetaAjuste,
  titulos,
} from "@/data/resultados";
import {
  Seccion,
  TarjetaMetrica,
  Figura,
  Tabla,
  BarrasImportancia,
  Texto,
  fmt,
} from "@/components/reporte";
import { iniciarEfectos } from "@/efectos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Predicción de la edad del abalón con Random Forest" },
      {
        name: "description",
        content: "Reporte técnico: Random Forest optimizado con Optuna sobre el dataset Abalone. TP4 · Laboratorio de Datos II · FICH-UNL.",
      },
      { property: "og:title", content: "Predicción de la edad del abalón con Random Forest" },
      {
        property: "og:description",
        content: "Métricas, residuos, importancia de variables, SHAP y LIME del modelo de regresión sobre Abalone.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reporte,
});

const INDICE = [
  ["resumen", "Resultado"],
  ["datos", "Datos"],
  ["metodologia", "Metodología"],
  ["metricas", "Métricas"],
  ["real-vs-predicho", "Real vs. predicho"],
  ["residuos", "Residuos"],
  ...(MODO_DISENO || resultados.por_sexo ? [["por-sexo", "Por sexo"]] : []),
  ["importancia", "Importancia"],
  ["interpretabilidad", "SHAP y LIME"],
  ["limitaciones", "Limitaciones"],
] as const;

function Reporte() {
  useEffect(() => iniciarEfectos(), []);
  const r = resultados;
  const m = r.metricas;
  const h = r.hiperparametros;
  const sexoNombres: Record<string, string> = { M: "M", I: "I", F: "F" };

  return (
    <>
      <div className="progreso" aria-hidden="true" />
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>
      <div className="pagina">
        <nav className="indice" aria-label="Índice de secciones">
          <p className="indice-titulo">Contenido</p>
          <ol>
            {INDICE.map(([id, txt], i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span className="tabular">{String(i).padStart(2, "0")}</span> {txt}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main id="contenido" className="contenido">
          <header className="cabecera">
            <p className="cabecera-sub">Laboratorio de Datos II · FICH-UNL · TP4 · Ejercicio 6A</p>
            <h1>Predicción de la edad del abalón con Random Forest</h1>
          </header>

          <Seccion id="resumen" numero={0} etiqueta="Resultado en una mirada" titulo={conclusionPrincipal}>
            <div className="tarjetas">
              <TarjetaMetrica nombre="MAE" valor={m.mae} decimales={3} unidad="anillos" explicacion={r.interpretacion.mae} />
              <TarjetaMetrica nombre="RMSE" valor={m.rmse} decimales={3} unidad="anillos" explicacion={r.interpretacion.rmse} />
              <TarjetaMetrica nombre="R²" valor={m.r2} decimales={3} explicacion={r.interpretacion.r2} insignia={etiquetaAjuste} />
              <TarjetaMetrica nombre="Observaciones de test" valor={m.n_test} decimales={0} unidad="obs." explicacion={`Conjunto de test: ${r.metodologia.split}.`} />
            </div>
          </Seccion>

          <Seccion id="datos" numero={1} etiqueta="Datos" titulo={titulos.datos}>
            <Tabla
              leyenda="Resumen del dataset Abalone"
              cabeceras={["Atributo", "Valor"]}
              numericas={[]}
              filas={[
                ["Observaciones", <span className="tabular">{r.datos.filas}</span>],
                ["Columnas", <span className="tabular">{r.datos.columnas}</span>],
                ["Predictores", <span className="tabular">{r.datos.predictores}</span>],
                ["Valores faltantes", <span className="tabular">{r.datos.faltantes}</span>],
                [
                  "Reparto de Sex",
                  <span className="tabular">
                    {Object.entries(r.datos.sexo)
                      .map(([k, v]) => `${sexoNombres[k]} ${fmt(v, 1)} %`)
                      .join(" · ")}
                  </span>,
                ],
                ["Rings (objetivo)", r.datos.rings],
              ]}
            />
          </Seccion>

          <Seccion id="metodologia" numero={2} etiqueta="Metodología e hiperparámetros" titulo={titulos.metodologia}>
            <dl className="definiciones">
              <dt>Partición</dt>
              <dd>{r.metodologia.split}</dd>
              <dt>Semilla</dt>
              <dd className="tabular">{r.metodologia.semilla}</dd>
              <dt>Modelo</dt>
              <dd>
                <code>{r.metodologia.modelo}</code>
              </dd>
              <dt>Preprocesamiento</dt>
              <dd>{r.metodologia.descripcion}</dd>
              <dt>Búsqueda</dt>
              <dd>{h.busqueda.metodo}</dd>
              <dt>Trials</dt>
              <dd className="tabular">{h.busqueda.trials}</dd>
              <dt>Validación</dt>
              <dd>{h.busqueda.validacion}</dd>
              <dt>Objetivo</dt>
              <dd>{h.busqueda.objetivo}</dd>
            </dl>
            <p className="nota">
              La búsqueda usó sólo el conjunto de entrenamiento; el conjunto de test no se tocó hasta la
              evaluación final. El modelo final se reentrenó con todo el conjunto de entrenamiento.
            </p>
            <Tabla
              leyenda="Espacio de búsqueda y mejores hiperparámetros encontrados"
              cabeceras={["Hiperparámetro", "Espacio de búsqueda", "Mejor valor"]}
              numericas={[2]}
              filas={[
                ...Object.entries(h.mejores).map(([k, v]) => [
                  <code>{k}</code>,
                  h.busqueda.espacio[k as keyof typeof h.busqueda.espacio] ?? "—",
                  Number.isInteger(v) ? String(v) : fmt(v, 4),
                ]),
                ...Object.entries(h.fijos).map(([k, v]) => [<code>{k}</code>, "fijo", String(v)]),
                ["Resto", h.resto, "—"],
              ]}
            />
          </Seccion>

          <Seccion id="metricas" numero={3} etiqueta="Métricas" titulo={titulos.metricas}>
            <Tabla
              leyenda="Métricas sobre el conjunto de test"
              cabeceras={["Métrica", "Valor", "Cómo leerlo"]}
              numericas={[1]}
              filas={[
                ["MAE", fmt(m.mae), r.interpretacion.mae],
                ["MSE", fmt(m.mse), r.interpretacion.mse],
                ["RMSE", fmt(m.rmse), r.interpretacion.rmse],
                ["R²", fmt(m.r2), r.interpretacion.r2],
              ]}
            />
            <div className="comparacion">
              <div>
                <p className="comparacion-rotulo">MAE de test</p>
                <p className="comparacion-valor tabular">{fmt(m.mae)}</p>
                <p className="comparacion-nota">Modelo final, {m.n_test} observaciones de test.</p>
              </div>
              <div>
                <p className="comparacion-rotulo">MAE de validación cruzada</p>
                <p className="comparacion-valor tabular">{fmt(m.mae_cv)}</p>
                <p className="comparacion-nota">Media de 5 pliegues sobre entrenamiento, mejor trial.</p>
              </div>
            </div>
          </Seccion>

          <Seccion id="real-vs-predicho" numero={4} etiqueta="Real vs. predicho" titulo={titulos.real_vs_predicho}>
            <Figura archivo="real_vs_predicho.png" alt="Dispersión de Rings reales frente a predichos, con diagonal de referencia" leyenda="Rings reales frente a predichos en el conjunto de test." />
            <Texto>{r.textos.real_vs_predicho}</Texto>
          </Seccion>

          <Seccion id="residuos" numero={5} etiqueta="Residuos" titulo={titulos.residuos}>
            <div className="figuras-par">
              <Figura archivo="residuos_vs_predicho.png" alt="Residuos frente al valor predicho" leyenda="Residuos frente al valor predicho." />
              <Figura archivo="hist_residuos.png" alt="Histograma de los residuos" leyenda="Distribución de los residuos." />
            </div>
            <Texto>{r.textos.residuos}</Texto>
          </Seccion>

          {r.por_sexo ? (
            <Seccion id="por-sexo" numero={6} etiqueta="Rendimiento por sexo" titulo={titulos.por_sexo}>
              <Figura archivo="mae_por_sexo.png" alt="MAE por grupo de sexo" leyenda="MAE por grupo de sexo." />
              <Tabla
                cabeceras={["Grupo", "n", "MAE", "RMSE", "R²"]}
                numericas={[1, 2, 3, 4]}
                filas={r.por_sexo.map((g) => [g.grupo, g.n, fmt(g.mae), fmt(g.rmse), fmt(g.r2)])}
              />
            </Seccion>
          ) : MODO_DISENO ? (
            <Seccion id="por-sexo" numero={6} etiqueta="Rendimiento por sexo" titulo={titulos.por_sexo}>
              <div className="vista-previa">
                <p className="vista-previa-rotulo">Sección opcional: vista previa de diseño</p>
                <p className="vista-previa-texto">Sin datos todavía. No es un resultado.</p>
                <Figura archivo="mae_por_sexo.png" alt="MAE por grupo de sexo (pendiente)" leyenda="Disposición prevista de la figura." />
                <Tabla
                  leyenda="Disposición prevista de la tabla"
                  cabeceras={["Grupo", "n", "MAE", "RMSE", "R²"]}
                  numericas={[1, 2, 3, 4]}
                  filas={["F", "I", "M"].map((g) => [g, "—", "—", "—", "—"])}
                />
              </div>
            </Seccion>
          ) : null}

          <Seccion id="importancia" numero={7} etiqueta="Importancia de variables" titulo={titulos.importancias}>
            <BarrasImportancia items={r.importancias} />
            <Texto>{r.textos.importancias}</Texto>
            <Figura archivo="pdp.png" alt="Gráficos de dependencia parcial de ShellWeight, ShuckedWeight y Height" leyenda="Dependencia parcial de las tres variables más importantes." />
            <dl className="definiciones">
              {Object.entries(r.textos.pdp).map(([k, v]) => (
                <div key={k} className="definicion-fila">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Seccion>

          <Seccion id="interpretabilidad" numero={8} etiqueta="Interpretabilidad local · SHAP y LIME" titulo={titulos.interpretabilidad}>
            <div className="figuras-par">
              <Figura archivo="shap_cascada.png" alt="Gráficos de cascada SHAP para tres observaciones de test" leyenda={`SHAP, tres observaciones (predicciones: ${r.interpretabilidad.predicciones_shap.map((p) => fmt(p, 2)).join("; ")} anillos).`} />
              <Figura archivo="lime.png" alt="Explicación LIME para la primera observación de test" leyenda={`LIME, primera observación (predicción: ${fmt(r.interpretabilidad.prediccion_lime, 2)} anillos).`} />
            </div>
            <Tabla
              leyenda="Contribuciones principales para la observación 0 (en anillos)"
              cabeceras={["Rango", "SHAP · variable", "SHAP", "LIME · variable", "LIME"]}
              numericas={[2, 4]}
              filas={r.interpretabilidad.shap_obs0.map((s, i) => {
                const l = r.interpretabilidad.lime_obs0[i];
                const sg = (v: number) => (v > 0 ? "+" : "−") + fmt(Math.abs(v), 3);
                return [i + 1, s.variable, sg(s.contribucion), l.variable, sg(l.contribucion)];
              })}
            />
            <Texto>{r.textos.shap_lime}</Texto>
          </Seccion>

          <Seccion id="limitaciones" numero={9} etiqueta="Limitaciones y lectura final" titulo={titulos.limitaciones}>
            <ul className="limitaciones">
              {r.limitaciones.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="cierre">{r.textos.conclusion_final}</p>
          </Seccion>

          <footer className="pie">Laboratorio de Datos II · FICH-UNL</footer>
        </main>
      </div>
    </>
  );
}
