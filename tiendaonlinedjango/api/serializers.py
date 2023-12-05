from rest_framework import serializers
from tienda.models import Categoria, Producto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)  

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'precio', 'categoria']

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.precio = validated_data.get('precio', instance.precio)

        categoria_data = validated_data.get('categoria')
        if categoria_data:
            instance.categoria = Categoria.objects.get(pk=categoria_data['id'])

        instance.save()
        return instance
