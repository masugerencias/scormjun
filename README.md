¡HOLA!
Proyecto local donde ejecutamos un archivo tipo scorm. 

El flujo sería el siguiente:
- Subirmos un scorm en zip,
- La aplicación lo descomprime, 
- Lo guarda localmente en scormPackages (habría que borrarlo luego)
- Ejecuta los archivos necesacios para su ejecución (indice, quizzz, funciones de js...)
- Tomamos constancia con algún console.log de KPIS que podremos guardar.

OJO 
El nombre del archivo NO está parametrizado, es decir, de momento se tiene que llamar scormVid sino no lo encontrará 'scromVid.html'

Modo de empleo:

Ejecutar el servidor (node index.js)
Subir zip llamado scormVid.zip

OJO ese nombre tiene que ser generado al exportarse en un programa como Camstasia, ya que no solo es el nombde del zip, sino que de archivos que hay ahí dentro también.

Se sube el video
Y se reproduce. 

Lo probado hasta ahora son los indices y un questionario.
