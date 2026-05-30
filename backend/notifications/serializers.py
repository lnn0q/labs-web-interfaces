from rest_framework import serializers
from .models import AsyncTaskResult

class AsyncTaskResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsyncTaskResult
        fields = '__all__'
