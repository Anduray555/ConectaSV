<?php

/*
|--------------------------------------------------------------------------
| Catálogo de categorías y tags (aprobado)
|--------------------------------------------------------------------------
| Lo leen TagCategorySeeder (categorías + áreas) y TagSeeder (tags).
| Para cambiarlo: edita este arreglo y vuelve a correr ambos seeders.
|
| Cada categoría tiene:
|   name  -> nombre visible (debe ser único)
|   areas -> slugs de StudyAreaSeeder::AREAS a los que aplica.
|            [] = categoría GENERAL: la ven todas las carreras.
|   tags  -> nombres de los tags (únicos en TODO el catálogo, no solo en su categoría).
|
| Slugs de área: tecnologia, ingenieria, salud, negocios, derecho,
|                arquitectura-y-diseno, ciencias-sociales-y-humanidades
|
| "slugs" corrige los nombres que Str::slug() convertiría mal
| (por ejemplo "C#" quedaría como "c").
*/

return [
    'categories' => [

        // ================= GENERALES (todas las carreras) =================
        [
            'name' => 'Habilidades blandas',
            'areas' => [],
            'tags' => [
                'Trabajo en equipo', 'Comunicación efectiva', 'Liderazgo', 'Resolución de problemas',
                'Pensamiento crítico', 'Gestión del tiempo', 'Adaptabilidad', 'Atención al cliente',
            ],
        ],
        [
            'name' => 'Idiomas',
            'areas' => [],
            'tags' => [
                'Inglés básico', 'Inglés intermedio', 'Inglés avanzado',
                'Francés', 'Portugués', 'Alemán', 'Chino mandarín',
            ],
        ],
        [
            'name' => 'Ofimática',
            'areas' => [],
            'tags' => ['Word', 'Excel', 'Excel avanzado', 'PowerPoint', 'Google Workspace'],
        ],

        // ================= TECNOLOGÍA =================
        [
            'name' => 'Frontend',
            'areas' => ['tecnologia'],
            'tags' => ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Tailwind CSS'],
        ],
        [
            'name' => 'Backend',
            'areas' => ['tecnologia'],
            'tags' => ['PHP', 'Laravel', 'Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'C#', '.NET'],
        ],
        [
            'name' => 'Bases de datos',
            'areas' => ['tecnologia'],
            'tags' => ['SQL', 'PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'Firebase'],
        ],
        [
            'name' => 'Desarrollo móvil',
            'areas' => ['tecnologia'],
            'tags' => ['Android', 'Kotlin', 'Swift', 'Flutter', 'React Native'],
        ],
        [
            'name' => 'Ciencia de datos e IA',
            'areas' => ['tecnologia', 'ingenieria'],
            'tags' => ['Análisis de datos', 'Pandas', 'Machine Learning', 'Power BI', 'Tableau', 'Estadística'],
        ],
        [
            'name' => 'DevOps y nube',
            'areas' => ['tecnologia'],
            'tags' => ['Git', 'GitHub', 'Docker', 'Linux', 'AWS', 'Azure', 'CI/CD'],
        ],
        [
            'name' => 'Redes y ciberseguridad',
            'areas' => ['tecnologia', 'ingenieria'],
            'tags' => ['Redes (CCNA)', 'Ciberseguridad', 'Administración de servidores', 'Soporte técnico'],
        ],
        [
            'name' => 'Desarrollo de videojuegos',
            'areas' => ['tecnologia', 'arquitectura-y-diseno'],
            'tags' => ['Unity', 'Unreal Engine', 'Godot', 'Blender'],
        ],
        [
            'name' => 'Calidad de software',
            'areas' => ['tecnologia'],
            'tags' => ['Pruebas manuales', 'Pruebas automatizadas', 'Selenium'],
        ],

        // ================= VARIAS ÁREAS =================
        [
            'name' => 'Gestión de proyectos',
            'areas' => ['tecnologia', 'ingenieria', 'negocios'],
            'tags' => ['Scrum', 'Metodologías ágiles', 'Jira', 'Microsoft Project', 'Gestión de proyectos (PMI)'],
        ],
        [
            'name' => 'Diseño asistido por computadora',
            'areas' => ['ingenieria', 'arquitectura-y-diseno'],
            'tags' => ['AutoCAD', 'Revit', 'SolidWorks', 'SketchUp', 'Civil 3D'],
        ],
        [
            'name' => 'Construcción',
            'areas' => ['ingenieria', 'arquitectura-y-diseno'],
            'tags' => ['Supervisión de obras', 'Topografía', 'Presupuestos de obra', 'Cálculo estructural'],
        ],

        // ================= INGENIERÍA =================
        [
            'name' => 'Electricidad y electrónica',
            'areas' => ['ingenieria'],
            'tags' => ['Instalaciones eléctricas', 'Circuitos electrónicos', 'PLC', 'Arduino', 'Microcontroladores'],
        ],
        [
            'name' => 'Producción y calidad',
            'areas' => ['ingenieria'],
            'tags' => ['Lean Manufacturing', 'Six Sigma', 'Control de calidad', 'ISO 9001', 'Seguridad industrial'],
        ],
        [
            'name' => 'Mecánica y mantenimiento',
            'areas' => ['ingenieria'],
            'tags' => ['Mantenimiento industrial', 'Neumática', 'Hidráulica', 'Soldadura'],
        ],
        [
            'name' => 'Procesos químicos y alimentos',
            'areas' => ['ingenieria'],
            'tags' => ['Inocuidad alimentaria', 'Buenas Prácticas de Manufactura', 'HACCP', 'Análisis de laboratorio'],
        ],

        // ================= SALUD =================
        [
            'name' => 'Atención clínica',
            'areas' => ['salud'],
            'tags' => ['Atención primaria', 'Historia clínica', 'Primeros auxilios', 'Signos vitales', 'Urgencias'],
        ],
        [
            'name' => 'Salud pública',
            'areas' => ['salud'],
            'tags' => ['Epidemiología', 'Promoción de la salud', 'Bioestadística'],
        ],
        [
            'name' => 'Tecnología médica',
            'areas' => ['salud', 'ingenieria'],
            'tags' => ['Equipo biomédico', 'Expediente clínico electrónico', 'Mantenimiento de equipo médico'],
        ],

        // ================= NEGOCIOS =================
        [
            'name' => 'Contabilidad y finanzas',
            'areas' => ['negocios'],
            'tags' => [
                'Contabilidad general', 'NIIF', 'Auditoría', 'Análisis financiero',
                'Tributación', 'Facturación electrónica', 'Planillas',
            ],
        ],
        [
            'name' => 'Marketing',
            'areas' => ['negocios', 'ciencias-sociales-y-humanidades'],
            'tags' => ['Marketing digital', 'Redes sociales', 'SEO', 'Google Ads', 'Investigación de mercados', 'Branding'],
        ],
        [
            'name' => 'Administración y recursos humanos',
            'areas' => ['negocios', 'ciencias-sociales-y-humanidades'],
            'tags' => ['Reclutamiento y selección', 'Gestión del talento humano', 'Planificación estratégica', 'Clima organizacional'],
        ],
        [
            'name' => 'Comercio y logística',
            'areas' => ['negocios', 'ingenieria'],
            'tags' => ['Comercio exterior', 'Gestión aduanera', 'Cadena de suministro', 'Logística', 'Ventas'],
        ],

        // ================= DERECHO =================
        [
            'name' => 'Ramas del derecho',
            'areas' => ['derecho'],
            'tags' => [
                'Derecho civil', 'Derecho penal', 'Derecho laboral', 'Derecho mercantil',
                'Derecho de familia', 'Derecho tributario', 'Derecho constitucional',
            ],
        ],
        [
            'name' => 'Práctica jurídica',
            'areas' => ['derecho'],
            'tags' => ['Redacción de escritos', 'Litigio oral', 'Investigación jurídica', 'Contratos', 'Mediación y arbitraje', 'Notariado'],
        ],

        // ================= ARQUITECTURA Y DISEÑO =================
        [
            'name' => 'Diseño gráfico',
            'areas' => ['arquitectura-y-diseno', 'negocios'],
            'tags' => ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'Identidad visual', 'Tipografía'],
        ],
        [
            'name' => 'Diseño UX/UI',
            'areas' => ['arquitectura-y-diseno', 'tecnologia'],
            'tags' => ['Figma', 'Prototipado', 'Investigación de usuarios', 'Diseño de interfaces'],
        ],
        [
            'name' => 'Diseño arquitectónico',
            'areas' => ['arquitectura-y-diseno'],
            'tags' => ['Diseño arquitectónico', 'Urbanismo', 'Renderizado', 'Maquetas', 'Diseño de interiores'],
        ],
        [
            'name' => 'Producción audiovisual',
            'areas' => ['arquitectura-y-diseno', 'ciencias-sociales-y-humanidades'],
            'tags' => ['Edición de video', 'Premiere Pro', 'After Effects', 'Fotografía'],
        ],

        // ================= CIENCIAS SOCIALES Y HUMANIDADES =================
        [
            'name' => 'Psicología',
            'areas' => ['ciencias-sociales-y-humanidades', 'salud'],
            'tags' => ['Evaluación psicológica', 'Psicología clínica', 'Psicología organizacional', 'Pruebas psicométricas', 'Orientación y consejería'],
        ],
        [
            'name' => 'Comunicación',
            'areas' => ['ciencias-sociales-y-humanidades', 'negocios'],
            'tags' => ['Redacción periodística', 'Producción radial', 'Locución', 'Relaciones públicas', 'Comunicación corporativa'],
        ],
        [
            'name' => 'Investigación social',
            'areas' => ['ciencias-sociales-y-humanidades', 'salud'],
            'tags' => ['Investigación cualitativa', 'Diseño de encuestas', 'SPSS'],
        ],
    ],

    'slugs' => [
        'C#' => 'csharp',
        '.NET' => 'dotnet',
        'CI/CD' => 'ci-cd',
        'Redes (CCNA)' => 'redes-ccna',
    ],
];
