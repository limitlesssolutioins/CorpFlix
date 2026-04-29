-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN) MANUALES

-- Standard: ISO9001
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y seleccionar las oportunidades de mejora e implementar cualquier acción necesaria para cumplir los requisitos del cliente y aumentar la satisfacción del cliente.', 1
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir: a) mejorar los productos y servicios para cumplir los requisitos, así como tratar las necesidades y expectativas futuras;', 2
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir: b) corregir, prevenir o reducir los efectos indeseados;', 3
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir: c) mejorar el desempeño y la eficacia del sistema de gestión de la calidad.', 4
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: a) reaccionar ante la no conformidad y, cuando sea aplicable: 1) tomar acciones para controlarla y corregirla;', 1
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: a) reaccionar ante la no conformidad y, cuando sea aplicable: 2) hacer frente a las consecuencias;', 2
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, mediante: 1) la revisión y el análisis de la no conformidad;', 3
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, mediante: 2) la determinación de las causas de la no conformidad;', 4
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, mediante: 3) la determinación de si existen no conformidades similares, o que potencialmente podrían ocurrir;', 5
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: c) implementar cualquier acción necesaria;', 6
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: d) revisar la eficacia de cualquier acción correctiva tomada;', 7
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: e) si es necesario, actualizar los riesgos y oportunidades determinados durante la planificación;', 8
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad, la organización debe: f) si es necesario, hacer cambios al sistema de gestión de la calidad.', 9
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones correctivas deben ser adecuadas a los efectos de las no conformidades encontradas.', 10
FROM iso_requirements WHERE requirement_code = '10.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de: a) la naturaleza de las no conformidades y cualquier acción posterior tomada;', 1
FROM iso_requirements WHERE requirement_code = '10.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de: b) los resultados de cualquier acción correctiva.', 2
FROM iso_requirements WHERE requirement_code = '10.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mejorar continuamente la idoneidad, adecuación y eficacia del sistema de gestión de la calidad.', 1
FROM iso_requirements WHERE requirement_code = '10.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar los resultados del análisis y la evaluación, y las salidas de la revisión por la dirección, para determinar si hay necesidades u oportunidades que deben tratarse como parte de la mejora continua.', 2
FROM iso_requirements WHERE requirement_code = '10.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: Las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de Calidad.', 1
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: a. Las partes interesadas que son pertinentes al sistema de gestión de calidad;', 1
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: b. Los requisitos de estas partes interesadas que son pertinentes para el sistema de gestión de la calidad.', 2
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento y la revisión de la información sobre estas partes interesadas y sus requisitos pertinentes.', 3
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinar los limites y la aplicabilidad del SGC para establecer su alcance.', 1
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: a. Las cuestiones externas e internas referidas en 4.1;', 2
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: b. Los requisitos de las partes interesadas pertinentes referidos en el apartado 4.2;', 3
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: c. Los productos y servicios de la organización;', 4
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse como información documentada estableciendo: Los tipos de productos y servicios cubiertos por el sistema de gestión de la calidad;', 5
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse como información documentada estableciendo: La justificación para cualquier requisito de esta norma internacional que la organización determine que no es aplicable para el alcance de su SGC.', 6
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos de esta Norma Internacional.', 1
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: a) determinar las entradas requeridas y las salidas esperados de estos procesos;', 2
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: b) determinar la secuencia e interacción de estos procesos;', 3
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: c) determinar y aplicar los criterios y los métodos (incluyendo el seguimiento, la medición y los indicadores del desempeño relacionados) necesarios para asegurarse la operación eficaz y el control de estos procesos;', 4
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: d) determinar los recursos necesarios para estos procesos y asegurarse de su disponibilidad;', 5
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: e) asignar las responsabilidades y autoridades para estos procesos;', 6
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: f) abordar los riesgos y oportunidades determinados de acuerdo con los requisitos del apartado 6.1;', 7
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: g) valorar estos procesos e implementar cualquier cambio necesario para asegurarse de que estos procesos logran los resultados previstos;', 8
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe: h) mejorar los procesos y el sistema de gestión de la calidad.', 9
FROM iso_requirements WHERE requirement_code = '4.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En la medida en que sea necesario, la organización debe: a) mantener información documentada para apoyar la operación de sus procesos;', 1
FROM iso_requirements WHERE requirement_code = '4.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'En la medida en que sea necesario, la organización debe: b) conservar la información documentada para tener la confianza de que los procesos se realizan según lo planificado.', 2
FROM iso_requirements WHERE requirement_code = '4.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: a) asumiendo la rendición de cuentas de la eficacia del sistema de gestión de la calidad;', 1
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: b) asegurando que se establezcan para el sistema de gestión de la calidad la política de la calidad y los objetivos de la calidad y que éstos sean compatibles con el contexto y la dirección estratégica de la organización;', 2
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: c) asegurando la integración de los requisitos del sistema de gestión de la calidad en los procesos de negocio de la organización;', 3
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: d) promoviendo el uso del enfoque basado en procesos y el pensamiento basado en riesgos;', 4
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: e) asegurando que los recursos necesarios para el sistema de gestión de la calidad estén disponibles;', 5
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: f) comunicando la importancia de una gestión de la calidad eficaz y conforme con los requisitos del sistema de gestión de la calidad;', 6
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: g) asegurando que el sistema de gestión de la calidad logre los resultados previstos;', 7
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: h) comprometiendo, dirigiendo y apoyando a las personas, para contribuir a la eficacia del sistema de gestión de la calidad;', 8
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: i) promoviendo la mejora;', 9
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad: j) apoyando otros roles pertinentes de la dirección, para demostrar su liderazgo aplicado a sus áreas de responsabilidad.', 10
FROM iso_requirements WHERE requirement_code = '5.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que: a) se determinan, se comprenden y se cumplen de manera coherente los requisitos del cliente y los legales y reglamentarios aplicables;', 1
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que: b) se determinan y se tratan los riesgos y oportunidades que pueden afectar a la conformidad de los productos y los servicios y a la capacidad de aumentar la satisfacción del cliente;', 2
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que: c) se mantiene el enfoque en aumentar la satisfacción del cliente.', 3
FROM iso_requirements WHERE requirement_code = '5.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: a) sea apropiada al propósito y al contexto de la organización y apoya su dirección estratégica;', 1
FROM iso_requirements WHERE requirement_code = '5.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: b) proporcione un marco de referencia para el establecimiento de los objetivos de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '5.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: c) incluya el compromiso de cumplir los requisitos aplicables;', 3
FROM iso_requirements WHERE requirement_code = '5.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política de la calidad que: d) incluya el compromiso de mejora continua del sistema de gestión de la calidad.', 4
FROM iso_requirements WHERE requirement_code = '5.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política de la calidad debe: a) estar disponible y mantenerse como información documentada;', 1
FROM iso_requirements WHERE requirement_code = '5.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política de la calidad debe: b) comunicarse, entenderse y aplicarse dentro de la organización;', 2
FROM iso_requirements WHERE requirement_code = '5.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política de la calidad debe: c) estar disponible para las partes interesadas pertinentes, según corresponda.', 3
FROM iso_requirements WHERE requirement_code = '5.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles pertinentes se asignen, se comuniquen y se entiendan dentro de la organización.', 1
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: a) asegurarse de que el sistema de gestión de la calidad es conforme con los requisitos de esta Norma Internacional;', 2
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: b) asegurarse de que los procesos están dando las salidas previstas;', 3
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: c) informar a la alta dirección sobre el desempeño del sistema de gestión de la calidad y sobre las oportunidades de mejora;', 4
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: d) asegurarse de que se promueva el enfoque al cliente a través de la organización;', 5
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asignar la responsabilidad y autoridad para: e) asegurarse de que la integridad del sistema de gestión de la calidad se mantiene cuando se planifican e implementan cambios en el sistema de gestión de la calidad.', 6
FROM iso_requirements WHERE requirement_code = '5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe determinar los riesgos y oportunidades para: a) asegurar que el sistema pueda lograr sus resultados previstos;', 1
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe determinar los riesgos y oportunidades para: b) aumentar los efectos deseables;', 2
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe determinar los riesgos y oportunidades para: c) prevenir o reducir efectos no deseados;', 3
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe determinar los riesgos y oportunidades para: d) lograr la mejora.', 4
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar: a) las acciones para abordar estos riesgos y oportunidades;', 1
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar: b) 1) integrar e implementar las acciones en sus procesos del sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar: b) 2) evaluar la eficacia de estas acciones.', 3
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones tomadas para abordar los riesgos y oportunidades deben ser proporcionales al impacto potencial en la conformidad de los productos y los servicios.', 4
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer los objetivos de la calidad para las funciones, niveles y procesos pertinentes necesarios para el sistema de gestión de la calidad.', 1
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: a) ser coherentes con la política de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: b) ser medibles;', 3
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: c) tener en cuenta los requisitos aplicables;', 4
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: d) ser pertinentes para la conformidad de los productos y servicios y para el aumento de la satisfacción del cliente;', 5
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: e) ser objeto de seguimiento;', 6
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: f) comunicarse;', 7
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben: g) actualizarse, según corresponda.', 8
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener información documentada sobre los objetivos de la calidad.', 9
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: a) qué se va a hacer;', 1
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: b) qué recursos se requerirán;', 2
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: c) quién será responsable;', 3
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: d) cuándo se finalizará;', 4
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: e) cómo se evaluarán los resultados.', 5
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determine la necesidad de cambios, estos se deben llevar a cabo de manera planificada y sistemática considerando: a) el propósito de los cambios y sus potenciales consecuencias;', 1
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determine la necesidad de cambios, estos se deben llevar a cabo de manera planificada y sistemática considerando: b) la integridad del sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determine la necesidad de cambios, estos se deben llevar a cabo de manera planificada y sistemática considerando: c) la disponibilidad de recursos;', 3
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determine la necesidad de cambios, estos se deben llevar a cabo de manera planificada y sistemática considerando: d) la asignación o reasignación de responsabilidades y autoridades.', 4
FROM iso_requirements WHERE requirement_code = '6.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del SGC.', 1
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: a) las capacidades y limitaciones de los recursos internos existentes;', 2
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: b) qué se necesita obtener de los proveedores externos.', 3
FROM iso_requirements WHERE requirement_code = '7.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar las personas necesarias para implementación eficaz de su sistema de gestión de la calidad y para la operación y control de sus procesos.', 1
FROM iso_requirements WHERE requirement_code = '7.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener la infraestructura necesaria para que la operación de sus procesos logre la conformidad de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '7.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener el ambiente necesario para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '7.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar los recursos necesarios para asegurarse de la validez y fiabilidad de los resultados de seguimiento o medición.', 1
FROM iso_requirements WHERE requirement_code = '7.1.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los recursos: a) son adecuados para el tipo específico de actividades realizadas;', 2
FROM iso_requirements WHERE requirement_code = '7.1.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los recursos: b) se mantienen para asegurarse de la adecuación continua para su propósito.', 3
FROM iso_requirements WHERE requirement_code = '7.1.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada como evidencia de la adecuación para el propósito del seguimiento y medición de los recursos.', 4
FROM iso_requirements WHERE requirement_code = '7.1.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad sea un requisito, el equipo de medición debe: a) verificarse o calibrarse a intervalos especificados o antes de su utilización;', 1
FROM iso_requirements WHERE requirement_code = '7.1.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad sea un requisito, el equipo de medición debe: b) identificarse para determinar su estado;', 2
FROM iso_requirements WHERE requirement_code = '7.1.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad sea un requisito, el equipo de medición debe: c) protegerse contra ajustes, daño o deterioro.', 3
FROM iso_requirements WHERE requirement_code = '7.1.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar si la validez de los resultados previos se ha visto afectada cuando el equipo se considere no apto, y tomar acciones.', 4
FROM iso_requirements WHERE requirement_code = '7.1.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '7.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estos conocimientos deben mantenerse y ponerse a disposición en la extensión necesaria.', 2
FROM iso_requirements WHERE requirement_code = '7.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al tratar necesidades cambiantes, la organización debe considerar sus conocimientos actuales y determinar cómo adquirir o acceder a conocimientos adicionales.', 3
FROM iso_requirements WHERE requirement_code = '7.1.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: a) determinar la competencia necesaria de las personas que realizan un trabajo que afecta al desempeño y eficacia del SGC;', 1
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: b) asegurarse de que estas personas sean competentes, basándose en la educación, formación o experiencia adecuadas;', 2
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: c) cuando sea aplicable, tomar acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones tomadas;', 3
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: d) conservar la información documentada apropiada, como evidencia de la competencia.', 4
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas bajo su control toman conciencia de: a) la política de la calidad;', 1
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas bajo su control toman conciencia de: b) los objetivos de la calidad pertinentes;', 2
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas bajo su control toman conciencia de: c) su contribución a la eficacia del SGC y los beneficios de la mejora;', 3
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas bajo su control toman conciencia de: d) las implicaciones de no cumplir los requisitos del SGC.', 4
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes: a) qué comunicar; b) cuándo comunicar; c) a quién comunicar;', 1
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes: d) cómo comunicar; e) quién comunica.', 2
FROM iso_requirements WHERE requirement_code = '7.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El SGC de la organización debe incluir: a) la información documentada requerida por esta Norma Internacional;', 1
FROM iso_requirements WHERE requirement_code = '7.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El SGC de la organización debe incluir: b) la información documentada que la organización ha determinado necesaria para la eficacia del sistema.', 2
FROM iso_requirements WHERE requirement_code = '7.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al crear y actualizar información documentada, se debe asegurar: a) la identificación y descripción (título, fecha, autor, ref);', 1
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al crear y actualizar información documentada, se debe asegurar: b) el formato (idioma, versión, gráficos) y sus medios de soporte;', 2
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al crear y actualizar información documentada, se debe asegurar: c) la revisión y aprobación con respecto a la idoneidad y adecuación.', 3
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada se debe controlar para asegurarse de que: a) esté disponible y adecuada para su uso;', 1
FROM iso_requirements WHERE requirement_code = '7.5.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada se debe controlar para asegurarse de que: b) esté protegida adecuadamente (confidencialidad, uso inadecuado, integridad).', 2
FROM iso_requirements WHERE requirement_code = '7.5.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización debe tratar: a) distribución, acceso, recuperación y uso;', 1
FROM iso_requirements WHERE requirement_code = '7.5.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización debe tratar: b) almacenamiento y preservación (incluida legibilidad);', 2
FROM iso_requirements WHERE requirement_code = '7.5.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización debe tratar: c) control de cambios (versión) y d) conservación y disposición.', 3
FROM iso_requirements WHERE requirement_code = '7.5.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada de origen externo necesaria para la planificación y operación se debe identificar y controlar.', 4
FROM iso_requirements WHERE requirement_code = '7.5.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada conservada como evidencia de conformidad debe protegerse contra modificaciones no intencionadas.', 5
FROM iso_requirements WHERE requirement_code = '7.5.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos (véase 4.4) necesarios para cumplir los requisitos para la producción de productos y prestación de servicios, y para implementar las acciones determinadas en el capítulo 6, mediante: a) la determinación de los requisitos para los productos y servicios;', 1
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos necesarios mediante: b) el establecimiento de criterios para: 1) los procesos;', 2
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos necesarios mediante: b) el establecimiento de criterios para: 2) la aceptación de los productos y servicios;', 3
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos necesarios mediante: c) la determinación de los recursos necesarios para lograr la conformidad para los requisitos de los productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos necesarios mediante: d) la implementación del control de los procesos de acuerdo con los criterios;', 5
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos necesarios mediante: e) la determinación y almacenaje de la información documentada en la medida necesaria: 1) para confiar en que los procesos se han llevado a cabo según lo planificado;', 6
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos necesarios mediante: e) la determinación y almacenaje de la información documentada en la medida necesaria: 2) para demostrar la conformidad de los productos y servicios con sus requisitos.', 7
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El elemento de salida de esta planificación debe ser adecuado para las operaciones de la organización.', 8
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar los cambios planificados y revisar las consecuencias de los cambios no previstos, tomando acciones para mitigar cualquier efecto adverso, cuando sea necesario.', 9
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos contratados externamente estén controlados (véase 8.4).', 10
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe: a) proporcionar la información relativa a los productos y servicios;', 1
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe: b) la atención de las consultas, los contratos o los pedidos, incluyendo los cambios;', 2
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe: c) obtener la retroalimentación de los clientes relativa a los productos y servicios, incluyendo las quejas de los clientes;', 3
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe: d) manipular o controlar las propiedades del cliente;', 4
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe: e) establecer los requisitos específicos para las acciones de contingencia, cuando sea pertinente.', 5
FROM iso_requirements WHERE requirement_code = '8.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando determina los requisitos para los productos y servicios que se van a ofrecer a los clientes, la organización debe asegurarse de que: a) los requisitos para los productos y servicios se definen, incluyendo: 1) cualquier requisito legal y reglamentario aplicable;', 1
FROM iso_requirements WHERE requirement_code = '8.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando determina los requisitos para los productos y servicios que se van a ofrecer a los clientes, la organización debe asegurarse de que: a) los requisitos para los productos y servicios se definen, incluyendo: 2) aquellos considerados necesarios por la organización;', 2
FROM iso_requirements WHERE requirement_code = '8.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando determina los requisitos para los productos y servicios que se van a ofrecer a los clientes, la organización debe asegurarse de que: b) la organización puede cumplir las reclamaciones de los productos y servicios que ofrece.', 3
FROM iso_requirements WHERE requirement_code = '8.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que tiene la capacidad de cumplir los requisitos para los productos y servicios que se van a ofrecer a los clientes.', 1
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: a) los requisitos especificados por el cliente, incluyendo los requisitos para las actividades de entrega y las posteriores a la misma;', 2
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: b) los requisitos no establecidos por el cliente, pero necesarios para el uso especificado o para el uso previsto, cuando sea conocido;', 3
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: c) los requisitos especificados por la organización;', 4
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: d) los requisitos legales y reglamentarios adicionales aplicables a los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir: e) las diferencias existentes entre los requisitos de contrato o pedido y los expresados previamente.', 6
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que se resuelven las diferencias existentes entre los requisitos del contrato o pedido y los expresados previamente.', 7
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe confirmar los requisitos del cliente antes de la aceptación, cuando el cliente no proporcione una declaración documentada de sus requisitos.', 8
FROM iso_requirements WHERE requirement_code = '8.2.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada, cuando sea aplicable: a) sobre los resultados de la revisión;', 1
FROM iso_requirements WHERE requirement_code = '8.2.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada, cuando sea aplicable: b) sobre cualquier requisito nuevo para los productos y servicios.', 2
FROM iso_requirements WHERE requirement_code = '8.2.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que la información documentada pertinente sea modificada, y de que las personas correspondientes sean conscientes de los requisitos modificados, cuando se cambien los requisitos para los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.2.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea adecuado para asegurarse de la posterior producción de productos y prestación de servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: a) la naturaleza, duración y complejidad de las actividades de diseño y desarrollo;', 1
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: b) las etapas del proceso requeridas, incluyendo las revisiones del diseño y desarrollo aplicables;', 2
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: c) las actividades requeridas de verificación y validación del diseño y desarrollo;', 3
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: d) las responsabilidades y autoridades involucradas en el proceso de diseño y desarrollo;', 4
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: e) las necesidades de recursos internos y externos para el diseño y desarrollo de los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: f) la necesidad de controlar las interfaces entre las personas implicadas en el proceso de diseño y desarrollo;', 6
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: g) la necesidad de la participación activa de los clientes y usuarios en el proceso de diseño y desarrollo;', 7
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: h) los requisitos para la posterior producción de productos y prestación de servicios;', 8
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: i) el nivel de control del proceso de diseño y desarrollo esperado por los clientes y otras partes interesadas pertinentes;', 9
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar: j) la información documentada necesaria para demostrar que se han cumplido los requisitos del diseño y desarrollo.', 10
FROM iso_requirements WHERE requirement_code = '8.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los requisitos esenciales para los tipos específicos de productos y servicios que se van a diseñar y desarrollar. La organización debe considerar: a) los requisitos funcionales y de desempeño;', 1
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: b) la información proveniente de actividades de diseño y desarrollo previas similares;', 2
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: c) los requisitos legales y reglamentarios;', 3
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: d) normas o códigos de prácticas que la organización se ha comprometido a implementar;', 4
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar: e) las consecuencias potenciales del fracaso debido a la naturaleza de los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los elementos de entrada deben ser adecuados para los fines de diseño y desarrollo, estar completos y sin ambigüedades. Los conflictos entre elementos de entrada deben resolverse.', 6
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las entradas deben ser adecuadas para los fines de diseño y desarrollo, estar completos y sin ambigüedades.', 7
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Deben resolverse las entradas del diseño y desarrollo contradictorios.', 8
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre las entradas del diseño y desarrollo.', 9
FROM iso_requirements WHERE requirement_code = '8.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: a) los resultados a lograr están definidos;', 1
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: b) las revisiones se realizan para evaluar la capacidad de los resultados del diseño y desarrollo de cumplir los requisitos;', 2
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: c) se realizan actividades de verificación para asegurarse de que las salidas del diseño y desarrollo cumplen los requisitos de las entradas;', 3
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: d) se realizan actividades de validación para asegurarse de que los productos y servicios resultantes satisfacen los requisitos para su aplicación especificada o uso previsto;', 4
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: e) se toma cualquier acción necesaria sobre los problemas determinados durante las revisiones, o las actividades de verificación y validación;', 5
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que: f) se conserva la información documentada de estas actividades.', 6
FROM iso_requirements WHERE requirement_code = '8.3.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: a) cumplen los requisitos de las entradas;', 1
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: b) son adecuados para los procesos posteriores para la provisión de productos y servicios;', 2
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: c) incluyen o hacen referencia a los requisitos de seguimiento y medición, cuando sea adecuado, y a los criterios de aceptación;', 3
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo: d) especifican las características de los productos y servicios que son esenciales para su propósito previsto y su uso seguro y correcto.', 4
FROM iso_requirements WHERE requirement_code = '8.3.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, revisar y controlar los cambios hechos durante el diseño y desarrollo de los productos y servicios o posteriormente, en la medida necesaria para asegurarse de que no haya un impacto adverso en la conformidad con los requisitos.', 1
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: a) los cambios del diseño y desarrollo;', 2
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: b) los resultados de las revisiones;', 3
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: c) la autorización de los cambios;', 4
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre: d) las acciones tomadas para prevenir los impactos adversos.', 5
FROM iso_requirements WHERE requirement_code = '8.3.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente son conformes a los requisitos.', 1
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando: a) los productos y servicios de proveedores externos están destinados a incorporarse dentro de los propios productos y servicios de la organización;', 2
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando: b) los productos y servicios son proporcionados directamente a los clientes por proveedores externos en nombre de la organización;', 3
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando: c) un proceso, o una parte de un proceso, es proporcionado por un proveedor externo como resultado de una decisión de la organización.', 4
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y aplicar criterios para la evaluación, la selección, el seguimiento del desempeño y la reevaluación de los proveedores externos, basándose en su capacidad para proporcionar procesos o productos y servicios de acuerdo con los requisitos.', 5
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada de estas actividades y de cualquier acción necesaria que surja de las evaluaciones.', 6
FROM iso_requirements WHERE requirement_code = '8.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente no afectan de manera adversa a la capacidad de la organización de entregar productos y servicios conformes de manera coherente a sus clientes.', 1
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: a) asegurarse de que los procesos suministrados externamente permanecen dentro del control de su sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: b) definir los controles que pretende aplicar a un proveedor externo y los que pretende aplicar a las salidas resultantes;', 3
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: c) tener en consideración: 1) el impacto potencial de los procesos, productos y servicios suministrados externamente en la capacidad de la organización de cumplir regularmente los requisitos del cliente y los legales y reglamentarios aplicables;', 4
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: c) tener en consideración: 2) la eficacia de los controles aplicados por el proveedor externo;', 5
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: d) determinar la verificación, u otras actividades, necesarias para asegurarse de que los procesos, productos y servicios suministrados externamente cumplen los requisitos.', 6
FROM iso_requirements WHERE requirement_code = '8.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de la adecuación de los requisitos antes de su comunicación al proveedor externo.', 1
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: a) los procesos, productos y servicios a proporcionar;', 2
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: b) la aprobación de: 1) productos y servicios;', 3
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: b) la aprobación de: 2) métodos, procesos y equipo;', 4
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: b) la aprobación de: 3) la liberación de productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: c) la competencia, incluyendo cualquier calificación de las personas requerida;', 6
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: d) las interacciones del proveedor externo con la organización;', 7
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: e) el control y el seguimiento del desempeño del proveedor externo a aplicar por la organización;', 8
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para: f) las actividades de verificación o validación que la organización, o su cliente, pretenden llevar a cabo en las instalaciones del proveedor externo.', 9
FROM iso_requirements WHERE requirement_code = '8.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar la producción y prestación del servicio bajo condiciones controladas.', 1
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: a) la disponibilidad de información documentada que defina: 1) las características de los productos a producir, los servicios a prestar, o las actividades a desempeñar;', 2
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: a) la disponibilidad de información documentada que defina: 2) los resultados a alcanzar;', 3
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: b) la disponibilidad y el uso de los recursos de seguimiento y medición adecuados;', 4
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: c) la implementación de actividades de seguimiento y medición en las etapas apropiadas para verificar que se cumplen los criterios para el control de los procesos o las salidas, y los criterios de aceptación para los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: d) el uso de la infraestructura y el ambiente adecuados para la operación de los procesos;', 6
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: e) la designación de personas competentes, incluyendo cualquier calificación requerida;', 7
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: f) la validación y revalidación periódica de la capacidad para alcanzar los resultados planificados de los procesos de producción y de prestación del servicio, donde el elemento de salida resultante no pueda verificarse mediante actividades de seguimiento o medición posteriores;', 8
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: g) la implementación de acciones para prevenir los errores humanos;', 9
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable: h) la implementación de actividades de liberación, entrega y posteriores a la entrega.', 10
FROM iso_requirements WHERE requirement_code = '8.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe utilizar los medios adecuados para identificar las salidas cuando sea necesario para asegurar la conformidad de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar el estado de las salidas con respecto a los requisitos de seguimiento y medición a través de la producción y prestación del servicio.', 2
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar la identificación única de las salidas cuando la trazabilidad sea un requisito.', 3
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se debe conservar la información documentada necesaria para permitir la trazabilidad.', 4
FROM iso_requirements WHERE requirement_code = '8.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cuidar la propiedad perteneciente a los clientes o a proveedores externos mientras esté bajo el control de la organización o esté siendo utilizado por la misma.', 1
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, verificar, proteger y salvaguardar la propiedad de los clientes o de los proveedores externos suministrada para su utilización o incorporación dentro de los productos y servicios.', 2
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la propiedad de un cliente o de un proveedor externo se pierda, deteriore o que de algún otro modo se considere inadecuada para su uso, la organización debe informar de esto al cliente o proveedor externo y conservar la información documentada sobre lo que ha ocurrido.', 3
FROM iso_requirements WHERE requirement_code = '8.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe preservar las salidas durante la producción y prestación del servicio, en la medida necesaria para asegurarse de la conformidad con los requisitos.', 1
FROM iso_requirements WHERE requirement_code = '8.5.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cumplir los requisitos para las actividades posteriores a la entrega asociadas con los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: a) los requisitos legales y reglamentarios;', 2
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: b) las potenciales consecuencias no deseadas asociadas con sus productos y servicios;', 3
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: c) la naturaleza, el uso y la vida prevista de sus productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: d) los requisitos del cliente;', 5
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar: e) retroalimentación del cliente.', 6
FROM iso_requirements WHERE requirement_code = '8.5.5' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe revisar y controlar los cambios para la producción o la prestación del servicio, en la medida necesaria para asegurarse de la conformidad continua con los requisitos especificados.', 1
FROM iso_requirements WHERE requirement_code = '8.5.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada que describa los resultados de la revisión de los cambios, las personas que autorizan el cambio y de cualquier acción necesaria que surja de la revisión.', 2
FROM iso_requirements WHERE requirement_code = '8.5.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar las disposiciones planificadas, en las etapas adecuadas, para verificar que se cumplen los requisitos de los productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La liberación de los productos y servicios al cliente no debe llevarse a cabo hasta que se hayan completado satisfactoriamente las disposiciones planificadas, a menos que sea aprobado de otra manera por una autoridad pertinente y, cuando sea aplicable, por el cliente.', 2
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre la liberación de los productos y servicios.', 3
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada debe incluir: a) evidencia de la conformidad con los criterios de aceptación;', 4
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada debe incluir: b) trazabilidad a las personas que han autorizado la liberación.', 5
FROM iso_requirements WHERE requirement_code = '8.6' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas que no sean conformes con sus requisitos se identifican y se controlan para prevenir su uso o entrega no intencional.', 1
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tomar las acciones adecuadas basándose en la naturaleza de la no conformidad y en su efecto sobre la conformidad de los productos y servicios. Esto se debe aplicar también a los productos y servicios no conformes detectados después de la entrega de los productos, durante o después de la provisión de los servicios.', 2
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: a) corrección;', 3
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: b) separación, contención, devolución o suspensión de la provisión de los productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: c) informar al cliente;', 5
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras: d) obtener autorización para su aceptación bajo concesión.', 6
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Debe verificarse la conformidad con los requisitos cuando las salidas no conformes se corrigen.', 7
FROM iso_requirements WHERE requirement_code = '8.7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: a) describa la no conformidad;', 1
FROM iso_requirements WHERE requirement_code = '8.7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: b) describa las acciones tomadas;', 2
FROM iso_requirements WHERE requirement_code = '8.7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: c) describa las concesiones obtenidas;', 3
FROM iso_requirements WHERE requirement_code = '8.7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada que: d) identifique la autoridad que ha decidido la acción con respecto a la no conformidad.', 4
FROM iso_requirements WHERE requirement_code = '8.7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: a) a qué es necesario hacer seguimiento y qué es necesario medir;', 1
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: b) los métodos de seguimiento, medición, análisis y evaluación necesarios para asegurar resultados válidos;', 2
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: c) cuándo se deben llevar a cabo el seguimiento y la medición;', 3
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: d) cuándo se deben analizar y evaluar los resultados del seguimiento y la medición.', 4
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe evaluar el desempeño y la eficacia del sistema de gestión de la calidad.', 5
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada como evidencia de los resultados.', 6
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento de las percepciones de los clientes del grado en que se cumplen sus necesidades y expectativas.', 1
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los métodos para obtener, realizar el seguimiento y revisar esta información.', 2
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe analizar y evaluar los datos y la información apropiados originados por el seguimiento y la medición.', 1
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: a) la conformidad de los productos y servicios;', 2
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: b) el grado de satisfacción del cliente;', 3
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: c) el desempeño y la eficacia del sistema de gestión de la calidad;', 4
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: d) si lo planificado se ha implementado de forma eficaz;', 5
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: e) la eficacia de las acciones tomadas para abordar los riesgos y oportunidades;', 6
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: f) el desempeño de los proveedores externos;', 7
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar: g) la necesidad de mejoras en el sistema de gestión de la calidad.', 8
FROM iso_requirements WHERE requirement_code = '9.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información acerca de si el sistema de gestión de la calidad cumple: a) 1) los requisitos propios de la organización para su sistema de gestión de la calidad;', 1
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información acerca de si el sistema de gestión de la calidad cumple: a) 2) los requisitos de esta Norma Internacional;', 2
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información acerca de si el sistema de gestión de la calidad: b) está implementado y mantenido eficazmente.', 3
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: a) planificar, establecer, implementar y mantener uno o varios programas de auditoría que incluyan la frecuencia, los métodos, las responsabilidades, los requisitos de planificación y la elaboración de informes, que deben tener en consideración la importancia de los procesos involucrados, los cambios que afecten a la organización y los resultados de las auditorías previas;', 1
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: b) para cada auditoría, definir los criterios de la auditoría y el alcance de cada auditoría;', 2
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: c) seleccionar los auditores y llevar a cabo auditorías para asegurarse de la objetividad y la imparcialidad del proceso de auditoría;', 3
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: d) asegurarse de que los resultados de las auditorías se informan a la dirección pertinente;', 4
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: e) realizar las correcciones y tomar las acciones correctivas adecuadas sin demora injustificada;', 5
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: f) conservar la información documentada como evidencia de la implementación del programa de auditoría y los resultados de la auditoría.', 6
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe revisar el sistema de gestión de la calidad de la organización a intervalos planificados, para asegurarse de su idoneidad, adecuación, eficacia y alineación con la dirección estratégica de la organización continuas.', 1
FROM iso_requirements WHERE requirement_code = '9.3.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: a) el estado de las acciones desde revisiones por la dirección previas;', 1
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: b) los cambios en las cuestiones externas e internas que sean pertinentes al sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: 1) satisfacción del cliente y la retroalimentación de las partes interesadas pertinentes;', 3
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: 2) el grado en que se han cumplido los objetivos de la calidad;', 4
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: 3) desempeño de los procesos y conformidad de los productos y servicios;', 5
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: 4) no conformidades y acciones correctivas;', 6
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: 5) resultados de seguimiento y medición;', 7
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: 6) resultados de las auditorías;', 8
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a: 7) el desempeño de los proveedores externos;', 9
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: d) la adecuación de los recursos;', 10
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: e) la eficacia de las acciones tomadas para abordar los riesgos y las oportunidades (véase 6.1);', 11
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión por la dirección debe planificarse y llevarse a cabo incluyendo consideraciones sobre: f) oportunidades de mejora.', 12
FROM iso_requirements WHERE requirement_code = '9.3.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con: a) las oportunidades de mejora;', 1
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con: b) cualquier necesidad de cambio en el sistema de gestión de la calidad;', 2
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con: c) las necesidades de recursos.', 3
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada como evidencia de los resultados de las revisiones por la dirección.', 4
FROM iso_requirements WHERE requirement_code = '9.3.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
-- Standard: ISO14001
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y seleccionar las oportunidades de mejora (véanse 9.1, 9.2 y 9.3) e implementar las acciones necesarias para lograr los resultados previstos en su SGA.', 1
FROM iso_requirements WHERE requirement_code = '10.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: a) reaccionar ante la no conformidad, cuando aplique: 1) tomar acciones para controlarla y corregirla;', 1
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: a) reaccionar ante la no conformidad, cuando aplique: 2) hacer frente a las consecuencias incluida la mitigación de los impactos ambientales adversos;', 2
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: b) evaluar la necesidad de acciones mediante: 1) la revisión de la no conformidad;', 3
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: b) evaluar la necesidad de acciones mediante: 2) la determinación de las causas de la no conformidad;', 4
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: b) evaluar la necesidad de acciones mediante: 3) la determinación de si existen no conformidades similares, o que potencialmente podrían ocurrir;', 5
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: c) implementar cualquier acción necesaria;', 6
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: d) revisar la eficacia de las acciones correctivas tomadas;', 7
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando ocurra una no conformidad la organización debe: e) si es necesario, hacer cambios al sistema de gestión ambiental.', 8
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones correctivas deben ser adecuadas a los efectos de las no conformidades encontradas, incluidos los impactos ambientales.', 9
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de: a) la naturaleza de las no conformidades y cualquier acción tomada posteriormente;', 10
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada, como evidencia de: b) los resultados de cualquier acción correctiva.', 11
FROM iso_requirements WHERE requirement_code = '10.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia del sistema de gestión ambiental para mejorar el desempeño ambiental.', 1
FROM iso_requirements WHERE requirement_code = '10.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: Las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión ambiental.', 1
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: Realizar el seguimiento y la revisión de la información sobre estas cuestiones internas y externas.', 2
FROM iso_requirements WHERE requirement_code = '4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: a. Las partes interesadas que son pertinentes al sistema de gestión ambiental;', 1
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: b. Las necesidades y expectativas pertinentes (es decir, requisitos) de estas partes interesadas;', 2
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: c. cuáles de estas son requisitos legales y otros requisitos.', 3
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento y la revisión de la información sobre estas partes interesadas y sus requisitos pertinentes.', 4
FROM iso_requirements WHERE requirement_code = '4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: a. Las cuestiones externas e internas referidas en el apartado 4.1;', 1
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: b. Los requisitos legales y otros requisitos a que se hace referencia en el apartado 4.2;', 2
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: c. Las unidades, funciones y límites físicos de la organización;', 3
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: d. Sus actividades, productos y servicios;', 4
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar: e. Su autoridad y capacidad para ejercer control e influencia.', 5
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse como información documentada estableciendo: Todas las actividades, productos y servicios cubiertos por el sistema de gestión ambiental;', 6
FROM iso_requirements WHERE requirement_code = '4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para lograr los resultados previstos, incluida la mejora de su desempeño ambiental, la organización debe establecer, implementar, mantener y mejorar continuamente su sistema de gestión ambiental incluyendo los procesos e interacciones necesarias.', 1
FROM iso_requirements WHERE requirement_code = '4.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para establecer y mantener el sistema de gestión ambiental, la organización debe considerar los apartados 4.1 y 4.2.', 2
FROM iso_requirements WHERE requirement_code = '4.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso asumiendo la responsabilidad y obligación de rendir cuentas por la eficacia del SGA;', 1
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso asegurando que la política y objetivos ambientales sean compatibles con la dirección estratégica;', 2
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso asegurando la integración de los requisitos del SGA en los procesos de negocio;', 3
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso asegurando que los recursos necesarios para el SGA estén disponibles;', 4
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso comunicando la importancia de una gestión ambiental eficaz y conforme con los requisitos;', 5
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso asegurándose de que el SGA logre los resultados previstos;', 6
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso dirigiendo y apoyando a las personas para la eficacia del sistema;', 7
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso promoviendo la mejora continua;', 8
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso apoyando otros roles pertinentes de la dirección para demostrar su liderazgo en sus áreas.', 9
FROM iso_requirements WHERE requirement_code = '5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política ambiental: a) apropiada al propósito y contexto de la organización e impactos ambientales;', 1
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política ambiental: b) que proporcione un marco para el establecimiento de los objetivos ambientales;', 2
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política ambiental: c) que incluya un compromiso con la protección del medio ambiente y prevención de la contaminación;', 3
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política ambiental: d) que incluya un compromiso de cumplir con requisitos legales y otros requisitos;', 4
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe establecer, implementar y mantener una política ambiental: e) que incluya un compromiso de mejora continua del SGA para la mejora del desempeño;', 5
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política ambiental debe: mantenerse como información documentada;', 6
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política ambiental debe: comunicarse dentro de la organización;', 7
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La política ambiental debe: estar disponible para las partes interesadas.', 8
FROM iso_requirements WHERE requirement_code = '5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener los procesos necesarios para cumplir con los requisitos de los apartados 6.1.1 a 6.1.4.', 1
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sisteme de gestión ambiental la organización debe considerar: a) las cuestiones referidas en el apartado 4.1;', 2
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sisteme de gestión ambiental la organización debe considerar: b) los requisitos referidos en el apartado 4.2;', 3
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sisteme de gestión ambiental la organización debe considerar: c) el alcance de su sistema de gestión ambiental;', 4
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determina los riesgos y oportunidades relacionados con sus: aspectos ambientales; requisitos legales y otros requisitos; y otras cuestiones y requisitos identificados en los apartados 4.1 y 4.2.', 5
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Asegura que el sistema de gestión ambiental puede lograr los resultados previstos.', 6
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Prevenir o reducir los efectos no deseados.', 7
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Lograr la mejora continua.', 8
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dentro del alcance del sistema de gestión ambiental, la organización determinara las situaciones de emergencia potenciales, incluidas las que pueden tener un impacto ambiental.', 9
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene la información documentada de sus riesgos y oportunidades que son necesario abordar.', 10
FROM iso_requirements WHERE requirement_code = '6.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dentro del alcance definido del sistema de gestión ambiental, la organización determinara los aspectos ambientales de sus actividades, productos y servicios.', 1
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determinan los aspectos ambientales, la organización tiene en cuenta los cambios, incluidos los desarrollos nuevos o planificados, y las actividades, productos y servicios nuevos o modificados.', 2
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización tiene en cuenta las condiciones anormales y las situaciones de emergencia razonablemente previsibles.', 3
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización determina aquellos aspectos que tengan o puedan tener un impacto ambiental significativo, es decir, los aspectos ambientales significativos, mediante el uso de criterios establecidos.', 4
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización determinara aquellos aspectos que tengan o puedan tener un impacto ambiental significativo.', 5
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene información documentada de sus aspectos ambientales e impactos ambientales asociados, criterios usados para determinar sus aspectos ambientales significativos y aspectos ambientales significativos.', 6
FROM iso_requirements WHERE requirement_code = '6.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) determinar y tener acceso a los requisitos legales y otros requisitos relacionados con sus aspectos ambientales;', 1
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) determinar cómo estos requisitos legales y otros requisitos se aplican a la organización;', 2
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) tener en cuenta estos requisitos legales y otros requisitos cuando se establezca, implemente, mantenga y mejore continuamente su sistema de gestión ambiental.', 3
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene información documentada de sus requisitos legales y otros requisitos.', 4
FROM iso_requirements WHERE requirement_code = '6.1.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La organización debe planificar la toma de acciones para abordar sus aspectos ambientales significativos; requisitos legales y otros requisitos; riesgos y oportunidades identificados en el apartado 6.1.1.', 1
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) Debe planificar la manera de integrar e interpretar las acciones en los procesos de su sistema de gestión ambiental, planificar la manera de evaluar la eficacia de estas acciones.', 2
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar sus opciones tecnológicas y sus requisitos financieros, operacionales y de negocio.', 3
FROM iso_requirements WHERE requirement_code = '6.1.4' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización establece objetivos ambientales para las funciones y niveles pertinentes, teniendo en cuenta los aspectos ambientales significativos de la organización y sus requisitos legales y otros requisitos asociados y considerando sus riesgos y oportunidades.', 1
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos ambientales deben: a) Los objetivos ambientales son coherentes con la política ambiental;', 2
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos ambientales deben: b) Los objetivos ambientales son medibles (si es factible);', 3
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos ambientales deben: c) Los objetivos ambientales son objeto de seguimiento;', 4
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos ambientales deben: d) Los objetivos ambietales son comunicados en la organización;', 5
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos ambientales deben: e) Los objetivos ambientales son actualizados según correspondan.', 6
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización conserva información documentada sobre los objetivos ambientales.', 7
FROM iso_requirements WHERE requirement_code = '6.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar cómo lograr sus objetivos ambientales, la organización determina, qué se va a hacer, qué recursos se requerirán, quién será responsable, cuándo se finalizará, cómo se evaluarán los resultados.', 1
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización considera cómo se pueden integrar las acciones para el logro de sus objetivos ambientales a los procesos de negocio de la organización.', 2
FROM iso_requirements WHERE requirement_code = '6.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina y proporciona los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión ambiental.', 1
FROM iso_requirements WHERE requirement_code = '7.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina la competencia necesaria de las personas que realizan trabajos bajo su control, que afecte a su desempeño ambiental y su capacidad para cumplir sus requisitos legales y otros requisitos.', 1
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic asegura de que estas personas sean competentes, con base en su educación, formación o experiencia apropiadas.', 2
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina las necesidades de formación asociadas con sus aspectos ambientales y su sistema de gestión ambiental.', 3
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alutrafic determina cuando sea aplicable, tomar acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones tomadas.', 4
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada apropiada, como evidencia de la competencia.', 5
FROM iso_requirements WHERE requirement_code = '7.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas que realicen el trabajo bajo el control de la organización tomen conciencia: a. La política ambiental;', 1
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas que realicen el trabajo bajo el control de la organización tomen conciencia: b. los aspectos ambientales significativos e impactos ambientales reales o potenciales relacionados;', 2
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas que realicen el trabajo bajo el control de la organización tomen conciencia: c. su contribución a la eficacia del sistema de gestión ambiental;', 3
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas que realicen el trabajo bajo el control de la organización tomen conciencia: d. las implicaciones de no satisfacer los requisitos del sistema de gestión ambiental.', 4
FROM iso_requirements WHERE requirement_code = '7.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener los procesos necesarios para las comunicaciones internas y externas pertinentes: a) que comunicar; b) cuándo comunicar; c) a quién comunicar; d) cómo comunicar.', 1
FROM iso_requirements WHERE requirement_code = '7.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando establece los procesos de comunicación Alutrafic tiene en cuenta los requisitos legales y otros requisitos, asegura que la información ambiental sea coherente y fiable.', 2
FROM iso_requirements WHERE requirement_code = '7.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización conserva la información documentada como evidencia de sus comunicaciones, según corresponda.', 3
FROM iso_requirements WHERE requirement_code = '7.4.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización comunica internamente la información pertinente del sistema de gestión ambiental entre los diversos niveles y funciones, incluidos los cambios.', 1
FROM iso_requirements WHERE requirement_code = '7.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización asegura que sus procesos de comunicación permitan que las personas que realicen trabajos bajo control contribuyan a la mejora continua.', 2
FROM iso_requirements WHERE requirement_code = '7.4.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización comunica externamente información pertinente al sistema de gestión ambiental, según se establezca en los procesos de comunicación.', 1
FROM iso_requirements WHERE requirement_code = '7.4.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión ambiental debe incluir información documentada requerida por esta Norma Internacional.', 1
FROM iso_requirements WHERE requirement_code = '7.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión ambiental determina información documentada como necesaria para la eficacia del sistema.', 2
FROM iso_requirements WHERE requirement_code = '7.5.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al crear y actualizar la información documentada, la organización se asegura de que lo siguiente sea apropiado: La identificación y descripción, el formato la revisión y aprobación.', 1
FROM iso_requirements WHERE requirement_code = '7.5.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada se controla para asegurarse de que esté disponible y sea idónea para su uso, dónde y cuándo se necesite.', 1
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada se controla para asegurarse de que esté protegida adecuadamente (confidencialidad, uso inadecuado, integridad).', 2
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el control de la información documentada, la organización aborda distribución, acceso, recuperación, uso, almacenamiento y preservación (legibilidad, control de cambios, conservación).', 3
FROM iso_requirements WHERE requirement_code = '7.5.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización establece, implementa, controla y mantiene los procesos necesarios para satisfacer los requisitos del sistema de gestión ambiental.', 1
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización controla los cambios planificados y examinar las consecuencias de los cambios no previstos, tomando acciones para mitigar los efectos adversos.', 2
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización se asegura de que los procesos contratados externamente estén controlados o que se tenga influencia sobre ellos.', 3
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La organización establece los controles para asegurarse de que sus requisitos ambientales se aborden en el proceso de diseño y desarrollo, considerando cada etapa de su ciclo de vida;', 4
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La organización determina sus requisitos ambientales para la compra de productos y servicios, según corresponda.', 5
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) La organización comunicar sus requisitos ambientales pertinentes a los proveedores externos, incluidos los contratistas.', 6
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) La organización considera la necesidad de suministrar información acerca de los impactos ambientales potenciales significativos asociados con transporte, uso y disposición final.', 7
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene la información documentada en la medida necesaria para tener la confianza en que los procesos se han llevado a cabo según lo planificado.', 8
FROM iso_requirements WHERE requirement_code = '8.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización establece, implementa y mantiene los procesos necesarios acerca de cómo prepararse y responder a situaciones potenciales de emergencia (6.1.1).', 1
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) La organización está preparada para responder, mediante la planificación de acciones para prevenir o mitigar los impactos ambientales adversos.', 2
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La organización responde a situaciones de emergencia reales.', 3
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) La organización toma acciones para prevenir o mitigar las consecuencias de las situaciones de emergencia, apropiadas a la magnitud y al impacto potencial.', 4
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) La organización toma acciones para prevenir o mitigar las consecuencias de las situaciones de emergencia, apropiadas a la magnitud de la emergencia.', 5
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) La organización pone a prueba periódicamente las acciones de respuesta planificadas, cuando sea factible.', 6
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) La organización proporciona información y formación pertinentes con relación a la preparación y respuesta ante emergencias.', 7
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización mantiene la información documentada en la medida necesaria para tener confianza en que los procesos se llevan a cabo de la manera planificada.', 8
FROM iso_requirements WHERE requirement_code = '8.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: a) a qué es necesario hacer seguimiento y qué es necesario medir;', 1
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: b) los métodos de seguimiento, medición, análisis y evaluación necesarios para asegurar resultados válidos;', 2
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: c) Los criterios contra los cuales la organización evaluará su desempeño ambiental e indicadores;', 3
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: d) cuándo se deben llevar a cabo el seguimiento y la medición;', 4
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar: e) cuándo se deben analizar y evaluar los resultados del seguimiento y la medición.', 5
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que se usan y mantienen equipos de seguimiento y medición calibrados o verificados.', 6
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Deberá evaluar el desempeño ambiental y la eficacia del sistema de gestión ambiental.', 7
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicar externa e internamente la información pertinente a su desempeño ambiental, según sus procesos de comunicación.', 8
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización deberá conservar información documentada como evidencia del seguimiento, medición, análisis y la evaluación.', 9
FROM iso_requirements WHERE requirement_code = '9.1.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener los procesos necesarios para evaluar el cumplimiento de sus requisitos legales y otros requisitos.', 1
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: a) determinar la frecuencia con la que se evaluará el cumplimiento;', 2
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: b) evaluar el cumplimiento y emprender las acciones que fueran necesarias;', 3
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: c) mantener el conocimiento y la comprensión de su estado de cumplimiento.', 4
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada como evidencia de los resultados de la evaluación del cumplimiento.', 5
FROM iso_requirements WHERE requirement_code = '9.1.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas para proporcionar información acerca de si el SGA es conforme con: 1) los requisitos propios de la organización;', 1
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas para proporcionar información acerca de si el SGA es conforme con: 2) los requisitos de esta Norma Internacional;', 2
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo auditorías internas para proporcionar información acerca de si el SGA: b) está implementado y mantenido eficazmente.', 3
FROM iso_requirements WHERE requirement_code = '9.2.1' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener uno o varios programas de auditoría que incluyan frecuencia, métodos y responsabilidades.', 1
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al establecer el programa, la organización debe tener en cuenta la importancia ambiental de los procesos y resultados de auditorías previas.', 2
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: a) para cada auditoría, definir los criterios y el alcance de ésta;', 3
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: c) seleccionar los auditores para asegurarse de la objetividad e imparcialidad del proceso;', 4
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe: c) asegurarse de que los resultados de las auditorías se informan a la dirección pertinente.', 5
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conservar la información documentada como evidencia de la implementación del programa de auditoría y sus resultados.', 6
FROM iso_requirements WHERE requirement_code = '9.2.2' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe revisar el SGA de la organización a intervalos planificados para asegurarse de su conveniencia, adecuación y eficacia continuas.', 1
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: a) consideraciones sobre el estado de las acciones desde anteriores revisiones;', 2
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: b) 1) cambios en cuestiones externas e internas pertinentes al SGA;', 3
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: b) 2) cambios en necesidades y expectativas de partes interesadas (legales y otros);', 4
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: b) 3) cambios en sus aspectos ambientales significativos;', 5
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: b) 4) cambios en los riesgos y oportunidades;', 6
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: c) el grado en que se han logrado los objetivos ambientales;', 7
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: d) 1) información sobre tendencias en no conformidades y acciones correctivas;', 8
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: d) 2) información sobre tendencias en seguimiento y resultados de las mediciones;', 9
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: d) 3) información sobre tendencias en cumplimiento de requisitos legales y otros;', 10
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: d) 4) información sobre tendencias en resultados de la auditoría;', 11
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: e) adecuación de los recursos;', 12
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: f) las comunicaciones pertinentes de las partes interesadas, incluidas las quejas;', 13
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión incluye: g) las oportunidades de mejora continua.', 14
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión debe incluir conclusiones sobre la conveniencia, adecuación y eficacia continuas del SGA.', 15
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión debe incluir decisiones relacionadas con las oportunidades de mejora continua.', 16
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión debe incluir decisiones sobre cualquier necesidad de cambio en el SGA, incluidos los recursos.', 17
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión debe incluir acciones necesarias cuando no se hayan logrado los objetivos ambientales.', 18
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión debe incluir oportunidades de mejorar la integración del SGA a otros procesos de negocio.', 19
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La revisión debe incluir cualquier implicación para la dirección estratégica de la organización.', 20
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización conserva información documentada como evidencia de los resultados de las revisiones por la dirección.', 21
FROM iso_requirements WHERE requirement_code = '9.3' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));
