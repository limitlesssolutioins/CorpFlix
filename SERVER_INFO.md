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
