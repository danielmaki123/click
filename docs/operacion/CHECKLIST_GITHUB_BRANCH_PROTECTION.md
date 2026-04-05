# Checklist GitHub Branch Protection (master)

Objetivo:
1. Bloquear merges riesgosos.
2. Obligar PR + CI antes de integrar a master.

Ruta en GitHub:
1. Repo -> Settings -> Branches -> Branch protection rules -> Add rule.

Configuracion recomendada:
1. Branch name pattern: master
2. Require a pull request before merging: ON
3. Require approvals: ON (minimo 1)
4. Dismiss stale pull request approvals when new commits are pushed: ON
5. Require status checks to pass before merging: ON
6. Required status checks: seleccionar job de CI (workflow CI)
7. Require branches to be up to date before merging: ON
8. Block force pushes: ON
9. Restrict deletions: ON
10. Do not allow bypassing the above settings: ON (si quieres control estricto)

Reglas de operacion:
1. Nadie hace push directo a master.
2. Todo cambio entra por rama + PR.
3. Si CI falla, merge bloqueado.
4. Si falta evidencia en canal/task log, supervisor marca BLOCKED.

Verificacion final:
1. Abrir PR de prueba.
2. Confirmar que GitHub exige CI en verde y aprobacion.
3. Confirmar que no se puede mergear con checks fallidos.
