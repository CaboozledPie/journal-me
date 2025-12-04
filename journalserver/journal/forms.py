from django import forms
from .models import JournalEntry

class JournalEntryForm(forms.ModelForm):
    tags = forms.CharField(required=False) # overrides JSONField

    class Meta:
        model = JournalEntry
        fields = ['title', 'content', 'image', 'tags']
    def clean_tags(self):
        raw = self.cleaned_data.get('tags', '')
        if not raw:
            return []

        return [t.strip() for t in raw.split(',') if t.strip()]
