# Información del Servidor (Lidus)

## Acceso Web de la Aplicación
- **URL Directa:** [http://160.153.188.144:3000](http://160.153.188.144:3000)
- **IP del Servidor:** `160.153.188.144`
- **Puerto de la app:** `3000`

## Acceso por SSH
- **Usuario:** `lidustechadmin`
- **Comando de conexión:** 
  ```bash
  ssh lidustechadmin@160.153.188.144
  ```

## Comandos Útiles del Servidor (PM2)
Si necesitas gestionar la aplicación una vez conectado por SSH, aquí tienes los comandos principales:

- **Ver los logs en tiempo real:** `pm2 logs`
- **Reiniciar la aplicación:** `pm2 restart lidus`
- **Limpiar el historial de logs (errores viejos):** `pm2 flush`
- **Ver el estado de la aplicación:** `pm2 status`

## Credenciales del Portal de Comando & Soporte Permanente (Back-office)
Para acceder a la administración aislada del sistema (desde donde se gestionan las categorías, normas de auditoría, se atienden chats con clientes en tiempo real y se activan/bloquean licencias de empresas):
- **URL de Acceso:** [http://160.153.188.144:3000/administracion/control-maestro](http://160.153.188.144:3000/administracion/control-maestro)
- **Email de Soporte:** `soporte@lidus.co`
- **Contraseña:** `LidusSoporte2026!`
- **Token de Seguridad Interno (API):** `lidus_admin_super_secret_token_2026`
