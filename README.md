# 🛫 Flight Delay Predictor — SkyPulse Analytics

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-lightgrey)](https://flask.palletsprojects.com/)
[![Apache Pinot](https://img.shields.io/badge/Apache%20Pinot-1.2.0-orange)](https://pinot.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Sistema web para el análisis y predicción de retrasos aéreos, desarrollado por **SkyPulse Analytics** como parte del proyecto académico de Construcción del Software (Sexto Semestre).

---

## 📖 Descripción

Flight Delay Predictor es una aplicación web que transforma datos históricos de vuelos en información accionable. Permite a aerolíneas, operadores y viajeros:

- Visualizar un **dashboard** interactivo con KPIs (total de vuelos, porcentaje de retrasos, retraso promedio, cancelaciones, desvíos) y gráficos (evolución diaria, distribución de tipos de retraso, ranking por aerolínea).
- **Gestionar dimensiones** (aerolíneas, aeropuertos, rutas, franjas horarias, códigos de cancelación) mediante un CRUD con interfaz tabulada y búsqueda.
- **Registrar vuelos** manualmente o mediante **carga masiva** de archivos CSV/Parquet, con vista previa y validación.
- **Predecir la probabilidad de retraso** de un vuelo específico usando consultas agregadas sobre 300 000 registros históricos almacenados en Apache Pinot.
- **Explorar rutas aéreas** en un mapa interactivo (Leaflet) coloreado según el riesgo de retraso.

---

## 🧰 Stack Tecnológico

| Capa          | Tecnologías                                          |
|---------------|------------------------------------------------------|
| Backend       | Python 3.10+, Flask, Jinja2, Flask-Login             |
| Frontend      | HTML5, Tailwind CSS, Material Symbols, Chart.js, Leaflet.js |
| Base de datos | Apache Pinot (OLAP, esquema estrella) + Zookeeper    |
| Ingesta       | Scripts Python con `pandas`, `pyarrow` y API REST de Pinot |
| Contenedores  | Docker Compose (controller, broker, server, zookeeper)|
| Control de versiones | Git + GitHub                                   |

---

## 📊 Dataset

Se utiliza una muestra de **300 000 registros** del dataset público [Flight Data 2024](https://www.kaggle.com/datasets/hrishitpatil/flight-data-2024) de Kaggle.  
Los datos incluyen información de aerolíneas, aeropuertos, tiempos programados y reales, retrasos, cancelaciones y desvíos.
