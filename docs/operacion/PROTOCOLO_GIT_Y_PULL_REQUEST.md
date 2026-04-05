# Protocolo Git y Pull Request (Proyecto Click)

Objetivo:
1. Evitar cambios directos en master.
2. Asegurar validacion automatica antes de merge.
3. Mejorar trazabilidad de decisiones y cambios.

Reglas obligatorias:
1. No trabajar directo en master.
2. Todo cambio va en rama: feature/*, fix/* o chore/*.
3. Todo merge a master debe pasar por Pull Request.
4. CI (GitHub Actions) debe estar en verde antes de aprobar.
5. El supervisor audita evidencia tecnica y funcional antes del merge.

Flujo operativo:
1. Crear rama desde master actualizado.
2. Implementar cambios y hacer commits pequenos.
3. Subir rama al remoto.
4. Abrir Pull Request a master.
5. Esperar CI en verde.
6. Auditoria del supervisor (PASS/BLOCKED).
7. Merge solo con PASS.

Checklist previo a abrir PR:
1. Build local en verde.
2. Task Log actualizado.
3. Canal de supervision actualizado.
4. Riesgos y mitigaciones declarados.
5. Sin archivos sueltos fuera de estructura oficial.

Convencion de ramas:
1. feature/<tema>
2. fix/<tema>
3. chore/<tema>

Convencion de commits:
1. feat: nueva funcionalidad
2. fix: correccion de bug
3. docs: cambios documentales
4. chore: mantenimiento/configuracion

Recomendacion GitHub (manual):
1. Activar branch protection para master.
2. Requerir PR para merge.
3. Requerir status checks (CI) para merge.
4. Bloquear push directo a master.
