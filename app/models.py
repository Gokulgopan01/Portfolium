from django.db import models

class Projects(models.Model):
    title=models.CharField(max_length=255)
    description=models.TextField()
    image=models.ImageField(upload_to='project/')
    link=models.URLField(blank=True)

    def __str__(self):
        return self.title

class Skills(models.Model):
    name=models.CharField(max_length=255)
    description=models.TextField()

    def __str__(self):
        return self.name
    
class Experience(models.Model):
    company_name=models.CharField(max_length=255)
    job_role=models.CharField(max_length=255)
    description=models.TextField()
    start_date=models.DateField()
    end_date=models.DateField(null=True,blank=True)

    def __str__(self):
        return f'{self.job_role} at {self.company_name}'