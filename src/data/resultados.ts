export const MODO_DISENO = true;

export const resultados = {
  metricas: {
    mae: 1.547, mse: 4.856, rmse: 2.204, r2: 0.551,
    mae_cv: 1.500, // MAE medio de validación cruzada (5 pliegues) sobre el conjunto de entrenamiento, del mejor trial
    n_test: 836 // observaciones del conjunto de test (20 % de 4177)
  },
  datos: {
    filas: 4177, columnas: 9, predictores: 8, faltantes: 0,
    sexo: { M: 36.581278, I: 32.128322, F: 31.290400 },
    rings: "Número de anillos de la concha (rango aproximado: 1 a 29). La documentación de UCI aproxima la edad como Rings + 1,5 años."
  },
  metodologia: {
    split: "train_test_split con test_size=0,2 (80 % entrenamiento / 20 % test)",
    semilla: 42,
    modelo: "RandomForestRegressor",
    descripcion: "Sex se codificó con variables dummy (get_dummies, drop_first=True): quedan Sex_I y Sex_M, y F es la categoría base. El modelo final se reentrenó sobre todo el conjunto de entrenamiento con los mejores hiperparámetros."
  },
  hiperparametros: {
    busqueda: {
      realizada: true,
      metodo: "Optuna con muestreador TPE (semilla 42) y MedianPruner (n_startup_trials=5, n_warmup_steps=1)",
      trials: 50,
      validacion: "KFold de 5 pliegues con mezcla (semilla 42), solo sobre el conjunto de entrenamiento; el conjunto de test no se usó en la búsqueda",
      objetivo: "Minimizar el MAE",
      espacio: {
        n_estimators: "50 a 400 (entero)",
        max_depth: "3 a 30 (entero)",
        min_samples_split: "2 a 20 (entero)",
        min_samples_leaf: "1 a 10 (entero)",
        max_features: "0,3 a 1,0 (continuo)"
      }
    },
    mejores: {
      n_estimators: 329, max_depth: 14, min_samples_split: 4,
      min_samples_leaf: 9, max_features: 0.8259752063293889
    },
    fijos: { random_state: 42, n_jobs: -1 },
    resto: "valores por defecto de scikit-learn"
  },
  interpretacion: {
    mae: "Error absoluto medio: en promedio, las predicciones se alejan unos 1,5 anillos del valor real.",
    mse: "Promedio de los errores al cuadrado (en anillos²); penaliza más los errores grandes.",
    rmse: "Raíz del MSE, en anillos. Es mayor que el MAE (2,204 frente a 1,547), lo que indica algunos errores relativamente grandes.",
    r2: "Proporción de la variabilidad de Rings que explica el modelo, comparado con predecir siempre la media. Ajuste moderado."
  },
  importancias: [
    { variable: "ShellWeight", valor: 0.544479 },
    { variable: "ShuckedWeight", valor: 0.150087 },
    { variable: "Height", valor: 0.106927 },
    { variable: "WholeWeight", valor: 0.068333 },
    { variable: "Diameter", valor: 0.043745 },
    { variable: "VisceraWeight", valor: 0.035752 },
    { variable: "Length", valor: 0.025787 },
    { variable: "Sex_I", valor: 0.019876 },
    { variable: "Sex_M", valor: 0.005013 }
  ],
  interpretabilidad: {
    predicciones_shap: [12.41, 9.80, 14.38],
    prediccion_lime: 12.41,
    // Observación 0 del conjunto de test; contribuciones en anillos
    shap_obs0: [
      { variable: "ShellWeight", contribucion: 1.497872 },
      { variable: "ShuckedWeight", contribucion: 0.380792 },
      { variable: "WholeWeight", contribucion: 0.312027 }
    ],
    lime_obs0: [
      { variable: "ShellWeight (0,23 a 0,33)", contribucion: 0.931220 },
      { variable: "ShuckedWeight (0,34 a 0,50)", contribucion: -0.695011 },
      { variable: "WholeWeight (0,80 a 1,15)", contribucion: 0.302697 }
    ]
  },
  textos: {
    real_vs_predicho: "La dispersión de las predicciones no es constante: para valores bajos de Rings están más concentradas y para valores altos se dispersan bastante más. Para valores reales altos (desde unos 15 anillos) casi todas las predicciones quedan por debajo de la diagonal: el modelo tiende a subestimarlos.",
    residuos: "La magnitud de los errores varía según el nivel de Rings, lo que puede ser indicativo de heterocedasticidad: la dispersión de los residuos crece con el valor predicho. Los residuos positivos (subestimación) llegan a unos +10 anillos y los negativos a unos −5,5.",
    importancias: "ShellWeight es, con diferencia, la variable más importante (≈0,54), seguida de ShuckedWeight (≈0,15) y Height (≈0,11).",
    pdp: {
      ShellWeight: "Tendencia creciente, aproximadamente lineal: a más peso de concha, más anillos predichos (de ≈6,5 a ≈12,8).",
      ShuckedWeight: "Tendencia decreciente: a más peso de la carne, menos anillos predichos (de ≈11,5 a ≈9,2).",
      Height: "Casi plano hasta una altura de ≈0,10; luego crece y se estabiliza (de ≈9,3 a ≈10,8)."
    },
    shap_lime: "Se explican tres observaciones del conjunto de test con SHAP (predicciones de 12,41; 9,80 y 14,38 anillos) y la primera con LIME (12,41 anillos). Para esa observación, ambos métodos coinciden en que ShellWeight es el mayor aporte positivo, pero difieren en el signo de la contribución de ShuckedWeight (positiva en SHAP, negativa en LIME).",
    conclusion_final: "El modelo optimizado logra un ajuste moderado (R² = 0,551; error medio de unos 1,5 anillos), con errores que crecen y tienden a subestimar en valores altos de Rings."
  },
  limitaciones: [
    "Ajuste moderado: R² = 0,551.",
    "Indicios de heterocedasticidad: el error varía según el nivel de Rings.",
    "El modelo tiende a subestimar los valores altos de Rings.",
    "Se evaluó una sola partición train/test; la validación cruzada se usó solo dentro del conjunto de entrenamiento para buscar hiperparámetros.",
    "SHAP y LIME explican observaciones puntuales, no el modelo completo, y pueden diferir entre sí."
  ]
  // por_sexo: NO disponible todavía. No inventar.,
  por_sexo: undefined as undefined | { grupo: string; n: number; mae: number; rmse: number; r2: number }[],
};
