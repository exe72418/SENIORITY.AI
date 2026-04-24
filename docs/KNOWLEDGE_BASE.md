# SENIORITY.AI: Total Knowledge Base & Context

> **AVISO PARA IA:** Este documento es la "Memoria a Largo Plazo" del proyecto. Antes de realizar cualquier cambio, lee este archivo para entender la cultura, la arquitectura y los secretos técnicos de SENIORITY.AI.

## 1. Misión y Cultura
**SENIORITY.AI** no es una plataforma de aprendizaje pasiva. Es un simulador de **alto rendimiento** y **máxima presión**.
- **El Tono:** Profesional, exigente y con "Spanglish" técnico (LATAM Startup Style).
- **El Objetivo:** Convertir Trainees en Seniors y Emprendedores en Fundadores de élite.
- **La Regla de Oro:** La calidad no se negocia. Si el código no es excelente, el Jefe IA lo rechaza.

## 2. Modos de Juego (The Core Flow)
1. **Selection Process:** El usuario no entra directo. Debe subir un CV, pasar una entrevista técnica y un examen de código.
2. **Career Mode:** El usuario es un "empleado" en una de las 13 industrias (Banca, ERP, Ciberseguridad, etc.).
3. **Entrepreneur Mode:** El usuario trae su propia idea. La IA actúa como CTO Mentor para construir el MVP con estándares de Senior.

## 3. Arquitectura del "Cerebro" (The Integration)
- **Costo Cero (BYO-AI):** El usuario pone sus propias llaves de Gemini/Claude/GPT.
- **MCP Server (The Hands):** Un servidor local que permite a la IA tocar archivos (`fs_saboteur`), correr Docker (`docker_runner`) y manejar Git (`git_manager`).
- **Validación Real:** Todo se valida corriendo tests reales en contenedores Docker via GitHub Actions del usuario.

## 4. Personalidades de la IA (System Prompts)
- **The Picky Boss:** El Tech Lead que te apura y revisa cada línea. No acepta nombres de variables genéricos ni falta de tests.
- **The QA:** El bot que busca casos borde y "rompe" la ilusión de que el código está listo.
- **The Mentee:** Un Junior que te hace preguntas técnicas para medir tu liderazgo.

## 5. Estándares de Código (Para el Crecimiento)
- **Frontend:** Feature-Sliced Design (FSD). Todo está en `features/` por dominio para ahorrar tokens.
- **Backend:** Modularidad estricta. Las herramientas de MCP están aisladas de la lógica del motor (`engine.py`).
- **Aesthetic:** Diseño "Dark Mode" por defecto, Glassmorphism, animaciones con Framer Motion y variables semánticas para escalabilidad.

## 6. Diccionario Técnico (Spanglish Mode)
Cuando la IA hable como el Jefe, debe usar:
- *PR / Push / Commit / Branch*
- *Issue / Ticket / Backlog*
- *N+1 / Race Condition / Bottleneck*
- *Deploy / Pipeline / Stage / Production*
- *Fix / Hotfix / Refactor*

## 7. Mapa de Industrias (The Victim Repos)
- Banca: Apache Fineract
- ERP: ERPNext
- E-commerce: Saleor
- Ciberseguridad: Zitadel
- *Ver docs/VISION.md para la lista completa.*
