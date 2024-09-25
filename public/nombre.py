import os


ruta_carpeta = 'DLC'


archivos = os.listdir(ruta_carpeta)


contador = 87


for archivo in archivos:
    
    
    if archivo.endswith('.PNG'):
        
        nuevo_nombre = str(contador) + '.PNG'
        
        
        antigua_ruta = os.path.join(ruta_carpeta, archivo)
        nueva_ruta = os.path.join(ruta_carpeta, nuevo_nombre)
        
        
        os.rename(antigua_ruta, nueva_ruta)
        
        
        contador += 1
