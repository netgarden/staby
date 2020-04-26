from django import forms

class UploadFileForm(forms.Form):
    files = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))

class CreateFolderForm(forms.Form):
    name = forms.CharField(max_length=255)

class RenameForm(forms.Form):
    name = forms.CharField(max_length=255)